<template>
    <div class="OrderChat">
        <div class="OrderChat-body">
            <div class="OrderChat-header">
                <div class="avatar">
                    <img src="https://api.dicebear.com/9.x/initials/svg?seed=Luis" alt="">
                </div>
                <div class="name">
                    <span>{{ orderData.seller_username }}</span>
                    <div class="last">
                        {{ lastSeenTime }}
                    </div>
                </div>
            </div>
            <div class="content" id="scrollable">
                <div class="message" v-for="(item, index) in messages" :key="index" :id="`m-${index}`">
                    <UserBubble :data="item" />
                    <PartyBubble :data="item" v-if="item.agent !== authStore.user?.pubkeyhash"/>
                </div>
            </div>
            <div class="footer">
                <div class="footer-top flex">
                    <button class="flex">
                        <i class="pi pi-image" />
                    </button>
                </div>

                <div class="footer-bottom flex">
                    <textarea class="OrderChat-input" v-model="inputValue" rows="1" cols="30"
                        placeholder="Chat with counterparty" @input="autoResize" @keydown="onEnter"
                        ref="textareaRef" />

                    <div class="OrderChat-send" @click="onSubmit">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                            class="lucide lucide-send-horizontal-icon lucide-send-horizontal">
                            <path
                                d="M3.714 3.048a.498.498 0 0 0-.683.627l2.843 7.627a2 2 0 0 1 0 1.396l-2.842 7.627a.498.498 0 0 0 .682.627l18-8.5a.5.5 0 0 0 0-.904z" />
                            <path d="M6 12h16" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import gql from 'graphql-tag'
import { timeAgo } from "@/utils/utils"

const { $chatClient } = useNuxtApp()

const orderStore = useOrderStore()

const authStore = useAuthStore()

const orderData = computed(() => orderStore.order)

const userViewing = ref(true);

const inputValue = ref("");

const messages = ref([]);

const lastSeenTime = computed(() => {
    const msg = messages.value.filter(i => i.seen && i.agent === authStore.user?.pubkeyhash).at(-1);

    if (msg) {
        return "Last seen " + timeAgo(msg.created_at);
    }

    return null
});

const textareaRef = ref(null);

const autoResize = () => {
    const el = textareaRef.value;
    if (el) {
        el.style.height = 'auto'; // Reset height
        el.style.height = el.scrollHeight + 'px'; // Set to scroll height
    }
};

watch(inputValue, () => {
    autoResize();
});

const loading = ref(false)

const onSubmit = async () => {
    if (!import.meta.client) return;

    const CREATE_MESSAGE_MUTATION = gql`
mutation CreateMessage($createMessageVariable: CreateMessageInput!) {
    createMessage(createMessageInput: $createMessageVariable) {
        success
    }
}
`;

    try {
        loading.value = true

        await $chatClient.mutate({
            mutation: CREATE_MESSAGE_MUTATION,
            variables: {
                createMessageVariable: {
                    session: orderStore.session,
                    content: inputValue.value
                }
            },
        });

    } catch (err) {
        console.error('createMessage:', err);
        order.showToast(err, 'error', 10_000)
    } finally {
        loading.value = false
    }

}

const onEnter = (event) => {
    if (event.key === 'Enter' && event.shiftKey) {
        event.preventDefault();
        const textarea = document.getElementById('inputValue');
        const cursorPos = textarea.selectionStart;
        inputValue.value =
            inputValue.value.slice(0, cursorPos) +
            '\n' +
            inputValue.value.slice(cursorPos);

        setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = cursorPos + 1;
        });
    } else if (event.key === 'Enter') {
        event.preventDefault();
        onSubmit()
    }
};

const updateUnseenMessages = (messages, seen) => {
    const seenList = new Set(Object.keys(seen));

    const processed = messages.map(item => {
        if (!item.seen && seenList.has(item.id)) {
            return { ...item, seen: true };
        }
        return item;
    });

    return processed
};

let subscription1;


const fetchMessages = async () => {

    const GET_MESSAGES_QUERY = gql`
query GetMessages($getMessagesVariable: GetMessagesInput!) {
    getMessages(getMessagesInput: $getMessagesVariable) {
        success
        message
        data {
            messages {
                id
                agent
                role
                content
                seen
                created_at
            }
            seen
        }
    }
}
`;

    const observable = await $chatClient.watchQuery({
        query: GET_MESSAGES_QUERY,
        variables: {
            getMessagesVariable: {
                session: orderStore.session
            }
        },
        fetchPolicy: 'no-cache',
        pollInterval: 60_000,
    })

    subscription1 = observable.subscribe({
        next({ data }) {
            console.log(data.getMessages.data.messages)

            const newMessages = data.getMessages.data.messages
            const seenMessages = data.getMessages.data.seen

            messages.value.push(...newMessages)
            messages.value = updateUnseenMessages(messages.value, seenMessages);

            scrollToBottom()
        },
        error(err) {
            console.error(err)
        }
    })

}

function removeSubscriptions() {
    subscription1?.unsubscribe()
}

function scrollToBottom() {
    nextTick(() => {
        const element = document.getElementById(`m-${messages.value.length - 1}`);

        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "end" });
        }

    })
}

function handleVisibilityChange() {
    if (document.hidden) {
        userViewing.value = false;
    } else {
        userViewing.value = true;
    }
};
onMounted(() => {
    document.addEventListener("visibilitychange", handleVisibilityChange);
    fetchMessages()
});

onUnmounted(() => {
    document.removeEventListener("visibilitychange", handleVisibilityChange);
});

onBeforeUnmount(() => {
    removeSubscriptions()
})


/**
const getMessagesVariables = ref({
    "getMessagesVariables": {
        session: orderData.value.session,
    }

})

const { result: onGetMessagesResult } = useQuery(gql`
      query getMessages($getMessagesVariables: GetMessagesInput!) {
        getMessages(getMessagesInput: $getMessagesVariables) {
           messages { 
            id
            agent
            role
            content
            seen
            created_at
           }
    
           seen
        }
      }
    `,
    getMessagesVariables,
    {
        clientId: 'chat',
        pollInterval: 60000,
        enabled: true,
        lazy: true
    })


 watch(onGetMessagesResult, value => {
    messages.value = [];

    messages.value.push(...value.getMessages.messages);

    messages.value = updateUnseenMessages(messages.value, value.getMessages.seen);

    scrollToBottom();
})

///////////////////////////////////////////////////////////////////////////////////////////////

const { result: onNewMessagesResult, onError: onNewMessagesError } = useSubscription(gql`
      subscription newMessages($session: ID!){
         newMessages(session: $session) {
          id
          agent
          role
          content
          seen
          created_at
        }
      }
    `,

    () => ({
        session: orderData.value.session
    }),
    {
        clientId: "chat",
        enabled: true,
        lazy: true
    }
)

onNewMessagesError((error, context) => {
    console.error(error, context)
})

const unwatchChat = watch(
    onNewMessagesResult,
    data => {
        console.log("New message received:", data.newMessages);

        messages.value.push(data.newMessages);

        scrollToBottom();

        if (!userViewing.value) {
            playNotification()
            document.title = `${document.title} | New Message`;
        }

    },
    {
        lazy: true
    }
)


///////////////////////////////////////////////////////////////////////////////////////////////

const { mutate: createMessage, onDone: onCreateMessageDone } = useMutation(gql`
  mutation createMessage ($createMessageVariable: CreateMessageInput!) {
    createMessage(createMessageInput: $createMessageVariable) {
      success
    }
  }
`,
    {
        clientId: "chat"
    })

 */
</script>

<style lang="css" scoped>
.OrderChat {
    width: 100%;
    display: flex;
    justify-content: flex-end;
}

.OrderChat-body {
    width: 400px;
    overflow: hidden;
    height: 700px;
    box-sizing: border-box;
    border-radius: var(--radius-c);
    transition: var(--transition-a);
    border: 2px solid var(--border-a);
}

.OrderChat-header {
    border-bottom: 1px solid var(--border-a);
    align-items: center;
    display: flex;
    padding: 1rem;
}

.avatar {
    background: var(--background-a);
    border-radius: var(--radius-b);
    border: 1px solid transparent;
    align-items: center;
    overflow: hidden;
    display: flex;
    width: 40px;
    height: 40px;
}

.avatar img {
    width: 100%;
    object-fit: scale-down;
}

.name {
    margin-left: 1rem;
    display: block;
}

.last {
    font-size: var(--text-size-0);
    color: var(--text-b);
}

.content {
    display: flex;
    flex-direction: column;
    padding: 1rem;
    height: 500px;
    font-size: var(--text-size-1);
    overflow-y: scroll;
    overflow-x: hidden;
    box-sizing: border-box;
    scroll-behavior: smooth;
    padding: 1rem;
}

.content::-webkit-scrollbar {
    width: 7px;
    height: 7px;
}

.content::-webkit-scrollbar-thumb {
    background: #f1f1f1;
    border-radius: 2px;
}

.content::-webkit-scrollbar-thumb:hover {
    background: #c1c1c1;
}

.content::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 10px;
}


.footer {
    border-top: 1px solid var(--border-a);
    width: inherit;
    box-sizing: border-box;
}

.footer-top {
    padding-top: 1rem;
    padding-left: 1rem;
    padding-bottom: 0;
}

.footer-top button {
    background: transparent;
    border: none;
    justify-content: center;
    cursor: pointer;
}

.footer-bottom {
    box-sizing: border-box;
    width: inherit;
    padding: 1rem;
}

.OrderChat-input {
    padding: 0.75rem;
    outline: none;
    color: inherit;
    font-family: inherit;
    font-size: var(--text-size-1);
    transition: 0.2s;
    max-height: 100px;
    border: 1px solid var(--border-a);
    border-radius: 8px;
    resize: none;
    width: inherit;
    background: var(--background-b);
}

.OrderChat-input:focus-within {
    border: 1px solid var(--text-a);
}

.OrderChat-input::placeholder {
    color: var(--text-b);
    opacity: 0.5;
}

.OrderChat-send {
    justify-content: center;
    align-items: center;
    display: flex;
    height: 3rem;
    cursor: pointer;
    padding-left: 1rem;
    padding-right: 0.25rem;

}
</style>
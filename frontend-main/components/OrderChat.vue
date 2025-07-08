<template>
    <div class="OrderChat">
        <div class="OrderChat-body">
            <div class="header flex">
                <div class="avatar flex">
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
                    <PartyBubble :data="item" />
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
                        placeholder="Chat with the other party..." @input="autoResize" @keydown="onEnter"
                        ref="chatTextarea" />

                    <div class="OrderChat-send flex" @click="onSend">
                        <i class="pi pi-send" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import gql from 'graphql-tag'
import { timeAgo } from "@/utils/utils"

const orderStore = useOrderStore()

const orderData = computed(() => orderStore.order)

const userViewing = ref(true);

const inputValue = ref("");

const messages = ref([]);

const lastSeenTime = computed(() => {
    const msg = messages.value.filter(msg => msg.seen && msg.agent === currentAgent.value).at(-1);

    if (msg) {
        return "Last seen " + timeAgo(msg.created_at);
    }

    return null
});

const chatTextarea = ref(null);

const autoResize = () => {
    const el = chatTextarea.value;
    if (el) {
        el.style.height = 'auto'; // Reset height
        el.style.height = el.scrollHeight + 'px'; // Set to scroll height
    }
};


onMounted(() => {
    autoResize();
});

watch(inputValue, () => {
    autoResize();
});

const onSend = () => {
    createMessage({
        "createMessageVariable": {
            session: orderData.value.session,
            content: inputValue.value
        }
    })
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
        onSend()
    }
};

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

function updateUnseenMessages(messages, seen) {
    const seenList = new Set(Object.keys(JSON.parse(seen)));

    const processed = messages.map(item => {
        if (!item.seen && seenList.has(item.id)) {
            return { ...item, seen: true };
        }
        return item;
    });

    return processed

};


onMounted(() => {
    document.addEventListener("visibilitychange", handleVisibilityChange);
});

onUnmounted(() => {
    document.removeEventListener("visibilitychange", handleVisibilityChange);
});

onBeforeUnmount(() => {

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
    border-radius: var(--radius-c);
    transition: var(--transition-a);
    border: 2px solid var(--border-a);
}

.header {
    border-bottom: 1px solid var(--border-a);
    padding: 1rem;
}

.avatar {
    background: var(--background-a);
    border-radius: var(--radius-b);
    border: 1px solid transparent;
    overflow: hidden;
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
    width: 60px;
    height: inherit;
    cursor: pointer;
}

.OrderChat-send i {
    font-size: var(--text-size-3);
    transform: rotate(45deg);
}
</style>
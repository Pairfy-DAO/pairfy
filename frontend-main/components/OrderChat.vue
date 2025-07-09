<template>
    <div class="OrderChat">
        <div class="OrderChat-body">
            <!--HEADER START-->
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
            <!--CONTENT START-->
            <div class="OrderChat-content" id="scrollable">
                <div class="message" v-for="(item, index) in messages" :key="index" :id="`m-${index}`">
                    <UserBubble :data="item" />
                    <PartyBubble :data="item" v-if="item.sender !== agentId" />
                </div>
            </div>
            <!--FOOTER-->
            <div class="OrderChat-footer">
                <div class="controls">
                    <button>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                            class="lucide lucide-circle-plus-icon lucide-circle-plus">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M8 12h8" />
                            <path d="M12 8v8" />
                        </svg>
                    </button>
                </div>

                <div class="editor">
                    <textarea class="textarea" v-model="inputValue" rows="1" cols="30"
                        placeholder="Chat with counterparty" @input="autoResize" @keydown="onEnter" ref="textareaRef" />

                    <div class="send-button" @click="onSubmit">
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

const agentId = computed(() => authStore.user?.pubkeyhash)

const lastSeenTime = computed(() => {
    const msg = messages.value.filter(e => e.seen && e.agent === agentId.value).at(-1);

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
                sender
                role
                message
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
            console.log(data.getMessages.data)

            const newMessages = data.getMessages.data.messages
            const seenMessages = data.getMessages.data.seen

            messages.value = newMessages.sort((a, b) => a.created_at - b.created_at);
            messages.value = updateUnseenMessages(messages.value, seenMessages);

            scrollToBottom()
        },
        error(err) {
            console.error(err)
        }
    })
}

const listenMessages = () => {
    const source = new EventSource('/api/stream?channel=5b2db94d0396210e2e790cef6adafb6843f53cc249333bfe4408e43c:a239e6c2bbd6a9f3249d65afef89c28e1471ed07c529ec06848cc141:95C9D9250530A974CDC0D')

    source.onmessage = (event) => {
        try {
            const parsed = JSON.parse(event.data);

            console.log(parsed);

            if (parsed.message) {
                messages.value.push(parsed.message)
                scrollToBottom()
            }
        } catch (e) {
            console.error("Error parsing JSON:", e);
        }
    }

    source.onerror = (err) => {
        console.error('❌ SSE error:', err)
        source.close()
    }
}

function updateUnseenMessages(messages, seen) {
    const seenList = new Set(...seen);

    const processed = messages.map(item => {
        if (!item.seen && seenList.has(item.id)) {
            return { ...item, seen: true };
        }
        return item;
    });

    return processed
};


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
    listenMessages()
});

onUnmounted(() => {
    document.removeEventListener("visibilitychange", handleVisibilityChange);
});

onBeforeUnmount(() => {
    removeSubscriptions()
})

</script>

<style lang="css" scoped>
.OrderChat {
    width: 100%;
}

.OrderChat-body {
    width: 428px;
    overflow: hidden;
    margin-left: auto;
    box-sizing: border-box;
    border-radius: var(--radius-d);
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
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    width: 48px;
    height: 48px;
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

.OrderChat-content {
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

.OrderChat-content::-webkit-scrollbar {
    width: 7px;
    height: 7px;
}

.OrderChat-content::-webkit-scrollbar-thumb {
    background: #f1f1f1;
    border-radius: 2px;
}

.OrderChat-content::-webkit-scrollbar-thumb:hover {
    background: #c1c1c1;
}

.OrderChat-content::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 10px;
}


.OrderChat-footer {
    border-top: 1px solid var(--border-a);
    width: inherit;
    box-sizing: border-box;
}

.controls {
    display: flex;
    padding-bottom: 0;
    padding-top: 1rem;
    padding-left: 1rem;
    align-items: center;
}

.controls button {
    background: transparent;
    border: none;
    justify-content: center;
    cursor: pointer;
}

.editor {
    box-sizing: border-box;
    align-items: center;
    width: inherit;
    display: flex;
    padding: 1rem;
}

.textarea {
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

.textarea:focus-within {
    border: 1px solid var(--text-a);
}

.textarea::placeholder {
    color: var(--text-b);
    opacity: 0.5;
}

.send-button {
    justify-content: center;
    align-items: center;
    display: flex;
    height: 3rem;
    cursor: pointer;
    padding-left: 1rem;
    padding-right: 0.25rem;

}
</style>
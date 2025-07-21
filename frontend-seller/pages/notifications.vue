<template>
    <div class="card">
        <ToastComp ref="toastRef" />

        <!--CONTENT-->

        <FolderComp :tabs="['Notifications']" v-model="tabIndex">

            <template #icon-0>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="lucide lucide-inbox-icon lucide-inbox">
                    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
                    <path
                        d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
                </svg>
            </template>

            <template #icon-1>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="lucide lucide-chart-no-axes-column-icon lucide-chart-no-axes-column">
                    <line x1="18" x2="18" y1="20" y2="10" />
                    <line x1="12" x2="12" y1="20" y2="4" />
                    <line x1="6" x2="6" y1="20" y2="14" />
                </svg>
            </template>

            <template #content="{ index }">

                <!----------------TABLET START---------------->

                <div v-if="!notifications.length"></div>

                <TableComp v-if="notifications.length" :columns="columns" :items="notifications" :limit="limit"
                    :hasNextPage="hasNextPage" :hasPrevPage="hasPrevPage" :range="range" :page="page" :count="bookCount"
                    actions @onPrev="handleOnPrev" @onNext="handleOnNext" :columnWidths="{
                        title: '4rem',
                        message: '8rem',
                        type: '2rem',
                        data: '20rem',
                        created_at: '4rem',
                        actions: '2rem',
                    }">

                    <template #col-data="{ value }">

                        <MessageComp :content="value" />

                    </template>

                    <template #col-created_at="{ value }">
                        {{ formatCompleteDate(value) }}
                    </template>

                    <template #actions="{ item }">

                        <div class="flex center">
                            <DottedMenu :options="dottedMenuOptions" :value="item" @onSelected="handleDottedMenu" />
                        </div>

                    </template>

                </TableComp>
                <!----------------TABLET END---------------->
            </template>

        </FolderComp>

        <!--CONTENT END-->
    </div>
</template>

<script setup>
import { formatCompleteDate } from "@/utils/utils"
import { gql } from 'graphql-tag'

const authStore = useAuthStore()

const { $notificationClient } = useNuxtApp()

const router = useRouter()

const tabIndex = ref(0)

const toastRef = ref(null);

const columns = ref([{ label: "Date", field: "created_at" },
{ label: "Title", field: "title" },
{ label: "Message", field: "message" },
{ label: "Type", field: "type" },
{ label: "Data", field: "data" }
])

const dottedMenuOptions = ref([
    { label: "Open", value: "open" }
])

const handleDottedMenu = (event, value) => {
    if (event === 'open') {
        const parsedData = JSON.parse(value.data)

        if (value.type === 'order') {
            router.push({
                name: 'order-id',
                params: {
                    id: parsedData.id
                }
            })
        }
    }
}

const notifications = ref([])
const nextCursor = ref(null)
const page = ref(1)
const limit = ref(16)
const bookCount = ref(0)
const hasNextPage = ref(false)
const hasPrevPage = ref(false)

const range = computed(() => {
    const start = (page.value - 1) * limit.value + 1
    const end = start + notifications.value.length - 1
    return `${start} - ${end} of ${bookCount.value}`
})

const initialFetchError = ref(null)

let subscription1;

const fetchNotifications = async (getCursorVariable) => {
    if (!import.meta.client) return;

    if (!authStore.seller) return;

    const GET_CURSOR_QUERY = gql`
query GetCursor($getCursorVariable: GetCursorInput!) {
    getCursor(getCursorInput: $getCursorVariable) {
        notifications {
            id
            type
            title
            owner
            seen
            data
            message
            created_at
        }
        nextCursor
        totalCount
        hasPrevMore
        hasNextMore
    }
}
    
`
    const observable = await $notificationClient.watchQuery({
        query: GET_CURSOR_QUERY,
        variables: {
            getCursorVariable
        },
        fetchPolicy: 'no-cache',
        pollInterval: 60_000
    })

    subscription1 = observable.subscribe({
        next({ data }) {
            const resultData = data.getCursor;

            notifications.value = resultData.notifications
            nextCursor.value = resultData.nextCursor
            bookCount.value = resultData.totalCount
            hasPrevPage.value = resultData.hasPrevMore
            hasNextPage.value = resultData.hasNextMore
        },
        error(err) {
            console.log(err)
            initialFetchError.value = err
            displayMessage(err, 'error', 10_000)
        }
    })

}

const handleOnNext = async (item) => {
    if (!hasNextPage.value) return
    const cursor = `${item.created_at}_${item.id}`
    await fetchNotifications({ cursor })
    page.value += 1
}

const handleOnPrev = async (item) => {
    if (!hasPrevPage.value) return
    const reverseCursor = `${item.created_at}_${item.id}`
    await fetchNotifications({ reverseCursor })
    if (page.value > 1) page.value -= 1
}

function displayMessage(message, type, duration) {
    toastRef.value?.showToast(message, type, duration)
}

onMounted(() => {
    fetchNotifications({})

    if (initialFetchError.value) {
        console.error('Error fetching the notifications:', initialFetchError.value)
        displayMessage('The notifications could not be loaded. Please try again later.' + initialFetchError.value, 'error', 10_000)
    }
})

onBeforeUnmount(() => {
    subscription1?.unsubscribe()
})

</script>

<style lang="css" scoped>
.card {
    background-image: var(--gradient-a);
    border: 1px solid var(--border-a);
    border-radius: var(--radius-c);
    margin: 0.5rem;
    padding: 0.5rem;
}
</style>
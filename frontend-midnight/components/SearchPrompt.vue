<template>
    <div class="SearchPrompt center">

        <DrawerComp v-model="filterDrawer" position="left" width="350px" :overlay="false">
            <SearchPanel @onApply="filterDrawer = false" />
        </DrawerComp>

        <div class="title">
            <span>Hello, what do you need today?</span>
        </div>

        <form class="SearchPrompt-form" :class="{ 'focused': isFocused }" @focusin="isFocused = true"
            @focusout="isFocused = false" @submit.prevent="submitPrompt">
            <div class="controls">
                <div class="SearchPrompt-input flex">
                    <textarea v-model="prompt" aria-label="Prompt" @keydown.enter.exact.prevent="submitPrompt" rows="1"
                        @focus="onFocusOrClick" @click="onFocusOrClick" placeholder="Search prompt" />
                </div>

                <div class="control flex">
                    <TiptoolComp text="Filters">
                        <button class="filter-button" @click="openFilters">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round"
                                class="lucide lucide-sliders-horizontal-icon lucide-sliders-horizontal">
                                <line x1="21" x2="14" y1="4" y2="4" />
                                <line x1="10" x2="3" y1="4" y2="4" />
                                <line x1="21" x2="12" y1="12" y2="12" />
                                <line x1="8" x2="3" y1="12" y2="12" />
                                <line x1="21" x2="16" y1="20" y2="20" />
                                <line x1="12" x2="3" y1="20" y2="20" />
                                <line x1="14" x2="14" y1="2" y2="6" />
                                <line x1="8" x2="8" y1="10" y2="14" />
                                <line x1="16" x2="16" y1="18" y2="22" />
                            </svg>
                        </button>
                    </TiptoolComp>

                    <button class="send-button flex center" type="submit" :disabled="isSubmitting || !prompt.trim()"
                        title="Enviar">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                            class="lucide lucide-arrow-up-icon lucide-arrow-up">
                            <path d="m5 12 7-7 7 7" />
                            <path d="M12 19V5" />
                        </svg>
                    </button>

                </div>
            </div>


        </form>
    </div>
</template>

<script setup>
const route = useRoute()
const router = useRouter()

const isFocused = ref(false)

const filterDrawer = ref(false)

function openFilters(e) {
    filterDrawer.value = !filterDrawer.value
}

const prompt = ref('')
const isSubmitting = ref(false)

watch(
    () => route.query.prompt,
    (value) => {
        if (value) {
            prompt.value = value
        }
    },
    { immediate: true }
)

function submitPrompt() {
    const trimmed = prompt.value.trim()
    if (!trimmed) return

    isSubmitting.value = true

    router.push({
        name: 'country-s',
        query: {
            ...route.query,
            prompt: trimmed,
            vectorized: true
        }
    })

    setTimeout(() => {
        isSubmitting.value = false
    }, 1000)
}
</script>



<style scoped>
.SearchPrompt {
    width: 100%;
    display: flex;
    padding: 1rem;
    min-height: 24rem;
    flex-direction: column;
    box-sizing: border-box;
    justify-content: flex-end;
    background: var(--black-a);
}

.controls {
    width: inherit;
    display: flex;
    flex-direction: column;
}

.control {
    justify-content: space-between;
}

.filter-button {
    background: transparent;
    cursor: pointer;
    border: none;
}

.SearchPrompt-form {
    width: inherit;
    display: flex;
    padding: 1rem;
    max-width: 45%;
    margin: auto auto;
    padding-top: 1rem;
    position: relative;
    align-items: center;
    margin-bottom: 4rem;
    box-sizing: border-box;
    padding-bottom: 0.75rem;
    box-shadow: var(--shadow-c);
    border-radius: var(--radius-d);
    background: var(--background-a);
    transition: var(--transition-a);
    border: 1px solid var(--border-a);
}

.SearchPrompt-form.focused {
    border: 1px solid var(--border-b);
}

.SearchPrompt-form:hover {
    border: 1px solid var(--border-b);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.SearchPrompt-input {
    flex: 1;
    display: flex;
    position: relative;
    align-items: center;
}

.SearchPrompt-input textarea {
    z-index: 2;
    width: 100%;
    border: none;
    outline: none;
    resize: none;
    height: 4rem;
    line-height: 1.5rem;
    position: relative;
    color: var(--text-a);
    background: transparent;
    font-size: var(--text-size-2);
}

.SearchPrompt-input textarea::placeholder {
    color: var(--text-b);
    font-size: inherit;
    opacity: 0.5;
}


.send-button {
    background: var(--black-a);
    color: var(--text-w);
    border: none;
    width: 36px;
    height: 36px;
    cursor: pointer;
    border-radius: 50%;
    transition: background-color 0.2s ease;
}

.send-button:hover {
    background: #333;
}

.send-button:disabled {
    background: var(--black-a);
    pointer-events: none;
}

.title {
    justify-content: center;
    margin-top: 3rem;
    width: inherit;
    display: flex;
}

.title span {
    font-size: var(--text-size-8);
    color: var(--text-w);
    text-align: center;
    font-weight: 500;
}
</style>

<style scoped>
@media (max-width: 480px) {
    .SearchPrompt {
        min-height: 18rem;
    }

    .title {
        margin-top: 2rem;
    }

    .title span {
        font-size: var(--text-size-6);
    }

    .SearchPrompt-form {
        max-width: 100%;
        margin-top: 1rem;
        margin-bottom: 1rem;
    }
}

@media (min-width: 481px) and (max-width: 767px) {}

@media (min-width: 768px) and (max-width: 991px) {}

@media (min-width: 992px) and (max-width: 1199px) {}

@media (min-width: 1200px) and (max-width: 1599px) {}

@media (min-width: 1600px) {}
</style>
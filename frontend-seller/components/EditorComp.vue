<template>
  <div class="EditorComp" :class="{ invalid: false }" v-if="editor">
    <ToastComp ref="toastRef" />

    <div class="EditorComp-control">
      <div class="EditorComp-control-group">
        <button @click="editor.chain().focus().toggleBold().run()"
          :disabled="!editor.can().chain().focus().toggleBold().run()"
          :class="{ 'is-active': editor.isActive('bold') }">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            class="lucide lucide-bold-icon lucide-bold">
            <path d="M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8" />
          </svg>
        </button>
        <button @click="editor.chain().focus().toggleItalic().run()"
          :disabled="!editor.can().chain().focus().toggleItalic().run()"
          :class="{ 'is-active': editor.isActive('italic') }">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            class="lucide lucide-italic-icon lucide-italic">
            <line x1="19" x2="10" y1="4" y2="4" />
            <line x1="14" x2="5" y1="20" y2="20" />
            <line x1="15" x2="9" y1="4" y2="20" />
          </svg>
        </button>
        <button @click="editor.chain().focus().toggleStrike().run()"
          :disabled="!editor.can().chain().focus().toggleStrike().run()"
          :class="{ 'is-active': editor.isActive('strike') }">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            class="lucide lucide-strikethrough-icon lucide-strikethrough">
            <path d="M16 4H9a3 3 0 0 0-2.83 4" />
            <path d="M14 12a4 4 0 0 1 0 8H6" />
            <line x1="4" x2="20" y1="12" y2="12" />
          </svg>
        </button>
      </div>

      <div class="EditorComp-control-group">
        <button @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
          :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            class="lucide lucide-heading1-icon lucide-heading-1">
            <path d="M4 12h8" />
            <path d="M4 18V6" />
            <path d="M12 18V6" />
            <path d="m17 12 3-2v8" />
          </svg>
        </button>

        <button @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
          :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            class="lucide lucide-heading2-icon lucide-heading-2">
            <path d="M4 12h8" />
            <path d="M4 18V6" />
            <path d="M12 18V6" />
            <path d="M21 18h-4c0-4 4-3 4-6 0-1.5-2-2.5-4-1" />
          </svg>
        </button>

        <button @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
          :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            class="lucide lucide-heading3-icon lucide-heading-3">
            <path d="M4 12h8" />
            <path d="M4 18V6" />
            <path d="M12 18V6" />
            <path d="M17.5 10.5c1.7-1 3.5 0 3.5 1.5a2 2 0 0 1-2 2" />
            <path d="M17 17.5c2 1.5 4 .3 4-1.5a2 2 0 0 0-2-2" />
          </svg>
        </button>
      </div>

      <div class="EditorComp-control-group">
        <button @click="editor.chain().focus().toggleBulletList().run()"
          :class="{ 'is-active': editor.isActive('bulletList') }">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            class="lucide lucide-list-icon lucide-list">
            <path d="M3 12h.01" />
            <path d="M3 18h.01" />
            <path d="M3 6h.01" />
            <path d="M8 12h13" />
            <path d="M8 18h13" />
            <path d="M8 6h13" />
          </svg>
        </button>

        <button @click="editor.chain().focus().toggleOrderedList().run()"
          :class="{ 'is-active': editor.isActive('orderedList') }">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            class="lucide lucide-list-ordered-icon lucide-list-ordered">
            <path d="M10 12h11" />
            <path d="M10 18h11" />
            <path d="M10 6h11" />
            <path d="M4 10h2" />
            <path d="M4 6h1v4" />
            <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
          </svg>
        </button>
      </div>

      <div class="EditorComp-control-counter">
        <span :style="{ color: productEditorCounter < 1 ? 'red' : 'black' }">{{ productEditorCounter }}</span>
        <span> {{ ` / ${editorLimit}` }}</span>
      </div>

    </div>

    <div class="EditorComp-content">
      <editor-content :editor="editor" />

      <div class="EditorComp-generative">
        <textarea id="EditorComp-generative" v-model="generativeEditor"
          placeholder="Write everything about the product..." rows="4"
          @keydown.enter.exact.prevent="onGenerativeSubmit" />


        <div class="EditorComp-generative-button" @click="onGenerativeSubmit">
          <svg v-if="!isGenerating" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            class="lucide lucide-arrow-up-icon lucide-arrow-up">
            <path d="m5 12 7-7 7 7" />
            <path d="M12 19V5" />
          </svg>

          <svg v-if="isGenerating" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 16 16"
            fill="currentColor" class="size-4">
            <rect width="10" height="10" x="3" y="3" rx="1.5" />
          </svg>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import StarterKit from '@tiptap/starter-kit'
import HardBreak from '@tiptap/extension-hard-break'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'
import { Editor, EditorContent } from '@tiptap/vue-3'
import { Node, mergeAttributes } from '@tiptap/core'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => null,
  },

  htmlContent: {
    type: String,
    default: () => ''
  }
})

const emit = defineEmits(['valid', 'update:modelValue'])
const toastRef = ref(null)
const editor = ref(null)
const editorLimit = ref(6000)
const isGenerating = ref(false)
const generativeEditor = ref('')

watch(
  () => props.modelValue,
  (newVal) => {
    if (editor.value && newVal) {
      editor.value.commands.setContent(newVal)
    }
  },
  { immediate: true, deep: true }
)

watch(
  () => props.htmlContent,
  (newVal) => {
    if (editor.value && newVal) {
      editor.value.commands.setContent(newVal)
      emitValid()
    }
  },
  { immediate: true }
)

const ChunkSpan = Node.create({
  name: 'chunkSpan',
  inline: true,
  group: 'inline',
  content: 'text*',
  atom: false,
  selectable: false,
  addAttributes() {
    return { class: { default: 'c' } }
  },
  parseHTML() {
    return [{ tag: 'span.c' }]
  },
  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(HTMLAttributes), 0]
  },
})

const setupEditor = async () => {
  await nextTick(() => {
    editor.value = new Editor({
      extensions: [
        StarterKit.configure({ hardBreak: false }),
        HardBreak.configure({ keepMarks: false }),
        ChunkSpan,
        Placeholder.configure({ placeholder: 'Editable Output' }),
        CharacterCount.configure({ limit: editorLimit.value }),
        TextStyle.configure({ types: [ListItem.name] }),
      ],
      editorProps: { attributes: { class: 'editor-class' } },
      content: '',
      onUpdate: ({ editor }) => {
        const json = editor.getJSON()
        const text = editor.getText().trim()
        const html = editor.getHTML()

        emit('valid', { valid: text.length > 0, value: html })
        emit('update:modelValue', json)
      },
    })
  })
}

function emitValid() {
  if (editor.value) {
    const text = editor.value.getText().trim() ?? ''
    const json = editor.value.getJSON() ?? null
    const html = editor.value.getHTML()

    emit('valid', {
      valid: text.length > 0,
      value: html
    })

    console.log("Initial editor length", text.length)
  } else {
    console.error("emitError editor does not exist.")
  }
}


const displayMessage = (message, type, duration) => {
  toastRef.value?.showToast(message, type, duration)
}

const productEditorCounter = computed(() => {
  if (editor.value) {
    return editor.value.storage.characterCount.characters()
  }
  return 0
})

const stopGenerative = ref(false);

const onGenerativeSubmit = async () => {
  if (isGenerating.value) {
    stopGenerative.value = true
  } else {
    stopGenerative.value = false
  }

  const rawText = generativeEditor.value.trim()
  const isPromptValid = rawText.length > 30 && rawText.length <= 1000

  if (!isPromptValid) {
    displayMessage('Please use a prompt of at least 30 to 1000 characters.', 'error', 10000)
    return
  }

  if (!editor.value) return

  isGenerating.value = true
  editor.value.commands.blur()
  editor.value.setEditable(false)

  try {
    await useProductDescriptionStream(generativeEditor.value, (paragraph) => {
      if (!stopGenerative.value) {
        const content = {
          type: 'paragraph',
          content: [
            {
              type: 'chunkSpan',
              content: [{ type: 'text', text: paragraph }],
            },
          ],
        };

        editor.value.chain().focus('end').insertContent(content).run();
      }
    });

  } catch (err) {
    console.error(err)
  }

  editor.value.setEditable(true)
  isGenerating.value = false
}

onMounted(() => {
  setupEditor()
})

onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.destroy()
  }
})
</script>


<style scoped>
::v-deep(.editor-class) {
  font-size: var(--text-size-1);
  box-sizing: border-box;
  word-break: break-word;
  white-space: pre-wrap;
  color: var(--text-a);
  overflow-y: scroll;
  height: auto;
  max-height: 95%;
  padding: 1rem;
  outline: none;

}


::v-deep(.c) {
  display: inline-block;
  opacity: 0;
  transform: translateY(6px);
  animation: fadeInSlideUp 0.3s ease-out forwards;
}

@keyframes fadeInSlideUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

::v-deep(.editor-class::-webkit-scrollbar) {
  width: 0.9rem;
}

::v-deep(.editor-class::-webkit-scrollbar-track) {
  background: transparent;
}

::v-deep(.editor-class::-webkit-scrollbar-thumb) {
  border: 2px solid var(--background-b);
  background: #888;
  border-radius: 4px;
  cursor: pointer;
}

::v-deep(.editor-class::-webkit-scrollbar-thumb:hover) {
  background: #999;
}

::v-deep(.is-editor-empty:first-child::before) {
  color: var(--text-b);
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}

.EditorComp {
  border: 1px solid var(--border-a);
  border-radius: var(--radius-b);
  position: relative;
  overflow: hidden;
  display: block;
  width: 100%;
}

.EditorComp-content {
  grid-template-rows: 30rem 10rem;
  grid-template-columns: 1fr;
  display: grid;
  height: 100%;
}

.EditorComp-generative {
  position: relative;
  display: flex;
  padding: 1rem;
}

.EditorComp-generative textarea {
  transition: border-color 0.3s, box-shadow 0.3s, background 0.3s;
  background: linear-gradient(135deg, rgba(var(--primary-a-base), 0.1), rgba(var(--primary-a-base), 0.2));
  box-shadow: 0 2px 8px rgba(var(--primary-a-base), 0.1);
  border: 1px solid rgba(var(--primary-a-base), 0.3);
  border-radius: var(--radius-c);
  font-size: var(--text-size-1);
  color: var(--primary-a);
  font-family: inherit;
  overflow: auto;
  resize: none;
  outline: none;
  padding: 1rem;
  width: 100%;
  overflow: scroll;
  scrollbar-width: none;
  /* Firefox */
  -ms-overflow-style: none;
  /* Internet Explorer 10+ */
}

.EditorComp-generative textarea:focus {
  border-color: var(--primary-a);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.3);
}

.EditorComp-generative textarea::placeholder {
  color: var(--text-b);
  opacity: var(--placeholder-opacity);
}

.EditorComp-generative textarea::-webkit-scrollbar {
  width: 0.6rem;
  display: none;
}

.EditorComp-generative textarea::-webkit-scrollbar-track {
  background: transparent;
}

.EditorComp-generative textarea::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
  cursor: pointer;
}

.EditorComp-generative textarea::-webkit-scrollbar-thumb:hover {
  background: #999;
}

.EditorComp-generative-button {
  transition: var(--transition-a);
  border-radius: var(--radius-e);
  background: var(--primary-a);
  box-shadow: var(--shadow-a);
  justify-content: center;
  color: var(--text-w);
  align-items: center;
  position: absolute;
  cursor: pointer;
  display: flex;
  height: 2.5rem;
  bottom: 2rem;
  width: 2.5rem;
  right: 2rem;
}

.EditorComp-generative-button:hover {
  opacity: 0.8;
}

.EditorComp-control {
  border-bottom: 1px solid var(--border-a);
  background: var(--background-a);
  align-items: center;
  position: sticky;
  padding: 0.5rem;
  display: flex;
  top: 0;
}

.EditorComp-control-group {
  display: flex;
  margin-right: 1rem
}

.EditorComp-control button {
  border: 1px solid var(--border-a);
  border-radius: var(--radius-b);
  background: transparent;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-b);
  margin-right: 0.5rem;
  cursor: pointer;
}

.EditorComp-control button svg {
  width: var(--text-size-2);
  height: var(--text-size-2);
}

.EditorComp-control button.is-active {
  border: 1px solid gray;
}

.EditorComp-control-counter {
  font-size: var(--text-size-0);
  color: var(--text-b);
}


.invalid {
  border: 1px solid red;
  border-radius: 5px 5px 0 0;
}
</style>
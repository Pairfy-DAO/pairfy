<template>
  <div class="uploader">
    <input type="file" ref="fileInput" multiple accept="image/jpeg,image/png,image/webp,image/avif"
      style="display: none" @change="onFilesSelected" />

    <div class="header" v-show="images.length">
      <div class="counter">
        <span :style="{ color: !images.length ? 'red' : 'black' }">
          {{ imageCounter }}
        </span>
        <span>{{ ` / ${MAX_IMAGES}` }}</span>
      </div>
    </div>

    <div class="empty-template" v-if="!images.length">
      <button class="upload-button" @click="triggerFileInput" :disabled="images.length >= MAX_IMAGES">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
          stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-upload-icon lucide-upload">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" x2="12" y1="3" y2="15" />
        </svg>
      </button>
    </div>

    <div class="image-grid" ref="grid" v-show="images.length">
      <div class="image-item" v-for="(img, index) in images" :key="img.id" :data-id="img.id">
        <img :src="img.local ? img.url : useMediaUrl(img.resolutions.large)" alt="uploaded image" />
        <button class="delete-button" @click="removeImage(img.id)">✖</button>
        <span class="index-badge">{{ index + 1 }}</span>
        <span v-if="img.local" class="local-label">Local</span>
        <span v-if="img.deleted" class="deleted-label">Deleted</span>
      </div>

      <div class="image-item no-drag" data-nodrag>
        <button class="upload-button" @click="triggerFileInput" :disabled="images.length >= MAX_IMAGES">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
            class="lucide lucide-plus-icon lucide-plus">
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Sortable from 'sortablejs';

const MAX_IMAGES = 10;
const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const MIN_WIDTH = 500;
const MIN_HEIGHT = 500;
const MAX_WIDTH = 5000;
const MAX_HEIGHT = 5000;

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
];

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.avif'];

const getFileExtension = (filename: string): string => {
  const match = filename.match(/\.[^.]+$/);
  return match ? match[0].toLowerCase() : '';
};

const toastRef = ref<any>(null);

const displayMessage = (message: any, type: string) => {
  toastRef.value?.showToast(message, type)!;
};

interface UploadedImg {
  id: string;
  file?: File;
  url: string;
  resolutions: {
    large: string;
    small: string;
    medium: string;
    thumbnail: string;
  };
  local?: boolean;
  deleted?: boolean;
}

const props = defineProps({
  modelValue: {
    type: Array as () => UploadedImg[],
    required: true
  }
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: UploadedImg[]): void;
  (
    e: 'valid',
    payload:
      | { valid: boolean; value: { images: UploadedImg[]; positions: string[] } }
      | { valid: boolean; value: null }
  ): void;
}>();

const fileInput = ref<HTMLInputElement | null>(null);
const grid = ref<HTMLDivElement | null>(null);

const images = ref<UploadedImg[]>([...props.modelValue]);

watch(() => props.modelValue, (newVal) => {
  images.value = [...newVal];
});

const positions = computed(() => images.value.map((img) => img.id));

const imageCounter = computed(() => images.value.filter(img => !img.deleted).length);

const validate = () => {
  const hasValidImage = images.value.some(img => !img.deleted);
  emit('valid', { valid: hasValidImage, value: { images: images.value, positions: positions.value } });
};

const triggerFileInput = () => {
  fileInput.value?.click();
};

function validateFiles(files: FileList, availableSlots: number): File[] {
  return Array.from(files)
    .filter((file) => {
      const extension = getFileExtension(file.name);
      const isValidMime = ALLOWED_MIME_TYPES.includes(file.type);
      const isValidExt = ALLOWED_EXTENSIONS.includes(extension);

      if (!isValidMime || !isValidExt) {
        displayMessage(`❌ "${file.name}" has unsupported format (${file.type}, ${extension})`, 'error');
        return false;
      }

      if (file.size > MAX_FILE_SIZE_BYTES) {
        displayMessage(`❌ "${file.name}" exceeds ${MAX_FILE_SIZE_MB}MB`, 'error');
        return false;
      }

      return true;
    })
    .slice(0, availableSlots);
}

const onFilesSelected = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = target.files;
  if (!files) return;

  const availableSlots = MAX_IMAGES - images.value.filter(img => !img.deleted).length;

  if (availableSlots <= 0) {
    displayMessage(`⚠️ No more slots available (${MAX_IMAGES} max).`, 'warning');
    return;
  }

  const filesToAdd = validateFiles(files, availableSlots);

  function validateImageResolution(img: HTMLImageElement, file: File): boolean {
    if (
      img.width < MIN_WIDTH || img.height < MIN_HEIGHT ||
      img.width > MAX_WIDTH || img.height > MAX_HEIGHT
    ) {
      displayMessage(`❌ "${file.name}" rejected due to resolution: ${img.width}x${img.height}`, 'error');
      return false;
    }
    return true;
  }

  filesToAdd.forEach((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {

        if (!validateImageResolution(img, file)) return;

        const newImage: UploadedImg = {
          id: crypto.randomUUID(),
          file,
          url: e.target?.result as string,
          resolutions: {
            large: '',
            small: '',
            medium: '',
            thumbnail: '',
          },
          local: true
        };
        images.value.push(newImage);
        emit('update:modelValue', images.value);
        validate();
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });

  target.value = '';
};

onMounted(() => {
  nextTick(() => {
    validate();
  });

  if (grid.value) {
    Sortable.create(grid.value, {
      animation: 200,
      ghostClass: 'sortable-ghost',
      draggable: '.image-item:not(.no-drag)',
      onEnd: (evt) => {
        if (evt.oldIndex === undefined || evt.newIndex === undefined || evt.oldIndex === evt.newIndex) return;

        const newOrder = Array.from(grid.value!.querySelectorAll('.image-item:not(.no-drag)')).map((el) =>
          (el as HTMLElement).dataset.id
        );

        if (!newOrder.every(id => id)) {
          displayMessage('❌ Error: invalid image ID during reordering.', 'error');
          return;
        }

        images.value.sort((a, b) => newOrder.indexOf(a.id) - newOrder.indexOf(b.id));
        emit('update:modelValue', images.value);
        validate();
      }
    });
  }
});

const removeImage = (id: string) => {
  const index = images.value.findIndex(img => img.id === id);

  if (index === -1) return;

  const image = images.value[index];

  if (image.local) {
    images.value.splice(index, 1);
  } else {
    image.deleted = true;
  }

  emit('update:modelValue', images.value);
  validate();
};

</script>

<style scoped>
.uploader {
  border: 1px solid var(--border-a);
  flex-direction: column;
  align-items: center;
  border-radius: var(--radius-b);
  display: flex;
}

.header {
  align-items: center;
  display: flex;
  height: 3rem;
  width: 100%;
}

.upload-button {
  background: transparent;
  justify-content: center;
  color: var(--text-b);
  align-items: center;
  cursor: pointer;
  display: flex;
  border: none;
  height: 150px;
  width: 150px;
  border-radius: 50%;
}

.upload-button:hover {
  background: var(--background-b);
}

.upload-button svg {
  width: 5rem;
}

.upload-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.counter {
  font-size: var(--text-size-0);
  color: var(--text-b);
  margin-left: 1rem;
}

.empty-template {
  align-items: center;
  height: 20rem;
  display: flex;
}

.image-grid {
  grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
  border-top: 1px solid var(--border-a);
  box-sizing: border-box;
  min-height: 20rem;
  display: grid;
  padding: 1rem;
  width: 100%;
  gap: 1rem;
}

.image-item {
  border: 1px solid var(--border-a);
  border-radius: var(--radius-c);
  justify-content: center;
  align-items: center;
  position: relative;
  height: 10rem;
  overflow: hidden;
  display: flex;
}

.image-item img {
  width: 100%;
  height: 10rem;
  object-fit: cover;
}

.index-badge {
  position: absolute;
  top: 5px;
  left: 5px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 2px 5px;
  font-size: 0.8rem;
  border-radius: 3px;
}

.local-label {
  position: absolute;
  bottom: 5px;
  left: 5px;
  background: rgba(0, 255, 0, 0.7);
  color: white;
  padding: 2px 5px;
  font-size: 0.8rem;
  border-radius: 3px;
}

.delete-button {
  position: absolute;
  top: 5px;
  right: 5px;
  background: rgba(255, 0, 0, 0.7);
  color: white;
  border: none;
  border-radius: 50%;
  width: 22px;
  height: 22px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.delete-button:hover {
  background: rgba(255, 0, 0, 1);
}
</style>

export const useProductStore = defineStore("product", () => {
  const product = ref(null);
  const media = ref([]);

  const cardanoDialog = ref(true);

  const toastMessage = ref<ToastMessage | null>(null);

  type ToastType = "success" | "error" | "info" | "default";

  type ToastMessage = {
    message: string;
    type: ToastType;
    duration: number;
  };

  const showToast = (message: string, type: ToastType, duration: number) => {
    toastMessage.value = {
      message,
      type,
      duration,
    };
  };

  function showCardanoDialog(value: boolean) {
    cardanoDialog.value = value;
  }

  function setProductData(data: any) {
    product.value = data.product;
    media.value = data.media;
  }

  function clear() {
    product.value = null;
    media.value = [];
  }

  return {
    product,
    media,
    clear,
    setProductData,
    toastMessage,
    showCardanoDialog,
    cardanoDialog,
    showToast
  };
});

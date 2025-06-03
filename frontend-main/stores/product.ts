export const useProductStore = defineStore("product", () => {
  const product = ref(null);
  const media = ref([]);
  const cardanoDialog = ref(true);

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
    showCardanoDialog,
    cardanoDialog
  };
});

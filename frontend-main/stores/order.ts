export const useOrderStore = defineStore("order", () => {
  type ToastType = "success" | "error" | "info" | "default";

  type ToastMessage = {
    message: string;
    type: ToastType;
    duration: number;
  };

  const toastMessage = ref<ToastMessage | null>(null);

  const order = ref(null);
  const state = ref(null);
  const finished = ref(null);
  const pendingTx = ref(null);

  const showToast = (message: string, type: ToastType, duration: number) => {
    toastMessage.value = {
      message,
      type,
      duration,
    };
  };

  const setOrder = (data: any) => {
    console.log(data)

    const { order: orderData, shipping, address, session } = data;

    order.value = orderData;
    state.value = orderData.contract_state;
    finished.value = orderData.finished;
  };

  function clear() {
    order.value = null;
  }

  return {
    order,
    clear,
    state,
    setOrder,
    finished,
    toastMessage,
    showToast,
    pendingTx
  };
});

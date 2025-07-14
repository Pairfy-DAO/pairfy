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

  const product = ref(null);
  const address = ref(null);
  const shipping = ref(null);
  const session = ref(null);
  const encryptedPrivateKey = ref(null);

  const countdown = ref(null);

  const showToast = (message: string, type: ToastType, duration: number) => {
    toastMessage.value = {
      message,
      type,
      duration,
    };
  };

  const setOrder = (data: any) => {
    const {
      order: orderData,
      product: productData,
      address: addressData,
      shipping: shippingData,
      session: sessionData,
      encrypted_private_key,
    } = data;

    order.value = orderData;
    state.value = orderData.contract_state;
    finished.value = orderData.finished;
    pendingTx.value = orderData.pending_tx;

    address.value = addressData;
    session.value = sessionData;

    if (productData) {
      product.value = JSON.parse(productData);
    }

    if (shippingData) {
      const parsedData = JSON.parse(shippingData);

      const unchunked = parsedData[0]?.json_metadata?.msg.join("");

      shipping.value = JSON.parse(unchunked);
    }

    if (encrypted_private_key) {
      encryptedPrivateKey.value = JSON.parse(encrypted_private_key);
    }
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
    pendingTx,
    product,
    address,
    shipping,
    session,
    encryptedPrivateKey,
    countdown,
  };
});

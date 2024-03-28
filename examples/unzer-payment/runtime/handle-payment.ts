export default defineNuxtPlugin({
  name: "unzer-handle-payment",
  async setup() {
    const { listen } = useEventBus();
    const { isUnzerPaymentMethod } = useUnzer();

    listen(
      "order:handle-payment",
      async ({ paymentDetails, paymentMethod }) => {
        if (!isUnzerPaymentMethod(paymentMethod)) return;
        console.debug("[unzer] order:handle-payment event received");

        paymentDetails.unzerResourceId = useLocalStorage("unzerId").value;
      },
    );

    listen("order:reset-payment", async () => {
      console.debug("[unzer] order:reset-payment event received");
      const store = useLocalStorage("unzerId");
      store.value = null;
    });
  },
});

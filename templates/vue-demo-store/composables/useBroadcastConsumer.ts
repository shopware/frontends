import type { Schemas } from "#shopware";

export type BroadcastEvent = {
  event: string;
  data: BroadcastDataType;
};

export type BroadcastDataType = {
  sessionContext: Schemas["SalesChannelContext"];
  cart: Schemas["Cart"];
};

export type UseBroadcastConsumerReturn = {
  consume(event: string, data?: BroadcastDataType): void;
  refreshSession(): void;
  actions: {
    loggedOut: string;
    refreshSession: string;
  };
};

/**
 * Registered actions names
 */
const actions = {
  loggedOut: "loggedOut",
  refreshSession: "refreshSession",
};

/**
 * Composable that contains the logic to consume broadcasted messages
 *
 * @returns {UseBroadcastConsumerReturn}
 */
export function useBroadcastConsumer(): UseBroadcastConsumerReturn {
  const { refreshSessionContext, sessionContext, updateContext } =
    useSessionContext();

  const { refreshCart, cart } = useCart();

  const {
    public: { broadcastChannelName },
  } = useRuntimeConfig();

  const { post: corePost, isSupported } = useBroadcastChannel({
    name: broadcastChannelName as string,
  });

  /**
   * Consumes the broadcasted messages
   *
   * @param {string} operation
   * @param {T} data
   */
  const consume = async (operation: string, data?: BroadcastDataType) => {
    switch (operation) {
      // When the user logs out, we refresh the session context by calling the refreshSessionContext method
      case actions.loggedOut:
        try {
          await refreshSessionContext();
        } catch (error) {
          console.error("[useBroadcastConsumer][consume]", error);
        }
        break;
      // When the session is refreshed, we update the session context manually by calling the updateContext method
      case actions.refreshSession:
        if (!data) return;
        updateContext(data.sessionContext);
        refreshCart(data.cart);
        break;
    }
  };

  /**
   * Refreshes the session context
   */
  const refreshSession = (): void => {
    if (isSupported.value) {
      post(actions.refreshSession, {
        sessionContext: sessionContext.value,
        cart: cart,
      });
    }
  };

  /**
   * Proxy to the useBroadcastChannel post method.
   * JSON methods are used to avoid circular references and other issues.
   *
   * @param {string} event name of the event
   * @param {t} data data to be sent
   */
  const post = (event: string, data: unknown) => {
    corePost(
      JSON.parse(
        JSON.stringify({
          event,
          data,
        }),
      ),
    );
  };

  return { consume, refreshSession, actions };
}

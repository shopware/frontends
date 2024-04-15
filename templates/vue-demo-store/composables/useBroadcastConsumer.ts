export type UseBroadcastConsumerReturn = {
  consume(operation: string): void;
  actions: {
    loggedOut: string;
  };
};

/**
 * Registered actions names
 */
const actions = {
  loggedOut: "loggedOut",
};

/**
 * Composable that contains the logic to consume broadcasted messages
 *
 * @returns {UseBroadcastConsumerReturn}
 */
export function useBroadcastConsumer(): UseBroadcastConsumerReturn {
  const { refreshSessionContext } = useSessionContext();

  const consume = async (operation: string) => {
    switch (operation) {
      case actions.loggedOut:
        try {
          await refreshSessionContext();
        } catch (error) {
          console.error("[useBroadcastConsumer][consume]", error);
        }
        break;
    }
  };

  return { consume, actions };
}

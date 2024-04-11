export type UseBroadcastConsumerReturn = {
  consume(operation: string): void;
  actions: {
    loggedOut: string;
  };
};

const actions = {
  loggedOut: "loggedOut",
};

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

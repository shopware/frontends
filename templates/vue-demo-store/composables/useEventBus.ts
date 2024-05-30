import type { Schemas } from "#shopware";

export interface EventPayloads {
  "order:placed": Schemas["PaymentMethod"];
  "order:retry-payment": Schemas["PaymentMethod"];
  "order:handle-payment": {
    paymentDetails: {
      [key: string]:
        | string
        | string[]
        | boolean
        | Record<string, unknown>
        | null;
    };
    paymentMethod: Schemas["PaymentMethod"];
  };
  "order:reset-payment": null;
}

type Emitter = {
  emit<K extends keyof EventPayloads>(
    event: K,
    payload?: EventPayloads[K],
  ): Promise<void>;
  listen<K extends keyof EventPayloads>(
    events: K | K[],
    callback: (payload: EventPayloads[K], event?: K) => Promise<void> | void,
  ): void;
};

export function useEventBus(): Emitter {
  const hooks = useNuxtApp().hooks;
  const listeners: Record<
    string,
    ((payload: never, eventName: string) => Promise<void> | void)[]
  > = {};

  return {
    emit: async (event, payload) => {
      if (listeners[event]) {
        for (const listener of listeners[event]) {
          await listener(payload as unknown as never, event);
        }
      }
      // @ts-expect-error todo: add proper types
      await hooks.callHook(event as never, payload);
    },
    listen: (events, callback) => {
      const eventArray = Array.isArray(events) ? events : [events];
      for (const event of eventArray) {
        if (!listeners[event]) {
          listeners[event] = [];
        }
        const wrappedCallback = (payload: never) => callback(payload, event);
        listeners[event].push(wrappedCallback);
        // @ts-expect-error todo: add proper types
        hooks.hook(event, wrappedCallback);
      }
    },
  };
}

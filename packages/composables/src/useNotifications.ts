import { computed, ComputedRef, Ref, ref, inject, provide } from "vue";

export type Notification = {
  type: "info" | "warning" | "success" | "danger";
  message: string;
  id: number;
};

export type UseNotificationsReturn = {
  notifications: ComputedRef<Notification[]>;
  /**
   * Remove a specific notification by ID
   */
  removeOne: (id: number) => void;
  /**
   * Reset the notification list
   */
  removeAll: () => void;
  pushInfo: (message: string, options?: any) => void;
  pushWarning: (message: string, options?: any) => void;
  pushError: (message: string, options?: any) => void;
  pushSuccess: (message: string, options?: any) => void;
};

export function useNotifications(): UseNotificationsReturn {
  const _notifications: Ref<Notification[]> = inject(
    "swNotifications",
    ref([])
  );
  provide("swNotifications", _notifications);

  function removeOne(notificationId: number) {
    _notifications.value =
      _notifications.value?.filter(({ id }) => id !== notificationId) || [];
  }

  function removeAll() {
    _notifications.value = [];
  }

  function geterateId() {
    return new Date().getTime();
  }

  async function pushNotification(
    message: string,
    options: {
      type: "info" | "warning" | "success" | "danger";
      timeout: number;
      persistent: boolean;
    }
  ) {
    const timeout = options.timeout || 2500;
    const persistent = !!options.persistent;
    _notifications.value = _notifications.value || [];

    const messageId = geterateId();
    _notifications.value.push({
      id: messageId,
      type: options.type,
      message,
    });
    if (!persistent) {
      setTimeout(() => {
        removeOne(messageId);
      }, timeout);
    }
  }

  return {
    removeOne,
    removeAll,
    pushInfo: (message: string, options = {}) =>
      pushNotification(message, { ...options, type: "info" }),
    pushSuccess: (message: string, options = {}) =>
      pushNotification(message, { ...options, type: "success" }),
    pushWarning: (message: string, options = {}) =>
      pushNotification(message, { ...options, type: "warning" }),
    pushError: (message: string, options = {}) =>
      pushNotification(message, { ...options, type: "danger" }),
    notifications: computed(() => _notifications.value || []),
  };
}

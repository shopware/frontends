import { computed, ref, inject, provide } from "vue";
import type { ComputedRef, Ref } from "vue";

type NotificationType = "info" | "warning" | "success" | "danger";

/**
 * @private
 */
export type Notification = {
  type: NotificationType;
  message: string;
  id: number;
};

/**
 * @private
 */
export type NotificationOptions = {
  /**
   * @private
   */
  type?: NotificationType;
  timeout?: number;
  persistent?: boolean;
};

/**
 * @public
 */
export type UseNotificationsReturn = {
  /**
   * List of active notifications
   */
  notifications: ComputedRef<Notification[]>;
  /**
   * Removes a specific notification by its ID
   */
  removeOne(id: number): void;
  /**
   * Resets the notification list - clear all notifications
   */
  removeAll(): void;
  /**
   * Push an info notification to the current list
   */
  pushInfo(message: string, options?: NotificationOptions): void;
  /**
   * Pushes a warning notification to the current list
   */
  pushWarning(message: string, options?: NotificationOptions): void;
  /**
   * Pushes an error notification to the current list
   */
  pushError(message: string, options?: NotificationOptions): void;
  /**
   * Pushes a success notification to the current list
   */
  pushSuccess(message: string, options?: NotificationOptions): void;
};

/**
 * Composable for managing notifications (flash messages) on frontend.
 * @public
 */
export function useNotifications(): UseNotificationsReturn {
  const _notifications: Ref<Notification[]> = inject(
    "swNotifications",
    ref([]),
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
    return +`${new Date().getTime()}${Math.random() * 1000}`;
  }

  async function pushNotification(
    message: string,
    options: Required<Pick<NotificationOptions, "type">> & NotificationOptions,
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

# useNotifications

<div class="mb-10 grid grid-cols-[80px_auto] gap-2 text-sm">
{{META}}
</div>

Composable for managing notifications (flash messages) on frontend.





## Types


```ts
export function useNotifications(): UseNotificationsReturn 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/useNotifications/useNotifications.ts#L77" target="_blank">source code</a>



```ts
export type NotificationAction = {
  label: string;
  to: string;
};
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/useNotifications/useNotifications.ts#L11" target="_blank">source code</a>

```ts
export type Notification = {
  type: NotificationType;
  message: string;
  id: number;
  action?: NotificationAction;
};
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/useNotifications/useNotifications.ts#L19" target="_blank">source code</a>

```ts
export type NotificationOptions = {
  /**
   * @private
   */
  type?: NotificationType;
  timeout?: number;
  persistent?: boolean;
  action?: NotificationAction;
};
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/useNotifications/useNotifications.ts#L29" target="_blank">source code</a>

```ts
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
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/useNotifications/useNotifications.ts#L42" target="_blank">source code</a>


<div data-placeholder="dynamic-markdown"></div>

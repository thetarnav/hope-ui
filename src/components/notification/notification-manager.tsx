import { Accessor, createContext, createMemo, createUniqueId, For, JSX, splitProps, useContext } from "solid-js";
import { Portal } from "solid-js/web";
import { TransitionGroup } from "solid-transition-group";

import { createQueue } from "@/hooks/create-queue";
import { PositionProps } from "@/styled-system/props/position";
import { classNames } from "@/utils/css";

import { Box } from "../box/box";
import { useNotificationsEvents } from "./notification.events";
import { notificationListStyles, NotificationListVariants, notificationTransitionName } from "./notification.styles";
import { NotificationConfig, ShowNotificationProps } from "./notification.types";
import { NotificationContainer } from "./notification-container";

interface NotificationManagerProps extends NotificationListVariants {
  /**
   * Maximum amount of notifications displayed at a time,
   * other new notifications will be added to queue.
   */
  limit?: number;

  /**
   * If `true`, notifications will show a close button.
   */
  closable?: boolean;

  /**
   * The delay (in ms) before notifications hides.
   * If set to `null`, notifications will never dismiss.
   */
  duration?: number | null;

  /**
   * The `z-index` css property of all notifications.
   */
  zIndex?: PositionProps["zIndex"];

  /**
   * The children of the notification manager.
   */
  children: JSX.Element;
}

const hopeNotificationListClass = "hope-notification__list";

export function NotificationManager(props: NotificationManagerProps) {
  const [local] = splitProps(props, ["children", "placement", "closable", "duration", "limit", "zIndex"]);

  const notificationQueue = createMemo(() => {
    return createQueue<NotificationConfig>({
      initialValues: [],
      limit: local.limit ?? 10,
    });
  });

  const finalPlacement: Accessor<NotificationManagerProps["placement"]> = () => local.placement ?? "top-end";

  const notificationsAccessor = () => notificationQueue().state.current;

  const queueAccessor = () => notificationQueue().state.queue;

  const showNotification = (notification: ShowNotificationProps) => {
    const id = notification.id ?? `hope-notification-${createUniqueId()}`;
    const closable = notification.closable ?? local.closable ?? true;
    const duration = notification.duration ?? local.duration ?? 4_000;

    notificationQueue().update(notifications => {
      if (notification.id && notifications.some(n => n.id === notification.id)) {
        return notifications;
      }

      const newNotification: NotificationConfig = { ...notification, id, closable, duration };

      return [...notifications, newNotification];
    });

    return id;
  };

  const updateNotification = (id: string, notification: NotificationConfig) => {
    notificationQueue().update(notifications => {
      const index = notifications.findIndex(n => n.id === id);

      if (index === -1) {
        return notifications;
      }

      const newNotifications = [...notifications];
      newNotifications[index] = notification;

      return newNotifications;
    });
  };

  const hideNotification = (id: string) => {
    notificationQueue().update(notifications => {
      return notifications.filter(notification => {
        if (notification.id === id) {
          notification.onClose?.(notification.id);
          return false;
        }

        return true;
      });
    });
  };

  const clear = () => notificationQueue().update(() => []);

  const clearQueue = () => notificationQueue().clearQueue();

  const classes = () => {
    return classNames(
      hopeNotificationListClass,
      notificationListStyles({
        placement: finalPlacement(),
      })
    );
  };

  const transitionName = () => {
    switch (finalPlacement()) {
      case "top-start":
        return notificationTransitionName.slideInLeft;
      case "top":
        return notificationTransitionName.slideInTop;
      case "top-end":
        return notificationTransitionName.slideInRight;
      case "bottom-start":
        return notificationTransitionName.slideInLeft;
      case "bottom":
        return notificationTransitionName.slideInBottom;
      case "bottom-end":
        return notificationTransitionName.slideInRight;
      default:
        return notificationTransitionName.slideInRight;
    }
  };

  const context: NotificationManagerContextValue = {
    notifications: notificationsAccessor,
    queue: queueAccessor,
    showNotification,
    updateNotification,
    hideNotification,
    clear,
    clearQueue,
  };

  useNotificationsEvents(context);

  return (
    <NotificationManagerContext.Provider value={context}>
      <Portal>
        <Box class={classes()} zIndex={local.zIndex}>
          <TransitionGroup name={transitionName()}>
            <For each={context.notifications()}>{notification => <NotificationContainer {...notification} />}</For>
          </TransitionGroup>
        </Box>
      </Portal>
      {local.children}
    </NotificationManagerContext.Provider>
  );
}

/* -------------------------------------------------------------------------------------------------
 * Context
 * -----------------------------------------------------------------------------------------------*/

export interface NotificationManagerContextValue {
  /**
   * All currently displayed notifications.
   */
  notifications: Accessor<NotificationConfig[]>;

  /**
   * All pending notifications.
   */
  queue: Accessor<NotificationConfig[]>;

  /**
   * Show a notification.
   */
  showNotification(config: NotificationConfig): string;

  /**
   * Update a notification for a given `id`.
   */
  updateNotification(id: string, config: NotificationConfig): void;

  /**
   * Hide a notification.
   */
  hideNotification(id: string): void;

  /**
   * Remove all notifications.
   * (displayed and from the queue)
   */
  clear(): void;

  /**
   * Remove all pending notifications for the queue only.
   */
  clearQueue(): void;
}

const NotificationManagerContext = createContext<NotificationManagerContextValue>();

export function useNotificationManagerContext() {
  const context = useContext(NotificationManagerContext);

  if (!context) {
    throw new Error(
      "[Hope UI]: useNotificationManagerContext must be used within a `<NotificationManager />` component"
    );
  }

  return context;
}
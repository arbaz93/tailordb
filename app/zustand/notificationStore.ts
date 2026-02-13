/**
 * Zustand store for managing notifications
 * Supports status, type, and modal display
 */

import { create } from "zustand";

/* ----------------------------- Types ---------------------------------- */

/** Allowed notification types */
type NotificationStatusType = "success" | "error" | "processing" | "warning";

/** Shape of a notification */
type Notification = {
  text: string;                // Notification message
  status: number;              // Status code (e.g., 100 = initial, 200 = success)
  type: NotificationStatusType;
  displayModal: boolean;       // Whether to show notification modal
};

/** Zustand store type */
type NotificationStore = {
  notification: Notification;

  /** Update notification, merges with existing state */
  setNotification: (notification: Partial<Notification>) => void;
};

/* ----------------------------- Store ---------------------------------- */

export const useNotificationStore = create<NotificationStore>((set) => ({
  /* Initial state: safe default for SSR */
  notification: {
    text: "",
    status: 100,
    type: "processing",
    displayModal: false,
  },

  /**
   * Update notification
   * Merges the new partial notification into current state
   */
  setNotification: (notification) =>
    set((state) => ({
      notification: { ...state.notification, ...notification },
    })),
}));

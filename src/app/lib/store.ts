import { create } from 'zustand';

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface AppNotification {
  id: string;
  type: NotificationType;
  message: string;
}

interface NotificationState {
  notifications: AppNotification[];
  addNotification: (notification: Omit<AppNotification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        ...state.notifications,
        { ...notification, id: Math.random().toString(36).substr(2, 9) },
      ],
    })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
  clearNotifications: () => set({ notifications: [] }),
}));

// DetectionType for detection results
export type DetectionType = {
  detection_time: string;
  frame_number: number;
  license_plate: {
    gcs_url: string;
    id: number;
    image_path: string;
    number: string;
    signed_url: string;
  };
  success: boolean;
  vehicle: {
    color: string | null;
    gcs_url: string;
    id: number;
    image_path: string;
    plate_number: string;
    signed_url: string;
  };
};

interface DetectionState {
  detectionResults: DetectionType[];
  setDetectionResults: (results: DetectionType[]) => void;
  addDetectionResult: (result: DetectionType) => void;
  clearDetectionResults: () => void;
}

export const useDetectionStore = create<DetectionState>((set) => ({
  detectionResults: [],
  setDetectionResults: (results) => set({ detectionResults: results }),
  addDetectionResult: (result) => set((state) => ({ detectionResults: [...state.detectionResults, result] })),
  clearDetectionResults: () => set({ detectionResults: [] }),
})); 
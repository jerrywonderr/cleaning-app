export interface Notification {
  id: string;
  customerId: string;
  message: string;
  type: string;
  read: boolean;
  timestamp: any;
  data?: Record<string, any>;
  pushNotification?: {
    title: string;
    body: string;
    data?: Record<string, any>;
  };
}

export type NotificationType =
  | "proposal_created"
  | "proposal_accepted"
  | "proposal_rejected"
  | "payment_success"
  | "payment_failed"
  | "appointment_confirmed"
  | "service_started"
  | "service_completed"
  | "cancelled"
  | "no_show"
  | "expired";

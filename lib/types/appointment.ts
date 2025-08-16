/**
 * Appointment Types and Interfaces
 *
 * This file defines the data structures for appointments in the cleaning app.
 * Appointments represent booked services that customers schedule with service providers.
 */

export type AppointmentStatus =
  | "pending" // Just created, waiting for service provider confirmation
  | "confirmed" // Service provider confirmed the appointment
  | "in-progress" // Service provider is currently at the location
  | "completed" // Customer marked as completed
  | "cancelled" // Cancelled by either party
  | "no-show"; // Service provider didn't show up

export type AppointmentPriority = "low" | "medium" | "high" | "urgent";

export interface Appointment {
  id: string;

  // Core appointment details
  offerId: string; // Reference to the offer being booked
  customerId: string; // Firebase user ID of the customer
  serviceProviderId: string; // Firebase user ID of the service provider

  // Service details
  serviceType: string; // Type of cleaning service
  address: string; // Service location address
  scheduledDate: Date; // When the service should happen
  scheduledTime: Date; // Time of day for the service
  duration: number; // Estimated duration in hours
  price: number; // Price in Naira

  // Status and tracking
  status: AppointmentStatus;
  priority: AppointmentPriority;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  confirmedAt?: Date; // When service provider confirmed
  startedAt?: Date; // When service actually started
  completedAt?: Date; // When customer marked as completed

  // Additional details
  notes?: string; // Customer notes or special instructions
  cancellationReason?: string; // If cancelled, why?

  // Payment and completion
  isPaid: boolean; // Whether customer has paid
  paymentMethod?: string; // How payment was made
  customerRating?: number; // Customer's rating (1-5)
  customerReview?: string; // Customer's review text
}

export interface CreateAppointmentData {
  offerId: string;
  serviceType: string;
  address: string;
  scheduledDate: Date;
  scheduledTime: Date;
  notes?: string;
}

export interface UpdateAppointmentData {
  status?: AppointmentStatus;
  notes?: string;
  cancellationReason?: string;
  customerRating?: number;
  customerReview?: string;
}

export interface AppointmentFilters {
  status?: AppointmentStatus;
  priority?: AppointmentPriority;
  dateRange?: {
    start: Date;
    end: Date;
  };
  serviceType?: string;
}

export interface AppointmentSearchParams {
  page?: number;
  limit?: number;
  sortBy?: "scheduledDate" | "createdAt" | "price" | "priority";
  sortOrder?: "asc" | "desc";
}

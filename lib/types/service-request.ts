/**
 * Service Request Types and Interfaces
 *
 * This file defines the data structures for service requests in the cleaning app.
 * Service requests represent customer requests that go through a lifecycle:
 *
 * PROPOSAL PHASE:
 * pending → accepted OR rejected
 *
 * PAYMENT PHASE (if accepted):
 * accepted → confirmed (after payment) OR expired (if not paid in time)
 *
 * APPOINTMENT PHASE (if confirmed):
 * confirmed → in-progress → completed
 * OR
 * confirmed → cancelled
 */

import { CreateProposalFormData } from "@/lib/schemas/create-proposal";

// Use the same location type as the form
export type ServiceRequestLocation = CreateProposalFormData["location"];

export type ServiceRequestStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "confirmed"
  | "in-progress"
  | "completed"
  | "cancelled"
  | "no-show"
  | "expired";

export interface ServiceRequest {
  id: string;

  // Core participants
  customerId: string;
  providerId: string;

  // Service details
  serviceType: string; // "classic-cleaning" | "deep-cleaning" | "end-of-tenancy"
  serviceName: string;
  duration: number; // in hours

  // Scheduling
  scheduledDate: string; // ISO date string
  timeRange: string; // e.g., "09:00-12:00"

  // Location
  location: ServiceRequestLocation;

  // Pricing
  basePrice: number;
  extrasPrice: number;
  totalPrice: number;
  extraOptions: string[]; // Array of extra service IDs

  // Status & lifecycle
  status: ServiceRequestStatus;

  // Timestamps
  createdAt: Date;
  acceptedAt?: Date;
  rejectedAt?: Date;
  confirmedAt?: Date; // when payment is made
  startedAt?: Date;
  completedAt?: Date;
  cancelledAt?: Date;
  noShowAt?: Date;
  expiredAt?: Date;

  // Additional fields
  rejectionReason?: string;
  cancellationReason?: string;
  noShowReason?: string;
  paymentId?: string;
  paymentMethod?: string;
  customerNotes?: string;
  providerNotes?: string;
}

export interface CreateServiceRequestData {
  customerId: string;
  providerId: string;
  serviceType: string;
  serviceName: string;
  duration: number;
  scheduledDate: string;
  timeRange: string;
  location: ServiceRequestLocation;
  basePrice: number;
  extrasPrice: number;
  totalPrice: number;
  extraOptions: string[];
  customerNotes?: string;
}

export interface UpdateServiceRequestData {
  status?: ServiceRequestStatus;
  rejectionReason?: string;
  cancellationReason?: string;
  noShowReason?: string;
  noShowAt?: Date;
  paymentId?: string;
  paymentMethod?: string;
  providerNotes?: string;
  customerNotes?: string;
}

// Rating and Review Types
export interface Rating {
  id: string;
  customerId: string;
  providerId: string;
  serviceRequestId: string; // Reference to the completed service
  rating: number; // 1-5 stars
  review?: string;
  createdAt: Date;
  isVisible: boolean; // for moderation
}

export interface CreateRatingData {
  customerId: string;
  providerId: string;
  rating: number;
  review?: string;
}

// Query filters
export interface ServiceRequestFilters {
  customerId?: string;
  providerId?: string;
  status?: ServiceRequestStatus;
  serviceType?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

// Response types
export interface ServiceRequestWithProvider {
  serviceRequest: ServiceRequest;
  provider: {
    id: string;
    firstName: string;
    lastName: string;
    profileImage?: string;
    phone: string;
    rating?: number;
    totalJobs?: number;
  };
}

export interface ServiceRequestWithCustomer {
  serviceRequest: ServiceRequest;
  customer: {
    id: string;
    firstName: string;
    lastName: string;
    profileImage?: string;
    phone: string;
  };
}

/**
 * Service Request Service
 *
 * Handles CRUD operations for service requests in the cleaning app.
 * Manages the lifecycle from pending to completed status.
 */

import { db } from "@/lib/firebase/config";
import {
  CreateRatingData,
  CreateServiceRequestData,
  Rating,
  ServiceRequest,
  ServiceRequestFilters,
  ServiceRequestWithCustomer,
  ServiceRequestWithProvider,
  UpdateServiceRequestData,
} from "@/lib/types/service-request";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

const SERVICE_REQUESTS_COLLECTION = "serviceRequests";
const RATINGS_COLLECTION = "ratings";
const USERS_COLLECTION = "users";
const SERVICE_PROVIDERS_COLLECTION = "serviceProviders";

export class ServiceRequestService {
  /**
   * Create a new service request
   */
  static async createServiceRequest(
    data: CreateServiceRequestData
  ): Promise<string> {
    try {
      const serviceRequestData = {
        ...data,
        status: "pending" as const,
        createdAt: new Date(),
      };

      const docRef = await addDoc(
        collection(db, SERVICE_REQUESTS_COLLECTION),
        serviceRequestData
      );
      return docRef.id;
    } catch (error) {
      console.error("Error creating service request:", error);
      throw new Error("Failed to create service request");
    }
  }

  /**
   * Get a service request by ID
   */
  static async getServiceRequest(id: string): Promise<ServiceRequest | null> {
    try {
      const docRef = doc(db, SERVICE_REQUESTS_COLLECTION, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          acceptedAt: data.acceptedAt?.toDate(),
          rejectedAt: data.rejectedAt?.toDate(),
          confirmedAt: data.confirmedAt?.toDate(),
          startedAt: data.startedAt?.toDate(),
          completedAt: data.completedAt?.toDate(),
          cancelledAt: data.cancelledAt?.toDate(),
          expiredAt: data.expiredAt?.toDate(),
        } as ServiceRequest;
      }
      return null;
    } catch (error) {
      console.error("Error getting service request:", error);
      throw new Error("Failed to get service request");
    }
  }

  /**
   * Update a service request
   */
  static async updateServiceRequest(
    id: string,
    data: UpdateServiceRequestData
  ): Promise<void> {
    try {
      const docRef = doc(db, SERVICE_REQUESTS_COLLECTION, id);

      // Add timestamp based on status change
      const updateData: any = { ...data };

      if (data.status === "accepted") {
        updateData.acceptedAt = new Date();
      } else if (data.status === "rejected") {
        updateData.rejectedAt = new Date();
      } else if (data.status === "confirmed") {
        updateData.confirmedAt = new Date();
      } else if (data.status === "in-progress") {
        updateData.startedAt = new Date();
      } else if (data.status === "completed") {
        updateData.completedAt = new Date();
      } else if (data.status === "cancelled") {
        updateData.cancelledAt = new Date();
      } else if (data.status === "expired") {
        updateData.expiredAt = new Date();
      }

      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error("Error updating service request:", error);
      throw new Error("Failed to update service request");
    }
  }

  /**
   * Get service requests with filters
   */
  static async getServiceRequests(
    filters: ServiceRequestFilters = {}
  ): Promise<ServiceRequest[]> {
    try {
      let q = query(collection(db, SERVICE_REQUESTS_COLLECTION));

      // Apply filters
      if (filters.customerId) {
        q = query(q, where("customerId", "==", filters.customerId));
      }
      if (filters.providerId) {
        q = query(q, where("providerId", "==", filters.providerId));
      }
      if (filters.status) {
        q = query(q, where("status", "==", filters.status));
      }
      if (filters.serviceType) {
        q = query(q, where("serviceType", "==", filters.serviceType));
      }

      // Order by creation date (newest first)
      q = query(q, orderBy("createdAt", "desc"));

      const querySnapshot = await getDocs(q);
      const serviceRequests: ServiceRequest[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        serviceRequests.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          acceptedAt: data.acceptedAt?.toDate(),
          rejectedAt: data.rejectedAt?.toDate(),
          confirmedAt: data.confirmedAt?.toDate(),
          startedAt: data.startedAt?.toDate(),
          completedAt: data.completedAt?.toDate(),
          cancelledAt: data.cancelledAt?.toDate(),
          expiredAt: data.expiredAt?.toDate(),
        } as ServiceRequest);
      });

      return serviceRequests;
    } catch (error) {
      console.error("Error getting service requests:", error);
      throw new Error("Failed to get service requests");
    }
  }

  /**
   * Get service requests with provider information
   */
  static async getServiceRequestsWithProvider(
    filters: ServiceRequestFilters = {}
  ): Promise<ServiceRequestWithProvider[]> {
    try {
      const serviceRequests = await this.getServiceRequests(filters);
      const serviceRequestsWithProvider: ServiceRequestWithProvider[] = [];

      for (const serviceRequest of serviceRequests) {
        try {
          // Get provider profile data from users collection
          const providerUserDoc = await getDoc(
            doc(db, USERS_COLLECTION, serviceRequest.providerId)
          );

          // Get provider business data from serviceProviders collection
          const providerBusinessDoc = await getDoc(
            doc(db, SERVICE_PROVIDERS_COLLECTION, serviceRequest.providerId)
          );

          if (providerUserDoc.exists()) {
            const providerUserData = providerUserDoc.data();
            const providerBusinessData = providerBusinessDoc.exists()
              ? providerBusinessDoc.data()
              : {};

            serviceRequestsWithProvider.push({
              serviceRequest,
              provider: {
                id: serviceRequest.providerId,
                firstName: providerUserData.firstName,
                lastName: providerUserData.lastName,
                profileImage: providerUserData.profileImage,
                phone: providerUserData.phone,
                rating: providerBusinessData.rating || 0,
                totalJobs: providerBusinessData.totalJobs || 0,
              },
            });
          }
        } catch (error) {
          console.error(
            `Error fetching provider for service request ${serviceRequest.id}:`,
            error
          );
        }
      }

      return serviceRequestsWithProvider;
    } catch (error) {
      console.error("Error getting service requests with provider:", error);
      throw new Error("Failed to get service requests with provider");
    }
  }

  /**
   * Get service requests with customer information
   */
  static async getServiceRequestsWithCustomer(
    filters: ServiceRequestFilters = {}
  ): Promise<ServiceRequestWithCustomer[]> {
    try {
      const serviceRequests = await this.getServiceRequests(filters);
      const serviceRequestsWithCustomer: ServiceRequestWithCustomer[] = [];

      for (const serviceRequest of serviceRequests) {
        try {
          const customerDoc = await getDoc(
            doc(db, USERS_COLLECTION, serviceRequest.customerId)
          );
          if (customerDoc.exists()) {
            const customerData = customerDoc.data();
            serviceRequestsWithCustomer.push({
              serviceRequest,
              customer: {
                id: serviceRequest.customerId,
                firstName: customerData.firstName,
                lastName: customerData.lastName,
                profileImage: customerData.profileImage,
                phone: customerData.phone,
              },
            });
          }
        } catch (error) {
          console.error(
            `Error fetching customer for service request ${serviceRequest.id}:`,
            error
          );
        }
      }

      return serviceRequestsWithCustomer;
    } catch (error) {
      console.error("Error getting service requests with customer:", error);
      throw new Error("Failed to get service requests with customer");
    }
  }

  /**
   * Delete a service request (for cancellations)
   */
  static async deleteServiceRequest(id: string): Promise<void> {
    try {
      const docRef = doc(db, SERVICE_REQUESTS_COLLECTION, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting service request:", error);
      throw new Error("Failed to delete service request");
    }
  }

  // Rating and Review Methods

  /**
   * Create a rating for a completed service
   */
  static async createRating(data: CreateRatingData): Promise<string> {
    try {
      // Check if customer has already rated this provider
      const existingRating = await this.getRatingByCustomerAndProvider(
        data.customerId,
        data.providerId
      );

      if (existingRating) {
        throw new Error("You have already rated this provider");
      }

      const ratingData = {
        ...data,
        createdAt: new Date(),
        isVisible: true,
      };

      const docRef = await addDoc(
        collection(db, RATINGS_COLLECTION),
        ratingData
      );
      return docRef.id;
    } catch (error) {
      console.error("Error creating rating:", error);
      throw error;
    }
  }

  /**
   * Get rating by customer and provider
   */
  static async getRatingByCustomerAndProvider(
    customerId: string,
    providerId: string
  ): Promise<Rating | null> {
    try {
      const q = query(
        collection(db, RATINGS_COLLECTION),
        where("customerId", "==", customerId),
        where("providerId", "==", providerId)
      );

      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
        } as Rating;
      }
      return null;
    } catch (error) {
      console.error("Error getting rating:", error);
      throw new Error("Failed to get rating");
    }
  }

  /**
   * Get all ratings for a provider
   */
  static async getProviderRatings(providerId: string): Promise<Rating[]> {
    try {
      const q = query(
        collection(db, RATINGS_COLLECTION),
        where("providerId", "==", providerId),
        where("isVisible", "==", true),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(q);
      const ratings: Rating[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        ratings.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
        } as Rating);
      });

      return ratings;
    } catch (error) {
      console.error("Error getting provider ratings:", error);
      throw new Error("Failed to get provider ratings");
    }
  }
}

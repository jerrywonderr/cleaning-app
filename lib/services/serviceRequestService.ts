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
  DocumentData,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  QueryDocumentSnapshot,
  startAfter,
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
   * Get a single service request with provider information
   */
  static async getServiceRequestWithProvider(
    id: string
  ): Promise<ServiceRequestWithProvider | null> {
    try {
      const serviceRequest = await this.getServiceRequest(id);
      if (!serviceRequest) return null;

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

        return {
          serviceRequest,
          provider: {
            id: serviceRequest.providerId,
            firstName: providerUserData.firstName || "",
            lastName: providerUserData.lastName || "",
            profileImage: providerUserData.profileImage,
            phone: providerUserData.phone || "",
            rating: providerBusinessData.rating,
            totalJobs: providerBusinessData.totalJobs,
          },
        };
      }

      return null;
    } catch (error) {
      console.error("Error getting service request with provider:", error);
      throw new Error("Failed to get service request with provider");
    }
  }

  /**
   * Get a single service request with customer information
   */
  static async getServiceRequestWithCustomer(
    id: string
  ): Promise<ServiceRequestWithCustomer | null> {
    try {
      const serviceRequest = await this.getServiceRequest(id);
      if (!serviceRequest) return null;

      // Get customer profile data from users collection
      const customerUserDoc = await getDoc(
        doc(db, USERS_COLLECTION, serviceRequest.customerId)
      );

      if (customerUserDoc.exists()) {
        const customerUserData = customerUserDoc.data();

        return {
          serviceRequest,
          customer: {
            id: serviceRequest.customerId,
            firstName: customerUserData.firstName || "",
            lastName: customerUserData.lastName || "",
            profileImage: customerUserData.profileImage,
            phone: customerUserData.phone || "",
          },
        };
      }

      return null;
    } catch (error) {
      console.error("Error getting service request with customer:", error);
      throw new Error("Failed to get service request with customer");
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
      } else if (data.status === "no-show") {
        updateData.noShowAt = new Date();
        updateData.noShowReason = data.noShowReason;
      }

      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error("Error updating service request:", error);
      throw new Error("Failed to update service request");
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

  /**
   * Get service requests with provider information (paginated)
   */
  static async getServiceRequestsWithProviderPaginated(
    filters: ServiceRequestFilters = {},
    pageSize: number = 15,
    lastDoc?: QueryDocumentSnapshot<DocumentData>
  ): Promise<{
    data: ServiceRequestWithProvider[];
    lastDoc: QueryDocumentSnapshot<DocumentData> | null;
    hasMore: boolean;
  }> {
    try {
      let q = query(collection(db, SERVICE_REQUESTS_COLLECTION));

      // Apply filters
      if (filters.customerId) {
        q = query(q, where("customerId", "==", filters.customerId));
      }
      if (filters.status) {
        if (Array.isArray(filters.status)) {
          q = query(q, where("status", "in", filters.status));
        } else {
          q = query(q, where("status", "==", filters.status));
        }
      }

      // Order and pagination
      q = query(q, orderBy("createdAt", "desc"), limit(pageSize));

      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }

      const querySnapshot = await getDocs(q);
      const serviceRequestsWithProvider: ServiceRequestWithProvider[] = [];

      for (const docSnap of querySnapshot.docs) {
        try {
          const data = docSnap.data();
          const serviceRequest: ServiceRequest = {
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
            noShowAt: data.noShowAt?.toDate(),
            noShowReason: data.noShowReason,
          } as ServiceRequest;

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
                firstName: providerUserData.firstName || "",
                lastName: providerUserData.lastName || "",
                profileImage: providerUserData.profileImage,
                phone: providerUserData.phone || "",
                rating: providerBusinessData.rating || 0,
                totalJobs: providerBusinessData.totalJobs || 0,
              },
            });
          }
        } catch (error) {
          console.error(
            `Error fetching provider for service request ${docSnap.id}:`,
            error
          );
        }
      }

      return {
        data: serviceRequestsWithProvider,
        lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1] || null,
        hasMore: querySnapshot.docs.length === pageSize,
      };
    } catch (error) {
      console.error(
        "Error getting paginated service requests with provider:",
        error
      );
      throw new Error("Failed to get paginated service requests with provider");
    }
  }

  /**
   * Get service requests with customer information (paginated)
   */
  static async getServiceRequestsWithCustomerPaginated(
    filters: ServiceRequestFilters = {},
    pageSize: number = 15,
    lastDoc?: QueryDocumentSnapshot<DocumentData>
  ): Promise<{
    data: ServiceRequestWithCustomer[];
    lastDoc: QueryDocumentSnapshot<DocumentData> | null;
    hasMore: boolean;
  }> {
    try {
      let q = query(collection(db, SERVICE_REQUESTS_COLLECTION));

      // Apply filters
      if (filters.providerId) {
        q = query(q, where("providerId", "==", filters.providerId));
      }
      if (filters.status) {
        if (Array.isArray(filters.status)) {
          q = query(q, where("status", "in", filters.status));
        } else {
          q = query(q, where("status", "==", filters.status));
        }
      }

      // Order and pagination
      q = query(q, orderBy("createdAt", "desc"), limit(pageSize));

      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }

      const querySnapshot = await getDocs(q);
      const serviceRequestsWithCustomer: ServiceRequestWithCustomer[] = [];

      for (const docSnap of querySnapshot.docs) {
        try {
          const data = docSnap.data();
          const serviceRequest: ServiceRequest = {
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
            noShowAt: data.noShowAt?.toDate(),
            noShowReason: data.noShowReason,
          } as ServiceRequest;

          const customerDoc = await getDoc(
            doc(db, USERS_COLLECTION, serviceRequest.customerId)
          );
          if (customerDoc.exists()) {
            const customerData = customerDoc.data();
            serviceRequestsWithCustomer.push({
              serviceRequest,
              customer: {
                id: serviceRequest.customerId,
                firstName: customerData.firstName || "",
                lastName: customerData.lastName || "",
                profileImage: customerData.profileImage,
                phone: customerData.phone || "",
              },
            });
          }
        } catch (error) {
          console.error(
            `Error fetching customer for service request ${docSnap.id}:`,
            error
          );
        }
      }

      return {
        data: serviceRequestsWithCustomer,
        lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1] || null,
        hasMore: querySnapshot.docs.length === pageSize,
      };
    } catch (error) {
      console.error(
        "Error getting paginated service requests with customer:",
        error
      );
      throw new Error("Failed to get paginated service requests with customer");
    }
  }
}

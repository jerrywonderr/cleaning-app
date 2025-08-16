import {
  QueryConstraint,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase/config";
import {
  Appointment,
  AppointmentFilters,
  AppointmentSearchParams,
  AppointmentStatus,
  CreateAppointmentData,
  UpdateAppointmentData,
} from "../types/appointment";
import { OfferService } from "./offerService";

/**
 * Appointment Service
 *
 * This service manages appointments in Firebase Firestore, providing CRUD operations
 * and status-based queries for customers and service providers.
 */
export class AppointmentService {
  private static readonly APPOINTMENTS_COLLECTION = "appointments";

  /**
   * Create a new appointment
   *
   * @param customerId - Firebase user ID of the customer
   * @param data - Appointment data to create
   * @returns The created appointment with generated ID and timestamps
   */
  static async createAppointment(
    customerId: string,
    data: CreateAppointmentData
  ): Promise<Appointment> {
    try {
      // Get the offer details to populate appointment data
      const offer = await OfferService.getOfferById(data.offerId);
      if (!offer) {
        throw new Error("Offer not found");
      }

      // Calculate priority based on scheduled date
      const priority = this.calculatePriority(data.scheduledDate);

      const appointmentData = {
        ...data,
        customerId,
        serviceProviderId: offer.providerId,
        duration: offer.duration,
        price: offer.price,
        status: "pending" as AppointmentStatus,
        priority,
        isPaid: false, // Will be updated when payment is processed
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(
        collection(db, this.APPOINTMENTS_COLLECTION),
        appointmentData
      );

      const createdAppointment = await this.getAppointmentById(docRef.id);
      if (!createdAppointment) {
        throw new Error("Failed to create appointment");
      }

      return createdAppointment;
    } catch (error: any) {
      throw new Error(`Failed to create appointment: ${error.message}`);
    }
  }

  /**
   * Get an appointment by its ID
   *
   * @param appointmentId - The unique identifier of the appointment
   * @returns The appointment data or null if not found
   */
  static async getAppointmentById(
    appointmentId: string
  ): Promise<Appointment | null> {
    try {
      console.log(
        `🔍 [DEBUG] getAppointmentById called with ID:`,
        appointmentId
      );

      const docRef = doc(
        collection(db, this.APPOINTMENTS_COLLECTION),
        appointmentId
      );

      console.log(`🔍 [DEBUG] Document reference created:`, docRef.path);

      const docSnap = await getDoc(docRef);

      console.log(`🔍 [DEBUG] Document snapshot result:`, {
        exists: docSnap.exists(),
        id: docSnap.id,
        hasData: !!docSnap.data(),
      });

      if (docSnap.exists()) {
        const rawData = docSnap.data();
        console.log(`🔍 [DEBUG] Raw document data:`, rawData);

        const convertedAppointment = this.convertFirestoreData(
          rawData,
          docSnap.id
        );
        console.log(`🔍 [DEBUG] Converted appointment:`, convertedAppointment);

        return convertedAppointment;
      }

      console.log(`🔍 [DEBUG] Document does not exist`);
      return null;
    } catch (error: any) {
      console.error(`❌ [ERROR] getAppointmentById failed:`, error);
      console.error(`❌ [ERROR] Error details:`, {
        message: error.message,
        code: error.code,
        stack: error.stack,
      });
      throw new Error(`Failed to get appointment: ${error.message}`);
    }
  }

  /**
   * Get all appointments for a specific customer
   *
   * @param customerId - Firebase user ID of the customer
   * @param filters - Optional filters to apply
   * @param searchParams - Search and pagination parameters
   * @returns Array of customer's appointments
   */
  static async getAppointmentsByCustomer(
    customerId: string,
    filters?: AppointmentFilters,
    searchParams?: AppointmentSearchParams
  ): Promise<Appointment[]> {
    try {
      const constraints: QueryConstraint[] = [
        where("customerId", "==", customerId),
      ];

      // Add status filter
      if (filters?.status) {
        constraints.push(where("status", "==", filters.status));
      }

      // Add service type filter
      if (filters?.serviceType) {
        constraints.push(where("serviceType", "==", filters.serviceType));
      }

      // Add date range filter
      if (filters?.dateRange) {
        constraints.push(
          where("scheduledDate", ">=", filters.dateRange.start),
          where("scheduledDate", "<=", filters.dateRange.end)
        );
      }

      // Add sorting
      const sortBy = searchParams?.sortBy || "scheduledDate";
      const sortOrder = searchParams?.sortOrder || "asc";
      constraints.push(orderBy(sortBy, sortOrder));

      // Add pagination
      if (searchParams?.limit) {
        constraints.push(limit(searchParams.limit));
      }

      const q = query(
        collection(db, this.APPOINTMENTS_COLLECTION),
        ...constraints
      );

      const querySnapshot = await getDocs(q);
      const appointments: Appointment[] = [];

      querySnapshot.forEach((doc) => {
        appointments.push(this.convertFirestoreData(doc.data(), doc.id));
      });

      return appointments;
    } catch (error: any) {
      throw new Error(`Failed to get customer appointments: ${error.message}`);
    }
  }

  /**
   * Get all appointments for a specific service provider
   *
   * @param serviceProviderId - Firebase user ID of the service provider
   * @param filters - Optional filters to apply
   * @param searchParams - Search and pagination parameters
   * @returns Array of service provider's appointments
   */
  static async getAppointmentsByServiceProvider(
    serviceProviderId: string,
    filters?: AppointmentFilters,
    searchParams?: AppointmentSearchParams
  ): Promise<Appointment[]> {
    try {
      const constraints: QueryConstraint[] = [
        where("serviceProviderId", "==", serviceProviderId),
      ];

      // Add status filter
      if (filters?.status) {
        constraints.push(where("status", "==", filters.status));
      }

      // Add service type filter
      if (filters?.serviceType) {
        constraints.push(where("serviceType", "==", filters.serviceType));
      }

      // Add date range filter
      if (filters?.dateRange) {
        constraints.push(
          where("scheduledDate", ">=", filters.dateRange.start),
          where("scheduledDate", "<=", filters.dateRange.end)
        );
      }

      // Add sorting
      const sortBy = searchParams?.sortBy || "scheduledDate";
      const sortOrder = searchParams?.sortOrder || "asc";
      constraints.push(orderBy(sortBy, sortOrder));

      // Add pagination
      if (searchParams?.limit) {
        constraints.push(limit(searchParams.limit));
      }

      const q = query(
        collection(db, this.APPOINTMENTS_COLLECTION),
        ...constraints
      );

      const querySnapshot = await getDocs(q);
      const appointments: Appointment[] = [];

      querySnapshot.forEach((doc) => {
        appointments.push(this.convertFirestoreData(doc.data(), doc.id));
      });

      return appointments;
    } catch (error: any) {
      throw new Error(
        `Failed to get service provider appointments: ${error.message}`
      );
    }
  }

  /**
   * Get all appointments (for admin purposes or filtering)
   *
   * @returns Array of all appointments
   */
  static async getAllAppointments(): Promise<Appointment[]> {
    try {
      const q = query(
        collection(db, this.APPOINTMENTS_COLLECTION),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(q);
      const appointments: Appointment[] = [];

      querySnapshot.forEach((doc) => {
        appointments.push(this.convertFirestoreData(doc.data(), doc.id));
      });

      return appointments;
    } catch (error: any) {
      throw new Error(`Failed to get all appointments: ${error.message}`);
    }
  }

  /**
   * Get appointments by status (upcoming, ongoing, past)
   *
   * @param userId - Firebase user ID (customer or service provider)
   * @param userType - "customer" or "serviceProvider"
   * @param status - Status to filter by
   * @returns Array of appointments with the specified status
   */
  static async getAppointmentsByStatus(
    userId: string,
    userType: "customer" | "serviceProvider",
    status: "upcoming" | "ongoing" | "past"
  ): Promise<Appointment[]> {
    try {
      const now = new Date();
      const constraints: QueryConstraint[] = [];

      console.log(`🔍 [DEBUG] getAppointmentsByStatus called with:`, {
        userId,
        userType,
        status,
        now: now.toISOString(),
      });

      // Add user type constraint
      if (userType === "customer") {
        constraints.push(where("customerId", "==", userId));
      } else {
        constraints.push(where("serviceProviderId", "==", userId));
      }

      // Add status-based constraints (more flexible approach)
      if (status === "upcoming") {
        // Show appointments that are scheduled for the future OR have pending/confirmed status
        constraints.push(where("status", "in", ["pending", "confirmed"]));
      } else if (status === "ongoing") {
        // Show appointments that are in progress or confirmed
        constraints.push(where("status", "in", ["confirmed", "in-progress"]));
      } else if (status === "past") {
        // Show completed, cancelled, or no-show appointments
        constraints.push(
          where("status", "in", ["completed", "cancelled", "no-show"])
        );
      }

      constraints.push(orderBy("scheduledDate", "asc"));

      console.log(`🔍 [DEBUG] Query constraints:`, constraints);

      const q = query(
        collection(db, this.APPOINTMENTS_COLLECTION),
        ...constraints
      );

      const querySnapshot = await getDocs(q);
      console.log(`🔍 [DEBUG] Query result:`, {
        totalDocs: querySnapshot.size,
        docs: querySnapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        })),
      });

      const appointments: Appointment[] = [];

      querySnapshot.forEach((doc) => {
        appointments.push(this.convertFirestoreData(doc.data(), doc.id));
      });

      console.log(`🔍 [DEBUG] Converted appointments:`, appointments);

      return appointments;
    } catch (error: any) {
      console.error(`❌ [ERROR] getAppointmentsByStatus failed:`, error);
      throw new Error(`Failed to get appointments by status: ${error.message}`);
    }
  }

  /**
   * Update an existing appointment
   *
   * @param appointmentId - The unique identifier of the appointment
   * @param data - Data to update
   * @returns Promise that resolves when update is complete
   */
  static async updateAppointment(
    appointmentId: string,
    data: UpdateAppointmentData
  ): Promise<void> {
    try {
      const appointmentRef = doc(
        collection(db, this.APPOINTMENTS_COLLECTION),
        appointmentId
      );

      const updateData: any = {
        ...data,
        updatedAt: serverTimestamp(),
      };

      // Add timestamp for specific status changes
      if (data.status === "confirmed") {
        updateData.confirmedAt = serverTimestamp();
      } else if (data.status === "in-progress") {
        updateData.startedAt = serverTimestamp();
      } else if (data.status === "completed") {
        updateData.completedAt = serverTimestamp();
      }

      await updateDoc(appointmentRef, updateData);
    } catch (error: any) {
      throw new Error(`Failed to update appointment: ${error.message}`);
    }
  }

  /**
   * Delete an appointment
   *
   * @param appointmentId - The unique identifier of the appointment
   * @returns Promise that resolves when deletion is complete
   */
  static async deleteAppointment(appointmentId: string): Promise<void> {
    try {
      const appointmentRef = doc(
        collection(db, this.APPOINTMENTS_COLLECTION),
        appointmentId
      );
      await deleteDoc(appointmentRef);
    } catch (error: any) {
      throw new Error(`Failed to delete appointment: ${error.message}`);
    }
  }

  /**
   * Mark appointment as completed by customer
   *
   * @param appointmentId - The unique identifier of the appointment
   * @param rating - Customer's rating (1-5)
   * @param review - Customer's review text
   * @returns Promise that resolves when update is complete
   */
  static async markAppointmentCompleted(
    appointmentId: string,
    rating: number,
    review?: string
  ): Promise<void> {
    try {
      await this.updateAppointment(appointmentId, {
        status: "completed",
        customerRating: rating,
        customerReview: review,
      });
    } catch (error: any) {
      throw new Error(
        `Failed to mark appointment as completed: ${error.message}`
      );
    }
  }

  /**
   * Calculate appointment priority based on scheduled date
   *
   * @param scheduledDate - When the appointment is scheduled
   * @returns Priority level
   */
  private static calculatePriority(
    scheduledDate: Date
  ): "low" | "medium" | "high" | "urgent" {
    const now = new Date();
    const timeDiff = scheduledDate.getTime() - now.getTime();
    const daysDiff = timeDiff / (1000 * 3600 * 24);

    if (daysDiff < 1) return "urgent";
    if (daysDiff < 3) return "high";
    if (daysDiff < 7) return "medium";
    return "low";
  }

  /**
   * Convert Firestore data to Appointment object
   *
   * @param data - Raw Firestore document data
   * @param id - Document ID
   * @returns Properly formatted Appointment object
   */
  private static convertFirestoreData(data: any, id: string): Appointment {
    return {
      id,
      offerId: data.offerId || "",
      customerId: data.customerId || "",
      serviceProviderId: data.serviceProviderId || "",
      serviceType: data.serviceType || "",
      address: data.address || "",
      scheduledDate: data.scheduledDate?.toDate() || new Date(),
      scheduledTime: data.scheduledTime?.toDate() || new Date(),
      duration: data.duration || 0,
      price: data.price || 0,
      status: data.status || "pending",
      priority: data.priority || "medium",
      isPaid: data.isPaid || false,
      notes: data.notes,
      cancellationReason: data.cancellationReason,
      customerRating: data.customerRating,
      customerReview: data.customerReview,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
      confirmedAt: data.confirmedAt?.toDate(),
      startedAt: data.startedAt?.toDate(),
      completedAt: data.completedAt?.toDate(),
      paymentMethod: data.paymentMethod,
    };
  }
}

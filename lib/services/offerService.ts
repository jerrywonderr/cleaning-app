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
  CreateOfferData,
  Offer,
  OfferFilters,
  OfferSearchParams,
  UpdateOfferData,
} from "../types/offer";

/**
 * Offer Service
 *
 * This service manages offers in Firebase Firestore, providing CRUD operations
 * and search functionality for service providers and customers.
 */
export class OfferService {
  private static readonly OFFERS_COLLECTION = "offers";

  /**
   * Create a new offer
   *
   * @param providerId - Firebase user ID of the service provider
   * @param providerName - Display name of the service provider
   * @param data - Offer data to create
   * @returns The created offer with generated ID and timestamps
   */
  static async createOffer(
    providerId: string,
    providerName: string,
    data: CreateOfferData
  ): Promise<Offer> {
    const offerData = {
      ...data,
      providerId,
      provider: providerName,
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(
      collection(db, this.OFFERS_COLLECTION),
      offerData
    );

    const createdOffer = await this.getOfferById(docRef.id);
    if (!createdOffer) {
      throw new Error("Failed to create offer");
    }

    return createdOffer;
  }

  /**
   * Get an offer by its ID
   *
   * @param offerId - The unique identifier of the offer
   * @returns The offer data or null if not found
   */
  static async getOfferById(offerId: string): Promise<Offer | null> {
    try {
      const docRef = doc(db, this.OFFERS_COLLECTION, offerId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return null;
      }

      const data = docSnap.data();
      return this.convertFirestoreData(data, docSnap.id);
    } catch (error) {
      console.error("Error getting offer by ID:", error);
      return null;
    }
  }

  /**
   * Get all offers for a specific service provider
   *
   * @param providerId - Firebase user ID of the service provider
   * @returns Array of offers created by the provider
   */
  static async getOffersByProvider(providerId: string): Promise<Offer[]> {
    try {
      const q = query(
        collection(db, this.OFFERS_COLLECTION),
        where("providerId", "==", providerId),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) =>
        this.convertFirestoreData(doc.data(), doc.id)
      );
    } catch (error) {
      console.error("Error getting offers by provider:", error);
      return [];
    }
  }

  /**
   * Get all active offers (for customers to browse)
   *
   * @param filters - Optional filters to apply
   * @param searchParams - Search and pagination parameters
   * @returns Array of active offers matching the criteria
   */
  static async getActiveOffers(
    filters?: OfferFilters,
    searchParams?: OfferSearchParams
  ): Promise<Offer[]> {
    try {
      const constraints: QueryConstraint[] = [
        where("isActive", "==", true),
        orderBy("createdAt", "desc"),
      ];

      // Apply filters
      if (filters?.category) {
        constraints.push(where("category", "==", filters.category));
      }
      if (filters?.minPrice !== undefined) {
        constraints.push(where("price", ">=", filters.minPrice));
      }
      if (filters?.maxPrice !== undefined) {
        constraints.push(where("price", "<=", filters.maxPrice));
      }
      if (filters?.location) {
        constraints.push(where("location", "==", filters.location));
      }

      // Apply search parameters
      if (searchParams?.limit) {
        constraints.push(limit(searchParams.limit));
      }

      const q = query(collection(db, this.OFFERS_COLLECTION), ...constraints);
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc) =>
        this.convertFirestoreData(doc.data(), doc.id)
      );
    } catch (error) {
      console.error("Error getting active offers:", error);
      return [];
    }
  }

  /**
   * Update an existing offer
   *
   * @param offerId - The unique identifier of the offer to update
   * @param data - Partial data to update
   * @returns Promise that resolves when update is complete
   */
  static async updateOffer(
    offerId: string,
    data: UpdateOfferData
  ): Promise<void> {
    try {
      const docRef = doc(db, this.OFFERS_COLLECTION, offerId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error updating offer:", error);
      throw error;
    }
  }

  /**
   * Delete an offer
   *
   * @param offerId - The unique identifier of the offer to delete
   * @returns Promise that resolves when deletion is complete
   */
  static async deleteOffer(offerId: string): Promise<void> {
    try {
      const docRef = doc(db, this.OFFERS_COLLECTION, offerId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting offer:", error);
      throw error;
    }
  }

  /**
   * Toggle offer active status
   *
   * @param offerId - The unique identifier of the offer
   * @param isActive - New active status
   * @returns Promise that resolves when status is updated
   */
  static async toggleOfferStatus(
    offerId: string,
    isActive: boolean
  ): Promise<void> {
    await this.updateOffer(offerId, { isActive });
  }

  /**
   * Search offers by text query
   *
   * @param query - Text to search for in title and description
   * @param filters - Optional filters to apply
   * @returns Array of offers matching the search query
   */
  static async searchOffers(
    query: string,
    filters?: OfferFilters
  ): Promise<Offer[]> {
    try {
      // For now, we'll get all offers and filter client-side
      // In production, you might want to use Algolia or similar for text search
      const allOffers = await this.getActiveOffers(filters);

      const searchTerm = query.toLowerCase();
      return allOffers.filter(
        (offer) =>
          offer.title.toLowerCase().includes(searchTerm) ||
          offer.description.toLowerCase().includes(searchTerm) ||
          offer.tags?.some((tag) => tag.toLowerCase().includes(searchTerm))
      );
    } catch (error) {
      console.error("Error searching offers:", error);
      return [];
    }
  }

  /**
   * Convert Firestore data to Offer object
   *
   * @param data - Raw Firestore document data
   * @param id - Document ID
   * @returns Properly formatted Offer object
   */
  private static convertFirestoreData(data: any, id: string): Offer {
    return {
      id,
      title: data.title || "",
      price: data.price || 0,
      provider: data.provider || "",
      providerId: data.providerId || "",
      description: data.description || "",
      image: data.image || "",
      category: data.category || "other",
      duration: data.duration || 0,
      isActive: data.isActive ?? true,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
      location: data.location,
      tags: data.tags || [],
      whatIncluded: data.whatIncluded || [],
      requirements: data.requirements || [],
    };
  }
}

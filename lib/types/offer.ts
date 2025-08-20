/**
 * Offer Types and Interfaces
 *
 * This file defines the data structures for service offers in the cleaning app.
 * Offers represent services that service providers can create and customers can book.
 */

export interface Offer {
  id: string;
  title: string;
  price: number;
  provider: string;
  providerId: string; // Firebase user ID of the service provider
  description: string;
  image: string;
  category: OfferCategory;
  duration: number; // in hours
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  location?: string;
  tags?: string[];
  whatIncluded: string[];
  requirements?: string[];
}

export type OfferCategory =
  | "classic-cleaning"
  | "deep-cleaning"
  | "end-of-tenancy";

export interface CreateOfferData {
  title: string;
  price: number;
  description: string;
  image: string;
  category: OfferCategory;
  duration: number;
  location?: string;
  tags?: string[];
  whatIncluded: string[];
  requirements?: string[];
}

export interface UpdateOfferData extends Partial<CreateOfferData> {
  isActive?: boolean;
}

export interface OfferFilters {
  category?: OfferCategory;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  isActive?: boolean;
}

export interface OfferSearchParams {
  query?: string;
  filters?: OfferFilters;
  sortBy?: "price" | "createdAt" | "rating";
  sortOrder?: "asc" | "desc";
  limit?: number;
  offset?: number;
}

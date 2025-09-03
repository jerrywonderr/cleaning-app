// Core business types
export type OfferCategory =
  | "classic-cleaning"
  | "deep-cleaning"
  | "end-of-tenancy";

// Location and geographic types
export interface SearchLocation {
  latitude: number;
  longitude: number;
}

export interface ServiceAreaData {
  fullAddress: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  country: string;
  countryCode: string;
  radius: number; // in meters
  geohash: string; // for efficient spatial queries
}

// Working schedule types
export interface WorkingSchedule {
  [day: string]: {
    isActive: boolean;
    startTime: string | null; // ISO string from database
    endTime: string | null; // ISO string from database
  };
}

export interface WorkingPreferences {
  serviceArea?: ServiceAreaData;
  workingSchedule?: WorkingSchedule;
}

// Service provider types
export interface ServiceProviderData {
  services: Record<OfferCategory, boolean>;
  extraOptions: Record<string, boolean>;
  workingPreferences?: WorkingPreferences;
}

// This is what's stored in the serviceProviders collection (Firestore)
export interface ServiceProviderProfile {
  id: string;
  userId: string; // Reference to users collection
  services: Record<OfferCategory, boolean>;
  extraOptions: Record<string, boolean>;
  workingPreferences?: WorkingPreferences;
  isActive: boolean;
  rating: number;
  totalJobs: number;
  location?: {
    coordinates: {
      latitude: number;
      longitude: number;
    };
    radius: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

// This is what the backend returns after combining serviceProviders + users data
export interface ServiceProviderResult {
  id: string;
  userId: string;
  profile: {
    firstName: string;
    lastName: string;
    profileImage?: string;
    phone: string;
  };
  services: Record<OfferCategory, boolean>;
  extraOptions: Record<string, boolean>;
  workingPreferences?: WorkingPreferences;
  rating?: number;
  totalJobs?: number;
  distance: number; // Distance in meters
}

// Request/Response types
export interface UpdateServiceProviderRequest {
  userId: string;
  providerData: ServiceProviderData;
}

export interface SearchServiceProvidersRequest {
  serviceType: OfferCategory;
  location: SearchLocation;
}

export interface ServiceConfig {
  id: OfferCategory;
  name: string;
  description: string;
  perHourPrice: number;
  image: string;
  isEnabled: boolean;
}

export interface ExtraServiceOption {
  id: string;
  name: string;
  description: string;
  additionalPrice: number;
  isEnabled: boolean;
}

export interface UpdateServiceProviderProfileData {
  services?: Record<OfferCategory, boolean>;
  extraOptions?: Record<string, boolean>;
  workingPreferences?: WorkingPreferences;
  isActive?: boolean;
}

// User types
export interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  dob: string;
  isServiceProvider: boolean;
  createdAt: Date;
  updatedAt: Date;
  profileImage?: string;
}

// Location autocomplete types
export interface LocationSearchRequest {
  query: string;
  countrySet?: string[];
  lat?: number;
  lon?: number;
  radius?: number;
  limit?: number;
}

export interface LocationAutocompleteResult {
  id: string;
  displayName: string;
  type: string;
  score: number;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    fullAddress: string;
  };
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

// Azure Maps API types
export interface AzureMapsResponse {
  results: {
    id: string;
    type: string;
    score: number;
    address: {
      freeformAddress: string;
      country: string;
      countryCode: string;
      countryCodeISO3: string;
      countrySubdivision: string;
      countrySecondarySubdivision: string;
      municipality: string;
      municipalitySubdivision: string;
      streetName: string;
      streetNumber: string;
      postalCode: string;
      extendedPostalCode: string;
    };
    position: {
      lat: number;
      lon: number;
    };
    viewport: {
      topLeftPoint: {
        lat: number;
        lon: number;
      };
      btmRightPoint: {
        lat: number;
        lon: number;
      };
    };
  }[];
}

import { getFunctions, httpsCallable } from "firebase/functions";
import app from "../firebase/config";
import { AddressSearchResult } from "../types/location";

// Initialize Firebase Functions
const functions = getFunctions(app);

export class LocationService {
  private static instance: LocationService;

  private constructor() {
    // Private constructor to prevent direct instantiation
  }

  public static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  async searchAddress(query: string): Promise<AddressSearchResult[]> {
    try {
      const searchAddressFunction = httpsCallable(
        functions,
        "locationAutocomplete"
      );
      const result = await searchAddressFunction({ query });

      // Server returns an array of items with shape:
      // { id, displayName, score, type, address: {...}, coordinates: {...} }
      const items = (result.data as any[]) ?? [];

      const mapped: AddressSearchResult[] = items.map((item: any) => {
        const addr = item?.address ?? {};
        const coords = item?.coordinates ?? {};
        const lat = coords.latitude ?? 0;
        const lon = coords.longitude ?? 0;

        const city = addr.city ?? "";
        const state = addr.state ?? "";
        const country = addr.country ?? "";
        const countryCode = ""; // Not provided in your data
        const postalCode = addr.postalCode ?? "";
        const streetName = addr.street ?? "";
        const streetNumber = ""; // Not provided in your data

        return {
          address: {
            freeformAddress:
              item.displayName ||
              addr.fullAddress ||
              [city, state, country].filter(Boolean).join(", "),
            country,
            countryCode,
            municipality: city,
            streetName,
            streetNumber,
            postalCode,
            state,
            city,
          },
          position: {
            lat: typeof lat === "number" ? lat : Number(lat) || 0,
            lon: typeof lon === "number" ? lon : Number(lon) || 0,
          },
        } as AddressSearchResult;
      });

      return mapped;
    } catch (error) {
      console.error("Error searching address:", error);
      throw error;
    }
  }

  // Prevent cloning of the singleton instance
  private clone(): never {
    throw new Error("Singleton instance cannot be cloned");
  }

  // Prevent serialization of the singleton instance
  private toJSON(): never {
    throw new Error("Singleton instance cannot be serialized");
  }
}

// Export a default instance for easy access
export const locationService = LocationService.getInstance();

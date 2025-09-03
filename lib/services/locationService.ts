import { getFunctions, httpsCallable } from "firebase/functions";
import app from "../firebase/config";
import { LocationAutocompleteResult } from "../types/location";

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

  async searchAddress(query: string): Promise<LocationAutocompleteResult[]> {
    try {
      const searchAddressFunction = httpsCallable(
        functions,
        "locationAutocomplete"
      );
      const result = await searchAddressFunction({ query });

      return result.data as LocationAutocompleteResult[];
    } catch (error) {
      console.error("Error searching address:", error);
      throw error;
    }
  }

  async getLocationFromCoordinates(
    lat: number,
    lon: number
  ): Promise<LocationAutocompleteResult> {
    try {
      const getLocationFromCoordinatesFunction = httpsCallable(
        functions,
        "getLocationFromCoordinates"
      );
      const result = await getLocationFromCoordinatesFunction({ lat, lon });

      return result.data as LocationAutocompleteResult;
    } catch (error) {
      console.error("Error getting location from coordinates:", error);
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

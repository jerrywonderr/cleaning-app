import { OfferCategory } from "./offer";

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

export interface ServiceAreaData {
  fullAddress: string;
  latitude: number;
  longitude: number;
  country: string;
  radius: number;
}

export interface WorkingPreferences {
  serviceArea?: ServiceAreaData;
  workingSchedule?: {
    [day: string]: {
      isActive: boolean;
      startTime: string | null; // ISO string from database
      endTime: string | null; // ISO string from database
    };
  };
}

export interface UserServicePreferences {
  userId: string;
  services: Record<OfferCategory, boolean>;
  extraOptions: Record<string, boolean>;
  workingPreferences?: WorkingPreferences;
  updatedAt: Date;
}

export interface CreateUserServicePreferencesData {
  userId: string;
  services: Record<OfferCategory, boolean>;
  extraOptions?: Record<string, boolean>;
  workingPreferences?: WorkingPreferences;
}

export interface UpdateUserServicePreferencesData {
  services?: Record<OfferCategory, boolean>;
  extraOptions?: Record<string, boolean>;
  workingPreferences?: WorkingPreferences;
}

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
  workingHours?: {
    start: string;
    end: string;
  };
  workingDays?: string[];
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

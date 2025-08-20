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

export interface UserServicePreferences {
  userId: string;
  services: Record<OfferCategory, boolean>;
  extraOptions: Record<string, boolean>;
  updatedAt: Date;
}

export interface CreateUserServicePreferencesData {
  userId: string;
  services: Record<OfferCategory, boolean>;
  extraOptions?: Record<string, boolean>;
}

export interface UpdateUserServicePreferencesData {
  services?: Record<OfferCategory, boolean>;
  extraOptions?: Record<string, boolean>;
}

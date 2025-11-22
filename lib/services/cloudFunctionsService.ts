import { getFunctions, httpsCallable } from "firebase/functions";
import app from "../firebase/config";
import { UpdateServiceProviderRequest } from "../types/service-config";

// Initialize Firebase Functions
const functions = getFunctions(app);

// Cloud Functions service class
export class CloudFunctionsService {
  // Process payment for an appointment
  static async processPayment(
    appointmentId: string,
    amount: number,
    paymentMethod: string
  ) {
    try {
      const processPaymentFunction = httpsCallable(functions, "processPayment");
      const result = await processPaymentFunction({
        appointmentId,
        amount,
        paymentMethod,
      });
      return result.data;
    } catch (error) {
      console.error("Error processing payment:", error);
      throw error;
    }
  }

  // Update user profile
  static async updateUserProfile(userId: string, profileData: any) {
    try {
      const updateProfileFunction = httpsCallable(
        functions,
        "updateUserProfile"
      );
      const result = await updateProfileFunction({
        userId,
        profileData,
      });
      return result.data;
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  }

  // Search for service providers
  static async searchServiceProviders(
    serviceType: string,
    location: {
      latitude: number;
      longitude: number;
      limit?: number;
      offset?: number;
    }
  ) {
    try {
      const searchProvidersFunction = httpsCallable(
        functions,
        "searchServiceProviders"
      );
      const result = await searchProvidersFunction({
        serviceType,
        location: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
        limit: location.limit,
        offset: location.offset,
      });
      return result.data;
    } catch (error) {
      console.error("Error searching service providers:", error);
      throw error;
    }
  }

  // Update service provider settings
  static async updateServiceProviderSettings(
    request: UpdateServiceProviderRequest
  ) {
    try {
      const updateSettingsFunction = httpsCallable(
        functions,
        "updateServiceProviderSettings"
      );
      const result = await updateSettingsFunction(request);
      return result.data;
    } catch (error) {
      console.error("Error updating service provider settings:", error);
      throw error;
    }
  }

  // Health check endpoint
  static async healthCheck() {
    try {
      const response = await fetch(
        `https://${functions.region}-${functions.app.options.projectId}.cloudfunctions.net/healthCheck`
      );
      return await response.json();
    } catch (error) {
      console.error("Error checking health:", error);
      throw error;
    }
  }

  static async deleteUserAccount() {
    try {
      const deleteUserAccountFn = httpsCallable(functions, "deleteUserAccount");
      const result = await deleteUserAccountFn();
      return result.data;
    } catch (error) {
      console.error("Error deleting user account via function:", error);
      throw error;
    }
  }
}

// Export individual functions for convenience
export const processPayment = CloudFunctionsService.processPayment;
export const updateUserProfile = CloudFunctionsService.updateUserProfile;
export const searchServiceProviders =
  CloudFunctionsService.searchServiceProviders;
export const updateServiceProviderSettings =
  CloudFunctionsService.updateServiceProviderSettings;
export const healthCheck = CloudFunctionsService.healthCheck;
export const deleteUserAccount = CloudFunctionsService.deleteUserAccount;

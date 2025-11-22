import { getFunctions, httpsCallable } from "firebase/functions";
import app from "../firebase/config";

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
export const searchServiceProviders =
  CloudFunctionsService.searchServiceProviders;
export const deleteUserAccount = CloudFunctionsService.deleteUserAccount;

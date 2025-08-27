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
}

// Export individual functions for convenience
export const processPayment = CloudFunctionsService.processPayment;
export const updateUserProfile = CloudFunctionsService.updateUserProfile;
export const healthCheck = CloudFunctionsService.healthCheck;

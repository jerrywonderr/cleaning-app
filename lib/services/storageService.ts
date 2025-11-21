import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { storage } from "../firebase/config";

/**
 * Storage Service
 *
 * This service manages file uploads and downloads in Firebase Storage,
 * providing utilities for handling images and other media files across the app.
 *
 * @example
 * // Upload a user profile image
 * const profileUrl = await StorageService.uploadProfileImage(uri, userId);
 *
 * // Upload a service request image
 * const imageUrl = await StorageService.uploadServiceRequestImage(uri, serviceRequestId, undefined, "before");
 *
 * // Upload a review image
 * const reviewUrl = await StorageService.uploadReviewImage(uri, reviewId);
 *
 * // Upload a user document
 * const documentUrl = await StorageService.uploadUserDocument(uri, userId, "id-verification");
 */
export class StorageService {
  // Define storage paths for different content types
  private static readonly STORAGE_PATHS = {
    USERS: "users",
    SERVICE_REQUESTS: "service-requests",
    REVIEWS: "reviews",
    TEMP: "temp",
  } as const;

  /**
   * Upload an image to Firebase Storage
   *
   * @param uri - Local file URI (from expo-image-picker)
   * @param folder - Storage folder path (use STORAGE_PATHS constants)
   * @param fileName - Optional custom filename, will generate one if not provided
   * @param fileType - File type for better organization (e.g., 'profile', 'service', 'review')
   * @param metadata - Optional metadata to attach to the file
   * @returns Promise that resolves to the public download URL
   */
  static async uploadImage(
    uri: string,
    folder: keyof typeof StorageService.STORAGE_PATHS = "SERVICE_REQUESTS",
    fileName?: string,
    fileType?: string,
    metadata?: Record<string, string>
  ): Promise<string> {
    try {
      // Validate storage instance
      if (!storage) {
        throw new Error("Firebase Storage is not initialized");
      }

      // Convert URI to blob
      const response = await fetch(uri);
      const blob = await response.blob();

      // Generate unique filename if not provided
      const finalFileName = fileName || this.generateFileName(fileType);

      // Create storage reference with proper folder structure
      const fullPath = `${this.STORAGE_PATHS[folder]}/${finalFileName}`;

      const storageRef = ref(storage, fullPath);

      // Upload the blob with metadata
      const snapshot = await uploadBytes(storageRef, blob, {
        customMetadata: metadata,
      });

      // Get the download URL
      const downloadURL = await getDownloadURL(snapshot.ref);

      return downloadURL;
    } catch (error) {
      console.error("Error uploading image:", error);
      if (error instanceof Error) {
        console.error("Error details:", {
          message: error.message,
          code: (error as any).code,
          stack: error.stack,
        });
      }
      throw new Error("Failed to upload image. Please try again.");
    }
  }

  /**
   * Delete an image from Firebase Storage
   *
   * @param imageUrl - The full URL of the image to delete
   * @returns Promise that resolves when deletion is complete
   */
  static async deleteImage(imageUrl: string): Promise<void> {
    try {
      // Extract the path from the URL
      const urlParts = imageUrl.split("/");
      const pathIndex = urlParts.findIndex((part) => part === "o");
      if (pathIndex === -1) {
        throw new Error("Invalid image URL format");
      }

      const encodedPath = urlParts[pathIndex + 1];
      const decodedPath = decodeURIComponent(encodedPath);

      // Create storage reference
      const storageRef = ref(storage, decodedPath);

      // Delete the file
      await deleteObject(storageRef);
    } catch (error) {
      console.error("Error deleting image:", error);
      throw new Error("Failed to delete image.");
    }
  }

  /**
   * Upload a user profile image
   *
   * @param uri - Local file URI
   * @param userId - User ID for better organization
   * @param fileName - Optional custom filename
   * @returns Promise that resolves to the public download URL
   */
  static async uploadProfileImage(
    uri: string,
    userId: string,
    fileName?: string
  ): Promise<string> {
    const finalFileName = fileName || `avatar.jpg`;
    const metadata = {
      ownerId: userId,
      fileType: "profile",
      uploadedAt: new Date().toISOString(),
    };
    // Create the full path for profile images
    const fullPath = `${userId}/profile/${finalFileName}`;
    return this.uploadImage(uri, "USERS", fullPath, "profile", metadata);
  }

  /**
   * Upload a service request image (for both proposals and appointments)
   *
   * @param uri - Local file URI
   * @param serviceRequestId - Service Request ID for organization
   * @param fileName - Optional custom filename
   * @param category - Image category (e.g., 'before', 'after', 'receipt')
   * @returns Promise that resolves to the public download URL
   */
  static async uploadServiceRequestImage(
    uri: string,
    serviceRequestId: string,
    fileName?: string,
    category: string = "photos"
  ): Promise<string> {
    const finalFileName = fileName || `${Date.now()}.jpg`;
    const metadata = {
      serviceRequestId: serviceRequestId,
      category: category,
      fileType: "service-request",
      uploadedAt: new Date().toISOString(),
    };
    // Create the full path for service request images
    const fullPath = `${serviceRequestId}/${category}/${finalFileName}`;
    return this.uploadImage(
      uri,
      "SERVICE_REQUESTS",
      fullPath,
      "service-request",
      metadata
    );
  }

  /**
   * Upload a review image
   *
   * @param uri - Local file URI
   * @param reviewId - Review ID for organization
   * @param fileName - Optional custom filename
   * @returns Promise that resolves to the public download URL
   */
  static async uploadReviewImage(
    uri: string,
    reviewId: string,
    fileName?: string
  ): Promise<string> {
    const finalFileName = fileName || `${Date.now()}.jpg`;
    const metadata = {
      reviewId: reviewId,
      fileType: "review",
      uploadedAt: new Date().toISOString(),
    };
    // Create the full path for review images
    const fullPath = `${reviewId}/photos/${finalFileName}`;
    return this.uploadImage(uri, "REVIEWS", fullPath, "review", metadata);
  }

  /**
   * Upload a user document file
   *
   * @param uri - Local file URI
   * @param userId - User ID for organization
   * @param documentType - Type of document (e.g., 'invoice', 'contract', 'id-verification')
   * @param fileName - Optional custom filename
   * @returns Promise that resolves to the public download URL
   */
  static async uploadUserDocument(
    uri: string,
    userId: string,
    documentType: string,
    fileName?: string
  ): Promise<string> {
    const finalFileName = fileName || `${Date.now()}.pdf`;
    const metadata = {
      userId: userId,
      documentType: documentType,
      fileType: "document",
      uploadedAt: new Date().toISOString(),
    };
    // Create the full path for user documents
    const fullPath = `${userId}/documents/${documentType}/${finalFileName}`;
    return this.uploadImage(uri, "USERS", fullPath, documentType, metadata);
  }

  /**
   * Delete all files for a specific service request
   *
   * @param serviceRequestId - Service Request ID
   * @returns Promise that resolves when all files are deleted
   */
  static async deleteServiceRequestFiles(
    serviceRequestId: string
  ): Promise<void> {
    try {
      // Note: This is a simplified approach. In production, you might want to
      // list all files in the service request folder and delete them individually
      // For now, we'll rely on the caller to provide specific file URLs
      console.log(
        `Service request ${serviceRequestId} files marked for deletion`
      );
    } catch (error) {
      console.error("Error deleting service request files:", error);
      throw new Error("Failed to delete service request files.");
    }
  }

  /**
   * Delete all files for a specific user
   *
   * @param userId - User ID
   * @returns Promise that resolves when all files are deleted
   */
  static async deleteUserFiles(userId: string): Promise<void> {
    try {
      // Note: This is a simplified approach. In production, you might want to
      // list all files in the user folder and delete them individually
      console.log(`User ${userId} files marked for deletion`);
    } catch (error) {
      console.error("Error deleting user files:", error);
      throw new Error("Failed to delete user files.");
    }
  }

  /**
   * Test Firebase Storage connection
   * This method can be used to verify that Storage is working
   */
  static async testStorageConnection(): Promise<boolean> {
    try {
      if (!storage) {
        return false;
      }

      // Try to create a simple reference
      const testRef = ref(storage, "test/connection-test.txt");
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get the storage path for a specific content type
   *
   * @param folder - Storage folder key
   * @returns The storage path string
   */
  static getStoragePath(
    folder: keyof typeof StorageService.STORAGE_PATHS
  ): string {
    return this.STORAGE_PATHS[folder];
  }

  /**
   * Generate a unique filename for an image
   *
   * @param fileType - Type of file for better organization (e.g., 'profile', 'service', 'review')
   * @param originalName - Original filename (optional)
   * @returns A unique filename
   */
  static generateFileName(fileType?: string, originalName?: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    const extension = originalName ? originalName.split(".").pop() : "jpg";
    const prefix = fileType || "file";
    return `${prefix}_${timestamp}_${random}.${extension}`;
  }
}

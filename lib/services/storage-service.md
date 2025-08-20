# Storage Service Documentation

## Overview

The Storage Service is a centralized utility for managing file uploads and downloads in Firebase Storage. It provides a structured, scalable approach to handling media files across the cleaning app, with built-in organization, access control, and resource lifecycle management.

## Architecture

### Storage Structure

The service organizes files in a hierarchical structure that reflects ownership and resource relationships:

```
Firebase Storage Root
├── users/
│   └── {userId}/
│       ├── profile/
│       │   └── avatar.jpg
│       └── documents/
│           ├── id-verification/
│           ├── contracts/
│           └── invoices/
├── offers/
│   └── {offerId}/
│       ├── main/
│       │   └── main-image.jpg
│       ├── gallery/
│       │   ├── image1.jpg
│       │   └── image2.jpg
│       └── attachments/
├── appointments/
│   └── {appointmentId}/
│       ├── before-photos/
│       ├── after-photos/
│       └── receipts/
└── reviews/
    └── {reviewId}/
        └── photos/
```

### Design Principles

1. **Ownership-Based Organization**: Files are organized by who owns them (users) or what they belong to (offers, appointments)
2. **Hierarchical Structure**: Clear folder hierarchy makes it easy to manage and clean up resources
3. **Consistent Naming**: Predictable file paths enable easy access control and cleanup operations
4. **Scalable Architecture**: Structure supports growth without becoming unwieldy

## Core Methods

### Generic Upload Method

```typescript
static async uploadImage(
  uri: string,
  folder: keyof typeof STORAGE_PATHS = "OFFERS",
  fileName?: string,
  fileType?: string
): Promise<string>
```

**Parameters:**

- `uri`: Local file URI from expo-image-picker
- `folder`: Storage folder (USERS, OFFERS, APPOINTMENTS, REVIEWS, TEMP)
- `fileName`: Optional custom filename
- `fileType`: File type for organization (e.g., 'profile', 'service', 'review')

**Returns:** Public download URL from Firebase Storage

### Specialized Upload Methods

#### User Profile Images

```typescript
static async uploadProfileImage(uri: string, userId: string, fileName?: string)
```

- **Path**: `users/{userId}/profile/{filename}`
- **Use Case**: User avatar, profile pictures
- **Example**: `users/abc123/profile/avatar.jpg`

#### Offer Images

```typescript
static async uploadOfferImage(uri: string, offerId: string, fileName?: string, category?: string)
```

- **Path**: `offers/{offerId}/{category}/{filename}`
- **Categories**: 'main', 'gallery', 'attachments'
- **Example**: `offers/offer456/main/1703123456789.jpg`

#### Appointment Images

```typescript
static async uploadAppointmentImage(uri: string, appointmentId: string, fileName?: string, category?: string)
```

- **Path**: `appointments/{appointmentId}/{category}/{filename}`
- **Categories**: 'before-photos', 'after-photos', 'receipts'
- **Example**: `appointments/appt789/before-photos/1703123456789.jpg`

#### Review Images

```typescript
static async uploadReviewImage(uri: string, reviewId: string, fileName?: string)
```

- **Path**: `reviews/{reviewId}/photos/{filename}`
- **Example**: `reviews/rev123/photos/1703123456789.jpg`

#### User Documents

```typescript
static async uploadUserDocument(uri: string, userId: string, documentType: string, fileName?: string)
```

- **Path**: `users/{userId}/documents/{documentType}/{filename}`
- **Document Types**: 'id-verification', 'contracts', 'invoices'
- **Example**: `users/abc123/documents/id-verification/1703123456789.pdf`

## Usage Examples

### Basic Image Upload

```typescript
import { StorageService } from "@/lib/services/storageService";

// Upload a simple image
const imageUrl = await StorageService.uploadImage(
  localImageUri,
  "OFFERS",
  "my-image.jpg",
  "service"
);
```

### Profile Image Management

```typescript
// Upload new profile image
const newProfileUrl = await StorageService.uploadProfileImage(
  newImageUri,
  userId
);

// Delete old profile image before updating
if (oldProfileUrl) {
  await StorageService.deleteImage(oldProfileUrl);
}

// Update user profile in Firestore
await updateUserProfile(userId, { profileImage: newProfileUrl });
```

### Offer Image Management

```typescript
// Upload main offer image
const mainImageUrl = await StorageService.uploadOfferImage(
  imageUri,
  offerId,
  undefined,
  "main"
);

// Upload additional gallery images
const galleryImage1 = await StorageService.uploadOfferImage(
  imageUri2,
  offerId,
  undefined,
  "gallery"
);

const galleryImage2 = await StorageService.uploadOfferImage(
  imageUri3,
  offerId,
  undefined,
  "gallery"
);
```

### Appointment Photo Management

```typescript
// Upload before and after photos
const beforePhoto = await StorageService.uploadAppointmentImage(
  beforeImageUri,
  appointmentId,
  undefined,
  "before-photos"
);

const afterPhoto = await StorageService.uploadAppointmentImage(
  afterImageUri,
  appointmentId,
  undefined,
  "after-photos"
);
```

### Document Management

```typescript
// Upload ID verification document
const idDocUrl = await StorageService.uploadUserDocument(
  documentUri,
  userId,
  "id-verification"
);

// Upload contract document
const contractUrl = await StorageService.uploadUserDocument(
  contractUri,
  userId,
  "contracts"
);
```

## Resource Cleanup

### Deleting Individual Files

```typescript
// Delete a specific image
await StorageService.deleteImage(imageUrl);
```

### Deleting All Files for a Resource

```typescript
// Delete all files for a specific offer
await StorageService.deleteOfferFiles(offerId);

// Delete all files for a specific user
await StorageService.deleteUserFiles(userId);
```

### Cleanup Patterns

#### Profile Image Update

```typescript
async function updateProfileImage(userId: string, newImageUri: string) {
  try {
    // 1. Get current profile image URL
    const currentUser = await getUser(userId);
    const oldProfileUrl = currentUser.profileImage;

    // 2. Upload new image
    const newProfileUrl = await StorageService.uploadProfileImage(
      newImageUri,
      userId
    );

    // 3. Delete old image if it exists
    if (oldProfileUrl && oldProfileUrl !== newProfileUrl) {
      await StorageService.deleteImage(oldProfileUrl);
    }

    // 4. Update user profile
    await updateUserProfile(userId, { profileImage: newProfileUrl });

    return newProfileUrl;
  } catch (error) {
    console.error("Failed to update profile image:", error);
    throw error;
  }
}
```

#### Offer Deletion

```typescript
async function deleteOffer(offerId: string) {
  try {
    // 1. Delete all offer files from storage
    await StorageService.deleteOfferFiles(offerId);

    // 2. Delete offer from Firestore
    await deleteOfferFromFirestore(offerId);

    console.log(
      `Offer ${offerId} and all associated files deleted successfully`
    );
  } catch (error) {
    console.error("Failed to delete offer:", error);
    throw error;
  }
}
```

## Firebase Security Rules

The storage structure enables granular access control through Firebase Security Rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Users can only access their own files
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Service providers can only access their own offers
    match /offers/{offerId}/{allPaths=**} {
      allow read: if true; // Public read for offers
      allow write: if request.auth != null &&
        resource.metadata.providerId == request.auth.uid;
    }

    // Appointments - users and providers can access their own
    match /appointments/{appointmentId}/{allPaths=**} {
      allow read, write: if request.auth != null &&
        (resource.metadata.userId == request.auth.uid ||
         resource.metadata.providerId == request.auth.uid);
    }

    // Reviews - public read, authenticated write
    match /reviews/{reviewId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## File Naming Conventions

### Automatic Naming

- **Default**: `{timestamp}.{extension}`
- **Custom**: Use `fileName` parameter for specific names
- **Examples**: `1703123456789.jpg`, `avatar.jpg`, `main-image.png`

### Path Structure

- **Users**: `users/{userId}/{category}/{filename}`
- **Offers**: `offers/{offerId}/{category}/{filename}`
- **Appointments**: `appointments/{appointmentId}/{category}/{filename}`
- **Reviews**: `reviews/{reviewId}/{category}/{filename}`

## Error Handling

The service includes comprehensive error handling:

```typescript
try {
  const imageUrl = await StorageService.uploadImage(uri, "OFFERS");
  // Use imageUrl
} catch (error) {
  if (error.message.includes("Failed to upload image")) {
    // Handle upload failure
    console.error("Image upload failed:", error);
    // Show user-friendly error message
  } else {
    // Handle other errors
    console.error("Unexpected error:", error);
  }
}
```

## Performance Considerations

### File Size Limits

- **Images**: Recommended max 5MB for profile/offer images
- **Documents**: Recommended max 10MB for PDFs
- **Gallery Images**: Consider compression for multiple images

### Upload Optimization

- **Quality**: Use appropriate image quality (0.8 for offers, 0.9 for profiles)
- **Compression**: Compress images before upload when possible
- **Batch Operations**: Consider batching multiple uploads

## Future Enhancements

### Planned Features

- **File Versioning**: Keep history of file changes
- **Bulk Operations**: Delete multiple files efficiently
- **Storage Analytics**: Track usage per user/resource
- **CDN Integration**: Cache frequently accessed images
- **Image Processing**: Automatic resizing and optimization

### Extension Points

- **New Content Types**: Easy to add new storage categories
- **Custom Metadata**: Store additional file information
- **Access Control**: Granular permissions per file type
- **Backup Strategies**: Implement file backup and recovery

## Troubleshooting

### Common Issues

#### Upload Fails

- Check file size and format
- Verify Firebase Storage permissions
- Ensure stable internet connection
- Check Firebase project configuration

#### File Not Found

- Verify file path structure
- Check if file was deleted
- Ensure proper access permissions
- Validate file URL format

#### Permission Denied

- Check Firebase Security Rules
- Verify user authentication
- Ensure user owns the resource
- Check file path permissions

### Debug Information

```typescript
// Enable debug logging
console.log("Storage path:", StorageService.getStoragePath("OFFERS"));
console.log("File path:", `${offerId}/main/${fileName}`);
console.log("Full URL:", imageUrl);
```

## Contributing

When adding new features to the storage service:

1. **Follow the existing structure** and naming conventions
2. **Add comprehensive JSDoc** documentation
3. **Include usage examples** in the README
4. **Update security rules** if adding new paths
5. **Test cleanup operations** for new file types
6. **Consider backward compatibility** when making changes

## Support

For questions or issues with the storage service:

- Check this README first
- Review Firebase Storage documentation
- Test with simple examples
- Check Firebase console for errors
- Verify security rules configuration

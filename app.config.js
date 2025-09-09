export default () => {
  const requiredEnvVars = [
    "EXPO_PUBLIC_FIREBASE_API_KEY",
    "EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN",
    "EXPO_PUBLIC_FIREBASE_PROJECT_ID",
    "EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET",
    "EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
    "EXPO_PUBLIC_FIREBASE_APP_ID",
  ];

  const missing = requiredEnvVars.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `❌ Missing required environment variables: ${missing.join(", ")}`
    );
  }

  return {
    expo: {
      name: "Rehoboth",
      slug: "rehoboth-app",
      version: "1.0.0",
      orientation: "portrait",
      icon: "./assets/images/icon.png",
      scheme: "rehoboth",
      userInterfaceStyle: "automatic",
      newArchEnabled: true,
      ios: {
        supportsTablet: true,
        bundleIdentifier: "com.rehoboth.app",
        infoPlist: {
          NSPhotoLibraryUsageDescription:
            "This app accesses your photos to create profile pictures and services display pictures.",
          NSLocationWhenInUseUsageDescription:
            "This app uses your location to help you find nearby service providers and set your service area.",
          NSLocationAlwaysAndWhenInUseUsageDescription:
            "This app uses your location to help you find nearby service providers and set your service area.",
        },
      },
      android: {
        adaptiveIcon: {
          foregroundImage: "./assets/images/adaptive-icon.png",
          backgroundColor: "#000000",
        },
        edgeToEdgeEnabled: true,
        package: "com.rehoboth.app",
        permissions: ["ACCESS_FINE_LOCATION", "ACCESS_COARSE_LOCATION"],
      },
      web: {
        bundler: "metro",
        output: "static",
        favicon: "./assets/images/favicon.png",
      },
      plugins: [
        "expo-router",
        [
          "expo-splash-screen",
          {
            image: "./assets/images/splash-icon.png",
            imageWidth: 200,
            resizeMode: "contain",
            backgroundColor: "#000000",
          },
        ],
        ["expo-web-browser", { experimentalLauncherActivity: true }],
        [
          "expo-image-picker",
          {
            photosPermission:
              "The app accesses your photos to create profile pictures and services display pictures.",
          },
        ],
        [
          "expo-location",
          {
            locationAlwaysAndWhenInUsePermission:
              "This app uses your location to help you find nearby service providers and set your service area.",
            locationWhenInUsePermission:
              "This app uses your location to help you find nearby service providers and set your service area.",
          },
        ],
      ],
      experiments: {
        typedRoutes: true,
      },
      extra: {
        eas: {
          projectId: "5f07ef35-5d3d-416e-a835-27eb262f4395",
        },
        FIREBASE_API_KEY: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
        FIREBASE_AUTH_DOMAIN: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
        FIREBASE_PROJECT_ID: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
        FIREBASE_STORAGE_BUCKET:
          process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
        FIREBASE_MESSAGING_SENDER_ID:
          process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        FIREBASE_APP_ID: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
        FIREBASE_MEASUREMENT_ID:
          process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
      },
      owner: "rehoboth-app",
    },
  };
};

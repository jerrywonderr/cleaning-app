import * as Location from "expo-location";
import { forwardRef, useCallback, useImperativeHandle } from "react";
import { useController, useFormContext } from "react-hook-form";
import { Alert, TouchableOpacity, View, ViewStyle } from "react-native";
import { useBottomSheet } from "../../../hooks/useBottomSheet";
import { locationService } from "../../../services/locationService";
import {
  LocationData,
  getContinentFromCountryCode,
} from "../../../types/location";
import { cn } from "../../../utils/style";
import BaseBottomSheet from "../../BaseBottomSheet";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlHelper,
  FormControlHelperText,
  FormControlLabel,
  FormControlLabelText,
} from "../../ui/form-control";
import { AlertCircleIcon } from "../../ui/icon";
import { useLoader } from "../../ui/loader/use-loader";
import { Text } from "../../ui/text";
import { AddressSheetContent } from "./AddressSheetContent";
import { useResponsiveSizes } from "./hooks/useResponsiveSizes";
import { FindMeButton } from "./FindMeButton";

export interface AddressFieldProps {
  name: string;
  label?: string;
  helperText?: string;
  placeholder?: string;
  className?: string;
  heightClassName?: string;
  containerStyle?: ViewStyle;
  onLocationChange?: (location: LocationData | null) => void;
}

export interface AddressFieldRef {
  present: () => void;
  dismiss: () => void;
}

const AddressField = forwardRef<AddressFieldRef, AddressFieldProps>(
  (
    {
      name,
      label,
      helperText,
      placeholder,
      className,
      heightClassName,
      containerStyle,
      onLocationChange,
    },
    ref
  ) => {
    const { control } = useFormContext();
    const {
      field,
      fieldState: { error },
    } = useController({ name, control });

    const { bottomSheetRef, present, dismiss } = useBottomSheet();
    const { showLoader, hideLoader } = useLoader();
    const { iconSize, fontSize, padding } = useResponsiveSizes(heightClassName);

    const handleReset = useCallback(() => {
      field.onChange(null);
      onLocationChange?.(null);
    }, [field, onLocationChange]);

    const handleLocationSelect = useCallback(
      (data: LocationData) => {
        field.onChange(data);
        field.onBlur();
        onLocationChange?.(data);
        dismiss();
      },
      [field, onLocationChange, dismiss]
    );

    const handleUseCurrentLocation = useCallback(async () => {
      try {
        showLoader("Finding you...");
        // Request location permissions
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission Denied",
            "Location permission is required to find you."
          );
          return;
        }

        // Get current position
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        const { latitude, longitude } = location.coords;
        // Get address from coordinates using our service
        const locationResult = await locationService.getLocationFromCoordinates(
          latitude,
          longitude
        );

        // Transform the result to LocationData format
        const locationData: LocationData = {
          fullAddress: locationResult.address.fullAddress,
          country: locationResult.address.country,
          countryCode: locationResult.address.countryCode,
          latitude: locationResult.coordinates.latitude,
          longitude: locationResult.coordinates.longitude,
          continent: getContinentFromCountryCode(
            locationResult.address.countryCode
          ),
          city: locationResult.address.city,
          state: locationResult.address.state,
          postalCode: locationResult.address.postalCode,
          streetName: locationResult.address.street,
          streetNumber: "",
        };

        field.onChange(locationData);
        field.onBlur();
        onLocationChange?.(locationData);
        dismiss();
      } catch (error) {
        console.error("Error getting current location:", error);
        Alert.alert(
          "Location Error",
          "Failed to get your current location. Please try again or select an address manually."
        );
      } finally {
        hideLoader();
      }
    }, [field, onLocationChange, dismiss, showLoader, hideLoader]);

    useImperativeHandle(
      ref,
      () => ({
        present: () => {
          present();
        },
        dismiss: () => {
          dismiss();
        },
      }),
      [present, dismiss]
    );

    const handleOpenSheet = useCallback(() => {
      present();
    }, [present]);

    return (
      <FormControl isInvalid={!!error}>
        {label && (
          <FormControlLabel>
            <FormControlLabelText className="text-sm font-inter-medium">
              {label}
            </FormControlLabelText>
          </FormControlLabel>
        )}

        <TouchableOpacity onPress={handleOpenSheet} activeOpacity={0.7}>
          <View
            className={cn(
              "border border-black/60 rounded-lg bg-white justify-center px-3 relative",
              heightClassName || "h-12",
              className
            )}
            style={containerStyle}
          >
            <Text className="text-base text-gray-900 pr-20">
              {field.value?.fullAddress || placeholder || "Select address"}
            </Text>

            <FindMeButton
              onPress={handleUseCurrentLocation}
              iconSize={iconSize}
              fontSize={fontSize}
              padding={padding}
            />
          </View>
        </TouchableOpacity>

        <BaseBottomSheet
          ref={bottomSheetRef}
          snapPoints={["80%"]}
          index={0}
          enablePanDownToClose
          onDismiss={dismiss}
          containerStyle={{ flex: 1 }}
        >
          <AddressSheetContent
            placeholder={placeholder}
            onLocationSelect={handleLocationSelect}
            onReset={handleReset}
            onUseCurrentLocation={handleUseCurrentLocation}
            initialValue={field.value}
          />
        </BaseBottomSheet>

        {helperText && (
          <FormControlHelper>
            <FormControlHelperText>{helperText}</FormControlHelperText>
          </FormControlHelper>
        )}
        <FormControlError>
          <FormControlErrorIcon as={AlertCircleIcon} />
          <FormControlErrorText>{error?.message}</FormControlErrorText>
        </FormControlError>
      </FormControl>
    );
  }
);

AddressField.displayName = "AddressField";

export default AddressField;

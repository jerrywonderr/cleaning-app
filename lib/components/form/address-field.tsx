import { forwardRef, useCallback, useImperativeHandle, useState } from "react";
import { useController, useFormContext } from "react-hook-form";
import { TouchableOpacity, View, ViewStyle } from "react-native";
import { useBottomSheet } from "../../hooks/useBottomSheet";
import {
  AddressSearchResult,
  LocationData,
  getContinentFromCountryCode,
} from "../../types/location";
import { cn } from "../../utils/style";
import BaseBottomSheet from "../BaseBottomSheet";
import { AzureMapsAutocomplete } from "../ui/azure-maps-autocomplete";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlHelper,
  FormControlHelperText,
  FormControlLabel,
  FormControlLabelText,
} from "../ui/form-control";
import { AlertCircleIcon } from "../ui/icon";
import { Text } from "../ui/text";

interface AddressFieldProps {
  name: string;
  label?: string;
  helperText?: string;
  placeholder?: string;
  className?: string;
  containerStyle?: ViewStyle;
  onLocationChange?: (location: LocationData | null) => void;
}

export interface AddressFieldRef {
  present: () => void;
  dismiss: () => void;
}

// Sheet content component that is shown inside the bottom sheet
interface AddressSheetContentProps {
  placeholder?: string;
  onLocationSelect: (data: LocationData) => void;
  onUseCurrentLocation: () => void;
  onReset: () => void;
  initialValue: LocationData | null;
}

const AddressSheetContent: React.FC<AddressSheetContentProps> = ({
  placeholder,
  onLocationSelect,
  onUseCurrentLocation,
  onReset,
  initialValue,
}) => {
  const [currentText, setCurrentText] = useState(
    initialValue?.fullAddress || ""
  );

  const handleReset = () => {
    setCurrentText("");
    onReset();
  };

  const handleLocationSelect = (data: AddressSearchResult) => {
    const locationData: LocationData = {
      fullAddress: data.address.freeformAddress,
      country: data.address.country,
      countryCode: data.address.countryCode,
      latitude: data.position.lat,
      longitude: data.position.lon,
      continent: getContinentFromCountryCode(data.address.countryCode),
      city: data.address.city,
      state: data.address.state,
      postalCode: data.address.postalCode,
      streetName: data.address.streetName,
      streetNumber: data.address.streetNumber,
    };
    onLocationSelect(locationData);
  };

  return (
    <View style={{ flex: 1 }} className="flex flex-col justify-between">
      {/* Header */}
      <Text className="text-xl font-semibold mb-4">Select Location</Text>

      {/* Main Content Area - This should fill most of the space */}
      <View className="flex-1">
        <AzureMapsAutocomplete
          placeholder={placeholder || "Enter your address"}
          onSelect={handleLocationSelect}
          initialValue={currentText}
          onTextChange={setCurrentText}
        />
      </View>

      {/* Footer Buttons - Fixed at bottom */}
      <View className="w-full border-t border-gray-200 pt-4 mt-auto">
        <TouchableOpacity
          onPress={onUseCurrentLocation}
          className="py-3 rounded-full bg-blue-500 mb-2"
        >
          <Text className="text-center text-white font-medium">
            Use Current Location
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onReset}
          className="py-3 rounded-full bg-gray-100"
        >
          <Text className="text-center text-gray-700 font-medium">
            Reset Location
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const AddressField = forwardRef<AddressFieldRef, AddressFieldProps>(
  (
    {
      name,
      label,
      helperText,
      placeholder,
      className,
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

    const handleReset = useCallback(() => {
      field.onChange(null);
      onLocationChange?.(null);
    }, [field, onLocationChange]);

    const handleLocationSelect = useCallback(
      (data: LocationData) => {
        console.log("data", data);
        field.onChange(data);
        field.onBlur();
        onLocationChange?.(data);
        dismiss();
      },
      [field, onLocationChange, dismiss]
    );

    const handleUseCurrentLocation = useCallback(() => {
      // Mock current location - replace with actual location service
      const locationData: LocationData = {
        fullAddress: "Current Location, Lagos, Nigeria",
        country: "Nigeria",
        countryCode: "NG",
        latitude: 6.5244,
        longitude: 3.3792,
        continent: "Africa",
        city: "Lagos",
        state: "Lagos",
      };
      field.onChange(locationData);
      field.onBlur();
      onLocationChange?.(locationData);
      dismiss();
    }, [field, onLocationChange, dismiss]);

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

    // Create a function for the TouchableOpacity to use
    const handleOpenSheet = useCallback(() => {
      present();
    }, [present]);

    console.log("error", error);

    return (
      <FormControl isInvalid={!!error}>
        {label && (
          <FormControlLabel>
            <FormControlLabelText className="text-sm font-inter-medium">
              {label}
            </FormControlLabelText>
          </FormControlLabel>
        )}

        {/* Touchable field that opens the address selector */}
        <TouchableOpacity onPress={handleOpenSheet} activeOpacity={0.7}>
          <View
            className={cn(
              "h-12 border border-black/60 rounded-lg bg-white justify-center px-3",
              className
            )}
            style={containerStyle}
          >
            <Text className="text-base text-gray-900">
              {field.value?.fullAddress || placeholder || "Select address"}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Address Selection Bottom Sheet */}
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

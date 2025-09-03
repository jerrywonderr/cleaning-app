import { useState } from "react";
import { View } from "react-native";
import {
  LocationAutocompleteResult,
  LocationData,
  getContinentFromCountryCode,
} from "../../../types/location";
import { AzureMapsAutocomplete } from "../../ui/azure-maps-autocomplete";
import { Text } from "../../ui/text";

interface AddressSheetContentProps {
  placeholder?: string;
  onLocationSelect: (data: LocationData) => void;
  onUseCurrentLocation: () => void;
  onReset: () => void;
  initialValue: LocationData | null;
}

export const AddressSheetContent: React.FC<AddressSheetContentProps> = ({
  placeholder,
  onLocationSelect,
  onUseCurrentLocation,
  onReset,
  initialValue,
}) => {
  const [currentText, setCurrentText] = useState(
    initialValue?.fullAddress || ""
  );

  const handleLocationSelect = (data: LocationAutocompleteResult) => {
    const locationData: LocationData = {
      fullAddress: data.address.fullAddress,
      country: data.address.country,
      countryCode: data.address.countryCode,
      latitude: data.coordinates.latitude,
      longitude: data.coordinates.longitude,
      continent: getContinentFromCountryCode(data.address.countryCode),
      city: data.address.city,
      state: data.address.state,
      postalCode: data.address.postalCode,
      streetName: data.address.street,
      streetNumber: "",
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
    </View>
  );
};

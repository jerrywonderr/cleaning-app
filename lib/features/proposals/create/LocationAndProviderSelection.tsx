import { AddressField, AddressFieldRef } from "@/lib/components/form";
import { useLoader } from "@/lib/components/ui/loader/use-loader";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import { CreateProposalFormData } from "@/lib/schemas/create-proposal";
import { searchServiceProviders } from "@/lib/services/cloudFunctionsService";
import { ServiceProviderResult } from "@/lib/types";
import { useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { ProviderList } from "./ProviderList";
import { ProviderProfileSheet } from "./ProviderProfileSheet";

interface LocationAndProviderSelectionProps {
  onLocationChange?: (location: any) => void;
  onProviderChange?: (providerId: string) => void;
}

export const LocationAndProviderSelection = ({
  onLocationChange,
  onProviderChange,
}: LocationAndProviderSelectionProps) => {
  const { watch, setValue, setError, clearErrors, formState } =
    useFormContext<CreateProposalFormData>();
  const selectedLocation = watch("location");
  const serviceId = watch("serviceId");
  const selectedProvider = watch("providerId");
  const { showLoader, hideLoader } = useLoader();

  const [providers, setProviders] = useState<ServiceProviderResult[]>([]);
  const [selectedProviderForProfile, setSelectedProviderForProfile] =
    useState<ServiceProviderResult | null>(null);

  const addressRef = useRef<AddressFieldRef>(null);
  const profileSheetRef = useRef<any>(null);

  useEffect(() => {
    const fetchProviders = async () => {
      if (!serviceId || !selectedLocation) return;
      try {
        clearErrors("providerId");
        showLoader("Finding service providers...");
        const results = await searchServiceProviders(serviceId, {
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
        });
        setProviders(results as ServiceProviderResult[]);
        // Auto-clear previous selection if no longer in list
        if (
          selectedProvider &&
          !(results as ServiceProviderResult[]).some(
            (p) => p.id === selectedProvider
          )
        ) {
          setValue("providerId", "");
        }
      } catch (err) {
        console.error("Error fetching providers:", err);
        setError("providerId", {
          type: "manual",
          message: "Failed to load service providers. Please try again.",
        });
      } finally {
        hideLoader();
      }
    };
    fetchProviders();
  }, [serviceId, selectedLocation?.latitude, selectedLocation?.longitude]);

  const handleProviderSelect = (providerId: string) => {
    setValue("providerId", providerId);
    onProviderChange?.(providerId);
  };

  const handleViewProfile = (providerId: string) => {
    const provider = providers.find((p) => p.id === providerId);
    if (provider) {
      setSelectedProviderForProfile(provider);
      profileSheetRef.current?.present();
    }
  };

  const handleBookProvider = () => {
    profileSheetRef.current?.dismiss();
    if (selectedProviderForProfile) {
      handleProviderSelect(selectedProviderForProfile.id);
    }
  };

  return (
    <VStack className="gap-6 flex-1">
      <Text className="text-2xl font-inter-bold text-black">
        Where should we clean?
      </Text>

      <AddressField
        ref={addressRef}
        name="location"
        label="Cleaning Address"
        placeholder="Enter your address"
        heightClassName="h-16"
      />

      {selectedLocation && (
        <VStack className="gap-4 flex-1">
          <Text className="text-2xl font-inter-bold text-black">
            Available Providers
          </Text>

          <ProviderList
            providers={providers}
            selectedProviderId={selectedProvider}
            onProviderSelect={handleProviderSelect}
            onViewProfile={handleViewProfile}
            serviceId={serviceId}
            error={formState.errors.providerId?.message}
          />
        </VStack>
      )}

      {selectedProviderForProfile && (
        <ProviderProfileSheet
          ref={profileSheetRef}
          provider={selectedProviderForProfile}
          onBookProvider={handleBookProvider}
        />
      )}
    </VStack>
  );
};

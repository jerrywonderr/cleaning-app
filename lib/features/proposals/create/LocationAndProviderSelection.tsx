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

  const addressRef = useRef<AddressFieldRef>(null);

  useEffect(() => {
    const fetchProviders = async () => {
      if (!serviceId || !selectedLocation) return;
      try {
        clearErrors("providerId");
        showLoader("Finding service providers in your area...");
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
            serviceId={serviceId}
            error={formState.errors.providerId?.message}
          />
        </VStack>
      )}
    </VStack>
  );
};

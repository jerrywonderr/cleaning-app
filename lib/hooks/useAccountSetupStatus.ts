import { useBankAccount } from "./useBankAccount";
import { useServiceProvider } from "./useServiceProvider";

export const useAccountSetupStatus = () => {
  const { stripeConnectAccount, isLoadingStripeAccount } = useBankAccount();
  const { serviceProviderProfile, isLoading: isLoadingProfile } =
    useServiceProvider();

  const hasWorkingSchedule = !!(
    serviceProviderProfile?.workingPreferences?.workingSchedule &&
    Object.keys(serviceProviderProfile.workingPreferences.workingSchedule).some(
      (day) =>
        serviceProviderProfile.workingPreferences?.workingSchedule?.[day]
          ?.isActive
    )
  );
  const hasServiceArea =
    !!serviceProviderProfile?.workingPreferences?.serviceArea?.fullAddress;
  const hasWorkingPreferences = hasWorkingSchedule && hasServiceArea;

  const hasServices = !!(
    serviceProviderProfile?.services &&
    Object.values(serviceProviderProfile.services).some((enabled) => enabled)
  );

  const hasStripeSetup =
    !isLoadingStripeAccount &&
    stripeConnectAccount &&
    (stripeConnectAccount.stripeAccountStatus === "active" ||
      stripeConnectAccount.stripeAccountStatus === "completed");

  const isAccountComplete =
    hasWorkingPreferences && hasServices && hasStripeSetup;
  const needsSetup = !isLoadingProfile && !isAccountComplete;

  return {
    hasWorkingPreferences,
    hasServices,
    hasStripeSetup,
    isAccountComplete,
    needsSetup,
    isLoading: isLoadingProfile || isLoadingStripeAccount,
  };
};

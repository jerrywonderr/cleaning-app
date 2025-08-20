import { router } from "expo-router";
import { useEffect } from "react";

export default function CreateOfferRedirect() {
  useEffect(() => {
    // Redirect to the new multi-step create flow
    router.replace("/service-provider/offers/create/");
  }, []);

  return null;
}

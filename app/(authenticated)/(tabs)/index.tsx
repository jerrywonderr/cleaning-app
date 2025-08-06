import CustomerHome from "@/lib/components/screens/CustomerHome";
import ServiceProviderHome from "@/lib/components/screens/ServiceProviderHome";
import { useAuthStore } from "@/lib/store/useAuthStore";

export default function HomeScreen() {
  const { user } = useAuthStore();

  // Conditionally render based on user type
  if (user?.isServiceProvider) {
    return <ServiceProviderHome />;
  }

  else return <CustomerHome />;
}

import ScrollableScreen from "@/lib/components/screens/ScrollableScreen";
import { VStack } from "@/lib/components/ui/vstack";
import OfferCard, { OfferCardProps } from "@/lib/features/offers/OfferCard";
import { useRouter } from "expo-router";

const offers: OfferCardProps[] = [
  {
    title: "Cleaning",
    price: 15000,
    provider: "Mr kay",
    description: "Classic Cleaning",
    image: "https://picsum.photos/200/200",
  },
  {
    title: "Cleaning",
    price: 32500,
    provider: "Mr kay",
    description: "Classic Cleaning",
    image: "https://picsum.photos/200/200",
  },
  {
    title: "Cleaning",
    price: 257000,
    provider: "Mr kay",
    description: "Classic Cleaning",
    image: "https://picsum.photos/200/200",
  },
];

export default function OffersScreen() {
  const router = useRouter();

  return (
    <ScrollableScreen
      addTopInset={false}
      addBottomInset={false}
      contentContainerClassName="px-[0]"
    >
      <VStack className="gap-3">
        {offers.map((offer, idx) => (
          <OfferCard
            key={idx}
            {...offer}
            onPress={() =>
              router.push({
                pathname: "/customer/customer-offer-details",
                params: {
                  title: offer.title,
                  price: offer.price.toString(),
                  provider: offer.provider,
                  description: offer.description,
                  image: offer.image,
                },
              })
            }
          />
        ))}
      </VStack>
    </ScrollableScreen>
  );
}

import { ExtraServiceOption, ServiceConfig } from "../types/service-config";

export const serviceConfigs: ServiceConfig[] = [
  {
    id: "classic-cleaning",
    name: "Classic Cleaning",
    description:
      "Standard maintenance cleaning for regular upkeep. Perfect for weekly or bi-weekly cleaning routines.",
    perHourPrice: 25,
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop&crop=center",
    isEnabled: false,
  },
  {
    id: "deep-cleaning",
    name: "Deep Cleaning",
    description:
      "Comprehensive cleaning including hard-to-reach areas, appliances, and detailed attention to every corner.",
    perHourPrice: 35,
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center",
    isEnabled: false,
  },
  {
    id: "end-of-tenancy",
    name: "End of Tenancy",
    description:
      "Thorough cleaning after moving out of a home. Includes deep cleaning and restoration to original condition.",
    perHourPrice: 45,
    image:
      "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&h=300&fit=crop&crop=center",
    isEnabled: false,
  },
];

export const extraServiceOptions: ExtraServiceOption[] = [
  {
    id: "ironing",
    name: "Ironing Service",
    description: "Professional ironing of clothes, linens, and fabrics",
    additionalPrice: 15,
    isEnabled: false,
  },
  {
    id: "laundry-on-premise",
    name: "On-Premise Laundry",
    description:
      "Wash and clean towels, cleaning cloths, and other fabrics at your location",
    additionalPrice: 20,
    isEnabled: false,
  },
  {
    id: "bring-tools",
    name: "Bring Cleaning Tools",
    description:
      "We bring all necessary cleaning tools and equipment to your venue",
    additionalPrice: 10,
    isEnabled: false,
  },
];

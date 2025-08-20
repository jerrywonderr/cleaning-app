import { OfferCategory } from "../types/offer";

/**
 * Service Category Options
 *
 * This file contains the predefined service categories for cleaning services.
 * It provides consistent labels and values across the app.
 */
const serviceCategoryOptions: {
  value: OfferCategory;
  label: string;
  description: string;
}[] = [
  {
    value: "classic-cleaning",
    label: "Classic Cleaning",
    description: "Standard maintenance cleaning for regular upkeep",
  },
  {
    value: "deep-cleaning",
    label: "Deep Cleaning",
    description: "Comprehensive cleaning including hard-to-reach areas",
  },
  {
    value: "end-of-tenancy",
    label: "End of Tenancy",
    description: "Thorough cleaning after moving out of a home",
  },
];

export default serviceCategoryOptions;

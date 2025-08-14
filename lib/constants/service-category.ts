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
    value: "deep-cleaning",
    label: "Deep Cleaning",
    description: "Comprehensive cleaning including hard-to-reach areas",
  },
  {
    value: "regular-cleaning",
    label: "Regular Cleaning",
    description: "Standard maintenance cleaning for regular upkeep",
  },
  {
    value: "move-in-cleaning",
    label: "Move-in Cleaning",
    description: "Thorough cleaning before moving into a new space",
  },
  {
    value: "move-out-cleaning",
    label: "Move-out Cleaning",
    description: "Deep cleaning when vacating a property",
  },
  {
    value: "post-construction",
    label: "Post Construction",
    description: "Cleaning after construction or renovation work",
  },
  {
    value: "carpet-cleaning",
    label: "Carpet Cleaning",
    description: "Specialized carpet and upholstery cleaning",
  },
  {
    value: "window-cleaning",
    label: "Window Cleaning",
    description: "Interior and exterior window cleaning",
  },
  {
    value: "other",
    label: "Other",
    description: "Custom cleaning services not listed above",
  },
];

export default serviceCategoryOptions;

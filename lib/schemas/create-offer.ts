import * as yup from "yup";
import serviceCategoryOptions from "../constants/service-category";

export const createOfferSchema = yup.object({
  title: yup.string().required("Service title is required"),
  price: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .min(1, "Price must be greater than 0")
    .required("Price is required"),
  description: yup.string().required("Description is required"),
  image: yup.string().required("Image is required"),
  category: yup
    .string()
    .oneOf(
      serviceCategoryOptions.map((c) => c.value),
      "Choose a valid category"
    )
    .required("Category is required"),
  duration: yup
    .number()
    .transform((value) => {
      if (value === "" || value === null || value === undefined)
        return undefined;
      const num = Number(value);
      return isNaN(num) ? undefined : num;
    })
    .min(1, "Duration must be at least 1 hour")
    .required("Duration is required"),
  tags: yup.array().of(yup.string().required()).default([]),
  whatIncluded: yup.array().of(yup.string().required()).default([]),
  requirements: yup.array().of(yup.string().required()).default([]),
});

export type CreateOfferFormData = yup.InferType<typeof createOfferSchema>;

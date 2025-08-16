import * as yup from "yup";
import serviceCategoryOptions from "../constants/service-category";

const schema = yup.object({
  offerId: yup.string().required("Offer ID is required"),
  address: yup
    .string()
    .min(10, "Address must be at least 10 characters")
    .required("Address is required"),
  serviceType: yup
    .string()
    .oneOf(serviceCategoryOptions.map((option) => option.value))
    .required("Service type is required"),
  scheduledDate: yup.date().required("Date is required"),
  scheduledTime: yup.date().required("Time is required"),
  notes: yup.string().optional(),
});

export default schema;

import * as yup from "yup";
import serviceCategoryOptions from "../constants/service-category";

const schema = yup.object({
  address: yup
    .string()
    .min(10, "Address must be at least 10 characters")
    .required("Address is required"),
  serviceType: yup
    .string()
    .oneOf(serviceCategoryOptions.map((option) => option.value))
    .required("Service type is required"),
  date: yup.date().required("Date is required"),
  time: yup.string().required("Time is required"),
});

export default schema;

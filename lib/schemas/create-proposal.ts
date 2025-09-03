import * as yup from "yup";

export const createProposalSchema = yup.object({
  serviceId: yup.string().required("Service selection is required"),
  location: yup
    .object()
    .shape({
      fullAddress: yup.string().required("Address is required"),
      latitude: yup.number().required("Valid address is required"),
      longitude: yup.number().required("Valid address is required"),
      country: yup.string().required("Valid address is required"),
    })
    .required("Location is required"),
  providerId: yup.string().required("Provider selection is required"),
  proposalDetails: yup.object({
    date: yup.string().required("Date is required"),
    duration: yup
      .number()
      .min(1, "Duration must be at least 1 hour")
      .required("Duration is required"),
    timeRange: yup.string().required("Time range is required"),
  }),
  extraOptions: yup.array().of(yup.string()).default([]),
});

export type CreateProposalFormData = yup.InferType<typeof createProposalSchema>;

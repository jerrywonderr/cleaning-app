import { createContext } from "react";

type LoaderContextType = {
  showLoader: (description?: string) => void;
  hideLoader: () => void;
};

export const LoaderContext = createContext<LoaderContextType | undefined>(
  undefined
);

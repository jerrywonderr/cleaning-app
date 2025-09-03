import { ReactNode, useCallback, useState } from "react";
import { LoaderContext } from "./context";
import { Loader } from "./loader";

type LoaderProviderProps = {
  children: ReactNode;
};

export const LoaderProvider = ({ children }: LoaderProviderProps) => {
  const [visible, setVisible] = useState(false);
  const [description, setDescription] = useState<string>();

  const showLoader = useCallback((text?: string) => {
    setDescription(text);
    setVisible(true);
  }, []);

  const hideLoader = useCallback(() => {
    setVisible(false);
    setDescription(undefined);
  }, []);

  return (
    <LoaderContext.Provider value={{ showLoader, hideLoader }}>
      {children}
      <Loader visible={visible} description={description} />
    </LoaderContext.Provider>
  );
};

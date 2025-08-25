import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useCallback, useRef } from "react";

export const useBottomSheet = () => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const present = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);

  const dismiss = useCallback(() => {
    bottomSheetRef.current?.dismiss();
  }, []);

  const expand = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);

  const collapse = useCallback(() => {
    bottomSheetRef.current?.collapse();
  }, []);

  const close = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  const snapToIndex = useCallback((index: number) => {
    bottomSheetRef.current?.snapToIndex(index);
  }, []);

  const snapToPosition = useCallback((position: number) => {
    bottomSheetRef.current?.snapToPosition(position);
  }, []);

  return {
    bottomSheetRef,
    present,
    dismiss,
    expand,
    collapse,
    close,
    snapToIndex,
    snapToPosition,
  };
};

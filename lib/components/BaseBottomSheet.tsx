import {
  BottomSheetBackdropProps,
  BottomSheetBackgroundProps,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { ClassValue } from "clsx";
import { BlurView } from "expo-blur";
import React, { forwardRef, useCallback } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Custom backdrop component using Expo BlurView
const CustomBackdrop = React.memo((props: BottomSheetBackdropProps) => (
  <BlurView
    intensity={30}
    tint="dark"
    experimentalBlurMethod="dimezisBlurView"
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "transparent",
    }}
  />
));
CustomBackdrop.displayName = "CustomBackdrop";

// Custom background component
const CustomBackground = React.forwardRef<any, BottomSheetBackgroundProps>(
  (props, ref) => (
    <View
      {...props}
      ref={ref}
      style={{ flex: 1 }}
      className="bg-white dark:bg-gray-800 rounded-t-3xl shadow-lg"
    />
  )
);
CustomBackground.displayName = "CustomBackground";

// Custom handle component
const CustomHandle = React.forwardRef<any, any>((props, ref) => (
  <View
    {...props}
    ref={ref}
    className="w-full h-6 items-center justify-center rounded-t-3xl bg-white dark:bg-gray-800"
  >
    <View className="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-600 opacity-30" />
  </View>
));
CustomHandle.displayName = "CustomHandle";

export interface BaseBottomSheetProps {
  children: React.ReactNode;
  snapPoints?: (string | number)[];
  index?: number;
  onChange?: (index: number) => void;
  onDismiss?: () => void;
  enablePanDownToClose?: boolean;
  enableOverDrag?: boolean;
  enableHandlePanningGesture?: boolean;
  enableContentPanningGesture?: boolean;
  backdropComponent?: React.ComponentType<any>;
  handleComponent?: React.ComponentType<any>;
  backgroundComponent?: React.ComponentType<any>;
  footerComponent?: React.ComponentType<any>;
  keyboardBehavior?: "interactive" | "extend" | "fillParent";
  keyboardBlurBehavior?: "none" | "restore";
  android_keyboardInputMode?: "adjustResize" | "adjustPan";
  enableDynamicSizing?: boolean;
  animateOnMount?: boolean;
  containerStyle?: any;
  contentContainerStyle?: any;
  handleClassName?: ClassValue;
  handleIndicatorClassName?: ClassValue;
  backgroundClassName?: ClassValue;
  backdropClassName?: ClassValue;
}

const BaseBottomSheet = forwardRef<BottomSheetModal, BaseBottomSheetProps>(
  (
    {
      children,
      snapPoints = ["25%", "50%", "90%"],
      index = 0,
      onChange,
      onDismiss,
      enablePanDownToClose = true,
      enableOverDrag = true,
      enableHandlePanningGesture = true,
      enableContentPanningGesture = true,
      backdropComponent,
      handleComponent,
      backgroundComponent,
      footerComponent,
      keyboardBehavior = "interactive",
      keyboardBlurBehavior = "restore",
      android_keyboardInputMode = "adjustResize",
      enableDynamicSizing = false,
      animateOnMount = true,
      containerStyle,
      contentContainerStyle,
      handleClassName,
      handleIndicatorClassName,
      backgroundClassName,
      backdropClassName,
    },
    ref
  ) => {
    const bottomSheetRef = React.useRef<BottomSheetModal>(null);
    const insets = useSafeAreaInsets();

    React.useImperativeHandle(ref, () => bottomSheetRef.current!);

    const handleSheetChanges = useCallback(
      (index: number) => {
        onChange?.(index);
      },
      [onChange]
    );

    const handleSheetDismiss = useCallback(() => {
      onDismiss?.();
    }, [onDismiss]);

    return (
      <BottomSheetModal
        ref={bottomSheetRef}
        index={index}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        onDismiss={handleSheetDismiss}
        enablePanDownToClose={enablePanDownToClose}
        enableOverDrag={enableOverDrag}
        enableHandlePanningGesture={enableHandlePanningGesture}
        enableContentPanningGesture={enableContentPanningGesture}
        backdropComponent={backdropComponent || (CustomBackdrop as any)}
        handleComponent={handleComponent || (CustomHandle as any)}
        backgroundComponent={backgroundComponent || (CustomBackground as any)}
        footerComponent={footerComponent as any}
        keyboardBehavior={keyboardBehavior}
        keyboardBlurBehavior={keyboardBlurBehavior}
        android_keyboardInputMode={android_keyboardInputMode}
        enableDynamicSizing={enableDynamicSizing}
        animateOnMount={animateOnMount}
        containerStyle={containerStyle}
      >
        <BottomSheetView
          style={{
            flex: 1,
            height: "100%",
            paddingBottom: insets.bottom + 8,
          }}
          className="px-4 bg-white"
        >
          {children}
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

BaseBottomSheet.displayName = "BaseBottomSheet";

export default BaseBottomSheet;

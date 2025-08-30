import React from "react";
import { Switch, SwitchProps } from "react-native";

type CustomSwitchProps = SwitchProps;

const CustomSwitch: React.FC<CustomSwitchProps> = ({
  trackColor = { false: "#A5AEE1", true: "#454EB0" },
  thumbColor = "#f9fafb",
  ios_backgroundColor = "#A5AEE1",
  ...rest
}) => {
  return (
    <Switch
      trackColor={trackColor}
      thumbColor={thumbColor}
      ios_backgroundColor={ios_backgroundColor}
      {...rest}
    />
  );
};

export default CustomSwitch;

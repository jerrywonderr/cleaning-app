import { LucideIcon } from "lucide-react-native";
import {
  Button,
  ButtonGroup,
  ButtonIcon,
  ButtonSpinner,
  ButtonText,
} from "./ui/button";

interface CustomButtonProps extends React.ComponentProps<typeof Button> {
  children: React.ReactNode;
  isLoading?: boolean;
  icon?: LucideIcon;
  rightIcon?: LucideIcon;
  iconProps?: React.ComponentProps<typeof ButtonIcon>;
  rightIconProps?: React.ComponentProps<typeof ButtonIcon>;
}

export function PrimaryButton({
  children,
  icon,
  rightIcon,
  iconProps,
  rightIconProps,
  ...props
}: CustomButtonProps) {
  return (
    <ButtonGroup isDisabled={props.disabled ?? undefined}>
      <Button
        size={props.size ?? "lg"}
        className="h-14 rounded-lg bg-brand-500"
        {...props}
      >
        {icon && <ButtonIcon as={icon} {...iconProps} />}
        <ButtonText>{children}</ButtonText>
        {rightIcon && <ButtonIcon as={rightIcon} {...rightIconProps} />}
        {props.isLoading && <ButtonSpinner />}
      </Button>
    </ButtonGroup>
  );
}

export function SecondaryButton({ children, ...props }: CustomButtonProps) {
  return (
    <ButtonGroup isDisabled={props.disabled ?? undefined}>
      <Button
        size={props.size ?? "lg"}
        className="h-14 rounded-lg"
        action="secondary"
        {...props}
      >
        <ButtonText>{children}</ButtonText>
        {props.isLoading && <ButtonSpinner />}
        {props.icon && <ButtonIcon />}
        {props.rightIcon && <ButtonIcon />}
      </Button>
    </ButtonGroup>
  );
}

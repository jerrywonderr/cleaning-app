import { LucideIcon } from "lucide-react-native";
import {
  Button,
  ButtonGroup,
  ButtonIcon,
  ButtonSpinner,
  ButtonText,
} from "./ui/button";

interface CustomButtonProps extends React.ComponentProps<typeof Button> {
  children?: React.ReactNode;
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
        {children && <ButtonText>{children}</ButtonText>}
        {rightIcon && <ButtonIcon as={rightIcon} {...rightIconProps} />}
        {props.isLoading && <ButtonSpinner />}
      </Button>
    </ButtonGroup>
  );
}

export function PrimaryOutlineButton({
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
        className={`h-14 rounded-lg border-brand-500`}
        variant="outline"
        {...props}
      >
        {icon && (
          <ButtonIcon as={icon} className="text-brand-500" {...iconProps} />
        )}
        {children && (
          <ButtonText className="text-brand-500">{children}</ButtonText>
        )}
        {rightIcon && (
          <ButtonIcon
            as={rightIcon}
            className="text-brand-500"
            {...rightIconProps}
          />
        )}
        {props.isLoading && <ButtonSpinner className="text-brand-500" />}
      </Button>
    </ButtonGroup>
  );
}

export function SecondaryButton({
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
        className="h-14 rounded-lg"
        action="secondary"
        {...props}
      >
        {icon && <ButtonIcon as={icon} {...iconProps} />}
        {children && <ButtonText>{children}</ButtonText>}
        {rightIcon && <ButtonIcon as={rightIcon} {...rightIconProps} />}
        {props.isLoading && <ButtonSpinner />}
      </Button>
    </ButtonGroup>
  );
}

export function DangerButton({
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
        className="h-14 rounded-lg bg-red-600"
        action="negative"
        {...props}
      >
        {icon && <ButtonIcon as={icon} {...iconProps} />}
        {children && <ButtonText>{children}</ButtonText>}
        {rightIcon && <ButtonIcon as={rightIcon} {...rightIconProps} />}
        {props.isLoading && <ButtonSpinner />}
      </Button>
    </ButtonGroup>
  );
}

export function DangerOutlineButton({
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
        className="h-14 rounded-lg border-red-600"
        action="negative"
        variant="outline"
        {...props}
      >
        {icon && <ButtonIcon as={icon} {...iconProps} />}
        {children && (
          <ButtonText className="text-red-600">{children}</ButtonText>
        )}
        {rightIcon && <ButtonIcon as={rightIcon} {...rightIconProps} />}
        {props.isLoading && <ButtonSpinner />}
      </Button>
    </ButtonGroup>
  );
}

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
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function PrimaryButton({ children, ...props }: CustomButtonProps) {
  return (
    <ButtonGroup isDisabled={props.disabled ?? undefined}>
      <Button size={props.size ?? "lg"} className="h-14 rounded-lg" {...props}>
        <ButtonText>{children}</ButtonText>
        {props.isLoading && <ButtonSpinner />}
        {props.icon && <ButtonIcon />}
        {props.rightIcon && <ButtonIcon />}
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

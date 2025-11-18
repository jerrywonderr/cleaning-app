import { LinkProps, Link as RNLink } from "expo-router";
import { cn } from "../utils/style";
import { Link as GLink, LinkText } from "./ui/link";

export default function Link({
  children,
  textClassName,
  ...props
}: LinkProps & { textClassName?: string }) {
  return (
    <GLink>
      <RNLink asChild {...props}>
        <LinkText
          className={cn("font-inter-medium text-brand-600", textClassName)}
        >
          {children}
        </LinkText>
      </RNLink>
    </GLink>
  );
}

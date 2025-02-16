import { EmptyState as ChakraEmptyState, VStack } from "@chakra-ui/react";
import * as React from "react";
import { HiColorSwatch } from "react-icons/hi";

export interface EmptyStateProps extends ChakraEmptyState.RootProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  href?: string;
}

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  function EmptyState(props, ref) {
    const _icon = <HiColorSwatch />;
    const { title, description, icon = _icon, children, href, ...rest } = props;
    return (
      <ChakraEmptyState.Root ref={ref} {...rest}>
        <ChakraEmptyState.Content>
          {icon && <ChakraEmptyState.Indicator>{icon}</ChakraEmptyState.Indicator>}
          {description ? (
            <VStack textAlign="center">
              <ChakraEmptyState.Title>{title}</ChakraEmptyState.Title>
              <ChakraEmptyState.Description>{description}</ChakraEmptyState.Description>
            </VStack>
          ) : (
            <ChakraEmptyState.Title>{title}</ChakraEmptyState.Title>
          )}
          {children}
        </ChakraEmptyState.Content>
      </ChakraEmptyState.Root>
    );
  },
);

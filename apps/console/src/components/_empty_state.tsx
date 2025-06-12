import { ButtonProps, Button, SmartImage } from "@nuvix/ui/components";
import { Stack, Text } from "@chakra-ui/react";
import React from "react";

type EmptyStateProps = {
  show: boolean;
  title: string;
  description?: string;
  primaryComponent?: React.JSX.Element;
  primary?: ButtonProps;
  secondary?: ButtonProps;
  children?: React.ReactNode;
};

export const EmptyState = ({
  show,
  title,
  description,
  primary,
  secondary,
  primaryComponent,
  children,
}: EmptyStateProps) => {
  return (
    show && (
      <Stack
        width="full"
        height="sm"
        border="1px dashed"
        borderColor={"var(--neutral-alpha-medium)"}
        borderRadius="l3"
        direction="column"
        justifyContent="center"
        alignItems="center"
        className="neutral-background-alpha-weak"
        gap={4}
      >
        <SmartImage src="/images/empty-dark.svg" alt="Empty state" height={14} width={20.5} />
        <Stack gap={1} justifyContent="center" alignItems="center">
          <Text textStyle="xl" fontWeight="bold">
            {title}
          </Text>
          {description && (
            <Text textStyle="sm" color="text.subtle">
              {description}
            </Text>
          )}
        </Stack>
        {children}
        <Stack direction="row" gap={4}>
          {primaryComponent ? primaryComponent : primary && <Button size="s" {...primary} />}
          {secondary && <Button size="s" variant="secondary" {...secondary} />}
        </Stack>
      </Stack>
    )
  );
};

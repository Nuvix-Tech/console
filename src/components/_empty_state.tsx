import { ButtonProps, Button, SmartImage } from "@/ui/components";
import { Stack, Text } from "@chakra-ui/react";

type EmptyStateProps = {
  title: string;
  description?: string;
  primary?: ButtonProps;
  secondary?: ButtonProps;
};

export const EmptyState = ({ title, description, primary, secondary }: EmptyStateProps) => {
  return (
    <Stack
      width="full"
      height="md"
      border="1px dashed"
      borderColor="border.subtle"
      borderRadius="l2"
      direction="column"
      justifyContent="center"
      alignItems="center"
      gap={4}
    >
      <SmartImage src="/images/empty-dark.svg" alt="Empty state" height={15} width={20.5} />
      <Stack gap={2} justifyContent="center" alignItems="center">
        <Text textStyle="xl" fontWeight="bold">
          {title}
        </Text>
        {description && (
          <Text textStyle="sm" color="text.subtle">
            {description}
          </Text>
        )}
      </Stack>
      <Stack direction="row" gap={4}>
        {primary && <Button {...primary} />}
        {secondary && <Button variant="secondary" {...secondary} />}
      </Stack>
    </Stack>
  );
};

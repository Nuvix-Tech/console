import { ButtonProps, Button } from "@/ui/components";
import { Stack, Text } from "@chakra-ui/react";

type EmptyStateProps = {
  title: string;
  description?: string;
  primary?: ButtonProps;
  secondary?: ButtonProps;
};

export const EmptyState = ({ title, description, primary, secondary }: EmptyStateProps) => {
  return (
    <>
      <Stack>
        <Text>{title}</Text>
      </Stack>
    </>
  );
};

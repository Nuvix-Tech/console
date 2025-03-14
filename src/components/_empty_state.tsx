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
      <Stack
        width="full"
        height="md"
        border="1px dashed"
        borderColor="border.subtle"
        borderRadius="l2"
        direction="column"
        justifyContent={"center"}
        alignItems="center"
      >
        <Text textStyle="lg">{title}</Text>
      </Stack>
    </>
  );
};

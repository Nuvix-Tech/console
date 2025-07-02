import { Column, Row } from "@nuvix/ui/components";
import { Heading, Stack, Text } from "@chakra-ui/react";

type PageHeadingProps = {
  heading: string;
  description?: string;
  right?: React.ReactNode;
};

export const PageHeading = ({ heading, description, right }: PageHeadingProps) => {
  return (
    <Row marginBottom="24" fillWidth>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        gap={4}
        width="full"
      >
        <Column vertical="center" horizontal="start" maxWidth={"xs"}>
          <Heading size="2xl">{heading}</Heading>
          <Text fontSize="sm" color="var(--neutral-on-background-weak)">
            {description}
          </Text>
        </Column>
        {right}
      </Stack>
    </Row>
  );
};

import { Column, Row } from "@nuvix/ui/components";
import { Heading, Stack, Text } from "@chakra-ui/react";

type PageHeadingProps = {
  heading: string | React.ReactNode;
  description?: string | React.ReactNode;
  right?: React.ReactNode;
};

export const PageHeading = ({ heading, description, right }: PageHeadingProps) => {
  return (
    <Row marginBottom="20" marginTop="4" fillWidth>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        gap={4}
        width="full"
        paddingX={"2"}
        paddingBottom={"2"}
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

import { Background, Row } from "@/ui/components";
import { Stack } from "@chakra-ui/react";
import { PropsWithChildren } from "react";

interface Props {
  minHeight?: number;
}

const TopCard = ({ children, minHeight = 16 }: PropsWithChildren<Props>) => {
  return (
    <Row
      position="relative"
      minHeight={minHeight}
      background="neutral-alpha-weak"
      radius="l"
      padding="12"
      overflow="hidden"
    >
      <Background
        position="absolute"
        mask={{
          cursor: true,
          radius: 6,
        }}
        dots={{
          color: "brand-on-background-weak",
          display: true,
          opacity: 100,
          size: "16",
        }}
        grid={{
          color: "neutral-alpha-weak",
          display: true,
          height: "var(--static-space-16)",
          opacity: 100,
          width: "var(--static-space-16)",
        }}
      />
      <Stack width={"full"} direction={{ base: "column", lg: "row" }}>
        {children}
      </Stack>
    </Row>
  );
};

export default TopCard;

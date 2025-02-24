import { Background, Flex } from "@/ui/components";
import { Spinner } from "@chakra-ui/react";

export default function LoadingUI() {
  return (
    <>
      <Flex fill minHeight={16} position="relative">
        <Background
          position="absolute"
          mask={{
            cursor: true,
            x: 60,
            y: 90,
          }}
          gradient={{
            colorEnd: "accent-solid-strong",
            colorStart: "brand-alpha-weak",
            display: true,
            height: 70,
            opacity: 70,
            tilt: 89,
            width: 50,
            x: 30,
            y: 20,
          }}
          dots={{
            color: "accent-on-background-medium",
            display: true,
            opacity: 60,
            size: "48",
          }}
        />
        <Flex fill fillWidth horizontal="center" vertical="center" align="center">
          <Spinner size="xl" />
        </Flex>
      </Flex>
    </>
  );
}

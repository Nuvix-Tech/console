import { Background, Flex } from "@/ui/components";
import { Spinner } from "@chakra-ui/react";
import { BackgroundBeams } from "./ui/background-beams";

export default function LoadingUI() {
  return (
    <>
      <Flex fill minHeight={16} position="relative">
        <Flex fill position="absolute">
          <BackgroundBeams />
        </Flex>
        <Flex fill fillWidth horizontal="center" vertical="center" align="center">
          <Spinner size="xl" />
        </Flex>
      </Flex>
    </>
  );
}

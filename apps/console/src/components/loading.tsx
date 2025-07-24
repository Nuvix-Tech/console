import { Flex, Spinner } from "@nuvix/ui/components";

export default function LoadingUI() {
  return (
    <>
      <Flex fill horizontal="center" vertical="center" align="center">
        <Spinner size="xl" />
      </Flex>
    </>
  );
}

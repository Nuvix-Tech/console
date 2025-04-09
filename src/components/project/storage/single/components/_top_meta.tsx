import {
  ClipboardIconButton,
  ClipboardInput,
  ClipboardLabel,
  ClipboardRoot,
} from "@/components/cui/clipboard";
import { InputGroup } from "@/components/cui/input-group";
import { IDChip, TopCard } from "@/components/others";
import { formatBytes } from "@/lib";
import { useFileStore, useProjectStore } from "@/lib/store";
import { formatDate } from "@/lib/utils";
import { Button, Row, SmartImage } from "@/ui/components";
import { Stack, Text, VStack } from "@chakra-ui/react";
import { useParams } from "next/navigation";

export const TopMeta = () => {
  const file = useFileStore.use.file?.();
  const sdk = useProjectStore.use.sdk();
  const { bucketId } = useParams<{ bucketId: string }>();

  if (!file) return null;

  return (
    <>
      <TopCard>
        <Row
          fill
          background="neutral-alpha-weak"
          radius="l"
          padding="20"
          horizontal="space-between"
        >
          <Stack
            direction={{ base: "column", md: "row" }}
            gap={"2.5"}
            justifyContent={"space-between"}
            width={"full"}
            zIndex={1}
          >
            <VStack
              width={{ base: "full", md: "1/2" }}
              alignItems={"flex-start"}
              justifyContent={"space-between"}
            >
              <VStack alignSelf={"flex-start"} alignItems={"flex-start"} width={"full"}>
                <Text textStyle={{ base: "lg", mdOnly: "md" }} fontWeight={"semibold"} truncate>
                  {file.name}
                </Text>
                <SmartImage
                  src={sdk.storage.getFilePreview(bucketId, file.$id, 410, 250)}
                  alt={file.name}
                  width={120}
                />
              </VStack>
              <IDChip id={file.$id} />
            </VStack>
            <VStack width={{ base: "full", md: "1/2" }} alignItems={"flex-start"}>
              {[
                { size: formatBytes(file.sizeOriginal) },
                { Created: formatDate(file.$createdAt) },
                { "Updated At": formatDate(file.$updatedAt) },
              ]
                .filter(Boolean)
                .map((item, _) => (
                  <Text
                    key={_}
                    textStyle={{ base: "sm", mdOnly: "xs" }}
                    color={"fg.muted"}
                    truncate
                  >
                    {Object.entries(item).map(([key, value]) => (
                      <span key={key}>
                        <b>{key}</b>: {value}
                        <br />
                      </span>
                    ))}
                  </Text>
                ))}
              <ClipboardRoot
                value={sdk.storage.getFileView(bucketId, file.$id).toString() + "&mode=admin"}
              >
                <ClipboardLabel>File URL</ClipboardLabel>
                <InputGroup width="full" endElement={<ClipboardIconButton me="-2" />}>
                  <ClipboardInput />
                </InputGroup>
              </ClipboardRoot>
            </VStack>
          </Stack>
        </Row>
        <VStack
          width={{ base: "full", lg: "1/3" }}
          alignItems={"flex-end"}
          justifyContent={"space-between"}
          gap={4}
        >
          <Text textStyle={{ base: "sm", mdOnly: "xs" }} color={"fg.muted"} truncate>
            {file.mimeType}
          </Text>
          <Stack
            direction={{ base: "row", lg: "column" }}
            gap={"2"}
            alignItems={"flex-end"}
            width={"full"}
          >
            <Button
              variant="primary"
              fillWidth
              href={sdk.storage.getFileDownload(bucketId, file.$id).toString() + "&mode=admin"}
              target="_blank"
            >
              Download
            </Button>
          </Stack>
        </VStack>
      </TopCard>
    </>
  );
};

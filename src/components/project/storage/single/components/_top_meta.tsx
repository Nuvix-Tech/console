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
import { Button, Icon, Row, SmartImage } from "@/ui/components";
import { Stack, Text, VStack } from "@chakra-ui/react";
import { ExternalLinkIcon } from "lucide-react";
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
              <PreviewFile // 410, 250
                url={sdk.storage.getFilePreview(bucketId, file.$id).toString() + "&mode=admin"}
                name={file.name}
              />
              <IDChip id={file.$id} />
            </VStack>
            <VStack
              width={{ base: "full", md: "1/2" }}
              alignItems={"flex-start"}
              justifyContent={"space-between"}
            >
              <Text textStyle={{ base: "lg", mdOnly: "md" }} fontWeight={"semibold"} truncate>
                {file.name}
              </Text>
              <div className="w-full">
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
              </div>
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

const PreviewFile = ({
  url,
  name,
}: {
  url: string;
  name: string;
}) => {
  return (
    <Stack
      justifyContent={"center"}
      position={"relative"}
      overflow={"hidden"}
      width={"full"}
      height={{ base: "full", md: "154px" }}
      maxW={{ base: "full", md: "240px" }}
      className="group/preview"
    >
      <Stack
        position={"absolute"}
        width={"full"}
        height={"full"}
        background="var(--neutral-alpha-strong)"
        justifyContent={"center"}
        alignItems={"center"}
        cursor="pointer"
        css={{
          borderRadius: "var(--radius-l)",
        }}
        onClick={() => window.open(url, "_blank")}
        className="opacity-0 hover:opacity-100 group-hover/preview:opacity-100 group-hover/preview:transition-opacity group-hover/preview:duration-200"
        zIndex={1}
      >
        <Icon name={<ExternalLinkIcon />} />
      </Stack>
      <SmartImage src={url} alt={name} unoptimized fill radius="l" />
    </Stack>
  );
};

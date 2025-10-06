import { TopCard } from "@/components/others";
import { formatDate } from "@/lib/utils";
import { Stack, VStack, HStack } from "@chakra-ui/react";
import { Models } from "@nuvix/console";
import { ClipboardIconButton, ClipboardLabel, ClipboardRoot } from "@nuvix/cui/clipboard";
import { PasswordInput, Text, Tag } from "@nuvix/ui/components";

interface TopMetaProps {
  apiKey: Models.Key;
}

export const TopMeta = ({ apiKey }: TopMetaProps) => {
  const lastAccessed = apiKey.accessedAt ? formatDate(apiKey.accessedAt) : "Never";

  const createdAt = apiKey.$createdAt ? formatDate(apiKey.$createdAt) : undefined;

  const expiresAt = apiKey.expire ? formatDate(apiKey.expire) : "Never";

  return (
    <TopCard minHeight={10}>
      <Stack
        direction={{ base: "column", md: "row" }}
        gap={6}
        justify="space-between"
        align="flex-start"
        w="full"
        padding={"4"}
        zIndex={1}
      >
        {/* Left section: Metadata */}
        <VStack align="flex-start" justify="space-between" gap={3} w={{ base: "full", md: "50%" }}>
          <Text variant="heading-strong-m" truncate>
            {apiKey.name || "Unnamed API Key"}
          </Text>

          <div className="w-full space-y-1 flex flex-col">
            <Text variant="body-default-s" onBackground="neutral-medium">
              <b>Last Accessed:</b> {lastAccessed}
            </Text>
            {createdAt && (
              <Text variant="body-default-s" onBackground="neutral-medium">
                <b>Created:</b> {createdAt}
              </Text>
            )}
            {expiresAt && (
              <Text variant="body-default-s" onBackground="neutral-medium">
                <b>Expires:</b> {expiresAt}
              </Text>
            )}
          </div>

          {/* Optional Tags for Status */}
          <HStack gap={2} pt={1}>
            <Tag size="m" variant={apiKey.expire ? "neutral" : "warning"}>
              {apiKey.expire ? "Expiring" : "Never Expires"}
            </Tag>
            {apiKey.accessedAt && (
              <Tag size="m" variant="accent">
                Active
              </Tag>
            )}
          </HStack>
        </VStack>

        {/* Right section: Secret Key display */}
        <VStack align="flex-start" justify="space-between" w={{ base: "full", md: "50%" }} gap={3}>
          <ClipboardRoot value={apiKey.secret}>
            <ClipboardLabel>API Secret Key</ClipboardLabel>
            <PasswordInput
              value={apiKey.secret}
              labelAsPlaceholder
              height="s"
              readOnly
              hasPrefix={<ClipboardIconButton className="!-ml-2" />}
            />
          </ClipboardRoot>

          <Text variant="body-default-xs" marginTop={"1"} onBackground="neutral-weak">
            Keep this key secret. It provides full access to your project within the defined
            permission scopes.
          </Text>
        </VStack>
      </Stack>
    </TopCard>
  );
};

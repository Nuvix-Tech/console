import {
  CardBox,
  CardBoxBody,
  CardBoxDesc,
  CardBoxItem,
  CardBoxTitle,
} from "@/components/others/card";
import { ClipboardInput, ClipboardLabel, ClipboardRoot } from "@nuvix/cui/clipboard";
import { Button } from "@chakra-ui/react";
import { useRouter } from "@bprogress/next";
import React from "react";
import { LuExternalLink } from "react-icons/lu";
import { useProjectStore } from "@/lib/store";
import { Icon } from "@nuvix/ui/components";
import { getEnv } from "@/lib/env";

export const ProjectInfo: React.FC = () => {
  const project = useProjectStore.use.project?.();
  const { push } = useRouter();

  return (
    <>
      <CardBox>
        <CardBoxBody>
          <CardBoxItem gap={"4"}>
            <CardBoxTitle>API Credentials</CardBoxTitle>
            <CardBoxDesc>
              Use the API Endpoint and Project ID to access Nuvix services for this project.
            </CardBoxDesc>
            <Button
              variant="surface"
              alignSelf="flex-start"
              mt="auto"
              size={"xs"}
              onClick={() => push(`/project/${project?.$id}/s/keys`)}
            >
              API Keys
              <Icon name={LuExternalLink} size="xs" />
            </Button>
          </CardBoxItem>
          <CardBoxItem direction="column" gap="8">
            <ClipboardRoot value={project?.$id}>
              <ClipboardLabel>Project ID</ClipboardLabel>
              <ClipboardInput />
            </ClipboardRoot>

            <ClipboardRoot value={getEnv().API_ENDPOINT}>
              <ClipboardLabel>API Endpoint</ClipboardLabel>
              <ClipboardInput />
            </ClipboardRoot>
          </CardBoxItem>
        </CardBoxBody>
      </CardBox>
    </>
  );
};

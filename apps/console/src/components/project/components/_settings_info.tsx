import {
  CardBox,
  CardBoxBody,
  CardBoxDesc,
  CardBoxItem,
  CardBoxTitle,
} from "@/components/others/card";
import { ClipboardInput, ClipboardLabel, ClipboardRoot } from "@nuvix/cui/clipboard";
import { API_ENDPOINT } from "@/lib/constants";
import { Button } from "@chakra-ui/react";
import { useRouter } from "@bprogress/next";
import React from "react";
import { LuExternalLink } from "react-icons/lu";
import { useProjectStore } from "@/lib/store";
import { usePreference } from "@/hooks/usePreference";

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
              onClick={() => push(`/project/${project?.$id}/apis`)}
            >
              API Keys
              <LuExternalLink />
            </Button>
          </CardBoxItem>
          <CardBoxItem direction="column" gap="8">
            <ClipboardRoot value={project?.$id}>
              <ClipboardLabel>Project ID</ClipboardLabel>
              <ClipboardInput />
            </ClipboardRoot>

            <ClipboardRoot value={API_ENDPOINT}>
              <ClipboardLabel>API Endpoint</ClipboardLabel>
              <ClipboardInput />
            </ClipboardRoot>
          </CardBoxItem>
        </CardBoxBody>
      </CardBox>
    </>
  );
};

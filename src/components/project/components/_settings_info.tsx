import {
  CardBox,
  CardBoxBody,
  CardBoxDesc,
  CardBoxItem,
  CardBoxTitle,
} from "@/components/others/card";
import {
  ClipboardIconButton,
  ClipboardInput,
  ClipboardLabel,
  ClipboardRoot,
} from "@/components/cui/clipboard";
import { InputGroup } from "@/components/cui/input-group";
import { API_ENDPOINT } from "@/lib/constants";
import { getProjectState } from "@/state/project-state";
import { Button } from "@chakra-ui/react";
import { useRouter } from "@bprogress/next";
import React from "react";
import { LuExternalLink } from "react-icons/lu";

export const ProjectInfo: React.FC = () => {
  const { project } = getProjectState();
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
              onClick={() => push(`/console/project/${project?.$id}/apis`)}
            >
              API Keys
              <LuExternalLink />
            </Button>
          </CardBoxItem>
          <CardBoxItem direction="column" gap="8">
            <ClipboardRoot value={project?.$id}>
              <ClipboardLabel>Project ID</ClipboardLabel>
              <InputGroup width="full" endElement={<ClipboardIconButton me="-2" />}>
                <ClipboardInput />
              </InputGroup>
            </ClipboardRoot>

            <ClipboardRoot value={API_ENDPOINT}>
              <ClipboardLabel>API Endpoint</ClipboardLabel>
              <InputGroup width="full" endElement={<ClipboardIconButton me="-2" />}>
                <ClipboardInput />
              </InputGroup>
            </ClipboardRoot>
          </CardBoxItem>
        </CardBoxBody>
      </CardBox>
    </>
  );
};

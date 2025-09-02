import React from "react";
import {
  CardBox,
  CardBoxBody,
  CardBoxDesc,
  CardBoxItem,
  CardBoxTitle,
} from "@/components/others/card";
import { Line, Switch, useConfirm, useToast } from "@nuvix/ui/components";
import { sdkForConsole } from "@/lib/sdk";
import { ApiService } from "@nuvix/console";
import { Button, HStack, VStack } from "@chakra-ui/react";
import { useProjectStore } from "@/lib/store";

export const UpdateServices = () => {
  const [loading, setLoading] = React.useState<ApiService | false>(false);
  const [disabled, setDisabled] = React.useState(false);
  const project = useProjectStore.use.project?.();
  const refresh = useProjectStore.use.update?.();
  const { addToast } = useToast();
  const confirm = useConfirm();
  const { projects } = sdkForConsole;

  const switchWrapper = async (updater: () => Promise<any>, message: string) => {
    try {
      await updater();
      addToast({
        variant: "success",
        message: message,
      });
      await refresh();
    } catch (e: any) {
      addToast({
        variant: "danger",
        message: e.message,
      });
    } finally {
      setDisabled(false);
      setLoading(false);
    }
  };

  const renderSwitch = (
    label: string,
    service: ApiService,
    projectProperty: boolean | undefined,
  ) => (
    <Switch
      reverse
      label={label}
      loading={loading === service}
      disabled={disabled}
      isChecked={!!projectProperty}
      onToggle={() =>
        switchWrapper(async () => {
          setLoading(service);
          await projects.updateServiceStatus(project?.$id!, service, !projectProperty);
        }, `${label} service status updated.`)
      }
    />
  );

  const handleStatusAll = async (enable: boolean) => {
    if (
      await confirm({
        title: `${enable ? "Enable" : "Disable"} All Services`,
        description: `Are you sure you want to ${enable ? "enable" : "disable"} all services? This action will ${enable ? "enable" : "disable"} all services for the client API.`,
        confirm: {
          text: enable ? "Enable" : "Disable",
        },
      })
    ) {
      setDisabled(true);
      await switchWrapper(
        () => {
          return projects.updateServiceStatusAll(project?.$id!, enable);
        },
        `All services status ${enable ? "enabled" : "disabled"}.`,
      );
    }
  };

  return (
    <>
      <CardBox>
        <CardBoxBody>
          <CardBoxItem gap={"4"}>
            <CardBoxTitle>Services</CardBoxTitle>
            <CardBoxDesc>
              Choose the services to enable or disable for the client API. When disabled, these
              services will not be accessible to client SDKs but will remain accessible to server
              SDKs.
            </CardBoxDesc>
            <HStack alignSelf="flex-start" mt="auto" gap="6">
              <Button variant="ghost" disabled={disabled} onClick={() => handleStatusAll(true)}>
                Enable All
              </Button>
              <Line vert />
              <Button variant="ghost" disabled={disabled} onClick={() => handleStatusAll(false)}>
                Disable All
              </Button>
            </HStack>
          </CardBoxItem>
          <CardBoxItem direction="row" gap="8">
            <VStack justifyContent={"start"} alignItems="flex-start" flex="1" gap="3">
              {renderSwitch("Account", ApiService.Account, project?.serviceStatusForAccount)}
              {renderSwitch("Avatars", ApiService.Avatars, project?.serviceStatusForAvatars)}
              {renderSwitch("Databases", ApiService.Databases, project?.serviceStatusForDatabases)}
              {renderSwitch("Functions", ApiService.Functions, project?.serviceStatusForFunctions)}
              {renderSwitch("Health", ApiService.Health, project?.serviceStatusForHealth)}
            </VStack>
            <VStack justifyContent={"start"} alignItems="flex-start" flex="1" gap="3">
              {renderSwitch("Locale", ApiService.Locale, project?.serviceStatusForLocale)}
              {renderSwitch("Messaging", ApiService.Messaging, project?.serviceStatusForMessaging)}
              {renderSwitch("Storage", ApiService.Storage, project?.serviceStatusForStorage)}
              {renderSwitch("Teams", ApiService.Teams, project?.serviceStatusForTeams)}
              {renderSwitch("Users", ApiService.Users, project?.serviceStatusForUsers)}
            </VStack>
          </CardBoxItem>
        </CardBoxBody>
      </CardBox>
    </>
  );
};

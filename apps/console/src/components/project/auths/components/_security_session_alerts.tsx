import {
  CardBox,
  CardBoxBody,
  CardBoxDesc,
  CardBoxItem,
  CardBoxTitle,
} from "@/components/others/card";
import { sdkForConsole } from "@/lib/sdk";
import { useProjectStore } from "@/lib/store";
import { Switch, useToast } from "@nuvix/ui/components";
import React from "react";

export const SessionAlerts: React.FC = () => {
  const [loading, setLoading] = React.useState(false);
  const project = useProjectStore.use.project?.();
  const refresh = useProjectStore.use.update();
  const { projects } = sdkForConsole;
  const { addToast } = useToast();

  const onSubmit = async () => {
    if (loading) return;
    try {
      setLoading(true);
      await projects.updateSessionAlerts(project?.$id!, !project?.authSessionAlerts!);
      addToast({
        variant: "success",
        message: "Session alerts updated successfully.",
      });
      await refresh();
    } catch (e: any) {
      addToast({
        variant: "danger",
        message: e.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <CardBox>
        <CardBoxBody>
          <CardBoxItem gap={"4"}>
            <CardBoxTitle>Session alerts</CardBoxTitle>
          </CardBoxItem>
          <CardBoxItem>
            <Switch
              reverse
              label="Session alerts"
              isChecked={project?.authSessionAlerts!}
              loading={loading}
              onToggle={onSubmit}
            />
            <CardBoxDesc>
              Enabling this option will send an email to the users when a new session is created.
            </CardBoxDesc>
          </CardBoxItem>
        </CardBoxBody>
      </CardBox>
    </>
  );
};

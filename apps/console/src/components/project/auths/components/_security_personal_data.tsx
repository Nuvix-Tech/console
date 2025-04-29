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

export const PersonalData: React.FC = () => {
  const [loading, setLoading] = React.useState(false);
  const project = useProjectStore.use.project?.();
  const refresh = useProjectStore.use.update();
  const { projects } = sdkForConsole;
  const { addToast } = useToast();

  const onSubmit = async () => {
    if (loading) return;
    try {
      setLoading(true);
      await projects.updatePersonalDataCheck(project?.$id!, !project?.authPersonalDataCheck!);
      addToast({
        variant: "success",
        message: "Personal Data check updated successfully.",
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
            <CardBoxTitle>Personal Data</CardBoxTitle>
          </CardBoxItem>
          <CardBoxItem>
            <Switch
              reverse
              label="Disallow personal data"
              isChecked={project?.authPersonalDataCheck!}
              loading={loading}
              onToggle={onSubmit}
            />
            <CardBoxDesc>
              Do not allow passwords that contain any part of the user's personal data. This
              includes the user's name, email, or phone.
            </CardBoxDesc>
          </CardBoxItem>
        </CardBoxBody>
      </CardBox>
    </>
  );
};

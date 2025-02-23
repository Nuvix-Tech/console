import {
  CardBox,
  CardBoxBody,
  CardBoxDesc,
  CardBoxItem,
  CardBoxTitle,
} from "@/components/others/card";
import { sdkForConsole } from "@/lib/sdk";
import { getProjectState } from "@/state/project-state";
import { Switch, useToast } from "@/ui/components";
import React from "react";

export const PersonalData: React.FC = () => {
  const [loading, setLoading] = React.useState(false);
  const { project, _update } = getProjectState();
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
      await _update();
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
            <CardBoxDesc>
              Do not allow passwords that contain any part of the user's personal data. This
              includes the user's name, email, or phone.
            </CardBoxDesc>
          </CardBoxItem>
          <CardBoxItem>
            <Switch
              label="Disallow personal data"
              isChecked={project?.authPersonalDataCheck!}
              loading={loading}
              onToggle={onSubmit}
            />
          </CardBoxItem>
        </CardBoxBody>
      </CardBox>
    </>
  );
};

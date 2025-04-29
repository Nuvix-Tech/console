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
import { AuthMethod } from "@nuvix/console";
import React from "react";

export const AuthMethods: React.FC = () => {
  const [loading, setLoading] = React.useState<AuthMethod | null>(null);
  const project = useProjectStore.use.project?.();
  const refresh = useProjectStore.use.update();
  const { projects } = sdkForConsole;
  const { addToast } = useToast();

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
      setLoading(null);
    }
  };

  const renderSwitch = (
    label: string,
    authMethod: AuthMethod,
    projectProperty: boolean | undefined,
  ) => (
    <Switch
      reverse
      label={label}
      loading={loading === authMethod}
      isChecked={!!projectProperty}
      onToggle={() =>
        switchWrapper(async () => {
          setLoading(authMethod);
          await projects.updateAuthStatus(project?.$id!, authMethod, !projectProperty);
        }, `${label} status updated.`)
      }
    />
  );

  return (
    <>
      <CardBox>
        <CardBoxBody>
          <CardBoxItem gap={"4"}>
            <CardBoxTitle>Auth methods</CardBoxTitle>
            <CardBoxDesc>
              Enabling this option prevents users from setting insecure passwords by comparing the
              user's password with the 10k most commonly used passwords.
            </CardBoxDesc>
          </CardBoxItem>
          <CardBoxItem direction="column" gap="2">
            {renderSwitch("Email/Password", AuthMethod.Emailpassword, project?.authEmailPassword)}
            {renderSwitch("Anonymous", AuthMethod.Anonymous, project?.authAnonymous)}
            {renderSwitch("Phone", AuthMethod.Phone, project?.authPhone)}
            {renderSwitch("Email Otp", AuthMethod.Emailotp, project?.authEmailOtp)}
            {renderSwitch("Team Invites", AuthMethod.Invites, project?.authInvites)}
            {renderSwitch("Magic url", AuthMethod.Magicurl, project?.authUsersAuthMagicURL)}
            {renderSwitch("JWT", AuthMethod.Jwt, project?.authJWT)}
          </CardBoxItem>
        </CardBoxBody>
      </CardBox>
    </>
  );
};

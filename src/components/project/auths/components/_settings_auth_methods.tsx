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
import { AuthMethod } from "@nuvix/console";
import React from "react";

export const AuthMethods: React.FC = () => {
  const { project, _update } = getProjectState();
  const { projects } = sdkForConsole;
  const { addToast } = useToast();

  const switchWrapper = async (updater: () => Promise<any>, message: string) => {
    try {
      await updater();
      addToast({
        variant: "success",
        message: message,
      });
      await _update();
    } catch (e: any) {
      addToast({
        variant: "danger",
        message: e.message,
      });
    }
  };

  return (
    <>
      <CardBox>
        <CardBoxBody>
          <CardBoxItem gap={"4"}>
            <CardBoxTitle>Auth methods</CardBoxTitle>
            <CardBoxDesc>
              Enabling this option prevent users from setting insecure passwords by comparing the
              user's password with the 10k most commonly used passwords.
            </CardBoxDesc>
          </CardBoxItem>
          <CardBoxItem direction="column" gap="2">
            <Switch
              reverse
              label="Email/Password"
              isChecked={project?.authEmailPassword!}
              onToggle={() =>
                switchWrapper(
                  async () =>
                    await projects.updateAuthStatus(
                      project?.$id!,
                      AuthMethod.Emailpassword,
                      !project?.authEmailPassword!,
                    ),
                  "Email/Pasword status updated.",
                )
              }
            />
            <Switch
              reverse
              label="Anonymous"
              isChecked={project?.authAnonymous!}
              onToggle={() =>
                switchWrapper(
                  async () =>
                    await projects.updateAuthStatus(
                      project?.$id!,
                      AuthMethod.Anonymous,
                      !project?.authAnonymous!,
                    ),
                  "Anonymous status updated.",
                )
              }
            />
            <Switch
              reverse
              label="Phone"
              isChecked={project?.authPhone!}
              onToggle={() =>
                switchWrapper(
                  async () =>
                    await projects.updateAuthStatus(
                      project?.$id!,
                      AuthMethod.Phone,
                      !project?.authPhone!,
                    ),
                  "Phone status updated.",
                )
              }
            />
            <Switch
              reverse
              label="Email Otp"
              isChecked={project?.authEmailOtp!}
              onToggle={() =>
                switchWrapper(
                  async () =>
                    await projects.updateAuthStatus(
                      project?.$id!,
                      AuthMethod.Emailotp,
                      !project?.authEmailOtp!,
                    ),
                  "Email Otp status updated.",
                )
              }
            />{" "}
            <Switch
              reverse
              label="Team Invites"
              isChecked={project?.authInvites!}
              onToggle={() =>
                switchWrapper(
                  async () =>
                    await projects.updateAuthStatus(
                      project?.$id!,
                      AuthMethod.Invites,
                      !project?.authInvites!,
                    ),
                  "Team Invites status updated.",
                )
              }
            />
            <Switch
              reverse
              label="Magic url"
              isChecked={project?.authUsersAuthMagicURL!}
              onToggle={() =>
                switchWrapper(
                  async () =>
                    await projects.updateAuthStatus(
                      project?.$id!,
                      AuthMethod.Magicurl,
                      !project?.authUsersAuthMagicURL!,
                    ),
                  "Magic url status updated.",
                )
              }
            />
            <Switch
              reverse
              label="JWT"
              isChecked={project?.authJWT!}
              onToggle={() =>
                switchWrapper(
                  async () =>
                    await projects.updateAuthStatus(
                      project?.$id!,
                      AuthMethod.Jwt,
                      !project?.authJWT!,
                    ),
                  "JWT status updated.",
                )
              }
            />
          </CardBoxItem>
        </CardBoxBody>
      </CardBox>
    </>
  );
};

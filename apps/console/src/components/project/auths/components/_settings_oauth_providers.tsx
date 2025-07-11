import { useProjectStore } from "@/lib/store";
import { formatValues, oAuthProviders, Provider } from "./oauth-providers";
import { FormDialog, SubmitButton } from "@/components/others/forms";
import { useState } from "react";
import { Avatar, Column, Icon, Row, SmartLink, Text, useToast } from "@nuvix/ui/components";
import { useTheme } from "next-themes";
import { Status } from "@nuvix/cui/status";
import { CardBox, CardBoxTitle, CardBoxDesc } from "@/components/others/card";
import { sdkForConsole } from "@/lib/sdk";

export const AuthProviders = () => {
  const { resolvedTheme } = useTheme();

  return (
    <>
      <CardBox>
        <CardBoxTitle>OAuth2 Providers</CardBoxTitle>
        <CardBoxDesc>
          Seamlessly integrate secure user authentication across a variety of OAuth2 providers.
        </CardBoxDesc>

        <Column gap="8" marginTop="16">
          {Object.entries(oAuthProviders).map(([key, provider]) => {
            return (
              <ProviderCard
                key={key}
                _key={key}
                provider={provider}
                theme={resolvedTheme ?? "dark"}
              />
            );
          })}
        </Column>
      </CardBox>
    </>
  );
};

const ProviderCard = ({
  _key,
  provider,
  theme,
}: { provider: Provider; theme: string; _key: string }) => {
  const { project, setProject } = useProjectStore((s) => s);
  const [open, setOpen] = useState(false);
  const { addToast } = useToast();

  const Component = provider.component;
  const _provider = project.oAuthProviders.find((p) => p.key === _key);
  const is = _provider?.enabled;

  const title = (
    <Row gap="8" vertical="center">
      <Avatar src={`/icons/${theme}/color/${provider.icon}.svg`} className="size-10" />
      <Text variant="body-strong-s">{_provider?.name}</Text>
    </Row>
  );

  return (
    <>
      <Row
        horizontal="space-between"
        vertical="center"
        className="hover:bg-muted cursor-pointer"
        paddingX="16"
        paddingY="8"
        radius="l"
        onClick={() => setOpen(true)}
      >
        {title}
        <Row gap="8" vertical="center">
          <Status value={is ? "success" : "info"}>{is ? "enabled" : "disabled"}</Status>
          <Icon name="chevronRight" size="s" onBackground="neutral-medium" />
        </Row>
      </Row>

      {_provider && (
        <FormDialog
          dialog={{
            title,
            description: (
              <span>
                To use {_provider?.name} authentication in your application, first fill in this
                form. <br /> For more info you can{" "}
                <SmartLink selected href={provider.docs}>
                  visit the docs.
                </SmartLink>
              </span>
            ),
            isOpen: open,
            onClose: () => setOpen(false),
            footer: <SubmitButton label="Update" />,
          }}
          form={{
            ...formatValues(_provider!),
            onSubmit: async (_values) => {
              const values = formatValues(_provider).format(_values);
              try {
                let { enabled, appId, secret } = values;
                const res = await sdkForConsole.projects.updateOAuth2(
                  project.$id,
                  _provider.key as any,
                  appId,
                  secret,
                  enabled,
                );
                addToast({
                  message: `Settings for ${_provider.name} have been updated successfully.`,
                  variant: "success",
                });
                setProject(res);
                setOpen(false);
              } catch (error: any) {
                addToast({
                  message: error.message,
                  variant: "danger",
                });
              }
            },
          }}
        >
          <Column paddingY="12" fillWidth gap="16">
            <Component provider={_provider!} />
          </Column>
        </FormDialog>
      )}
    </>
  );
};

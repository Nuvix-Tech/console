import { useProjectStore } from "@/lib/store";
import { oAuthProviders, Provider } from "./oauth-providers";
import { FormDialog, SubmitButton } from "@/components/others/forms";
import { useState } from "react";
import { Avatar, Column, Icon, Row, SmartImage, SmartLink, Text } from "@nuvix/ui/components";
import { Models } from "@nuvix/console";
import { useTheme } from "next-themes";
import { Status } from "@nuvix/cui/status";
import { CardBox, CardBoxTitle, CardBoxDesc } from "@/components/others/card";

export const AuthProviders = () => {
  const { sdk, project } = useProjectStore((s) => s);
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
                project={project}
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
  project,
  theme,
}: { provider: Provider; project: Models.Project; theme: string; _key: string }) => {
  const [open, setOpen] = useState(false);

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

      <FormDialog
        dialog={{
          title,
          description: (
            <span>
              To use {_provider?.name} authentication in your application, first fill in this form.{" "}
              <br /> For more info you can{" "}
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
          // validationSchema: schema,
          initialValues: {
            ..._provider,
          },
          onSubmit: async (values) => {
            // try {
            //     let { id, email, phone, name, password } = values;
            //     id = id?.trim() || "unique()";
            //     const user = await sdk.users.create(id, email, phone, password, name);
            //     addToast({
            //         message: "User has been successfully created",
            //         variant: "success",
            //     });
            //     onClose();
            //     push(`${baseURL}/${user.$id}`);
            // } catch (error: any) {
            //     addToast({
            //         message: error.message,
            //         variant: "danger",
            //     });
            // }
          },
        }}
      >
        <Column paddingY="12" fillWidth gap="16">
          <Component provider={_provider!} />
        </Column>
      </FormDialog>
    </>
  );
};

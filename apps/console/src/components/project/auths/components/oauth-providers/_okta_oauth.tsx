import { InputSwitchField, InputField } from "@/components/others/forms";
import { Alert, AlertDescription } from "@nuvix/sui/components/alert";
import { Models } from "@nuvix/console";
import { Icon } from "@nuvix/ui/components";
import { ClipboardInput, ClipboardRoot } from "@nuvix/cui/clipboard";
import { useParams } from "next/navigation";
import { useProjectStore } from "@/lib/store";

export const Okta = ({ provider }: { provider: Models.AuthProvider }) => {
  const { id } = useParams<{ id: string }>();
  const { apiEndpoint } = useProjectStore((s) => s);

  return (
    <>
      <InputSwitchField name="enabled" label={"Enabled/Disabled"} reverse />
      <InputField name="appId" label="App ID" placeholder="Enter ID" />
      <InputField
        name="appSecret"
        type="password"
        label="App Secret"
        placeholder="Enter App Secret"
      />
      <Alert svgAsSpan>
        <Icon name="helpCircle" />
        <AlertDescription>
          To complete set up, add this OAuth2 redirect URI to your {provider.name} app
          configuration.
        </AlertDescription>
      </Alert>
      <ClipboardRoot
        value={`${apiEndpoint()}/account/sessions/oauth2/callback/${provider.key}/${id}`}
      >
        <ClipboardInput />
      </ClipboardRoot>
    </>
  );
};

import { InputSwitchField, InputField } from "@/components/others/forms";
import { Alert, AlertDescription } from "@nuvix/sui/components/alert";
import { Models } from "@nuvix/console";
import { Icon } from "@nuvix/ui/components";
import { ClipboardInput, ClipboardRoot } from "@nuvix/cui/clipboard";
import { useParams } from "next/navigation";
import { useProjectStore } from "@/lib/store";

export const Oidc = ({ provider }: { provider: Models.AuthProvider }) => {
  const { id } = useParams<{ id: string }>();
  const { apiEndpoint } = useProjectStore((s) => s);

  return (
    <>
      <InputSwitchField name="enabled" label={"Enabled/Disabled"} reverse />
      <InputField name="appId" label="Application (client) ID" placeholder="Enter ID" />
      <InputField
        name="secret"
        label="Client Secret"
        placeholder="Enter Client Secret"
        type="password"
      />
      <InputField
        name="well-known-endpoint"
        label="Well-Known Endpoint"
        placeholder="https://example.com/.well-known/openid-configuration"
      />
      <InputField
        name="authorization-endpoint"
        label="Authorization Endpoint"
        placeholder="https://example.com/authorize"
      />
      <InputField
        name="token-endpoint"
        label="Token Endpoint"
        placeholder="https://example.com/token"
      />
      <InputField
        name="userinfo-endpoint"
        label="User Info Endpoint"
        placeholder="https://example.com/userinfo"
      />
      <Alert svgAsSpan>
        <Icon name="helpCircle" />
        <AlertDescription>
          To complete set up, add this OAuth2 redirect URI to your {provider.name} app
          configuration.
        </AlertDescription>
      </Alert>
      <ClipboardRoot
        value={`${apiEndpoint()}/account/sessions/oauth2/callback/${provider?.key}/${id}`}
      >
        <ClipboardInput />
      </ClipboardRoot>
    </>
  );
};

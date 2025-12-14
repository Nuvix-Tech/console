import { Chip, Row, Text } from "@nuvix/ui/components";
import { useNavigate } from "react-router";
import { DOCS_URL } from "~/lib/constants";

export const CustomerIdentity = () => {
  const methods = {
    "email-password": "Email & Password",
    "phone-sms": "Phone (SMS)",
    "magic-url": "Magic Link",
    "email-otp": "Email OTP",
    oauth2: "OAuth2 Providers",
    jwt: "JWT",
    "server-side-rendering": "SSR Authentication",
    "custom-token": "Custom Tokens",
    anonymous: "Anonymous Login",
    mfa: "Multi-factor Authentication (MFA)",
  };

  return (
    <div className="w-full bg-(--warning-background-strong)">
      <div className="mx-auto p-4 py-20 flex flex-col items-center ">
        <Row gap={"8"} vertical="center">
          <Text variant="display-strong-xs">Authentication Built for Everyone</Text>
        </Row>

        <Text
          variant="body-default-m"
          onBackground="warning-medium"
          className="max-w-lg text-center"
        >
          From simple email login to enterprise SSO, give your users the authentication experience
          they expect. Secure, scalable, and ready to deploy in minutes.
        </Text>

        <div className="flex flex-wrap justify-center max-w-4xl mt-8 gap-4">
          {Object.entries(methods).map(([key, method]) => (
            <Chip
              key={key}
              selected={false}
              label={method}
              as={"span"}
              className="!text-(--warning-on-background-strong)"
              onClick={() => window.open(`${DOCS_URL}/products/auth/${key}`, "_blank")}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

import { Chip, Row, Text } from "@nuvix/ui/components";

export const CustomerIdentity = () => {
  return (
    <div className="mx-auto p-4 py-20 flex flex-col items-center">
      <Row gap={"8"} vertical="center">
        <Text variant="display-strong-xs">Customer Identity</Text>
      </Row>

      <Text variant="body-default-m" onBackground="neutral-weak" className="max-w-lg text-center">
        Deliver a seamless login experience with flexible authentication methods - secure, fast, and
        built for every use case.
      </Text>

      <div className="flex flex-wrap justify-center max-w-4xl mt-8 gap-4">
        {[
          "Email & Password",

          "Phone (SMS)",

          "Magic Link",

          "Email OTP",

          "OAuth2 Providers",

          "JWT",

          "SSR Authentication",

          "Custom Tokens",

          "Anonymous Login",

          "Multi-factor Authentication (MFA)",
        ].map((method) => (
          <Chip key={method} selected={false} label={method} as={"span"} />
        ))}
      </div>
    </div>
  );
};

import { Button, Chip, Column, Icon, IconButton, Row, Text } from "@nuvix/ui/components";
import type { Route } from "../+types/home";
import { DASHBOARD_URL, DOCS_URL } from "~/lib/constants";
import { CustomerIdentity } from "~/components/products/auth";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Auth - Nuvix" },
    {
      name: "description",
      content: "Nuvix Auth Service",
    },
  ];
}

export default function AuthPage() {
  return (
    <div className="flex flex-col gap-20">
      <div className="max-w-7xl mx-auto p-4 py-20 flex items-center">
        <Column gap="12" className="max-w-2xl">
          <Row gap={"8"} vertical="center">
            <IconButton icon="authentication" />
            <Text variant="label-strong-m">Authentication</Text>
          </Row>

          <Text variant="display-default-m" className="mt-4 mb-2">
            Secure and Scalable Authentication
          </Text>

          <Text variant="body-default-s" onBackground="neutral-weak" className="max-w-lg">
            A complete solution for user authentication, from registration to session management,
            all out of the box.
          </Text>

          <Row gap="12" marginTop="12">
            <Button variant="primary" size="s" href={DASHBOARD_URL} arrowIcon>
              Get Started
            </Button>
            <Button variant="secondary" size="s" href={`${DOCS_URL}/services/auth`}>
              Read Docs
            </Button>
          </Row>
        </Column>
        <div className="hidden lg:block flex-1">
          <img src="/images/services/phone.auth.png" alt="Auth Service" className="max-w-md" />
        </div>
      </div>

      <CustomerIdentity />
    </div>
  );
}

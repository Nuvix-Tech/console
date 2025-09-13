import { Button, Chip, Column, Icon, IconButton, Row, Text } from "@nuvix/ui/components";
import type { Route } from "../+types/home";
import { DASHBOARD_URL, DOCS_URL } from "~/lib/constants";

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
    <div className="max-w-7xl mx-auto p-4 py-20">
      <Column gap="12" className="max-w-2xl">
        <Row gap={"8"} vertical="center">
          <IconButton icon="authentication" />
          <Text variant="label-strong-m">Authentication</Text>
        </Row>

        <Text variant="display-default-m" className="mt-4 mb-2">
          Secure and Scalable Authentication
        </Text>

        <Text variant="body-default-s" onBackground="neutral-weak" className="max-w-lg">
          A complete solution for user authentication, from registration to session management, all
          out of the box.
          <br />
          <br />
          Key features include:
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>User Registration and Login</li>
            <li>Social OAuth Providers</li>
            <li>Multi-Factor Authentication (MFA)</li>
            <li>Password Recovery</li>
            <li>Session Management</li>
            <li>Role-Based Access Control (RBAC)</li>
          </ul>
        </Text>

        <Row gap="12" marginTop="12">
          <Button variant="primary" href={DASHBOARD_URL}>
            Get Started
          </Button>
          <Button variant="secondary" href={`${DOCS_URL}/services/auth`}>
            Read Docs
          </Button>
        </Row>
      </Column>
    </div>
  );
}

import { Background, Button, Column, IconButton, Row, Text } from "@nuvix/ui/components";
import type { Route } from "../+types/home";
import { DASHBOARD_URL, DOCS_URL } from "~/lib/constants";
import {
  AuthExample,
  CustomerIdentity,
  UserManagement,
  SecurityFeatures,
} from "~/components/products/auth";

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
    <section className="flex flex-col z-5 relative overflow-hidden bg-gradient-to-b from-transparent to-(--neutral-alpha-medium)">
      <Background
        dots={{
          display: true,
          size: "8",
          opacity: 20,
          color: "neutral-solid-medium",
        }}
        height={"xl"}
        position="absolute"
        fillWidth
        zIndex={-1}
      />
      <div className="max-w-7xl mx-auto p-4 py-14 flex items-center gap-12">
        <Column gap="8" className="max-w-2xl">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-200 bg-white/50 w-fit backdrop-blur-sm">
            <IconButton icon="authentication" size="s" variant="ghost" className="!p-0 size-4" />
            <Text variant="label-default-s" onBackground="neutral-strong">
              Authentication
            </Text>
          </div>

          <Text variant="display-default-l" className="mt-4 mb-2 tracking-tight">
            Secure and Scalable Authentication
          </Text>

          <Text
            variant="body-default-m"
            onBackground="neutral-medium"
            className="max-w-lg leading-relaxed"
          >
            A complete solution for user authentication, from registration to session management,
            all out of the box.
          </Text>

          <Row gap="12" marginTop="12">
            <Button variant="primary" size="m" href={DASHBOARD_URL} arrowIcon>
              Get Started
            </Button>
            <Button variant="secondary" size="m" href={`${DOCS_URL}/products/auth`}>
              Read Docs
            </Button>
          </Row>
        </Column>
        <div className="hidden lg:block flex-1 relative animation-float">
          <img
            src="/images/services/auth.png"
            alt="Auth Service"
            className="max-w-lg w-full drop-shadow-2xl"
          />
        </div>
      </div>

      <div data-theme="dark" className="w-full bg-(--neutral-background-medium)">
        <CustomerIdentity />
        <AuthExample />
      </div>
      <div className="w-full info-background-medium">
        <UserManagement />
        <SecurityFeatures />
      </div>
    </section>
  );
}

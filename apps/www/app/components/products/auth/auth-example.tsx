"use client";

import { useState } from "react";
import { Column, Row, Text, Chip } from "@nuvix/ui/components";
import { CodeBlock } from "@nuvix/ui/modules";
import { motion, AnimatePresence } from "motion/react";

type AuthMethod = {
  id: string;
  label: string;
  description: string;
  codeExamples: {
    code: string;
    language: string;
    label: string;
  }[];
};

const authMethods: AuthMethod[] = [
  {
    id: "email-password",
    label: "Email & Password",
    description: "Traditional email and password authentication with secure password hashing",
    codeExamples: [
      {
        label: "JavaScript",
        language: "javascript",
        code: `import { createClient } from '@nuvix/client';

const nuvix = createClient({
  endpoint: 'https://api.nuvix.app',
  projectId: 'your-project-id'
});

// Sign up with email and password
const { user, session } = await nuvix.auth.signUp({
  email: 'user@example.com',
  password: 'securePassword123!'
});

// Sign in
const { user, session } = await nuvix.auth.signIn({
  email: 'user@example.com',
  password: 'securePassword123!'
});`,
      },
      {
        label: "TypeScript",
        language: "typescript",
        code: `import { createClient } from '@nuvix/client';
import type { User, Session } from '@nuvix/types';

const nuvix = createClient({
  endpoint: 'https://api.nuvix.app',
  projectId: 'your-project-id'
});

// Sign up with email and password
const { user, session }: { user: User; session: Session } = 
  await nuvix.auth.signUp({
    email: 'user@example.com',
    password: 'securePassword123!'
  });

// Sign in
const { user, session }: { user: User; session: Session } = 
  await nuvix.auth.signIn({
    email: 'user@example.com',
    password: 'securePassword123!'
  });`,
      },
    ],
  },
  {
    id: "oauth",
    label: "OAuth Providers",
    description: "Seamless social authentication with Google, GitHub, and more",
    codeExamples: [
      {
        label: "JavaScript",
        language: "javascript",
        code: `import { createClient } from '@nuvix/client';

const nuvix = createClient({
  endpoint: 'https://api.nuvix.app',
  projectId: 'your-project-id'
});

// Sign in with Google
await nuvix.auth.signInWithOAuth({
  provider: 'google',
  redirectTo: 'https://yourapp.com/auth/callback'
});

// Sign in with GitHub
await nuvix.auth.signInWithOAuth({
  provider: 'github',
  redirectTo: 'https://yourapp.com/auth/callback'
});`,
      },
      {
        label: "React",
        language: "tsx",
        code: `import { createClient } from '@nuvix/client';

const nuvix = createClient({
  endpoint: 'https://api.nuvix.app',
  projectId: 'your-project-id'
});

function LoginPage() {
  const handleGoogleLogin = async () => {
    await nuvix.auth.signInWithOAuth({
      provider: 'google',
      redirectTo: window.location.origin + '/auth/callback'
    });
  };

  const handleGitHubLogin = async () => {
    await nuvix.auth.signInWithOAuth({
      provider: 'github',
      redirectTo: window.location.origin + '/auth/callback'
    });
  };

  return (
    <div>
      <button onClick={handleGoogleLogin}>
        Sign in with Google
      </button>
      <button onClick={handleGitHubLogin}>
        Sign in with GitHub
      </button>
    </div>
  );
}`,
      },
    ],
  },
  {
    id: "magic-link",
    label: "Magic Link",
    description: "Passwordless authentication via email magic links",
    codeExamples: [
      {
        label: "JavaScript",
        language: "javascript",
        code: `import { createClient } from '@nuvix/client';

const nuvix = createClient({
  endpoint: 'https://api.nuvix.app',
  projectId: 'your-project-id'
});

// Send magic link to user's email
await nuvix.auth.signInWithMagicLink({
  email: 'user@example.com',
  redirectTo: 'https://yourapp.com/auth/verify'
});

// User clicks the link in their email and gets authenticated
// Handle the callback on your redirect page
const { user, session } = await nuvix.auth.verifyMagicLink();`,
      },
      {
        label: "TypeScript",
        language: "typescript",
        code: `import { createClient } from '@nuvix/client';
import type { User, Session } from '@nuvix/types';

const nuvix = createClient({
  endpoint: 'https://api.nuvix.app',
  projectId: 'your-project-id'
});

// Send magic link to user's email
await nuvix.auth.signInWithMagicLink({
  email: 'user@example.com',
  redirectTo: 'https://yourapp.com/auth/verify'
});

// Handle the callback
const { user, session }: { user: User; session: Session } = 
  await nuvix.auth.verifyMagicLink();`,
      },
    ],
  },
  {
    id: "mfa",
    label: "Multi-Factor Auth",
    description: "Add an extra layer of security with TOTP-based MFA",
    codeExamples: [
      {
        label: "JavaScript",
        language: "javascript",
        code: `import { createClient } from '@nuvix/client';

const nuvix = createClient({
  endpoint: 'https://api.nuvix.app',
  projectId: 'your-project-id'
});

// Enable MFA for user
const { qrCode, secret } = await nuvix.auth.mfa.enroll({
  type: 'totp',
  friendlyName: 'My Authenticator'
});

// User scans QR code with authenticator app
// Verify with the code from authenticator
await nuvix.auth.mfa.verify({
  code: '123456'
});

// Sign in with MFA
const { user } = await nuvix.auth.signIn({
  email: 'user@example.com',
  password: 'password'
});

const { session } = await nuvix.auth.mfa.challenge({
  code: '123456'
});`,
      },
    ],
  },
];

export const AuthExample = () => {
  const [selectedMethod, setSelectedMethod] = useState<string>(authMethods[0].id);

  const currentMethod = authMethods.find((m) => m.id === selectedMethod) || authMethods[0];

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto p-4 pt-20 pb-20 flex flex-col lg:flex-row gap-12 lg:gap-24">
        {/* Left Column: Content & Navigation */}
        <div className="flex-1 flex flex-col gap-8 lg:py-8">
          <div className="flex flex-col gap-6">
            <Text variant="display-strong-xs" className="!text-(--neutral-on-background-strong)">
              Simple APIs, Powerful Authentication
            </Text>
            <Text variant="body-default-m" onBackground="neutral-medium">
              Get started in minutes with our intuitive SDK. Choose your preferred authentication
              method and integrate it seamlessly into your application.
            </Text>
          </div>

          <div className="flex flex-col gap-6">
            {/* Method Selector */}
            <div className="flex flex-wrap gap-3">
              {authMethods.map((method) => (
                <Chip
                  key={method.id}
                  label={method.label}
                  selected={selectedMethod === method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className="cursor-pointer !text-(--neutral-on-background-medium)"
                />
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={selectedMethod}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-6"
              >
                <Text variant="body-default-s" onBackground="neutral-medium">
                  {currentMethod.description}
                </Text>

                <div className="flex flex-wrap gap-2">
                  {getMethodFeatures(selectedMethod).map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-(--neutral-alpha-weak)"
                    >
                      <span className="text-xs text-(--neutral-on-background-medium)">✓</span>
                      <Text variant="body-default-xs" onBackground="neutral-medium">
                        {feature}
                      </Text>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Right Column: Code Block */}
        <div className="flex-1 w-full lg:max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedMethod}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <CodeBlock
                codeInstances={currentMethod.codeExamples}
                copyButton={true}
                compact={false}
                codeHeight={24}
                className=" h-full"
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

// Helper function to get features for each method
function getMethodFeatures(methodId: string): string[] {
  const features: Record<string, string[]> = {
    "email-password": [
      "Secure password hashing",
      "Password reset flows",
      "Email verification",
      "Rate limiting",
    ],
    oauth: [
      "20+ OAuth providers",
      "Automatic user linking",
      "Scope management",
      "Refresh token handling",
    ],
    "magic-link": [
      "Passwordless login",
      "Customizable emails",
      "Link expiration",
      "One-click authentication",
    ],
    mfa: [
      "TOTP support",
      "Backup codes",
      "Trusted devices",
      "Recovery options",
    ],
  };

  return features[methodId] || [];
}

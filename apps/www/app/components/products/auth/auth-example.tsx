"use client";

import { useState } from "react";
import { Column, Row, Text, Chip } from "@nuvix/ui/components";
import { CodeBlock } from "@nuvix/ui/modules";
import { motion, AnimatePresence } from "motion/react";
import { DOCS_URL } from "~/lib/constants";

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
        label: "TypeScript",
        language: "typescript",
        code: `import { Client, ID } from "@nuvix/client";
const nx = new Client()
    .setEndpoint('https://api.nuvix.in/v1')
    .setProject('<PROJECT_ID>');

try {
    const session = await nx.account.createEmailPasswordSession(
        'user@example.com',
        'secure-password'
    );
    console.log('Login successful:', session);
} catch (error) {
    console.error('Login failed:', error);
}
`,
      },
    ],
  },
  {
    id: "oauth",
    label: "OAuth Providers",
    description: "Seamless social authentication with Google, GitHub, and more",
    codeExamples: [
      {
        label: "TypeScript",
        language: "typescript",
        code: `import { Client } from "@nuvix/client";

const nx = new Client()
    .setEndpoint('https://api.nuvix.in/v1') // Your API Endpoint
    .setProject('<PROJECT_ID>');                 // Your project ID



// Go to OAuth provider login page
nx.account.createOAuth2Session({
    provider: 'github',
    success: 'https://example.com/success', // redirect here on success
    failure: 'https://example.com/failed', // redirect here on failure
    scopes: ['repo', 'user'] // scopes (optional)
});`,
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
        code: `import { Client, ID } from "@nuvix/client";

const nx = new Client()
    .setEndpoint('https://api.nuvix.in/v1')
    .setProject('<PROJECT_ID>');

// Create magic URL token
const token = await nx.account.createMagicURLToken(
    ID.unique(),                    // User ID
    'user@example.com',            // Email address
    'https://yourapp.com/verify'   // Redirect URL
);

// User will receive email with login link

// On your redirect page (https://yourapp.com/verify)
const urlParams = new URLSearchParams(window.location.search);
const secret = urlParams.get('secret');
const userId = urlParams.get('userId');

// Create session from magic link data
const session = await nx.account.createSession({
    userId: userId,
    secret: secret
});

// User is now authenticated - redirect to app
window.location.href = '/dashboard';
`,
      },
    ],
  },
  {
    id: "mfa",
    label: "Multi-Factor Auth",
    description: "Add an extra layer of security with TOTP-based MFA",
    codeExamples: [
      {
        label: "TypeScript",
        language: "typescript",
        code: `import { Client, ID, Avatars } from "@nuvix/client";

const nx = new Client()
    .setEndpoint('https://api.nuvix.in/v1')
    .setProject('<PROJECT_ID>');

async function handleMFA() {
    try {
        // 1. Generate and display recovery codes (do this before enabling MFA)
        console.log("--- Generating Recovery Codes ---");
        const recoveryCodesResponse = await nx.account.createMfaRecoveryCodes();
        console.log('Please save these recovery codes:', recoveryCodesResponse.recoveryCodes);
        // In a real application, securely display these to the user.

        // 2. Enable MFA (assuming factors like email/TOTP are already verified)
        console.log("\\n--- Enabling MFA ---");
        await nx.account.updateMFA({ enabled: true });
        console.log('MFA enabled successfully.');

        // 3. Simulate a login attempt that will require MFA
        console.log("\\n--- Attempting Login (will require MFA) ---");
        try {
            await nx.account.createEmailPasswordSession(
                'user@example.com',
                'secure-password'
            );
            console.log('Login successful without MFA (if no factors are set or enforced).');
        } catch (error: any) {
            if (error.type === 'user_more_factors_required') {
                console.error('Login requires MFA. Initiating MFA challenge flow.');

                // 4. List available MFA factors for the user
                const factors = await nx.account.listMfaFactors();
                console.log('Available MFA factors:', factors);

                // 5. Create an MFA Challenge (e.g., using email as a second factor)
                if (factors.email) {
                    console.log("\\n--- Creating Email MFA Challenge ---");
                    const challenge = await nx.account.createMfaChallenge({
                        factor: 'email'
                    });
                    console.log(\`Email MFA challenge created. Challenge ID: \${challenge.$id}\`);
                    // User would receive an email with an OTP.
                    // Prompt the user to enter the OTP.
                    const userOtp = '123456'; // Replace with actual OTP from user input

                    // 6. Complete the MFA Challenge
                    console.log("\\n--- Completing Email MFA Challenge ---");
                    await nx.account.updateMfaChallenge({
                        challengeId: challenge.$id,
                        otp: userOtp
                    });
                    console.log('MFA challenge completed. User is now fully authenticated.');
                } else {
                    console.warn('No email factor available for challenge. Check other factors like TOTP.');
                }
            } else {
                console.error('Login failed with other error:', error);
            }
        }
    } catch (error) {
        console.error('An error occurred during MFA process:', error);
    }
}

// Call the function to execute the MFA flow
handleMFA();
`,
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
                className="h-full"
                codeHeight={24}
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
    mfa: ["TOTP support", "Backup codes", "Trusted devices", "Recovery options"],
  };

  return features[methodId] || [];
}

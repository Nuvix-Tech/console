import React from "react";
import { Metadata } from "next";
import { Stack } from "@chakra-ui/react";
import { Text } from "@/ui/components";

export const metadata: Metadata = {
  title: "Create Organization",
  description: "Create a new organization",
};

export default function CreateOrganization() {
  const [orgName, setOrgName] = React.useState('');
  const [selectedPlan, setSelectedPlan] = React.useState('free');

  const plans = [
    { id: 'free', name: 'Free', price: '$0/month', features: ['Up to 3 users', '5 projects', 'Basic support'] },
    { id: 'pro', name: 'Professional', price: '$49/month', features: ['Up to 10 users', 'Unlimited projects', 'Priority support'] },
    { id: 'enterprise', name: 'Enterprise', price: '$99/month', features: ['Unlimited users', 'Advanced security', '24/7 support'] },
  ];

  return (
    <>
      <div className="p-6">
        <Text variant="heading-strong-m" marginBottom={'4'}>Create a new organization</Text>
        <Text color="gray.600" marginBottom={'8'}>
          Set up a new organization to collaborate with your team and manage projects efficiently.
        </Text>

        <Stack direction={{ base: "column", md: "row" }} gap={8} alignItems="flex-start">
          {/* Left side: Form */}
          <Stack width={{ base: "100%", md: "60%" }} gap={6}>
            {/* Organization name */}
            <Stack gap={3}>
              <Text size="m">Organization name</Text>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder="Enter organization name"
                className="w-full p-2 border rounded-md"
              />
            </Stack>

            {/* Plan selection */}
            <Stack gap={3}>
              <Text size="m">Select a plan</Text>
              <Stack gap={3}>
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`p-4 border rounded-md cursor-pointer ${selectedPlan === plan.id ? 'border-blue-500 bg-blue-50' : ''}`}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Text size="m">{plan.name}</Text>
                      <Text>{plan.price}</Text>
                    </Stack>
                    <Stack mt={2}>
                      {plan.features.map((feature, idx) => (
                        <Text key={idx} size="s" color="gray.600">• {feature}</Text>
                      ))}
                    </Stack>
                  </div>
                ))}
              </Stack>
            </Stack>

            {/* Payment method */}
            <Stack gap={3}>
              <Text size="m">Payment method</Text>
              <div className="p-4 border rounded-md">
                <Stack direction="row" gap={4}>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="card"
                      name="payment"
                      defaultChecked
                      className="mr-2"
                    />
                    <label htmlFor="card">Credit Card</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="paypal"
                      name="payment"
                      className="mr-2"
                    />
                    <label htmlFor="paypal">PayPal</label>
                  </div>
                </Stack>
              </div>
            </Stack>
          </Stack>

          {/* Right side: Summary */}
          <Stack
            width={{ base: "100%", md: "40%" }}
            p={6}
            bg="gray.50"
            borderRadius="md"
            gap={4}
          >
            <Text size="l">Summary</Text>

            <Stack gap={3}>
              <Stack direction="row" justifyContent="space-between">
                <Text>Organization</Text>
                <Text size="m">{orgName || 'Not specified'}</Text>
              </Stack>

              <Stack direction="row" justifyContent="space-between">
                <Text>Plan</Text>
                <Text size="m">
                  {plans.find(p => p.id === selectedPlan)?.name || 'Free'}
                </Text>
              </Stack>

              <Stack direction="row" justifyContent="space-between">
                <Text>Price</Text>
                <Text size="m">
                  {plans.find(p => p.id === selectedPlan)?.price || '$0/month'}
                </Text>
              </Stack>

              <hr />

              <Stack direction="row" justifyContent="space-between">
                <Text size="l">Total</Text>
                <Text size="l">
                  {plans.find(p => p.id === selectedPlan)?.price || '$0/month'}
                </Text>
              </Stack>
            </Stack>

            <button
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 mt-4"
              disabled={!orgName}
            >
              Create Organization
            </button>

            <Text size="xs" color="gray.500" >
              By creating an organization, you agree to our Terms of Service and Privacy Policy.
            </Text>
          </Stack>
        </Stack>
      </div>
    </>
  );
}

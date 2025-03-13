"use client";
import React, { useState, useEffect } from "react";
import { Button, Input, Select, SmartLink, Text, useToast } from "@/ui/components";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { BillingPlan, ID, PlansInfo } from "@nuvix/console";
import { sdkForConsole } from "@/lib/sdk";
import { useRouter } from "@bprogress/next";
import { ExternalLink } from "lucide-react";

export const CreateOrgPage = () => {
  const [orgName, setOrgName] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<string>("free");
  const [plansList, setPlansList] = useState<PlansInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { addToast } = useToast()
  const { replace } = useRouter()

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const plans = await sdkForConsole.billing.listPlans();
        setPlansList(plans);
      } catch (err) {
        setError("Failed to load plans. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const createOrg = async () => {
    setLoading(true);
    try {
      const plan = plansList?.plans.find((p) => p.$id === selectedPlan);
      if (!plan) {
        throw new Error("Invalid plan selected.");
      }

      let org = await sdkForConsole.organizations.create(
        ID.unique(),
        orgName,
        plan.$id as BillingPlan
      );
      addToast({
        variant: 'success',
        message: 'Organization created successfully.'
      })
      replace(`/organization/${org.$id}`)
    } catch (err) {
      addToast({
        variant: 'danger',
        message: 'Failed to create organization. Please try again.'
      })
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Create Organization</CardTitle>
            <CardDescription>
              Provide an organization name and pick a plan that suits your needs.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col space-y-6">
            <Input
              label="Organization Name"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              placeholder="Enter organization name"
              description="This will be the name of your organization."
            />
            <Select
              label="Select a Plan"
              value={selectedPlan}
              onSelect={(val) => setSelectedPlan(val)}
              options={[
                {
                  label: "Free Plan ($0/month)",
                  value: "tier-0",
                  description: "Basic features to get started.",
                },
                {
                  label: "Pro Plan ($10/month)",
                  value: "tier-1",
                  description: "Advanced features for growing teams.",
                },
                // {
                //   label: "Enterprise Plan (Contact us)",
                //   value: "enterprise",
                //   description: "Customized solutions at scale.",
                // },
              ]}
            />
            <SmartLink suffixIcon={<ExternalLink />} >
              Pricing
            </SmartLink>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button
              loading={loading}
              disabled={loading}
              onClick={createOrg}
            >
              Create Organization
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

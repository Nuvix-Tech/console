"use client";
import React, { useState, useEffect } from "react";
import { Button, Input, Select, SmartLink, Text, useToast } from "@nuvix/ui/components";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@nuvix/sui/components/card";
import { BillingPlan, ID, PlansInfo } from "@nuvix/console";
import { sdkForConsole } from "@/lib/sdk";
import { useRouter } from "@bprogress/next";
import { ExternalLink } from "lucide-react";

export const CreateOrgPage = () => {
  const [orgName, setOrgName] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<string>("tier-0");
  const [plansList, setPlansList] = useState<PlansInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { addToast } = useToast();
  const { replace } = useRouter();

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
      const plan = plansList?.plans?.find((p) => p.$id === selectedPlan);
      // if (!plan) {
      //   throw new Error("Invalid plan selected.");
      // }

      let org = await sdkForConsole.organizations.create(
        ID.unique(),
        orgName,
        (plan?.$id ?? "tier-0") as BillingPlan,
      );
      addToast({
        variant: "success",
        message: "Organization created successfully.",
      });
      replace(`/organization/${org.$id}`);
    } catch (err) {
      console.error(err);
      addToast({
        variant: "danger",
        message: "Failed to create organization. Please try again.",
      });
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center h-screen">
        <div className="max-w-xl w-full">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Create Organization</CardTitle>
              <CardDescription className="text-gray-500">
                Get started by creating a new organization.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Input
                  label="Organization Name"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  description="This will be the name of your organization."
                />
              </div>
              <div className="grid gap-2">
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
              </div>
              <p className="text-sm text-muted-foreground">
                Learn more about our
                <SmartLink href="/pricing" suffixIcon={<ExternalLink size={18} />}>
                  plans and pricing
                </SmartLink>
              </p>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button loading={loading} disabled={loading} onClick={createOrg}>
                Create Organization
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
};

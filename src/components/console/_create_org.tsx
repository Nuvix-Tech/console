"use client";
import React, { useState, useEffect } from "react";
import { Input, Select, Text } from "@/ui/components";
import { Spinner } from "@chakra-ui/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Models, Plan, PlansInfo } from "@nuvix/console";
import { sdkForConsole } from "@/lib/sdk";

export const CreateOrgPage = () => {
  const [orgName, setOrgName] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<string>("free");
  const [plansList, setPlansList] = useState<PlansInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <>
      <div>
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Create a new Organization</CardTitle>
            <CardDescription>Choose your organization name and a plan.</CardDescription>
            <CardContent className="flex flex-col space-y-6">
              <Input
                label="Organization Name"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
              />

              <Select
                options={[
                  {
                    label: "Free $0/month",
                    value: "",
                  },
                ]}
              />
            </CardContent>
            <CardFooter></CardFooter>
          </CardHeader>
        </Card>
      </div>
    </>
  );
};

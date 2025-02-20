"use client";

import { sdkForConsole } from "@/lib/sdk";
import { appState } from "@/state/app-state";
import { Row } from "@/ui/components";
import { Spinner } from "@chakra-ui/react";
import { Models } from "@nuvix/console";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const { user } = appState;
  const { organizations, account } = sdkForConsole;

  const { replace } = useRouter();

  useEffect(() => {
    async function fetchUser() {
      if (!user) return;
      let org: Models.Organization<any> | null = null;

      if (user?.prefs?.organization) {
        try {
          org = await organizations.get(user.prefs.organization);
        } catch (e: any) {
          // noop
        }
      }

      if (!org) {
        const orgs = await organizations.list();
        if (orgs.total === 0) {
          replace("/console/onboarding");
          return;
        }

        appState.user = await account.updatePrefs({
          ...user.prefs,
          organization: orgs.teams?.[0]?.$id,
        });
      }
      const scopes = await organizations.getScopes(org!.$id);
      appState.scopes = scopes;
      replace(`/console/organization/${org?.$id}`);
    }

    fetchUser();
  }, [user?.$id]);

  return (
    <Row fill center>
      <Spinner size={"xl"} />
    </Row>
  );
}

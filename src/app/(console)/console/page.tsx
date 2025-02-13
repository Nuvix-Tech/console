"use client";

import { sdkForConsole } from "@/lib/sdk";
import { appState } from "@/state/app-state";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const { user } = appState;
  const { organizations, account } = sdkForConsole;

  const { replace } = useRouter();

  useEffect(() => {
    async function fetchUser() {
      if (!user) return;

      if (user.prefs?.organization) {
        replace(`/console/organization/${user.prefs.organization}`);
        return;
      }

      const orgs = await organizations.list();
      if (orgs.total === 0) {
        replace("/console/onboarding");
        return;
      }

      appState.user = await account.updatePrefs({
        ...user.prefs,
        organization: orgs.teams[0].$id,
      });
    }

    fetchUser();
  }, [user?.$id]);

  return (
    <div>
      <h1>Console</h1>
      <p>This is the console page.</p>
    </div>
  );
}

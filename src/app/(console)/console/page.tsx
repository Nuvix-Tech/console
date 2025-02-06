"use client";

import { sdkForConsole } from "@/lib/sdk";
import { ConsoleContext } from "@/lib/store/console";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";

export default function Page() {
  const { data, dispatch } = useContext(ConsoleContext);
  const { organizations, account } = sdkForConsole;

  const { replace } = useRouter();

  useEffect(() => {
    async function fetchUser() {
      if (!data.user) return;

      if (data.user.prefs?.organization) {
        replace(`/console/organization/${data.user.prefs.organization}`);
        return;
      }

      const orgs = await organizations.list();
      if (orgs.total === 0) {
        replace("/console/onboarding");
        return;
      }

      await account.updatePrefs({
        ...data.user.prefs,
        organization: orgs.teams[0].$id,
      });
    }

    fetchUser();
  }, [data.user]);

  return (
    <div>
      <h1>Console</h1>
      <p>This is the console page.</p>
    </div>
  );
}

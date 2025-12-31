"use client";
import { sdkForConsole } from "@/lib/sdk";
import { Models } from "@nuvix/console";
import { useRouter } from "@bprogress/next";
import { useEffect, useState } from "react";
import { useApp } from "@/lib/store";
import LoadingUI from "@/components/loading";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { isPlatform } from "@/lib/constants";
import ErrorPage from "@/components/others/page-error";

export default function Page() {
  const { user, setUser, setScopes } = useApp((state) => state);
  const [_, setOrg] = useLocalStorage<string | null>("org", null);
  const { organizations, account } = sdkForConsole;
  const { replace } = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      if (!user) {
        setIsLoading(false);
        return;
      }

      if (!isPlatform) {
        return;
      }

      try {
        let org: Models.Organization<any> | null = null;

        if (user.prefs?.organization) {
          try {
            org = await organizations.get(user.prefs.organization);
          } catch (error) {
            console.warn("Failed to fetch organization:", error);
          }
        }

        if (!org) {
          const orgs = await organizations.list();
          if (orgs.total === 0) {
            replace("/create-organization");
            setIsLoading(false);
            return;
          } else {
            const updatedUser = await account.updatePrefs({
              ...user.prefs,
              organization: orgs.data?.[0]?.$id,
            });
            setUser(updatedUser);
            org = await organizations.get(updatedUser.prefs.organization);
          }
        }

        if (org) {
          setOrg(org.$id);
          if (isPlatform) {
            const scopes = await organizations.getScopes(org.$id);
            setScopes(scopes);
          }
          replace(`/organization/${org.$id}`);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("An error occurred while fetching user data.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchUser();
  }, [user]);

  if (isLoading) {
    return <LoadingUI />;
  }

  return error ? (
    <ErrorPage error={new Error(error)} reset={() => window.location.reload()} />
  ) : null;
}

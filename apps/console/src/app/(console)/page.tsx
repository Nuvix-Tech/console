"use client";
import { sdkForConsole } from "@/lib/sdk";
import { Row } from "@nuvix/ui/components";
import { Spinner } from "@chakra-ui/react";
import { Models } from "@nuvix/console";
import { useRouter } from "@bprogress/next";
import { useEffect } from "react";
import { useApp } from "@/lib/store";

export default function Page() {
  const { user, setUser, setScopes } = useApp((state) => state);
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
          replace("/create-organization");
          return;
        }

        setUser(
          await account.updatePrefs({
            ...user.prefs,
            organization: orgs.teams?.[0]?.$id,
          }),
        );
      }
      const scopes = await organizations.getScopes(org!.$id);
      setScopes(scopes);
      replace(`/organization/${org?.$id}`);
    }

    fetchUser();
  }, [user?.$id]);

  return (
    <Row fill center>
      <Spinner size={"xl"} />
    </Row>
  );
}

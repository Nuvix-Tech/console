"use client";

import { sdkForConsole } from "@/lib/sdk";
import { AvatarGroup, Button, Column, Heading, Row, SegmentedControl, Tag } from "@/ui/components";
import { ConsoleSidebar } from "@/ui/modules/layout/ConsoleSidebar";
import { Stack } from "@chakra-ui/react";
import type { Models } from "@nuvix/console";
import { useEffect, useState } from "react";

export default function OrgLayout({ children, id }: { children: React.ReactNode; id: string }) {
  const [organization, setOrganization] = useState<Models.Organization<any>>();
  const [memberships, setMemberships] = useState<Models.Membership[]>([]);
  const { organizations, avatars } = sdkForConsole;

  useEffect(() => {
    organizations.get(id).then((org) => {
      setOrganization(org);
    });

    organizations.listMemberships(id).then((memberships) => {
      setMemberships(memberships.memberships);
    });
  }, [id]);

  return (
    <>
      <Row fillHeight>
        <ConsoleSidebar />
        {/* <Column fillWidth padding="l" gap="l">
          <Row maxHeight={12} fillHeight background="neutral-alpha-weak" direction="column" horizontal="center" vertical="space-between" paddingTop="l">
            <Row fillWidth maxWidth={'l'} horizontal="space-between" vertical="center">
              <Row vertical="center" gap="s">
                <Heading size="xl" as={'h2'}>{organization?.name}</Heading>
                {organization?.billingPlan === 'tier-0' ? <Tag size="m" color="neutral">
                  Free
                </Tag> : null}
              </Row>
              <Row gap="s">
                <AvatarGroup avatars={memberships
                  .map((membership) => ({
                    src: avatars.getInitials(membership.userName),
                    name: membership.userName,
                  }))
                } />

                <Button prefixIcon="plus" >Invite</Button>
              </Row>
            </Row>

            <Row fillWidth maxWidth={'l'} horizontal="space-between" vertical="center">
              <SegmentedControl fitWidth buttons={[
                {
                  label: 'Projects',
                  value: 'projects',
                  variant: 'ghost',
                },
                {
                  label: 'Members',
                  value: 'members',
                  variant: 'ghost',

                },
                {
                  label: 'Usage',
                  value: 'usage',
                  variant: 'ghost',

                },
                {
                  label: 'Billing',
                  value: 'billing',
                  variant: 'ghost',

                },
                {
                  label: 'Settings',
                  value: 'settings',
                  variant: 'ghost',

                }
              ]} onToggle={() => { }} bottomRadius="xs" />
            </Row>
          </Row>
          </Column> */}
        <Row fillWidth paddingX="l" paddingY="s" gap="l" className="md:ml-64">
          {children}
        </Row>
      </Row>
    </>
  );
}

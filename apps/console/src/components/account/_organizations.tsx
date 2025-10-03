"use client";
import { Models, Query } from "@nuvix/console";
import React from "react";
import { DataGridProvider, GridCard, GridWrapper, Pagination, SelectLimit } from "@/ui/data-grid";
import { CreateButton, PageContainer, PageHeading } from "@/components/others";
import { useSearchQuery } from "@/hooks/useQuery";
import { EmptyState } from "@/components/_empty_state";
import { useSuspenseQuery } from "@tanstack/react-query";
import { HStack } from "@chakra-ui/react";
import { sdkForConsole } from "@/lib/sdk";
import { Row, Text, Button, Tag } from "@nuvix/ui/components";

export const OrganizationsPage = () => {
  const { limit, page, search, hasQuery } = useSearchQuery({ limit: 6 });

  const fetcher = async () => {
    const queries: string[] = [];
    queries.push(Query.limit(limit), Query.offset((page - 1) * limit));
    return await sdkForConsole.organizations.list();
  };

  const { data, isFetching } = useSuspenseQuery({
    queryKey: ["orgs", page, limit, search],
    queryFn: fetcher,
  });

  const create = (
    <CreateButton
      hasPermission={true}
      label="Create Org"
      component={() => (
        <Button size="s" variant="secondary" href="/create-organization">
          Create organization
        </Button>
      )}
    />
  );

  return (
    <PageContainer>
      <PageHeading heading="Organizations" right={create} />

      <DataGridProvider<Models.Organization<any>>
        columns={[]}
        data={data.data ?? []}
        manualPagination
        rowCount={data.total}
        loading={isFetching}
        state={{
          pagination: { pageIndex: page, pageSize: limit },
        }}
      >
        <EmptyState
          show={data.total === 0 && !isFetching && !hasQuery}
          title="No Organizations"
          description="No Organizations have been created yet."
          primaryComponent={create}
        />

        {(data.total > 0 || hasQuery) && (
          <>
            <GridWrapper>
              {data.data.map((team) => (
                <OrgCard org={team} key={team.name} />
              ))}
            </GridWrapper>
            <HStack justifyContent="space-between" alignItems="center">
              <SelectLimit />
              <Pagination />
            </HStack>
          </>
        )}
      </DataGridProvider>
    </PageContainer>
  );
};

const OrgCard = ({ org }: { org: Models.Organization<any> }) => {
  return (
    <GridCard key={org.$id} href={`/organization/${org.$id}`} minHeight={12}>
      <Text variant="label-default-s" onBackground="neutral-weak">
        {org.total} {org.total === 1 ? "member" : "members"}
      </Text>
      <Row gap="2" vertical="center" horizontal="space-between" fillWidth>
        <Text as={"h3"} variant="heading-strong-m">
          {org.name}
        </Text>
        <Tag variant="gradient">{org.billingPlan}</Tag>
      </Row>
    </GridCard>
  );
};

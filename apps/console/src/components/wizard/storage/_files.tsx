import { useQuery } from "@tanstack/react-query";
import { useBucketSelector } from "./_store";
import { useBucketStore, useProjectStore } from "@/lib/store";
import { Avatar, RadioButton, Row, Text } from "@nuvix/ui/components";
import { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Models } from "@nuvix/console";
import { formatBytes } from "@/lib";
import { formatDate } from "@/lib/utils";
import { Tooltip } from "@/components/cui/tooltip";
import { DataGridProvider, Search, Table } from "@/ui/data-grid";
import { EmptyState } from "@/components/_empty_state";
import { HStack } from "@chakra-ui/react";
import { CreateButton } from "@/components/others";
import { UploadFile } from "@/components/project/storage/single/components";

export const Files = () => {
  const { bucket, setLoading, file, setFile } = useBucketSelector((state) => state);
  const { sdk, permissions } = useProjectStore((state) => state);
  const { setBucket } = useBucketStore((state) => state);
  const [search, setSearch] = useState("");
  const { canCreateFiles } = permissions();

  const fetcher = async () => {
    return await sdk.storage.listFiles(bucket?.$id!, [], search);
  };

  const { data, isSuccess, isFetching, refetch } = useQuery({
    queryKey: ["files", bucket?.$id, search],
    queryFn: fetcher,
    enabled: !!bucket?.$id,
  });

  const columns: ColumnDef<Models.File>[] = [
    {
      header: "",
      accessorKey: "$id",
      size: 14,
      minSize: 14,
      cell({ row }) {
        return (
          <RadioButton
            isChecked={file?.$id === row.original.$id}
            onToggle={() => setFile(row.original)}
          />
        );
      },
    },
    {
      header: "Filename",
      accessorKey: "name",
      minSize: 280,
      cell(props) {
        const row = props.row.original;
        return (
          <Row gap="8" vertical="center">
            <Avatar
              src={
                sdk.storage.getFilePreview(bucket?.$id!, row.$id, 64, 64).toString() + "&mode=admin"
              }
              className="mr-2"
              unoptimized
            />
            <span>{row.name}</span>
          </Row>
        );
      },
    },
    {
      header: "Type",
      accessorKey: "mimeType",
      minSize: 250,
    },
    {
      header: "Size",
      accessorKey: "sizeOriginal",
      cell({ getValue }) {
        return formatBytes(getValue<number>());
      },
      minSize: 100,
    },
    {
      header: "Created At",
      accessorKey: "$createdAt",
      minSize: 200,
      cell(props) {
        const date = formatDate(props.getValue<string>());
        return (
          <Tooltip showArrow content={date}>
            <span>{date}</span>
          </Tooltip>
        );
      },
    },
  ];

  useEffect(() => {
    setLoading(false);
  }, [isSuccess]);

  useEffect(() => {
    setBucket(bucket);
  }, [bucket]);

  return (
    <>
      <div className="w-full py-2">
        <Text variant="label-strong-s">Files</Text>
        <div className="space-y-4 mt-2">
          <DataGridProvider<Models.File>
            columns={columns}
            data={data?.files ?? []}
            manualPagination
            rowCount={data?.total}
            loading={isFetching}
          >
            <EmptyState
              show={data?.total === 0 && !isFetching && !search}
              title="No Files"
              description="No files have been uploaded yet."
            />

            {((data?.total && data?.total > 0) || search) && (
              <>
                <HStack justifyContent="space-between" alignItems="center">
                  <Search
                    height="s"
                    placeholder="Search by file name"
                    onSearch={(v) => setSearch(v)}
                  />
                  <CreateButton
                    hasPermission={canCreateFiles}
                    label="Upload File"
                    component={UploadFile}
                    size="s"
                    extraProps={{ refetch }}
                  />
                </HStack>
                <Table noResults={data?.total === 0 && !!search} interactive={false} />
              </>
            )}
          </DataGridProvider>
        </div>
      </div>
    </>
  );
};

"use client";
import { useProjectStore } from "@/lib/store";
import React, { PropsWithChildren, useEffect } from "react";
import { useSchemaStore } from "@/lib/store/schema";
import { useSuspenseQuery } from "@tanstack/react-query";

const SchemaLayout: React.FC<PropsWithChildren<{ schemaId: string }>> = ({
  children,
  schemaId,
}) => {
  const setSchema = useSchemaStore.use.setSchema();
  const sdk = useProjectStore.use.sdk();
  const setRefetch = useSchemaStore.use.setRefetch();

  const fetcher = async () => {
    const schema = await sdk.schema.get(schemaId);
    return schema;
  };

  const { data, isPending } = useSuspenseQuery({
    queryKey: ["schema", schemaId],
    queryFn: fetcher,
  });

  useEffect(() => {
    if (data) {
      setSchema(data);
      setRefetch(async () => {
        const schema = await sdk.schema.get(schemaId);
        setSchema(schema);
      });
    }
  }, [data]);

  return <>{children}</>;
};

export { SchemaLayout };

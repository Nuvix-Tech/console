import {
  CardBox,
  CardBoxBody,
  CardBoxDesc,
  CardBoxItem,
  CardBoxTitle,
} from "@/components/others/card";
import { useDatabaseStore, useProjectStore } from "@/lib/store";
import { formatDate } from "@/lib/utils";
import React from "react";

export const TopMeta: React.FC = () => {
  const sdk = useProjectStore.use.sdk?.();
  const database = useDatabaseStore.use.database?.();

  if (!database || !sdk) return;

  return (
    <>
      <CardBox>
        <CardBoxBody>
          <CardBoxItem gap={"4"}>
            <CardBoxTitle>{database.name}</CardBoxTitle>
          </CardBoxItem>
          <CardBoxItem>
            <CardBoxDesc>Created: {formatDate(database.$createdAt)}</CardBoxDesc>
            <CardBoxDesc>Last updated: {formatDate(database.$updatedAt)}</CardBoxDesc>
          </CardBoxItem>
        </CardBoxBody>
      </CardBox>
    </>
  );
};

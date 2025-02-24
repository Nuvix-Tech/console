"use client";
import { documentPageState } from "@/state/page";
import { getProjectState } from "@/state/project-state";
import { notFound } from "next/navigation";
import React, { PropsWithChildren } from "react";

type Props = PropsWithChildren & {
  databaseId: string;
  collectionId: string;
  documentId: string;
};

export const DocumentLayout: React.FC<Props> = ({
  children,
  databaseId,
  collectionId,
  documentId,
}) => {
  const { sdk } = getProjectState();

  sdk?.databases
    .getDocument(databaseId, collectionId, documentId)
    .then((v) => (documentPageState.document = v))
    .catch(notFound);

  return <>{children}</>;
};

"use client";
import { ReactFlowProvider } from "@xyflow/react";
import { SchemaGraph } from "../schema/components/flow/_graph";

export const SchemaVisualizer = () => {
  return (
    <ReactFlowProvider>
      <SchemaGraph />
    </ReactFlowProvider>
  );
};

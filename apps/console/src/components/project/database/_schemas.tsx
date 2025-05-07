"use client";
import { ReactFlowProvider } from "reactflow";
import { SchemaGraph } from "../schema/components/flow/_graph";

export const SchemaVisualizer = () => {
  return (
    <ReactFlowProvider>
      <SchemaGraph />
    </ReactFlowProvider>
  );
};

import type { PostgresSchema } from "@nuvix/pg-meta";
// import { toPng, toSvg } from 'html-to-image'
import { Download, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  MiniMap,
  useReactFlow,
  Controls,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import SchemaSelector from "@/ui/SchemaSelector";
import { useSchemasQuery } from "@/data/database/schemas-query";
import { useTablesQuery } from "@/data/tables/tables-query";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useQuerySchemaState } from "@/hooks/useSchemaQueryState";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@nuvix/sui/components/dropdown-menu";
import { SchemaGraphLegend } from "./_graph_legend";
import { getGraphDataFromTables, getLayoutedElementsViaDagre } from "./_utils";
import { TableNode, TableNodeData } from "./_table_node";
import { useParams } from "next/navigation";
import { useProjectStore } from "@/lib/store";
import { LOCAL_STORAGE_KEYS } from "@/lib/constants";
import { Button, Column, IconButton } from "@nuvix/ui/components";
import { Skeleton } from "@nuvix/sui/components";
import { Node } from "@xyflow/react";

// [Joshen] Persisting logic: Only save positions to local storage WHEN a node is moved OR when explicitly clicked to reset layout

export const SchemaGraph = () => {
  const { id: ref } = useParams<{ id: string }>();
  const { project, sdk } = useProjectStore((state) => state);
  const { selectedSchema, setSelectedSchema } = useQuerySchemaState();

  const [isDownloading, setIsDownloading] = useState(false);

  const miniMapNodeColor = "var(--neutral-on-solid-medium)";
  const miniMapMaskColor = "var(--neutral-solid-medium)";

  const reactFlowInstance = useReactFlow<Node<TableNodeData>>();
  const nodeTypes = useMemo(
    () => ({
      table: TableNode,
    }),
    [],
  );

  const {
    data: schemas,
    error: errorSchemas,
    isSuccess: isSuccessSchemas,
    isLoading: isLoadingSchemas,
    isError: isErrorSchemas,
  } = useSchemasQuery({
    projectRef: project?.$id,
    sdk,
  });

  const {
    data: tables,
    error: errorTables,
    isSuccess: isSuccessTables,
    isLoading: isLoadingTables,
    isError: isErrorTables,
  } = useTablesQuery({
    projectRef: project?.$id,
    sdk,
    schema: selectedSchema,
    includeColumns: true,
  });

  const schema = (schemas ?? []).find((s) => s.name === selectedSchema);
  const [_, setStoredPositions] = useLocalStorage(
    LOCAL_STORAGE_KEYS.SCHEMA_VISUALIZER_POSITIONS(ref as string, schema?.id ?? 0),
    {},
  );

  const resetLayout = () => {
    const nodes = reactFlowInstance.getNodes(); // Corrected type to Node<TableNodeData>[]
    const edges = reactFlowInstance.getEdges();

    getLayoutedElementsViaDagre(nodes, edges);
    reactFlowInstance.setNodes(nodes);
    reactFlowInstance.setEdges(edges);
    setTimeout(() => reactFlowInstance.fitView({}));
    saveNodePositions();
  };

  const saveNodePositions = () => {
    if (schema === undefined) return console.error("Schema is required");

    const nodes = reactFlowInstance.getNodes();
    if (nodes.length > 0) {
      const nodesPositionData = nodes.reduce((a, b) => {
        return { ...a, [b.id]: b.position };
      }, {});
      setStoredPositions(nodesPositionData);
    }
  };

  const downloadImage = (format: "png" | "svg") => {
    const reactflowViewport = document.querySelector(".react-flow__viewport") as HTMLElement;
    if (!reactflowViewport) return;

    setIsDownloading(true);
    const width = reactflowViewport.clientWidth;
    const height = reactflowViewport.clientHeight;
    const { x, y, zoom } = reactFlowInstance.getViewport();

    // if (format === 'svg') {
    //     toSvg(reactflowViewport, {
    //         backgroundColor: 'white',
    //         width,
    //         height,
    //         style: {
    //             width: width.toString(),
    //             height: height.toString(),
    //             transform: `translate(${x}px, ${y}px) scale(${zoom})`,
    //         },
    //     })
    //         .then((data) => {
    //             const a = document.createElement('a')
    //             a.setAttribute('download', `supabase-schema-${ref}.svg`)
    //             a.setAttribute('href', data)
    //             a.click()
    //             toast.success('Successfully downloaded as SVG')
    //         })
    //         .catch((error) => {
    //             console.error('Failed to download:', error)
    //             toast.error('Failed to download current view:', error.message)
    //         })
    //         .finally(() => {
    //             setIsDownloading(false)
    //         })
    // } else if (format === 'png') {
    //     toPng(reactflowViewport, {
    //         backgroundColor: 'white',
    //         width,
    //         height,
    //         style: {
    //             width: width.toString(),
    //             height: height.toString(),
    //             transform: `translate(${x}px, ${y}px) scale(${zoom})`,
    //         },
    //     })
    //         .then((data) => {
    //             const a = document.createElement('a')
    //             a.setAttribute('download', `supabase-schema-${ref}.png`)
    //             a.setAttribute('href', data)
    //             a.click()
    //             toast.success('Successfully downloaded as PNG')
    //         })
    //         .catch((error) => {
    //             console.error('Failed to download:', error)
    //             toast.error('Failed to download current view:', error.message)
    //         })
    //         .finally(() => {
    //             setIsDownloading(false)
    //         })
    // }
  };

  useEffect(() => {
    if (isSuccessTables && isSuccessSchemas && tables.length > 0) {
      const schema = schemas.find((s) => s.name === selectedSchema) as PostgresSchema;
      getGraphDataFromTables(ref as string, schema, tables).then(({ nodes, edges }) => {
        reactFlowInstance.setNodes(nodes);
        reactFlowInstance.setEdges(edges);
        setTimeout(() => reactFlowInstance.fitView({})); // it needs to happen during next event tick
      });
    }
  }, [isSuccessTables, isSuccessSchemas, tables]);

  return (
    <Column
      fillHeight
      background="neutral-medium"
      border="neutral-medium"
      radius="l"
      overflow="hidden"
    >
      <div className="flex items-center justify-between py-2 px-4 border-b border-b-neutral-border-medium">
        {isLoadingSchemas && <Skeleton className="h-[34px] w-[260px]" />}

        {isErrorSchemas && (
          // <AlertError error={errorSchemas as any} subject="Failed to retrieve schemas" />
          <p className="text-sm text-muted-foreground">
            Failed to retrieve schemas: {errorSchemas?.message}
          </p>
        )}

        {isSuccessSchemas && (
          <>
            <SchemaSelector
              className="w-[180px]"
              size="s"
              showError={false}
              selectedSchemaName={selectedSchema}
              onSelectSchema={setSelectedSchema}
            />
            <div className="flex items-center gap-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <IconButton
                    size="m"
                    disabled={isDownloading}
                    icon={<Download size={14} />}
                    tooltip={"Download current view"}
                    tooltipPosition="bottom"
                    variant="secondary"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-32">
                  <DropdownMenuItem onClick={() => downloadImage("png")}>
                    Download as PNG
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => downloadImage("svg")}>
                    Download as SVG
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                onClick={resetLayout}
                tooltip={"Automatically arrange the layout of all nodes"}
                tooltipPosition="bottom"
                size="s"
                variant="secondary"
              >
                Auto layout
              </Button>
            </div>
          </>
        )}
      </div>
      {isLoadingTables && (
        <div className="w-full h-full flex items-center justify-center gap-x-2">
          <Loader2 className="animate-spin text-muted-foreground" size={16} />
          <p className="text-sm text-muted-foreground">Loading tables</p>
        </div>
      )}
      {isErrorTables && (
        <div className="w-full h-full flex items-center justify-center px-20">
          {/* <AlertError subject="Failed to retrieve tables" error={errorTables} /> */}
          <p className="text-sm text-muted-foreground">
            Failed to retrieve tables: {errorTables?.message}
          </p>
        </div>
      )}
      {isSuccessTables && (
        <>
          {tables.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              {/* <ProductEmptyState
                                title="No tables created yet"
                                ctaButtonLabel="Create a new table"
                                ctaUrl={`/project/${ref}/editor?create=table`}
                            >
                                <p className="text-sm text-foreground-light">
                                    There are no tables found in the schema "{selectedSchema}"
                                </p>
                            </ProductEmptyState> */}
              <p className="text-sm text-muted-foreground">
                There are no tables found in the schema "{selectedSchema}"
              </p>
            </div>
          ) : (
            <div className="w-full h-full page-background">
              <ReactFlow
                defaultNodes={[]}
                defaultEdges={[]}
                defaultEdgeOptions={{
                  type: "smoothstep",
                  animated: true,
                  deletable: false,
                  style: {
                    stroke: "var(--neutral-border-strong)",
                    strokeWidth: 0.7,
                  },
                }}
                nodeTypes={nodeTypes}
                fitView
                minZoom={0.8}
                maxZoom={1.8}
                proOptions={{ hideAttribution: true }}
                onNodeDragStop={() => saveNodePositions()}
              >
                <Controls className="!bg-[var(--neutral-background-medium)]" />
                <Background
                  gap={16}
                  className="[&>*]:stroke-muted-foreground opacity-10"
                  variant={BackgroundVariant.Dots}
                  color={"inherit"}
                />
                <MiniMap
                  pannable
                  zoomable
                  nodeColor={miniMapNodeColor}
                  maskColor={miniMapMaskColor}
                  nodeBorderRadius={10}
                  className="border border-[var(--neutral-solid-strong)] !rounded-md overflow-hidden"
                />
              </ReactFlow>
            </div>
          )}
        </>
      )}
      <SchemaGraphLegend />
    </Column>
  );
};

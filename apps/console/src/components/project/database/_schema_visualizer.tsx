import { useEffect, useRef, useState } from "react";
import { Edge, Node, ReactFlowProvider } from "reactflow";
import { getGraphDataFromTables, SchemaFlow, TableNodeData } from "../schema/components/flow";

import pgMeta from "@nuvix/pg-meta";
import { useGetTables } from "@/data/tables/tables-query";
import { useProjectStore } from "@/lib/store";
import { executeSql } from "@/data/sql/execute-sql-query";
// import { SchemaFlow } from 'components/interfaces/ProjectCreation/SchemaFlow'
// import { getGraphDataFromTables } from '../Database/Schemas/Schemas.utils'
// import { TableNodeData } from '../Database/Schemas/SchemaTableNode'

export const TABLE_NODE_WIDTH = 640;
export const TABLE_NODE_ROW_HEIGHT = 80;

interface SchemaVisualizerProps {
  sqlStatements: string[];
  className?: string;
}

export const SchemaVisualizer = ({ sqlStatements, className }: SchemaVisualizerProps) => {
  const [nodes, setNodes] = useState<Node<TableNodeData>[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const { project, sdk } = useProjectStore((data) => data);
  // const db = useRef<PGlite>()
  // const executedStatements = useRef<Set<string>>(new Set())

  // // Initialize database once
  // useEffect(() => {
  //     db.current = new PGlite()

  //     // Execute initial auth schema setup
  //     db.current.exec(AUTH_SCHEMA_SQL)
  // }, [])

  const getTables = useGetTables({ projectRef: project?.$id, sdk });

  // Execute new SQL statements and update schema
  useEffect(() => {
    const updateSchema = async () => {
      //   if (!db.current) return

      //   // Reset if statements is empty
      //   if (sqlStatements.length === 0) {
      //     setNodes([])
      //     setEdges([])
      //     if (executedStatements.current.size) {
      //       executedStatements.current.clear()
      //       // Reset database
      //       db.current = new PGlite()
      //       // Re-run initial auth schema setup
      //       db.current.exec(AUTH_SCHEMA_SQL)
      //     }
      //     return
      //   }

      //   // Execute only new statements
      //   const newStatements = sqlStatements.filter((sql) => !executedStatements.current.has(sql))

      //   if (newStatements.length === 0) return

      try {
        // for (const sql of newStatements) {
        //   await db.current.exec(sql)
        //   executedStatements.current.add(sql)
        // }

        // const pgMeta = new PostgresMetaBase({
        //   query: async (sql: string) => {
        //     try {
        //       const res = await db.current?.query(sql)
        //       if (!res) throw new Error('No response from database')
        //       return wrapResult<any[]>(res.rows)
        //     } catch (error) {
        //       console.error('Query failed:', error)
        //       return wrapError(error, sql)
        //     }
        //   },
        //   end: async () => {},
        // })

        const { sql } = pgMeta.tables.list({
          includedSchemas: ["public"],
          includeColumns: true,
        });

        const { result: tables } = await executeSql({
          projectRef: project?.$id,
          sql,
          sdk,
        });

        // if (result.error) {
        //     console.error('Failed to get tables:', result.error)
        //     return
        // }

        if (tables) {
          const { nodes, edges } = await getGraphDataFromTables(
            "onboarding",
            { id: 1, name: "public", owner: "admin" },
            tables,
          );
          setNodes(nodes);
          setEdges(edges);
        }
      } catch (error) {
        console.error("Failed to execute SQL:", error);
      }
    };

    updateSchema();
  }, [sqlStatements, getTables, sdk, project?.$id]);

  return (
    <div className={className}>
      <ReactFlowProvider>
        <SchemaFlow nodes={nodes} edges={edges} />
      </ReactFlowProvider>
    </div>
  );
};

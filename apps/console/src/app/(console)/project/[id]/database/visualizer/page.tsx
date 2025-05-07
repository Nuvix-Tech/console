import { SchemaVisualizer } from "@/components/project/database";

export const metadata = {
  title: "Database Visualizer",
  description: "Visualize your database schema",
};

export default function DatabaseVisualizer() {
  return <SchemaVisualizer />;
}

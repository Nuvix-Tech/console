import "react-data-grid/lib/styles.css";
import { TableEditor } from "@/components/editor";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Table Editor",
};

export default function () {
  return <TableEditor />;
}

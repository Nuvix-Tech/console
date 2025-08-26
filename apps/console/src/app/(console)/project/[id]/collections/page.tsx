import { EmptyCollectionEditor } from "@/components/project/collection-editor";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Collection Editor",
};

export default function () {
  return <EmptyCollectionEditor />;
}

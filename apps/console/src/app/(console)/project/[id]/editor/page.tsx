import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Table Editor",
};

export default function () {
  return (
    <div className="flex size-full justify-center items-center">
      Please select a table from the sidebar to edit.
    </div>
  );
}

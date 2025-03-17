import { LayoutSkelton } from "@/components/skeletons";
import React, { Suspense } from "react";

export default function Template({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<LayoutSkelton />}>{children}</Suspense>
}
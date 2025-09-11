import { PlatformPage } from "@/components/project/settings/platforms/single/_page";
import type { PropsWithParams } from "@/types";

export default async function ({ params }: PropsWithParams<{ platformId: string }>) {
  const { platformId } = await params;
  return <PlatformPage platformId={platformId} />;
}

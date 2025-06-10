import { ProvidersSinglePage } from "@/components/project/messaging/providers/single";
import { PropsWithParams } from "@/types";

export default async function ({ params }: PropsWithParams<{ providerId: string }>) {
  const { providerId } = await params;

  return <ProvidersSinglePage providerId={providerId} />;
}

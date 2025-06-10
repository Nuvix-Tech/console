import { DangerCard } from "@/components/others/danger-card";
import { formatDate } from "@/lib/utils";
import { useConfirm, useToast } from "@nuvix/ui/components";
import { Button, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "@bprogress/next";
import { useState } from "react";
import { useProjectStore } from "@/lib/store";
import { useProviderStore } from "./store";

export const DeleteProvider = () => {
    const project = useProjectStore.use.project?.();
    const sdk = useProjectStore.use.sdk?.();
    const provider = useProviderStore.use.provider?.();

    const [loading, setLoading] = useState(false);
    const { addToast } = useToast();
    const { replace } = useRouter();
    const confirm = useConfirm();

    if (!provider || !sdk) return;

    const deleteProvider = async (id: string) => {
        if (
            await confirm({
                title: "Delete Provider",
                description: "Are you sure you want to delete this provider?",
                confirm: {
                    text: "Delete",
                    variant: "danger",
                },
            })
        ) {
            try {
                setLoading(true);
                await sdk.messaging.deleteProvider(id);
                addToast({
                    variant: "success",
                    message: "Provider deleted successfully",
                });
                replace(`/project/${project?.$id}/messaging/providers`);
            } catch (e: any) {
                addToast({
                    variant: "danger",
                    message: e.message,
                });
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <DangerCard
            title="Delete Provider"
            description="The provider will be permanently deleted. This action is irreversible."
            actions={
                <Button
                    variant={"surface"}
                    colorPalette="red"
                    loading={loading}
                    onClick={() => deleteProvider(provider?.$id)}
                    loadingText={"Deleting..."}
                >
                    Delete
                </Button>
            }
        >
            <VStack alignItems={"flex-start"} gap={0.2}>
                <Text textStyle="md" fontWeight="semibold">
                    {provider.name}
                </Text>
                <Text textStyle={{ base: "sm", mdOnly: "xs" }} color={"fg.muted"} truncate>
                    Last Updated: {formatDate(provider.$updatedAt)}
                </Text>
            </VStack>
        </DangerCard>
    );
};

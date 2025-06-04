import { Button } from "@nuvix/sui/components";
import { Card, IconButton, Text } from "@nuvix/ui/components";
import React, { useState, useMemo } from "react";
import { Topics } from "./_topics";
import { LuPlus, LuX } from "react-icons/lu";
import { useProjectStore } from "@/lib/store";
import { DialogRoot } from "@/components/cui/dialog";
import { Models, MessagingProviderType } from "@nuvix/console";
import { ProjectSdk } from "@/lib/sdk";

export const TopicsSelector = ({ type }: { type: MessagingProviderType, values: string[], onSave: (values: string[]) => void }) => {
    const { sdk } = useProjectStore((state) => state);
    const groups = new Map<string, Models.Topic>();
    const [topicsById, setTopicsById] = useState<Record<string, Models.Topic>>({});

    const hasTopics = useMemo(() => Object.keys(topicsById).length > 0, [topicsById]);

    const addTopics = (newTopics: Record<string, Models.Topic>) => {
        setTopicsById(newTopics);
    };

    const removeTopic = (targetId: string) => {
        const { [targetId]: _, ...rest } = topicsById;
        setTopicsById(rest);
    };

    const getTotal = (topic: Models.Topic): number => {
        switch (type) {
            case MessagingProviderType.Email:
                return topic.emailTotal;
            case MessagingProviderType.Sms:
                return topic.smsTotal;
            case MessagingProviderType.Push:
                return topic.pushTotal;
            default:
                return 0;
        }
    };

    if (!hasTopics) {
        return (
            <Card
                title="Topics & Topics"
                minHeight="160"
                radius="l-4"
                center
                fillWidth
                direction="column"
                gap="12"
            >
                <WithDialog
                    type={type}
                    onAddTopics={addTopics}
                    sdk={sdk}
                    groups={groups}
                    trigger={IconButton}
                    args={{
                        children: <LuPlus />,
                    }}
                />
                <Text variant="body-default-s" onBackground="neutral-medium">
                    Select topics to get started
                </Text>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            <div className="border rounded-lg">
                <table className="w-full">
                    <thead>
                        <tr className="border-b">
                            <th className="text-left p-3">Topics</th>
                            <th className="w-10 pr-2">
                                <WithDialog
                                    type={type}
                                    onAddTopics={addTopics}
                                    sdk={sdk}
                                    groups={groups}
                                    trigger={Button}
                                    args={{
                                        children: (
                                            <>
                                                <LuPlus /> Add
                                            </>
                                        ),
                                        size: "sm",
                                    }}
                                />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(topicsById).map(([targetId, target]) => (
                            <tr key={targetId} className="border-b">
                                <td className="p-3">{target.name}</td>
                                <td className="p-3">
                                    <div className="flex justify-end">
                                        <button
                                            type="button"
                                            onClick={() => removeTopic(targetId)}
                                            className="text-gray-500 hover:text-red-500"
                                        >
                                            <LuX size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export const WithDialog = ({
    type,
    onAddTopics,
    sdk,
    groups,
    trigger: Trigger,
    args,
}: DialogBoxProps) => {
    const [open, setOpen] = useState(false);

    const handleRoleClick = () => {
        setOpen(true);
    };

    return (
        <div className="relative">
            <Trigger variant="secondary" onClick={handleRoleClick} size="m" {...args} />

            <DialogRoot
                open={open}
                onOpenChange={({ open }) => setOpen(open)}
                closeOnEscape={false}
                closeOnInteractOutside={false}
            >
                <Topics
                    add={(topics) => onAddTopics({ [topics.$id]: topics })}
                    sdk={sdk}
                    onClose={() => setOpen(false)}
                    groups={groups}
                    type={type}
                />
            </DialogRoot>
        </div>
    );
};

export type DialogBoxProps = {
    type: MessagingProviderType;
    onAddTopics: (topics: Record<string, Models.Topic>) => void;
    children?: React.ReactNode;
    groups: Map<string, Models.Topic>;
    sdk: ProjectSdk;
    trigger: React.ElementType;
    args?: any;
};

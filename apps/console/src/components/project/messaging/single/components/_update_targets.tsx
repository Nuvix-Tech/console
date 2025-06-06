import { useProjectStore } from "@/lib/store";
import { useMessageStore } from "./store";
import { CardBox, CardBoxBody, CardBoxItem, CardBoxTitle } from "@/components/others/card";
import { Targets, WithDialog } from "@/components/wizard/messaging/targets";
import { PlusIcon, XIcon } from "lucide-react";
import { Button } from "@nuvix/ui/components";
import { MessagingProviderType } from "@nuvix/console";


export const UpdateTargets = () => {
    const { targetsById, setTargetsById, message } = useMessageStore((s) => s);
    const { sdk } = useProjectStore((s) => s);

    if (!message) return;

    const type = message.providerType as MessagingProviderType;

    return (
        <>
            <CardBox>
                <CardBoxBody>
                    <CardBoxItem gap={"4"}>
                        <CardBoxTitle className="flex gap-2 items-center">
                            Targets
                        </CardBoxTitle>
                    </CardBoxItem>
                    <CardBoxItem>
                        {Object.keys(targetsById).length > 0 ? <div className="space-y-4">
                            <div className="border rounded-lg">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left p-3">Targets</th>
                                            <th className="w-10 pr-2">
                                                <WithDialog
                                                    type={type}
                                                    onAddTargets={() => { }}
                                                    sdk={sdk}
                                                    groups={targetsById}
                                                    trigger={Button}
                                                    args={{
                                                        children: (
                                                            <>
                                                                <PlusIcon /> Add
                                                            </>
                                                        ),
                                                        size: "sm",
                                                    }}
                                                />
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.entries(targetsById).map(([targetId, target]) => (
                                            <tr key={targetId} className="border-b">
                                                <td className="p-3">{target.name || target.identifier}</td>
                                                <td className="p-3">
                                                    <div className="flex justify-end">
                                                        <button
                                                            type="button"
                                                            // onClick={() => removeTarget(targetId)}
                                                            className="text-gray-500 hover:text-red-500"
                                                        >
                                                            <XIcon size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div> :
                            <Targets
                                groups={targetsById}
                                sdk={sdk}
                                add={() => { }}
                                onClose={() => { }}
                            />
                        }
                    </CardBoxItem>
                </CardBoxBody>
            </CardBox>
        </>
    )
}
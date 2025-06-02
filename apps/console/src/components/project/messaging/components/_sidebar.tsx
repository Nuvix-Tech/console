import { useProjectStore } from "@/lib/store";
import { Line } from "@nuvix/ui/components";
import { SidebarGroup } from "@/ui/layout/navigation";
import { usePathname } from "next/navigation";

const MessagingSidebar = () => {
    const project = useProjectStore.use.project?.();
    const path = usePathname();

    const resolveHref = (value?: string) =>
        `/project/${project?.$id}/messaging${value ? `/${value}` : ""}`;
    const resolveIsSelected = (value?: string) => path.includes(resolveHref(value));

    return (
        <>
            <SidebarGroup
                title="Messaging"
                items={[
                    {
                        label: "Messages",
                        href: resolveHref(),
                        isSelected: path === resolveHref(),
                    },
                    {
                        label: 'Topics',
                        href: resolveHref("topics"),
                        isSelected: resolveIsSelected("topics"),
                    },
                    {
                        label: 'Subscribers',
                        href: resolveHref("subscribers"),
                        isSelected: resolveIsSelected("subscribers"),
                    }
                ]}
            />
        </>
    );
};

export { MessagingSidebar };

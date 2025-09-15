import { PostgresPolicy } from "@nuvix/pg-meta";
import { useState } from "react";
import {
  getGeneralPolicyTemplates,
  getQueuePolicyTemplates,
  getRealtimePolicyTemplates,
} from "../PolicyEditorModal/PolicyEditorModal.constants";
import { HoverCard, Portal } from "@chakra-ui/react";
import { Markdown } from "@/components/others/markdown";
import { CodeBlock } from "@nuvix/ui/modules";
import CardButton from "@/ui/CardButton";
import { cn } from "@nuvix/sui/lib/utils";
import { Badge } from "@nuvix/sui/components/badge";
import { Icon, Input } from "@nuvix/ui/components";
import NoSearchResults from "@/ui/NoSearchResults";

interface PolicyTemplatesProps {
  schema: string;
  table: string;
  selectedPolicy?: PostgresPolicy;
  selectedTemplate?: string;
  onSelectTemplate: (template: any) => void;
}

export const PolicyTemplates = ({
  schema,
  table,
  selectedPolicy,
  selectedTemplate,
  onSelectTemplate,
}: PolicyTemplatesProps) => {
  const [search, setSearch] = useState("");

  const templates =
    schema === "realtime"
      ? getRealtimePolicyTemplates()
      : schema === "pgmq"
        ? getQueuePolicyTemplates()
        : getGeneralPolicyTemplates(schema, table.length > 0 ? table : "table_name");

  const baseTemplates =
    selectedPolicy !== undefined
      ? templates.filter((t) => t.command === selectedPolicy.command)
      : templates;
  const filteredTemplates =
    search.length > 0
      ? baseTemplates.filter(
          (template) =>
            template.name.toLowerCase().includes(search.toLowerCase()) ||
            template.command.toLowerCase().includes(search.toLowerCase()),
        )
      : baseTemplates;

  return (
    <div className="h-full flex flex-col gap-3 px-4 pt-2 pb-12">
      <label className="sr-only" htmlFor="template-search">
        Search templates
      </label>
      <Input
        labelAsPlaceholder
        height="s"
        id="template-search"
        hasPrefix={<Icon name="search" size="s" />}
        placeholder="Search templates"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      {search.length > 0 && filteredTemplates.length === 0 && (
        <NoSearchResults searchString={search} className="min-w-full" />
      )}

      <div className="flex flex-col gap-1.5">
        {filteredTemplates.map((template) => {
          return (
            <HoverCard.Root
              size={"sm"}
              key={template.id}
              openDelay={100}
              closeDelay={100}
              positioning={{ placement: "right" }}
            >
              <HoverCard.Trigger>
                <CardButton
                  title={template.name}
                  titleClass="text-sm"
                  className={cn(
                    "transition w-full",
                    template.id === selectedTemplate
                      ? "!border-(--accent-background-strong) !bg-(--neutral-alpha-medium) hover:!border-primary"
                      : "",
                  )}
                  key={template.id}
                  onClick={() => onSelectTemplate(template)}
                  hideChevron
                  fixedHeight={false}
                  icon={
                    <div className="min-w-16">
                      <Badge
                        className={cn(
                          "!rounded font-mono",
                          template.command === "UPDATE" ? "bg-blue-400 text-blue-900" : "",
                        )}
                        variant={
                          template.command === "ALL"
                            ? "outline"
                            : template.command === "SELECT"
                              ? "success"
                              : template.command === "UPDATE"
                                ? "default"
                                : template.command === "DELETE"
                                  ? "destructive"
                                  : "warning"
                        }
                      >
                        {template.command}
                      </Badge>
                    </div>
                  }
                >
                  <Markdown content={template.description} className="[&>p]:!m-0" />
                </CardButton>
              </HoverCard.Trigger>
              <Portal>
                <HoverCard.Positioner>
                  <HoverCard.Content maxWidth={"500px"} className="!p-0">
                    <HoverCard.Arrow />
                    <CodeBlock
                      codeInstances={[{ language: "sql", code: template.statement, label: "SQL" }]}
                    />
                  </HoverCard.Content>
                </HoverCard.Positioner>
              </Portal>
            </HoverCard.Root>
          );
        })}
      </div>
    </div>
  );
};

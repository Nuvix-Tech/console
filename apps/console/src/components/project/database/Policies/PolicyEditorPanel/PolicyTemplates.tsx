import { PostgresPolicy } from "@nuvix/pg-meta";
import { Search } from "lucide-react";
import { useState } from "react";
// import { Badge, HoverCard, HoverCardContent, HoverCardTrigger, Input, cn } from 'ui';

// import { Markdown } from 'components/interfaces/Markdown';
// import { SimpleCodeBlock } from 'ui';
// import CardButton from 'components/ui/CardButton';
// import CopyButton from 'components/ui/CopyButton';
// import NoSearchResults from 'components/ui/NoSearchResults';
import {
  getGeneralPolicyTemplates,
  getQueuePolicyTemplates,
  getRealtimePolicyTemplates,
} from "../PolicyEditorModal/PolicyEditorModal.constants";
import { Input } from "@/components/others/ui";
import { HoverCard } from "@chakra-ui/react";
import { Markdown } from "@/components/others/markdown";
import { CodeBlock } from "@nuvix/ui/modules";
import CardButton from "@/ui/CardButton";
import { cn } from "@nuvix/sui/lib/utils";
import { Badge } from "@nuvix/sui/components/badge";

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
    <div className="h-full flex flex-col gap-3 px-4">
      <label className="sr-only" htmlFor="template-search">
        Search templates
      </label>
      <Input
        // size="small"
        id="template-search"
        hasPrefix={<Search size={16} className="text-foreground-muted" />}
        placeholder="Search templates"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      {search.length > 0 && filteredTemplates.length === 0 && (
        // <NoSearchResults searchString={search} className="min-w-full" />
        <div className="p-4 text-sm text-foreground-muted">No search results</div>
      )}

      <div className="flex flex-col gap-1.5">
        {filteredTemplates.map((template) => {
          return (
            <HoverCard.Root key={template.id} openDelay={100} closeDelay={100}>
              <HoverCard.Trigger>
                <CardButton
                  title={template.name}
                  titleClass="text-sm"
                  className={cn(
                    "transition w-full",
                    template.id === selectedTemplate
                      ? "!border-stronger bg-surface-200 hover:!border-stronger"
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
                          template.command === "UPDATE"
                            ? "bg-blue-400 text-blue-900 border border-blue-800"
                            : "",
                        )}
                        variant={
                          template.command === "ALL"
                            ? "outline"
                            : template.command === "SELECT"
                              ? "secondary"
                              : template.command === "UPDATE"
                                ? "default"
                                : template.command === "DELETE"
                                  ? "destructive"
                                  : "secondary"
                        }
                      >
                        {template.command}
                      </Badge>
                    </div>
                  }
                >
                  <Markdown content={template.description} className="[&>p]:m-0 space-y-2" />
                </CardButton>
              </HoverCard.Trigger>
              <HoverCard.Content
                // hideWhenDetached
                // side="left"
                // align="center"
                className="w-[500px] flex !p-0"
                // animate="slide-in"
              >
                <CodeBlock
                  codeInstances={[{ language: "sql", code: template.statement, label: "SQL" }]}
                />
              </HoverCard.Content>
            </HoverCard.Root>
          );
        })}
      </div>
    </div>
  );
};

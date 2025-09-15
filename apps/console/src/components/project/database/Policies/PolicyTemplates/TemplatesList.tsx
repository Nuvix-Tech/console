import { noop } from "lodash";

import { PolicyTemplate } from "./PolicyTemplates.constants";

interface TemplatesListProps {
  templates: PolicyTemplate[];
  templatesNote: string;
  selectedTemplate: PolicyTemplate;
  setSelectedTemplate: (template: PolicyTemplate) => void;
}

const TemplatesList = ({
  templates = [],
  templatesNote = "",
  selectedTemplate,
  setSelectedTemplate = noop,
}: TemplatesListProps) => (
  <div className="flex flex-col justify-between border-r border-default w-full">
    <div
      className="hide-scrollbar divide-border-primary space-y-0 divide-y divide-solid overflow-y-auto"
      style={{ maxHeight: "24rem" }}
    >
      {templates.map((template, i) => {
        const active = selectedTemplate?.id === template?.id;
        return (
          <div
            key={i}
            className={
              "border-b border-overlay hover:bg-surface-200 " + (active ? "bg-surface-300" : "")
            }
          >
            {/* <Menu.Item
              key={template.id}
              active={active}
              onClick={() => setSelectedTemplate(template)}
            > */}
            <div className="truncate py-2">{template.templateName}</div>
            {/* </Menu.Item> */}
          </div>
        );
      })}
    </div>
    {templatesNote && (
      <div className="px-4 py-2">
        <p className="text-xs neutral-on-background-weak">{templatesNote}</p>
      </div>
    )}
  </div>
);

export default TemplatesList;

import { isEmpty, noop } from "lodash";
import { useState } from "react";

import { PolicyTemplate } from "./PolicyTemplates.constants";
import TemplatePreview from "./TemplatePreview";
import TemplatesList from "./TemplatesList";
import { Button } from "@nuvix/ui/components";

interface PolicyTemplatesProps {
  templates?: PolicyTemplate[];
  templatesNote?: string;
  onUseTemplate?: (template: PolicyTemplate) => void;
}

const PolicyTemplates = ({
  templates = [],
  templatesNote = "",
  onUseTemplate = noop,
}: PolicyTemplatesProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState<PolicyTemplate>(templates[0]);
  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between border-t border-default">
        <TemplatesList
          templatesNote={templatesNote}
          templates={templates}
          selectedTemplate={selectedTemplate}
          setSelectedTemplate={setSelectedTemplate}
        />
        <TemplatePreview selectedTemplate={selectedTemplate} />
      </div>
      <div className="flex w-full items-center justify-end gap-3 border-t px-6 py-4 border-default">
        <span className="text-sm neutral-on-background-weak">
          This will override any existing code you've written
        </span>
        <Button
          size="s"
          type="primary"
          disabled={isEmpty(selectedTemplate)}
          onClick={() => onUseTemplate(selectedTemplate)}
        >
          Use this template
        </Button>
      </div>
    </div>
  );
};

export default PolicyTemplates;

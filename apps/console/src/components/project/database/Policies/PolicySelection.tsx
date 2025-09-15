import { noop } from "lodash";
import { AlertDescription, AlertTitle, Alert } from "@nuvix/sui/components/alert";
import { Edit, ExternalLink, FlaskConical, Grid } from "lucide-react";

interface PolicySelectionProps {
  description: string;
  showAssistantPreview: boolean;
  onViewTemplates: () => void;
  onViewEditor: () => void;
  onToggleFeaturePreviewModal?: () => void;
}

const PolicySelection = ({
  description = "",
  showAssistantPreview,
  onViewTemplates = noop,
  onViewEditor = noop,
  onToggleFeaturePreviewModal,
}: PolicySelectionProps) => {
  return (
    <>
      {/* <Modal.Content className="space-y-4 py-4">
      <div className="flex flex-col gap-y-2">
        <p className="text-sm neutral-on-background-medium">{description}</p>
        <div className="grid grid-cols-1 gap-2 lg:grid-cols-1">
          <CardButton
            title="Get started quickly"
            description="Create a policy from a template"
            icon={
              <div className="flex">
                <div
                  className="
                  flex h-8 w-8 items-center
                  justify-center
                  rounded bg-foreground text-background
                "
                >
                  <Grid size={14} strokeWidth={2} />
                </div>
              </div>
            }
            onClick={onViewTemplates}
          />
          <CardButton
            title="For full customization"
            description="Create a policy from scratch"
            icon={
              <div className="flex">
                <div
                  className="
                  flex h-8 w-8 items-center
                  justify-center
                  rounded bg-foreground text-background
                "
                >
                  <Edit size={14} strokeWidth={2} />
                </div>
              </div>
            }
            onClick={onViewEditor}
          />
        </div>
      </div>

      {showAssistantPreview && onToggleFeaturePreviewModal !== undefined && (
        <Alert>
          <FlaskConical />
          <AlertTitle>Try the new Supabase Assistant for RLS policies</AlertTitle>
          <AlertDescription>
            Create RLS policies for your tables with the help of AI
          </AlertDescription>
          <div className="flex items-center gap-x-2 mt-3">
            <Button type="default" onClick={onToggleFeaturePreviewModal}>
              Toggle feature preview
            </Button>
            <Button asChild type="default" icon={<ExternalLink strokeWidth={1.5} />}>
              <a
                href="https://supabase.com/blog/studio-introducing-assistant#introducing-the-supabase-assistant"
                target="_blank"
                rel="noreferrer"
              >
                Learn more
              </a>
            </Button>
          </div>
        </Alert>
      )}
      </Modal.Content> */}
    </>
  );
};

export default PolicySelection;

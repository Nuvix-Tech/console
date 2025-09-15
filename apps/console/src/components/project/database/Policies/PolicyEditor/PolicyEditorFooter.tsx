import { Button } from "@nuvix/ui/components";
import { noop } from "lodash";

interface PolicyEditorFooterProps {
  showTemplates: boolean;
  onViewTemplates: () => void;
  onReviewPolicy: () => void;
}

const PolicyEditorFooter = ({
  showTemplates,
  onViewTemplates = noop,
  onReviewPolicy = noop,
}: PolicyEditorFooterProps) => (
  <div className="flex justify-between items-center border-t px-6 py-4 border-default">
    <div className="flex w-full items-center justify-end gap-2">
      {showTemplates && (
        <Button size="s" variant="secondary" onClick={onViewTemplates}>
          View templates
        </Button>
      )}
      <Button size="s" variant="primary" onClick={onReviewPolicy}>
        Review
      </Button>
    </div>
  </div>
);

export default PolicyEditorFooter;

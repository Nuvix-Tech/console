import { Button } from "@nuvix/ui/components";
import { BookOpen } from "lucide-react";

interface DocsButtonProps {
  href: string;
  abbrev?: boolean;
  className?: string;
}

export const DocsButton = ({ href, abbrev = true, className }: DocsButtonProps) => {
  return (
    <Button
      asChild
      type="default"
      variant="secondary"
      size="s"
      className={className}
      prefixIcon={<BookOpen size={16} />}
      onClick={(e) => e.stopPropagation()}
    >
      <a target="_blank" rel="noopener noreferrer" href={href}>
        {abbrev ? "Docs" : "Documentation"}
      </a>
    </Button>
  );
};

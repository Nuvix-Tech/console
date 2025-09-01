import { Button, Icon, IconButton, Text, type IconProps } from "@nuvix/ui/components";
import { ExternalLink, Maximize2, Minimize2 } from "lucide-react";
import { ReactNode, useState, forwardRef } from "react";

interface InformationBoxProps {
  icon?: IconProps["name"];
  title: ReactNode | string;
  description?: ReactNode | string;
  url?: string;
  urlLabel?: string;
  defaultVisibility?: boolean;
  hideCollapse?: boolean;
  button?: React.ReactNode;
  className?: string;
  block?: boolean;
}

const InformationBox = forwardRef<HTMLDivElement, InformationBoxProps>(
  (
    {
      icon,
      title,
      description,
      url,
      urlLabel = "Read more",
      defaultVisibility = false,
      hideCollapse = false,
      button,
      className = "",
      block = false,
    },
    ref,
  ) => {
    const [isExpanded, setIsExpanded] = useState<boolean>(defaultVisibility);

    return (
      <div
        ref={ref}
        role="alert"
        className={`${block ? "block w-full" : ""}
      block w-full rounded-md border bg-(--neutral-alpha-weak) dark:bg-(--neutral-background-medium) py-2 ${className}`}
      >
        <div className="flex flex-col px-4">
          <div className="flex items-center justify-between">
            <div className="flex w-full space-x-3 items-center">
              {icon && <Icon name={icon} size="s" onBackground="neutral-medium" />}
              <div className="flex-grow">
                <Text as="h5" variant="label-strong-s">
                  {title}
                </Text>
              </div>
            </div>
            {description && !hideCollapse ? (
              <IconButton
                onClick={() => setIsExpanded(!isExpanded)}
                icon={isExpanded ? Minimize2 : Maximize2}
                variant="ghost"
                size="s"
                className="neutral-on-background-medium"
                type="button"
                aria-label={isExpanded ? "Collapse" : "Expand"}
              />
            ) : null}
          </div>
          {(description || url || button) && (
            <div
              className={`flex flex-col space-y-3 overflow-hidden transition-all ${
                isExpanded ? "mt-3" : ""
              }`}
              style={{ maxHeight: isExpanded ? 500 : 0 }}
            >
              <div className="neutral-on-background-medium text-sm">{description}</div>

              {url && (
                <div>
                  <Button
                    type="default"
                    variant="secondary"
                    size="s"
                    weight="default"
                    prefixIcon={ExternalLink}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="neutral-on-background-medium !bg-(--neutral-background-weak)"
                  >
                    {urlLabel}
                  </Button>
                </div>
              )}

              {button && <div>{button}</div>}
            </div>
          )}
        </div>
      </div>
    );
  },
);

InformationBox.displayName = "InformationBox";
export default InformationBox;

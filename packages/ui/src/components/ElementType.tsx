import React, { type ReactNode, forwardRef } from "react";
import { Flex } from ".";
import { useMeta } from "../contexts";

interface ElementTypeProps {
  href?: string;
  onClick?: () => void;
  onLinkClick?: () => void;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  type?: "button" | "submit" | "reset";
  [key: string]: any;
}

const isExternalLink = (url: string) => /^https?:\/\//.test(url);

const ElementType = forwardRef<HTMLElement, ElementTypeProps>(
  ({ href, type, onClick, onLinkClick, children, className, style, ...props }, ref) => {
    const { link: Link } = useMeta();
    if (href) {
      const isExternal = isExternalLink(href);
      if (isExternal) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            ref={ref as React.Ref<HTMLAnchorElement>}
            className={className}
            style={style}
            onClick={() => onLinkClick?.()}
            {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
          >
            {children}
          </a>
        );
      }
      return (
        <Link
          href={href}
          to={href}
          ref={ref as React.Ref<HTMLAnchorElement>}
          className={className}
          style={style}
          onClick={() => onLinkClick?.()}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {children}
        </Link>
      );
    }

    if (onClick || type === "submit" || type === "button") {
      return (
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          className={className}
          onClick={onClick}
          style={style}
          type={type}
          {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
        >
          {children}
        </button>
      );
    }

    return (
      <Flex
        ref={ref as React.Ref<HTMLDivElement>}
        className={className}
        style={style}
        {...(props as React.HTMLAttributes<HTMLDivElement>)}
      >
        {children}
      </Flex>
    );
  },
);

ElementType.displayName = "ElementType";
export { ElementType };

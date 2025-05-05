import { cn } from "@nuvix/sui/lib/utils";
import Link from "next/link";
import ReactMarkdown, { Options } from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prose } from "../cui/prose";

interface Props extends Omit<Options, "children" | "node"> {
  className?: string;
  content: string;
  extLinks?: boolean;
}

const Markdown = ({ className, content = "", extLinks = false, ...props }: Props) => {
  return (
    <Prose className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h3: ({ children }) => <h3 className="mb-1">{children}</h3>,
          a: ({ href, children }) => {
            if (extLinks) {
              return (
                <a href={href} target="_blank" rel="noreferrer noopener">
                  {children}
                </a>
              );
            } else {
              return <Link href={href ?? "/"}>{children}</Link>;
            }
          },
        }}
        {...props}
      >
        {content}
      </ReactMarkdown>
    </Prose>
  );
};

export { Markdown };

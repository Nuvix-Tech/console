import * as React from "react";
import Image from "next/image";
import Link from "next/link";

import { Alert, AlertDescription, AlertTitle } from "@nuvix/sui/components/alert";
import { Button } from "@nuvix/sui/components/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@nuvix/sui/components/tabs";
import { cn } from "@nuvix/sui/lib/utils";
import { InlineCode, Line, SmartLink, Text } from "@nuvix/ui/components";
import { HeadingLink } from "@nuvix/ui/modules";
import { MDXComponents } from "mdx/types";
import defaultMdxComponents from "fumadocs-ui/mdx";
import { CodeBlock, Pre } from "fumadocs-ui/components/codeblock";

const Callout = defaultMdxComponents.Callout;

export function mdxComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    ...components,
    Callout: ({ className, ...props }) => {
      return (
        <Callout
          className={cn("[&>*:first-child]:w-1 [&>*:first-child]:-ml-1 overflow-hidden", className)}
          {...props}
        />
      );
    },
    h1: ({ className, ...props }: React.ComponentProps<typeof Text>) => (
      <Text
        className={cn("font-heading mt-2 scroll-m-28 text-3xl font-bold tracking-tight", className)}
        {...props}
      />
    ),
    h2: ({ className, ...props }) => {
      return (
        <HeadingLink
          as="h2"
          marginTop="16"
          id={
            props.children
              ?.toString()
              .replace(/ /g, "-")
              .replace(/'/g, "")
              .replace(/\?/g, "")
              .toLowerCase() as string
          }
          className={cn("scroll-m-28 first:mt-0 [&+p]:!mt-4 *:[code]:text-2xl", className)}
          {...props}
        />
      );
    },
    // h3: ({ className, ...props }) => (
    //   <Text
    //     as="h3"
    //     variant="heading-default-m"
    //     className={cn(
    //       // "font-heading mt-8 scroll-m-28 *:[code]:text-xl",
    //       className,
    //     )}
    //     {...props}
    //   />
    // ),
    // h4: ({ className, ...props }: React.ComponentProps<"h4">) => (
    //   <h4
    //     className={cn("font-heading mt-8 scroll-m-28 text-lg font-medium tracking-tight", className)}
    //     {...props}
    //   />
    // ),
    // h5: ({ className, ...props }: React.ComponentProps<"h5">) => (
    //   <h5
    //     className={cn("mt-8 scroll-m-28 text-lg font-medium tracking-tight", className)}
    //     {...props}
    //   />
    // ),
    // h6: ({ className, ...props }: React.ComponentProps<"h6">) => (
    //   <h6
    //     className={cn("mt-8 scroll-m-28 text-base font-medium tracking-tight", className)}
    //     {...props}
    //   />
    // ),
    // a: ({ className, ...props }) => (
    //   <SmartLink className={cn("font-medium !underline !underline-offset-4", className)} unstyled {...props} />
    // ),
    // p: ({ className, ...props }) => (
    //   <Text variant="body-default-s" className={cn("[&:not(:first-child)]:mt-6", className)} {...props} />
    // ),
    hr: ({ ...props }) => <Line className="my-4 md:my-8" {...props} />,
    pre: ({ ref: _ref, ...props }) => (
      <CodeBlock {...props}>
        <Pre>{props.children}</Pre>
      </CodeBlock>
    ),
    code: ({ className, ...props }) => {
      const languageMatch = className?.match(/language-(\w+)/);
      const language = languageMatch ? languageMatch[1] : undefined;
      // Inline Code.
      if (typeof props.children === "string" && !language) {
        return <InlineCode {...props} />;
      }

      return <code className={className} {...props} />;
    },
    Step: ({ className, ...props }: React.ComponentProps<"h3">) => (
      <h3
        className={cn(
          "font-heading mt-8 scroll-m-32 text-xl font-medium tracking-tight",
          className,
        )}
        {...props}
      />
    ),
    Steps: ({ ...props }) => (
      <div className="[&>h3]:step steps mb-12 [counter-reset:step] *:[h3]:first:!mt-0" {...props} />
    ),
    Image: ({ src, className, width, height, alt, ...props }: React.ComponentProps<"img">) => (
      <Image
        className={cn("mt-6 rounded-md border", className)}
        src={src || ""}
        width={Number(width)}
        height={Number(height)}
        alt={alt || ""}
        {...props}
      />
    ),
    Tabs: ({ className, ...props }: React.ComponentProps<typeof Tabs>) => {
      return <Tabs className={cn("relative mt-6 w-full", className)} {...props} />;
    },
    TabsList: ({ className, ...props }: React.ComponentProps<typeof TabsList>) => (
      <TabsList
        className={cn("justify-start gap-4 rounded-none bg-transparent px-2 md:px-0", className)}
        {...props}
      />
    ),
    TabsTrigger: ({ className, ...props }: React.ComponentProps<typeof TabsTrigger>) => (
      <TabsTrigger
        className={cn(
          "text-muted-foreground data-[state=active]:text-foreground px-0 text-base data-[state=active]:shadow-none dark:data-[state=active]:border-transparent dark:data-[state=active]:bg-transparent",
          className,
        )}
        {...props}
      />
    ),
    TabsContent: ({ className, ...props }: React.ComponentProps<typeof TabsContent>) => (
      <TabsContent
        className={cn(
          "relative [&_h3.font-heading]:text-base [&_h3.font-heading]:font-medium *:[figure]:first:mt-0 [&>.steps]:mt-6",
          className,
        )}
        {...props}
      />
    ),
    Tab: ({ className, ...props }: React.ComponentProps<"div">) => (
      <div className={cn(className)} {...props} />
    ),
    Button,
    Alert,
    AlertTitle,
    AlertDescription,
    Link: ({ className, ...props }: React.ComponentProps<typeof SmartLink>) => (
      <SmartLink className={cn(className)} {...props} unstyled={false} />
    ),
    LinkedCard: ({ className, ...props }: React.ComponentProps<typeof Link>) => (
      <Link
        className={cn(
          "bg-surface text-surface-foreground hover:bg-surface/80 flex w-full flex-col items-center rounded-xl p-6 transition-colors sm:p-10",
          className,
        )}
        {...props}
      />
    ),
  };
}

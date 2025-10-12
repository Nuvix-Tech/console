"use client";
import * as TabsComponents from "fumadocs-ui/components/tabs";
import React, { createContext, useContext } from "react";
import fumadocsComponents from "fumadocs-ui/mdx";

// Context to control whether titles should be shown in CodeBlocks
const TabGroupContext = createContext<{ isInsideTabGroup: boolean }>({ isInsideTabGroup: false });

// Custom wrapper for CodeBlock that checks context
export function ContextAwareCodeBlock(props: React.ComponentProps<typeof fumadocsComponents.pre>) {
  const { isInsideTabGroup } = useContext(TabGroupContext) || {};

  return <fumadocsComponents.pre {...props} title={isInsideTabGroup ? undefined : props.title} />;
}

// Wrapper for CodeBlockTabs to set context
export function ContextAwareCodeBlockTabs(
  props: React.ComponentProps<typeof fumadocsComponents.CodeBlockTabs>,
) {
  return (
    <TabGroupContext.Provider value={{ isInsideTabGroup: true }}>
      <fumadocsComponents.CodeBlockTabs {...props} />
    </TabGroupContext.Provider>
  );
}

// Wrapper for CodeBlockTab to maintain context
export function ContextAwareCodeBlockTab(
  props: React.ComponentProps<typeof fumadocsComponents.CodeBlockTab>,
) {
  return (
    <TabGroupContext.Provider value={{ isInsideTabGroup: true }}>
      <fumadocsComponents.CodeBlockTab {...props} />
    </TabGroupContext.Provider>
  );
}

export function Tab({ children, title, ...props }: { children: React.ReactNode; title?: string }) {
  return (
    <TabsComponents.Tab value={title} {...props}>
      <TabGroupContext.Provider value={{ isInsideTabGroup: true }}>
        {children}
      </TabGroupContext.Provider>
    </TabsComponents.Tab>
  );
}

Tab.displayName = "Tab";

export function Tabs(props: React.ComponentProps<typeof TabsComponents.Tabs>) {
  // Helper to check if a node is a Tab
  const isTab = (el: any) => {
    if (!el || typeof el !== "object" || !el.type) return false;
    // Accept both imported Tab component or a TabsComponents.Tab function/component
    return (
      el.type === Tab ||
      el.type === TabsComponents.Tab ||
      (typeof el.type === "function" && el.type.displayName === "Tab")
    );
  };

  // Normalize children: wrap non-Tab children in a Tab using title/value if possible
  function normalizeChildren(children: React.ReactNode): React.ReactNode[] {
    const arr = React.Children.toArray(children);
    return arr.map((child, idx) => {
      if (isTab(child)) {
        return child;
      }
      // Try to use .props.title or .props.value if available
      const asElement = child as any;
      const tabTitle =
        (asElement?.props?.title as string) ??
        (asElement?.props?.value as string) ??
        `Tab ${idx + 1}`;

      return (
        <Tab title={tabTitle} key={asElement?.key ?? idx}>
          {child}
        </Tab>
      );
    });
  }

  // Extract tab titles from children (whether already Tab or wrapped)
  function extractTitles(children: React.ReactNode): string[] {
    const arr = React.Children.toArray(children);
    const titles: string[] = [];
    arr.forEach((child, idx) => {
      const asElement = child as any;
      if (
        asElement &&
        asElement.props &&
        (typeof asElement.props.title === "string" || typeof asElement.props.value === "string")
      ) {
        titles.push(
          (asElement.props.title as string) ??
            (asElement.props.value as string) ??
            `Tab ${idx + 1}`,
        );
      } else {
        titles.push(`Tab ${idx + 1}`);
      }
    });
    return titles;
  }

  // If items are already provided, use them directly
  if (props.items) {
    return (
      <TabGroupContext.Provider value={{ isInsideTabGroup: true }}>
        <TabsComponents.Tabs {...props} />
      </TabGroupContext.Provider>
    );
  }

  // Otherwise, normalize children and extract titles
  const normalizedChildren = normalizeChildren(props.children);
  const items = extractTitles(normalizedChildren);

  return (
    <TabGroupContext.Provider value={{ isInsideTabGroup: true }}>
      <TabsComponents.Tabs {...props} items={items}>
        {normalizedChildren}
      </TabsComponents.Tabs>
    </TabGroupContext.Provider>
  );
}

Tabs.displayName = "Tabs";

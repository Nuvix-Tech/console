import type * as PageTree from "fumadocs-core/page-tree";
import { type ComponentProps, type HTMLAttributes, type ReactNode, useMemo } from "react";
import { Languages, Sidebar as SidebarIcon } from "lucide-react";
import { buttonVariants } from "fumadocs-ui/components/ui/button";
import {
  Sidebar,
  SidebarCollapseTrigger,
  SidebarContent,
  SidebarDrawer,
  SidebarLinkItem,
  SidebarPageTree,
  SidebarTrigger,
  SidebarViewport,
} from "./sidebar";
import { type BaseLayoutProps, resolveLinkItems } from "fumadocs-ui/layouts/shared";
import { LinkItem } from "fumadocs-ui/layouts/shared";
// import { LanguageToggle, LanguageToggleText } from "fumadocs-ui/layouts/shared/language-toggle";
import { LayoutTabs, LayoutHeader, LayoutBody, LayoutContextProvider, LayoutRoot } from "./client";
import { TreeContextProvider } from "fumadocs-ui/contexts/tree";
// import { ThemeToggle } from "fumadocs-ui/layouts/shared/theme-toggle";
import Link from "fumadocs-core/link";
// import { LargeSearchToggle, SearchToggle } from "fumadocs-ui/layouts/shared/search-toggle";
import {
  getSidebarTabs,
  type GetSidebarTabsOptions,
} from "fumadocs-ui/components/sidebar/tabs/index";
import type { SidebarPageTreeComponents } from "fumadocs-ui/components/sidebar/page-tree";
import {
  SidebarTabsDropdown,
  type SidebarTabWithProps,
} from "fumadocs-ui/components/sidebar/tabs/dropdown";
import { cn } from "@nuvix/sui/lib/utils";
import { NavBar } from "../layout/nav-bar";
import { RenderNodes } from "../sidebar";
import { LargeSearchToggle, SearchToggle } from "./search-toggle";

export interface DocsLayoutProps extends BaseLayoutProps {
  tree: PageTree.Root;

  sidebar?: SidebarOptions;

  tabMode?: "top" | "auto";

  /**
   * Props for the `div` container
   */
  containerProps?: HTMLAttributes<HTMLDivElement>;
}

interface SidebarOptions
  extends ComponentProps<"aside">,
    Partial<Pick<ComponentProps<typeof Sidebar>, "defaultOpenLevel" | "prefetch">> {
  enabled?: boolean;
  component?: ReactNode;
  components?: Partial<SidebarPageTreeComponents>;

  /**
   * Root Toggle options
   */
  tabs?: SidebarTabWithProps[] | GetSidebarTabsOptions | false;

  banner?: ReactNode;
  footer?: ReactNode;

  /**
   * Support collapsing the sidebar on desktop mode
   *
   * @defaultValue true
   */
  collapsible?: boolean;
}

export function DocsLayout({
  nav: { transparentMode, ...nav } = {},
  sidebar: {
    tabs: sidebarTabs,
    enabled: sidebarEnabled = true,
    defaultOpenLevel,
    prefetch,
    ...sidebarProps
  } = {},
  searchToggle = {},
  themeSwitch = {},
  tabMode = "auto",
  i18n = false,
  children,
  tree,
  ...props
}: DocsLayoutProps) {
  const tabs = useMemo(() => {
    if (Array.isArray(sidebarTabs)) {
      return sidebarTabs;
    }
    if (typeof sidebarTabs === "object") {
      return getSidebarTabs(tree, sidebarTabs);
    }
    if (sidebarTabs !== false) {
      return getSidebarTabs(tree);
    }
    return [];
  }, [tree, sidebarTabs]);
  const links = resolveLinkItems(props);

  function sidebar() {
    const { footer, banner, collapsible = true, component, components, ...rest } = sidebarProps;
    if (component) return component;

    const iconLinks = links.filter((item) => item.type === "icon");
    const rawItems = tree?.children || [];

    const viewport = (
      <SidebarViewport className="[&>div]:pl-0">
        {links
          .filter((v) => v.type !== "icon")
          .map((item, i, list) => (
            <SidebarLinkItem key={i} item={item} className={cn(i === list.length - 1 && "mb-4")} />
          ))}
        <SidebarPageTree />
      </SidebarViewport>
    );

    return (
      <>
        <SidebarContent {...rest} className="!bg-transparent border-none">
          {/* <div className="flex flex-col gap-3 p-4 pb-2"> */}
          {/* <div className="flex">
              <Link
                href={nav.url ?? "/"}
                className="inline-flex text-[0.9375rem] items-center gap-2.5 font-medium me-auto"
              >
                {nav.title}
              </Link>
              {nav.children}
              {collapsible && (
                <SidebarCollapseTrigger
                  className={cn(
                    buttonVariants({
                      color: "ghost",
                      size: "icon-sm",
                      className: "mb-auto text-fd-muted-foreground",
                    }),
                  )}
                >
                  <SidebarIcon />
                </SidebarCollapseTrigger>
              )}
            </div> */}
          {searchToggle.enabled !== false &&
            (searchToggle.components?.lg ?? (
              <div className="inline-flex pr-4 mt-2">
                <LargeSearchToggle hideIfDisabled className="w-full" />
              </div>
            ))}
          {/* {tabs.length > 0 && tabMode === "auto" && <SidebarTabsDropdown options={tabs} />}
            {banner}
          </div> */}
          {viewport}
          {/* {(i18n || iconLinks.length > 0 || themeSwitch?.enabled !== false || footer) && (
            <div className="flex flex-col border-t p-4 pt-2 empty:hidden">
              <div className="flex text-fd-muted-foreground items-center empty:hidden"> */}
          {/* {i18n && (
                  <LanguageToggle>
                    <Languages className="size-4.5" />
                  </LanguageToggle>
                )} */}
          {/* {iconLinks.map((item, i) => (
                  <LinkItem
                    key={i}
                    item={item}
                    className={cn(buttonVariants({ size: "icon-sm", color: "ghost" }))}
                    aria-label={item.label}
                  >
                    {item.icon}
                  </LinkItem>
                ))} */}
          {/* {themeSwitch.enabled !== false &&
                  (themeSwitch.component ?? (
                    <ThemeToggle className="ms-auto p-0" mode={themeSwitch.mode} />
                  ))} */}
          {/* </div>
              {footer}
            </div>
          )} */}
        </SidebarContent>
        <SidebarDrawer>
          <div className="flex flex-col gap-3 p-4 pb-2">
            <div className="flex text-fd-muted-foreground items-center gap-1.5">
              <div className="flex flex-1">
                {/* {iconLinks.map((item, i) => (
                  <LinkItem
                    key={i}
                    item={item}
                    className={cn(
                      buttonVariants({
                        size: "icon-sm",
                        color: "ghost",
                        className: "p-2",
                      }),
                    )}
                    aria-label={item.label}
                  >
                    {item.icon}
                  </LinkItem>
                ))} */}
              </div>
              {/* {i18n && (
                <LanguageToggle>
                  <Languages className="size-4.5" />
                  <LanguageToggleText />
                </LanguageToggle>
              )} */}
              {/* {themeSwitch.enabled !== false &&
                (themeSwitch.component ?? <ThemeToggle className="p-0" mode={themeSwitch.mode} />)} */}
              <SidebarTrigger
                className={cn(
                  buttonVariants({
                    color: "ghost",
                    size: "icon-sm",
                    className: "p-2",
                  }),
                )}
              >
                <SidebarIcon />
              </SidebarTrigger>
            </div>
            {tabs.length > 0 && <SidebarTabsDropdown options={tabs} />}
            {banner}
          </div>
          {viewport}
          <div className="flex flex-col border-t p-4 pt-2 empty:hidden">{footer}</div>
        </SidebarDrawer>
      </>
    );
  }

  return (
    <TreeContextProvider tree={tree}>
      <LayoutContextProvider navTransparentMode={transparentMode}>
        <Sidebar defaultOpenLevel={defaultOpenLevel} prefetch={prefetch}>
          <NavBar />
          <LayoutRoot className="main-container px-1 md:px-3">
            {sidebarEnabled && sidebar()}
            <LayoutBody
              {...props.containerProps}
              className="bg-(--neutral-background-medium)/40 border border-(--neutral-alpha-weak) radius-xs min-h-[calc(100vh_-_60px)] max-h-[calc(100vh_-_60px)] overflow-y-auto"
            >
              {/* {nav.enabled !== false &&
              (nav.component ?? (
                <LayoutHeader
                  id="nd-subnav"
                  className="[grid-area:header] sticky top-(--fd-docs-row-1) z-30 flex items-center ps-4 pe-2.5 border-b transition-colors backdrop-blur-sm h-(--fd-header-height) md:hidden max-md:layout:[--fd-header-height:--spacing(14)] data-[transparent=false]:bg-fd-background/80"
                >
            <Link
              href={nav.url ?? "/"}
              className="inline-flex items-center gap-2.5 font-semibold"
            >
              {nav.title}
            </Link>
            <div className="flex-1">{nav.children}</div> */}
              {/* {searchToggle.enabled !== false &&
                (searchToggle.components?.sm ?? <SearchToggle className="p-2" hideIfDisabled />)} */}
              {/* {sidebarEnabled && (
                    <SidebarTrigger
                      className={cn(
                        buttonVariants({
                          color: "ghost",
                          size: "icon-sm",
                          className: "p-2",
                        }),
                      )}
                    >
                      <SidebarIcon />
                    </SidebarTrigger>
                  )}
                </LayoutHeader> */}
              {/* ))} */}
              {/* {tabMode === "top" && tabs.length > 0 && (
              <LayoutTabs
                options={tabs}
                className="z-10 bg-fd-background border-b px-6 pt-3 xl:px-8 max-md:hidden"
              />
            )} */}
              {/* <div className="pb-1 px-1 md:pb-3 md:px-3 main-container">
              <div className="bg-(--surface-background) border border-(--neutral-border-medium) dark:border-(--neutral-border-weak) radius-xs-4 min-h-[calc(100vh_-_60px)] max-h-[calc(100vh_-_60px)] overflow-y-auto overflow-x-hidden"> */}
              {children}
              {/* </div>
            </div> */}
            </LayoutBody>
          </LayoutRoot>
        </Sidebar>
      </LayoutContextProvider>
    </TreeContextProvider>
  );
}

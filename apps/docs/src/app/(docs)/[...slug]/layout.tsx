import { CollapsibleControl, DocsLayout } from "fumadocs-ui/layouts/docs";
import { source } from "@/lib/source";
import { layoutProps } from "@/components/layout/base-layout";
import { NavProvider, TreeContextProvider } from "fumadocs-ui/provider";
import {
  Sidebar,
  SidebarCollapseTrigger,
  type SidebarComponents,
  SidebarContent,
  SidebarContentMobile,
  SidebarFolder,
  SidebarFolderContent,
  SidebarFolderLink,
  SidebarFolderTrigger,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarPageTree,
  type SidebarProps,
  SidebarTrigger,
  SidebarViewport,
} from "fumadocs-ui/components/layout/sidebar";
import { LargeSearchToggle } from "fumadocs-ui/components/layout/search-toggle";
import { cn } from "@nuvix/sui/lib/utils";
import { buttonVariants } from "fumadocs-ui/components/ui/button";
import { BaseLinkItem, getLinks, LinkItemType } from "fumadocs-ui/layouts/links";
import { SidebarIcon } from "lucide-react";
import { RootToggle } from "fumadocs-ui/components/layout/root-toggle";
import { LayoutBody } from "fumadocs-ui/layouts/docs-client";
import { NavBar } from "@/components/layout/nav-bar";

const sidebarVariables = cn("md:[--fd-sidebar-width:268px] lg:[--fd-sidebar-width:286px]");

export default function Layout({ children }: { children: React.ReactNode }) {
  function sidebar() {
    const {
      footer,
      banner,
      collapsible = true,
      component,
      components,
      defaultOpenLevel,
      prefetch,
      ...rest
    } = {} as any;
    if (component) return component;

    const links = getLinks();
    const iconLinks = links.filter((item) => item.type === "icon");

    const viewport = (
      <SidebarViewport>
        {links
          .filter((v) => v.type !== "icon")
          .map((item, i, list) => (
            <SidebarLinkItem key={i} item={item} className={cn(i === list.length - 1 && "mb-4")} />
          ))}
        <SidebarPageTree components={components} />
      </SidebarViewport>
    );

    const mobile = (
      <SidebarContentMobile {...rest}>
        <SidebarHeader>
          <div className="flex text-fd-muted-foreground items-center gap-1.5">
            <div className="flex flex-1">
              {iconLinks.map((item, i) => (
                <BaseLinkItem
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
                </BaseLinkItem>
              ))}
            </div>
            {/* {i18n ? (
              <LanguageToggle>
                <Languages className="size-4.5" />
                <LanguageToggleText />
              </LanguageToggle>
            ) : null} */}
            {/* {themeSwitch.enabled !== false &&
              (themeSwitch.component ?? (
                <ThemeToggle className="p-0" mode={themeSwitch.mode} />
              ))} */}
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
          {/* {tabs.length > 0 && <RootToggle options={tabs} />} */}
          {banner}
        </SidebarHeader>
        {viewport}
        <SidebarFooter className="empty:hidden">{footer}</SidebarFooter>
      </SidebarContentMobile>
    );

    const content = (
      <SidebarContent {...rest} className="!bg-transparent border-none !mt-12">
        {/* <SidebarHeader>
          <div className="flex">
            <Link
              href={nav.url ?? '/'}
              className="inline-flex text-[15px] items-center gap-2.5 font-medium me-auto"
            >
              {nav.title}
            </Link>
            {nav.children}
            {collapsible && (
              <SidebarCollapseTrigger
                className={cn(
                  buttonVariants({
                    color: 'ghost',
                    size: 'icon-sm',
                    className: 'mb-auto text-fd-muted-foreground',
                  }),
                )}
              >
                <SidebarIcon />
              </SidebarCollapseTrigger>
            )}
          </div>
          {searchToggle.enabled !== false &&
            (searchToggle.components?.lg ?? (
              ))}
              {tabs.length > 0 && tabMode === 'auto' && (
                <RootToggle options={tabs} />
                )}
                {banner}
                </SidebarHeader> */}
        <SidebarHeader className="pt-2 my-0">
          <LargeSearchToggle hideIfDisabled />
        </SidebarHeader>
        {viewport}
        {/* {(i18n ||
          iconLinks.length > 0 ||
          themeSwitch?.enabled !== false ||
          footer) && (
            <SidebarFooter>
              <div className="flex text-fd-muted-foreground items-center empty:hidden">
                {i18n && (
                  <LanguageToggle>
                    <Languages className="size-4.5" />
                  </LanguageToggle>
                )}
                {iconLinks.map((item, i) => (
                  <BaseLinkItem
                    key={i}
                    item={item}
                    className={cn(
                      buttonVariants({ size: 'icon-sm', color: 'ghost' }),
                    )}
                    aria-label={item.label}
                  >
                    {item.icon}
                  </BaseLinkItem>
                ))}
                {/* {themeSwitch.enabled !== false &&
                  (themeSwitch.component ?? (
                    <ThemeToggle
                      className="ms-auto p-0"
                      mode={themeSwitch.mode}
                    />
                  ))} 
      </div>
              { footer }*/}
        {/* </SidebarFooter >
          )
        }  }*/}
      </SidebarContent>
    );

    return (
      <Sidebar
        defaultOpenLevel={defaultOpenLevel}
        prefetch={prefetch}
        Mobile={mobile}
        Content={
          <>
            {collapsible && <CollapsibleControl />}
            {content}
          </>
        }
      />
    );
  }

  return (
    <>
      <TreeContextProvider tree={source.pageTree}>
        {/* <NavProvider transparentMode={"top"}> */}
        {/* {nav.enabled !== false &&
            (nav.component ?? (
              <Navbar className="h-(--fd-nav-height) on-root:[--fd-nav-height:56px] md:on-root:[--fd-nav-height:0px] md:hidden">
                <Link
                  href={nav.url ?? '/'}
                  className="inline-flex items-center gap-2.5 font-semibold"
                >
                  {nav.title}
                </Link>
                <div className="flex-1">{nav.children}</div>
                {searchToggle.enabled !== false &&
                  (searchToggle.components?.sm ?? (
                    <SearchToggle className="p-2" hideIfDisabled />
                  ))}
                {sidebarEnabled && (
                  <SidebarTrigger
                    className={cn(
                      buttonVariants({
                        color: 'ghost',
                        size: 'icon-sm',
                        className: 'p-2',
                      }),
                    )}
                  >
                    <SidebarIcon />
                  </SidebarTrigger>
                )}
              </Navbar>
            ))} */}
        <NavBar />
        <LayoutBody className={cn(sidebarVariables)}>
          {sidebar()}
          <div className="pb-1 px-1 md:pb-3 md:px-3 main-container">
            <div className="bg-(--surface-background) border border-(--neutral-border-medium) dark:border-(--neutral-border-weak) radius-xs-4 max-h-[calc(100vh_-_60px)] overflow-y-auto overflow-x-hidden">
              {children}
            </div>
          </div>
        </LayoutBody>
      </TreeContextProvider>
    </>
  );
}

function SidebarLinkItem({
  item,
  ...props
}: {
  item: Exclude<LinkItemType, { type: "icon" }>;
  className?: string;
}) {
  if (item.type === "menu")
    return (
      <SidebarFolder {...props}>
        {item.url ? (
          <SidebarFolderLink href={item.url} external={item.external}>
            {item.icon}
            {item.text}
          </SidebarFolderLink>
        ) : (
          <SidebarFolderTrigger>
            {item.icon}
            {item.text}
          </SidebarFolderTrigger>
        )}
        <SidebarFolderContent>
          {item.items.map((child, i) => (
            <SidebarLinkItem key={i} item={child} />
          ))}
        </SidebarFolderContent>
      </SidebarFolder>
    );

  if (item.type === "custom") return <div {...props}>{item.children as any}</div>;

  return (
    <SidebarItem href={item.url} icon={item.icon} external={item.external} {...props}>
      {item.text}
    </SidebarItem>
  );
}

// import {
//   //  CollapsibleControl,
//   DocsLayout,
// } from "fumadocs-ui/layouts/docs";
import { source } from "@/lib/source";
// import { layoutProps } from "@/components/layout/base-layout";
// import { TreeContextProvider } from "fumadocs-ui/contexts/tree";
// import {
//   Sidebar,
//   SidebarCollapseTrigger,
//   type SidebarComponents,
//   SidebarContent,
//   SidebarContentMobile,
//   SidebarFolder,
//   SidebarFolderContent,
//   SidebarFolderLink,
//   SidebarFolderTrigger,
//   SidebarFooter,
//   SidebarHeader,
//   SidebarItem,
//   SidebarPageTree,
//   type SidebarProps,
//   SidebarTrigger,
//   SidebarViewport,
// } from "@/components/root/sidebar";
// // import { LargeSearchToggle } from "fumadocs-ui/layouts/shared/search-toggle";
// import { cn } from "@nuvix/sui/lib/utils";
// import { buttonVariants } from "fumadocs-ui/components/ui/button";
// import { BaseLinkItem, getLinks, LinkItemType } from "fumadocs-ui/layouts/shared";
// import { SidebarIcon } from "lucide-react";
// import { RootToggle } from "fumadocs-ui/layouts/shared/root-toggle";
// import { LayoutBody } from "@/components/root/client";
// import { NavBar } from "@/components/layout/nav-bar";
// import { SidebarGroup } from "@/components/layout";
// import { RenderNodes } from "@/components/sidebar";
import { notFound } from "next/navigation";

import { DocsLayout } from "@/components/root";

// const sidebarVariables = cn("md:[--fd-sidebar-width:268px] lg:[--fd-sidebar-width:286px]");

// export default async function Layout({
//   children,
//   params,
// }: {
//   children: React.ReactNode;
//   params: Promise<{ slug?: string[] }>;
// }) {
//   const { slug } = await params;
//   const page = source.getPage(slug);
//   if (!page) notFound();

//   function sidebar() {
//     const {
//       footer,
//       banner,
//       collapsible = true,
//       component,
//       components,
//       defaultOpenLevel,
//       prefetch,
//       ...rest
//     } = {} as any;
//     if (component) return component;

//     const rawItems = source.pageTree?.children || [];

//     const viewport = (
//       <SidebarViewport>
//         <RenderNodes
//           nodes={[{ type: "page", name: "Home", url: "/home", icon: "house" }, ...rawItems]}
//         />
//       </SidebarViewport>
//     );

//     const mobile = (
//       <SidebarContentMobile {...rest}>
//         <SidebarHeader>
//           <div className="flex text-fd-muted-foreground items-center gap-1.5">
//             {/* {themeSwitch.enabled !== false &&
//               (themeSwitch.component ?? (
//                 <ThemeToggle className="p-0" mode={themeSwitch.mode} />
//               ))} */}
//             <SidebarTrigger
//               className={cn(
//                 buttonVariants({
//                   color: "ghost",
//                   size: "icon-sm",
//                   className: "p-2",
//                 }),
//               )}
//             >
//               <SidebarIcon />
//             </SidebarTrigger>
//           </div>
//           {banner}
//         </SidebarHeader>
//         {viewport}
//         <SidebarFooter className="empty:hidden">{footer}</SidebarFooter>
//       </SidebarContentMobile>
//     );

//     const content = (
//       <SidebarContent {...rest} className="!bg-transparent border-none !mt-12">
//         {/* <SidebarHeader>
//           <div className="flex">
//             <Link
//               href={nav.url ?? '/'}
//               className="inline-flex text-[15px] items-center gap-2.5 font-medium me-auto"
//             >
//               {nav.title}
//             </Link>
//             {nav.children}
//             {collapsible && (
//               <SidebarCollapseTrigger
//                 className={cn(
//                   buttonVariants({
//                     color: 'ghost',
//                     size: 'icon-sm',
//                     className: 'mb-auto text-fd-muted-foreground',
//                   }),
//                 )}
//               >
//                 <SidebarIcon />
//               </SidebarCollapseTrigger>
//             )}
//           </div>
//           {searchToggle.enabled !== false &&
//             (searchToggle.components?.lg ?? (
//               ))}
//               {tabs.length > 0 && tabMode === 'auto' && (
//                 <RootToggle options={tabs} />
//                 )}
//                 {banner}
//                 </SidebarHeader> */}
//         <SidebarHeader className="pt-2 my-0">
//           {/* <LargeSearchToggle hideIfDisabled /> */}
//         </SidebarHeader>
//         {viewport}
//         {/* {(i18n ||
//           iconLinks.length > 0 ||
//           themeSwitch?.enabled !== false ||
//           footer) && (
//             <SidebarFooter>
//               <div className="flex text-fd-muted-foreground items-center empty:hidden">
//                 {i18n && (
//                   <LanguageToggle>
//                     <Languages className="size-4.5" />
//                   </LanguageToggle>
//                 )}
//                 {iconLinks.map((item, i) => (
//                   <BaseLinkItem
//                     key={i}
//                     item={item}
//                     className={cn(
//                       buttonVariants({ size: 'icon-sm', color: 'ghost' }),
//                     )}
//                     aria-label={item.label}
//                   >
//                     {item.icon}
//                   </BaseLinkItem>
//                 ))}
//                 {/* {themeSwitch.enabled !== false &&
//                   (themeSwitch.component ?? (
//                     <ThemeToggle
//                       className="ms-auto p-0"
//                       mode={themeSwitch.mode}
//                     />
//                   ))}
//       </div>
//               { footer }*/}
//         {/* </SidebarFooter >
//           )
//         }  }*/}
//       </SidebarContent>
//     );

//     return (
//       <Sidebar
//         defaultOpenLevel={defaultOpenLevel}
//         prefetch={prefetch}
//         // Mobile={mobile}
//       >
//         {" "}
//         <>
//           {/* {collapsible && <CollapsibleControl />} */}
//           {content}
//         </>
//       </Sidebar>
//     );
//   }
//   const isArticleLayout = page.data.layout === "article";

//   return (
//     <>
//       <TreeContextProvider tree={source.pageTree}>
//         {/* <NavProvider transparentMode={"top"}> */}
//         {/* {nav.enabled !== false &&
//             (nav.component ?? (
//               <Navbar className="h-(--fd-nav-height) on-root:[--fd-nav-height:56px] md:on-root:[--fd-nav-height:0px] md:hidden">
//                 <Link
//                   href={nav.url ?? '/'}
//                   className="inline-flex items-center gap-2.5 font-semibold"
//                 >
//                   {nav.title}
//                 </Link>
//                 <div className="flex-1">{nav.children}</div>
//                 {searchToggle.enabled !== false &&
//                   (searchToggle.components?.sm ?? (
//                     <SearchToggle className="p-2" hideIfDisabled />
//                   ))}
//                 {sidebarEnabled && ( */}
//         {/* <SidebarTrigger
//           className={cn(
//             buttonVariants({
//               color: "ghost",
//               size: "icon-sm",
//               className: "p-2",
//             }),
//           )}
//         >
//           <SidebarIcon />
//         </SidebarTrigger> */}
//         {/* )}
//               </Navbar>
//             ))}  */}
//         <NavBar />
//         <LayoutBody
//           className={cn(sidebarVariables, isArticleLayout && "lg:on-root:[--fd-toc-width:286px]")}
//         >
//           {sidebar()}
//           <div className="pb-1 px-1 md:pb-3 md:px-3 main-container">
//             <div className="bg-(--surface-background) border border-(--neutral-border-medium) dark:border-(--neutral-border-weak) radius-xs-4 min-h-[calc(100vh_-_60px)] max-h-[calc(100vh_-_60px)] overflow-y-auto overflow-x-hidden">
//               {children}
//             </div>
//           </div>
//         </LayoutBody>
//       </TreeContextProvider>
//     </>
//   );
// }

// function SidebarLinkItem({
//   item,
//   ...props
// }: {
//   item: Exclude<LinkItemType, { type: "icon" }>;
//   className?: string;
// }) {
//   if (item.type === "menu")
//     return (
//       <SidebarFolder {...props}>
//         {item.url ? (
//           <SidebarFolderLink href={item.url} external={item.external}>
//             {item.icon}
//             {item.text}
//           </SidebarFolderLink>
//         ) : (
//           <SidebarFolderTrigger>
//             {item.icon}
//             {item.text}
//           </SidebarFolderTrigger>
//         )}
//         <SidebarFolderContent>
//           {item.items.map((child, i) => (
//             <SidebarLinkItem key={i} item={child} />
//           ))}
//         </SidebarFolderContent>
//       </SidebarFolder>
//     );

//   if (item.type === "custom") return <div {...props}>{item.children as any}</div>;

//   return (
//     <SidebarItem href={item.url} icon={item.icon} external={item.external} {...props}>
//       {item.text}
//     </SidebarItem>
//   );
// }

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  const page = source.getPage(slug);
  if (!page) notFound();

  return <DocsLayout tree={source.pageTree}>{children}</DocsLayout>;
}

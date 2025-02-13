"use client";
import { proxy } from "valtio";
import { Models } from "@nuvix/console";
import type { sdkForProject } from "@/lib/sdk";
import { useProxy } from "valtio/utils";
import { SidebarItem, SidebarItemGroup } from "@/components/console/sidebar";
import React from "react";

interface Sidebar {
  first?: React.ReactNode;
  middle?: React.ReactNode;
  last?: React.ReactNode;
}

interface ProjectState {
  initialfetching: boolean;
  project?: Models.Project;
  sdk?: typeof sdkForProject;

  showSidebar: boolean;
  sidebarItems: (SidebarItemGroup | SidebarItem)[];
  sidebar: Sidebar;
}

export const projectState = proxy<ProjectState>({
  initialfetching: true,

  showSidebar: false,
  sidebarItems: [],
  sidebar: {
    first: null,
    middle: null,
    last: null
  },
});

export const getProjectState = () => useProxy(projectState);

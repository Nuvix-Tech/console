"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import {
  EyeIcon,
  LockIcon,
  PenLineIcon,
  Trash2Icon,
  MessageSquarePlusIcon,
  UserIcon,
  UsersIcon,
  GlobeIcon,
  ImageIcon,
  HeartIcon,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type RoleKey = "public" | "user" | "admin";

type RoleConfig = {
  key: RoleKey;
  label: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  canRead: boolean;
  canComment: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canSeeEmail: boolean;
  canSeeAnalytics: boolean;
};

const roles: RoleConfig[] = [
  {
    key: "public",
    label: "Public",
    icon: GlobeIcon,
    color: "text-zinc-400",
    bg: "bg-zinc-400/10",
    canRead: true,
    canComment: false,
    canEdit: false,
    canDelete: false,
    canSeeEmail: false,
    canSeeAnalytics: false,
  },
  {
    key: "user",
    label: "User",
    icon: UserIcon,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    canRead: true,
    canComment: true,
    canEdit: false,
    canDelete: false,
    canSeeEmail: false,
    canSeeAnalytics: false,
  },
  {
    key: "admin",
    label: "Admin",
    icon: UsersIcon,
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    canRead: true,
    canComment: true,
    canEdit: true,
    canDelete: true,
    canSeeEmail: true,
    canSeeAnalytics: true,
  },
];

// ─── Blurred text block ───────────────────────────────────────────────────────

const Redacted = ({ children }: { children: React.ReactNode }) => (
  <span className="select-none blur-[5px] opacity-50">{children}</span>
);

// ─── Main component ──────────────────────────────────────────────────────────

export const O2 = () => {
  const [active, setActive] = useState<RoleKey>("public");
  const role = roles.find((r) => r.key === active)!;

  return (
    <div className="p-2.5 bg-(--surface-background) radius-xs size-full flex-grow flex flex-col min-h-[500px]">
      {/* ── Role switcher bar ─────────────────────────────────────────── */}
      <div className="flex items-center gap-1 p-1 bg-(--page-background) radius-xs mb-2">
        <span className="text-[10px] text-(--neutral-on-background-weak) px-2 hidden xl:block">
          Viewing as
        </span>
        {roles.map((r) => {
          const Icon = r.icon;
          const isActive = r.key === active;
          return (
            <button
              key={r.key}
              onClick={() => setActive(r.key)}
              className={`
                relative flex items-center gap-1.5 px-3 py-1.5 radius-xs text-xs font-medium transition-all cursor-pointer
                ${
                  isActive
                    ? "bg-(--surface-background) text-(--neutral-on-background-strong) shadow-sm"
                    : "text-(--neutral-on-background-weak) hover:text-(--neutral-on-background-medium)"
                }
              `}
            >
              <Icon className="size-3" />
              {r.label}
            </button>
          );
        })}
        <div className="ml-auto flex items-center gap-1.5 px-2">
          <EyeIcon className="size-3 text-(--neutral-on-background-weak)" />
          <span className={`text-[10px] font-medium ${role.color}`}>{role.label}</span>
        </div>
      </div>

      {/* ── Content card that transforms ──────────────────────────────── */}
      <div className="bg-(--page-background) radius-xs flex-1 p-5 flex flex-col gap-4 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-4 flex-1"
          >
            {/* Post header */}
            <div className="flex items-start gap-3">
              <div className="size-9 rounded-full bg-gradient-to-br from-violet-400 to-blue-500 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-(--neutral-on-background-strong)">
                    Sarah Chen
                  </span>
                  <span className="text-[10px] text-(--neutral-on-background-weak)">
                    @sarah_chen
                  </span>
                </div>
                <span className="text-[10px] text-(--neutral-on-background-weak)">
                  {role.canSeeEmail ? "sarah@nuvix.dev · " : ""}Product Engineer · 4h ago
                </span>
              </div>

              {/* Admin-only analytics badge */}
              {role.canSeeAnalytics && (
                <motion.span
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-[9px] font-mono bg-emerald-400/10 text-emerald-400 px-2 py-0.5 radius-xs flex-shrink-0"
                >
                  2.4k views
                </motion.span>
              )}
            </div>

            {/* Post body */}
            <div className="space-y-2">
              <p className="text-sm text-(--neutral-on-background-strong) leading-relaxed">
                Just shipped the new permission system for Nuvix collections. You can now set
                granular access per role — right from the dashboard.
              </p>
              {role.canRead ? (
                <div className="radius-xs overflow-hidden bg-(--surface-background) border border-(--surface-border) p-3 flex items-center gap-3">
                  <ImageIcon className="size-8 text-(--neutral-on-background-weak) flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-(--neutral-on-background-strong)">
                      permissions-demo.mp4
                    </p>
                    <p className="text-[10px] text-(--neutral-on-background-weak)">1:24 · 12 MB</p>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Engagement row */}
            <div className="flex items-center gap-4 text-[10px] text-(--neutral-on-background-weak) pt-1">
              <span className="flex items-center gap-1">
                <HeartIcon className="size-3" /> 48 likes
              </span>
              <span>12 comments</span>
              {role.canSeeAnalytics ? (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="ml-auto font-mono text-emerald-400"
                >
                  ↑ 340% engagement
                </motion.span>
              ) : null}
            </div>

            {/* Divider */}
            <div className="border-t border-(--surface-border)" />

            {/* Action bar — morphs per role */}
            <div className="flex items-center gap-2 flex-wrap">
              {role.canComment ? (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-1.5 px-3 py-1.5 radius-xs text-[11px] font-medium bg-(--accent-alpha-weak) text-(--accent-on-background-strong) cursor-default"
                >
                  <MessageSquarePlusIcon className="size-3" />
                  Comment
                </motion.button>
              ) : (
                <span className="flex items-center gap-1.5 px-3 py-1.5 radius-xs text-[11px] text-(--neutral-on-background-weak) bg-(--surface-background) border border-dashed border-(--surface-border)">
                  <LockIcon className="size-3" />
                  Sign in to comment
                </span>
              )}

              {role.canEdit && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.05 }}
                  className="flex items-center gap-1.5 px-3 py-1.5 radius-xs text-[11px] font-medium bg-amber-400/10 text-amber-400 cursor-default"
                >
                  <PenLineIcon className="size-3" />
                  Edit
                </motion.button>
              )}

              {role.canDelete && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center gap-1.5 px-3 py-1.5 radius-xs text-[11px] font-medium bg-red-400/10 text-red-400 cursor-default"
                >
                  <Trash2Icon className="size-3" />
                  Delete
                </motion.button>
              )}
            </div>

            {/* Permissions summary — bottom */}
            <div className="mt-auto flex items-center gap-2 pt-3 border-t border-(--surface-border)">
              <span
                className={`text-[10px] font-medium px-2 py-0.5 radius-xs ${role.bg} ${role.color}`}
              >
                {role.label}
              </span>
              <span className="text-[10px] text-(--neutral-on-background-weak)">
                {role.key === "public" && "Read-only · no actions · no private data"}
                {role.key === "user" && "Read + comment · no edit or admin access"}
                {role.key === "admin" && "Full access · edit · delete · analytics · PII"}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

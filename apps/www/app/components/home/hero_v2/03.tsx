"use client";

import { AnimatedBeam } from "components/magicui/animated-beam";
import {
  DatabaseIcon,
  ShieldCheckIcon,
  HardDriveIcon,
  BellIcon,
  BrainCircuitIcon,
  CodeIcon,
} from "lucide-react";
import { motion } from "motion/react";
import { useRef } from "react";

// ─── Service node component ──────────────────────────────────────────────────

const ServiceNode = ({
  ref,
  icon: Icon,
  label,
  color,
  bg,
  delay = 0,
}: {
  ref: React.RefObject<HTMLDivElement | null>;
  icon: React.ElementType;
  label: string;
  color: string;
  bg: string;
  delay?: number;
}) => (
  <motion.div
    ref={ref}
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.35, delay }}
    className="flex items-center gap-2.5 bg-(--page-background) border border-(--surface-border) radius-xs px-3 py-2 z-10"
  >
    <div className={`p-1 radius-xs ${bg}`}>
      <Icon className={`size-3.5 ${color}`} />
    </div>
    <span className="text-xs font-medium text-(--neutral-on-background-strong)">{label}</span>
  </motion.div>
);

// ─── Central hub ─────────────────────────────────────────────────────────────

const CenterHub = ({ ref }: { ref: React.RefObject<HTMLDivElement | null> }) => (
  <motion.div
    ref={ref}
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4, delay: 0.2 }}
    className="relative flex flex-col items-center justify-center size-24 radius-xs bg-(--page-background) border-2 border-(--accent-alpha-weak) z-10"
  >
    <div className="size-2.5 rounded-full bg-(--accent-on-background-strong) animate-pulse mb-1.5" />
    <span className="text-[11px] font-semibold text-(--neutral-on-background-strong)">Nuvix</span>
    <span className="text-[9px] text-(--neutral-on-background-weak)">unified API</span>
  </motion.div>
);

// ─── Main component ──────────────────────────────────────────────────────────

export const O3 = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);

  const dbRef = useRef<HTMLDivElement>(null);
  const authRef = useRef<HTMLDivElement>(null);
  const storageRef = useRef<HTMLDivElement>(null);
  const msgRef = useRef<HTMLDivElement>(null);
  const vectorRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<HTMLDivElement>(null);

  return (
    <div className="p-2.5 bg-(--surface-background) radius-xs size-full flex-grow flex flex-col min-h-[500px]">
      {/* ── Architecture diagram ──────────────────────────────────────── */}
      <div
        ref={containerRef}
        className="bg-(--page-background) radius-xs flex-1 relative flex items-center justify-center overflow-hidden p-6"
      >
        {/* Left column of services */}
        <div className="absolute left-6 top-0 bottom-0 flex flex-col items-start justify-center gap-5">
          <ServiceNode
            ref={dbRef}
            icon={DatabaseIcon}
            label="Database"
            color="text-blue-400"
            bg="bg-blue-400/10"
            delay={0}
          />
          <ServiceNode
            ref={authRef}
            icon={ShieldCheckIcon}
            label="Auth"
            color="text-emerald-400"
            bg="bg-emerald-400/10"
            delay={0.06}
          />
          <ServiceNode
            ref={storageRef}
            icon={HardDriveIcon}
            label="Storage"
            color="text-violet-400"
            bg="bg-violet-400/10"
            delay={0.12}
          />
        </div>

        {/* Center hub */}
        <CenterHub ref={centerRef} />

        {/* Right column of services */}
        <div className="absolute right-6 top-0 bottom-0 flex flex-col items-end justify-center gap-5">
          <ServiceNode
            ref={msgRef}
            icon={BellIcon}
            label="Messaging"
            color="text-amber-400"
            bg="bg-amber-400/10"
            delay={0.18}
          />
          <ServiceNode
            ref={vectorRef}
            icon={BrainCircuitIcon}
            label="Vector"
            color="text-pink-400"
            bg="bg-pink-400/10"
            delay={0.24}
          />
          <ServiceNode
            ref={apiRef}
            icon={CodeIcon}
            label="APIs"
            color="text-cyan-400"
            bg="bg-cyan-400/10"
            delay={0.3}
          />
        </div>

        {/* Animated beams — left to center */}
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={dbRef}
          toRef={centerRef}
          gradientStartColor="#60a5fa"
          gradientStopColor="#818cf8"
          curvature={-40}
          duration={4}
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={authRef}
          toRef={centerRef}
          gradientStartColor="#34d399"
          gradientStopColor="#818cf8"
          curvature={0}
          duration={4.5}
          delay={0.5}
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={storageRef}
          toRef={centerRef}
          gradientStartColor="#a78bfa"
          gradientStopColor="#818cf8"
          curvature={40}
          duration={5}
          delay={1}
        />

        {/* Animated beams — center to right */}
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={centerRef}
          toRef={msgRef}
          gradientStartColor="#818cf8"
          gradientStopColor="#fbbf24"
          curvature={-40}
          duration={4}
          delay={0.3}
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={centerRef}
          toRef={vectorRef}
          gradientStartColor="#818cf8"
          gradientStopColor="#f472b6"
          curvature={0}
          duration={4.5}
          delay={0.8}
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={centerRef}
          toRef={apiRef}
          gradientStartColor="#818cf8"
          gradientStopColor="#22d3ee"
          curvature={40}
          duration={5}
          delay={1.3}
        />
      </div>

      {/* ── Bottom caption bar ────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex items-center gap-3 mt-2 px-3 py-2 bg-(--page-background) radius-xs overflow-x-auto"
      >
        {[
          { label: "Database", dot: "bg-blue-400" },
          { label: "Auth", dot: "bg-emerald-400" },
          { label: "Storage", dot: "bg-violet-400" },
          { label: "Messaging", dot: "bg-amber-400" },
          { label: "Vector", dot: "bg-pink-400" },
          { label: "APIs", dot: "bg-cyan-400" },
        ].map((s) => (
          <div key={s.label} className="flex items-center gap-1.5 flex-shrink-0">
            <div className={`size-1.5 rounded-full ${s.dot}`} />
            <span className="text-[10px] text-(--neutral-on-background-weak)">{s.label}</span>
          </div>
        ))}
        <span className="ml-auto text-[10px] text-(--neutral-on-background-weak) flex-shrink-0">
          Same auth · same schema · same events
        </span>
      </motion.div>
    </div>
  );
};

"use client";

import { cn } from "@nuvix/sui/lib/utils";
import { Icon } from "@nuvix/ui/components";
import React, { forwardRef, useRef } from "react";

import { AnimatedBeam } from "~/magicui/animated-beam";

const colors = {
  start: 'var(--accent-alpha-medium)',
  stop: 'var(--accent-solid-weak)',
}

const Circle = forwardRef<HTMLDivElement, { className?: string; children?: React.ReactNode }>(
  ({ className, children }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "z-10 flex size-12 items-center justify-center rounded-full border-2 backdrop-blur-md neutral-background-alpha-weak p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]",
          className,
        )}
      >
        {children}
      </div>
    );
  },
);

Circle.displayName = "Circle";

export function Messaging({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const div1Ref = useRef<HTMLDivElement>(null);
  const div2Ref = useRef<HTMLDivElement>(null);
  const div3Ref = useRef<HTMLDivElement>(null);

  const div6Ref = useRef<HTMLDivElement>(null);
  const div7Ref = useRef<HTMLDivElement>(null);

  return (
    <div
      className={cn(
        "relative flex h-48 w-full items-center justify-center overflow-hidden p-10 ",
        className,
      )}
      ref={containerRef}
    >
      <div className="flex size-full max-w-lg flex-row items-stretch justify-between gap-10">
        <div className="flex flex-col justify-center">
          <Circle ref={div7Ref}>
            <Icon name="person" />
          </Circle>
        </div>
        <div className="flex flex-col justify-center">
          <Circle ref={div6Ref} className="size-16">
            <Icon name="messaging" />
          </Circle>
        </div>
        <div className="flex flex-col justify-center gap-2">
          <Circle ref={div1Ref}>
            <Icon name="mail" />
          </Circle>
          <Circle ref={div2Ref}>
            <Icon name="sms" />
          </Circle>
          <Circle ref={div3Ref}>
            <Icon name="push" />
          </Circle>
        </div>
      </div>

      {/* AnimatedBeams */}
      <AnimatedBeam
        gradientStartColor={colors.start}
        gradientStopColor={colors.stop}
        containerRef={containerRef} fromRef={div1Ref} toRef={div6Ref} duration={3} />
      <AnimatedBeam
        gradientStartColor={colors.start}
        gradientStopColor={colors.stop}
        containerRef={containerRef} fromRef={div2Ref} toRef={div6Ref} duration={3} />
      <AnimatedBeam
        gradientStartColor={colors.start}
        gradientStopColor={colors.stop}
        containerRef={containerRef} fromRef={div3Ref} toRef={div6Ref} duration={3} />
      <AnimatedBeam
        containerRef={containerRef}
        gradientStartColor="var(--brand-alpha-medium)"
        gradientStopColor="var(--brand-on-background-weak)"
        fromRef={div6Ref}
        toRef={div7Ref}
        duration={3}
      />
    </div>
  );
}

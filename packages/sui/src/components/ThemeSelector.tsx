"use client";
import { useTheme } from "next-themes";
import { usePreference } from "../hooks/usePreference";
import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { cn } from "../lib/utils";
import React, { useMemo } from "react";

export const ThemeSelector = ({
  className,
  ...rest
}: React.ComponentProps<typeof DialogTrigger>) => {
  const { setPref, getPref } = usePreference();
  const { resolvedTheme } = useTheme();
  const neutral = getPref()?.neutral;
  const variant = useMemo(() => (resolvedTheme === "dark" ? 200 : 900), [resolvedTheme]);

  const themes = [
    { name: "Primary", value: "custom", description: "Your system's default color scheme." },
    { name: "Gray", value: "gray", description: "A classic, understated grayscale palette." },
    { name: "Slate", value: "slate", description: "A cool, sophisticated blue-gray theme." },
    { name: "Sand", value: "sand", description: "A warm, inviting earthy tone." },
  ];

  return (
    <Dialog>
      <DialogTrigger
        className={cn(
          "size-6 page-background flex items-center justify-center rounded-md border-2 border-muted hover:bg-accent/50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-accent",
          className,
        )}
        {...rest}
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Theme</DialogTitle>
          <DialogDescription>
            Choose your preferred color theme for the application.
          </DialogDescription>
        </DialogHeader>
        <RadioGroup
          value={neutral}
          onValueChange={(value) => setPref({ neutral: value ?? "custom" })}
        >
          <div className="grid grid-cols-2 gap-4">
            {themes.map((t, i) => (
              <RadioGroupItem
                value={t.value}
                key={i}
                data-neutral={t.value}
                style={{
                  background: `var(--scheme-${t.value === "custom" ? "neutral" : t.value}-${variant}, var(--page-background))`,
                }}
                className="relative flex cursor-pointer select-none items-center justify-center rounded-xs border border-border p-4 text-center hover:shadow-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 data-[state=checked]:border-primary data-[state=checked]:ring-2 data-[state=checked]:ring-primary"
                title={t.description}
              >
                <p className="font-label font-m neutral-on-background-strong">{t.name}</p>
              </RadioGroupItem>
            ))}
          </div>
        </RadioGroup>
      </DialogContent>
    </Dialog>
  );
};

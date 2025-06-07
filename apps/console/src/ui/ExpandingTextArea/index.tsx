"use client";

import { Textarea } from "@chakra-ui/react";
import { cn } from "@nuvix/sui/lib/utils";
import React, { forwardRef, useImperativeHandle, useRef } from "react";

export interface ExpandingTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /* The value of the textarea. Required to calculate the height of the textarea. */
  value: string;
}

/**
 * This is a custom TextArea component that expands based on the content.
 */
const ExpandingTextArea = forwardRef<HTMLTextAreaElement, ExpandingTextAreaProps>(
  ({ className, value, ...props }, ref) => {
    const internalRef = useRef<HTMLTextAreaElement | null>(null);

    useImperativeHandle(ref, () => internalRef.current as HTMLTextAreaElement, []);

    const updateTextAreaHeight = (element: HTMLTextAreaElement | null) => {
      if (!element) return;

      // Update the height
      if (!value) {
        element.style.height = "auto";
        element.style.minHeight = "36px";
      } else {
        element.style.height = "auto";
        element.style.height = element.scrollHeight + "px";
      }
    };

    return (
      <Textarea
        ref={(element) => {
          if (element) {
            internalRef.current = element;
            updateTextAreaHeight(element);
          }
        }}
        rows={1}
        aria-expanded={false}
        className={cn("h-auto resize-none box-border", className)}
        value={value}
        {...props}
      />
    );
  },
);

ExpandingTextArea.displayName = "ExpandingTextArea";

export { ExpandingTextArea };

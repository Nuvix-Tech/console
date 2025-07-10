"use client";

import type React from "react";
import { forwardRef } from "react";
import { Flex } from ".";
import styles from "./Card.module.scss";
import classNames from "classnames";

interface CardProps extends React.ComponentProps<typeof Flex> {
  children?: React.ReactNode;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, style, className, ...rest }, ref) => {
    return (
      <Flex
        ref={ref}
        background="surface"
        transition="macro-medium"
        border="neutral-medium"
        cursor="interactive"
        className={classNames(styles.card, className)}
        {...rest}
      >
        {children}
      </Flex>
    );
  },
);

Card.displayName = "Card";
export { Card };

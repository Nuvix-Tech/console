import { SimpleGrid } from "@chakra-ui/react";
import { cn } from "@nuvix/sui/lib/utils";
import { Card, SmartLink } from "@nuvix/ui/components";
import React from "react";

export const GridCard = ({
  href,
  className,
  ...props
}: React.ComponentProps<typeof Card> & { href?: string }) => {
  return (
    <SmartLink unstyled fillWidth href={href} data-disable-progress={true}>
      <Card
        radius="l"
        direction="column"
        vertical="space-between"
        horizontal="start"
        padding="m"
        fillWidth
        className={cn(
          "!bg-(--neutral-alpha-weak) dark:!bg-(--neutral-background-medium) hover:!bg-(--neutral-alpha-medium) dark:hover:!bg-(--neutral-alpha-medium)",
          className,
        )}
        {...props}
      />
    </SmartLink>
  );
};

export const GridWrapper = ({ children, ...props }: React.ComponentProps<typeof SimpleGrid>) => {
  return (
    <SimpleGrid width="full" gap="8" columns={{ base: 1, mdToLg: 2, lgTo2xl: 3 }} {...props}>
      {children}
    </SimpleGrid>
  );
};

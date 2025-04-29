import React, { PropsWithChildren } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Stack, StackProps } from "@chakra-ui/react";
import { Separator } from "../ui/separator";

interface InfoCardProps {}

interface UpdateCardProps extends PropsWithChildren {
  actions?: React.ReactNode;
}

export const CardBox = (props: UpdateCardProps) => {
  const { children, actions } = props;

  return (
    <>
      <Card className="neutral-background-alpha-weak neutral-border-alpha-medium shadow-none">
        <CardContent>{children}</CardContent>
        {actions ? (
          <>
            <Separator className="neutral-background-alpha-weak" />
            <CardFooter className={"justify-end"}>{actions}</CardFooter>{" "}
          </>
        ) : null}
      </Card>
    </>
  );
};

export const CardBoxBody = (props: StackProps) => {
  return <Stack direction={{ base: "column", md: "row" }} width={"full"} gap={"8"} {...props} />;
};

export const CardBoxItem = (props: StackProps) => {
  return <Stack maxW={{ base: "full", md: "1/2" }} width={"full"} {...props} />;
};

export const CardBoxTitle = (props: any) => {
  return <CardTitle {...props} />;
};

export const CardBoxDesc = (props: any) => {
  return <CardDescription {...props} />;
};

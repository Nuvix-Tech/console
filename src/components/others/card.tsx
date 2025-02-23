import { Card, Separator, Stack, StackProps, Text, TextProps } from "@chakra-ui/react";
import React, { PropsWithChildren } from "react";

interface InfoCardProps {}

interface UpdateCardProps extends PropsWithChildren {
  actions?: React.ReactNode;
}

export const CardBox = (props: UpdateCardProps) => {
  const { children, actions } = props;

  return (
    <>
      <Card.Root variant={"outline"}>
        <Card.Body>{children}</Card.Body>
        {actions ? (
          <>
            <Separator variant={"dashed"} paddingBottom={"6"} />
            <Card.Footer justifyContent={"flex-end"}>{actions}</Card.Footer>{" "}
          </>
        ) : null}
      </Card.Root>
    </>
  );
};

export const CardBoxBody = (props: StackProps) => {
  return <Stack direction={{ base: "column", md: "row" }} width={"full"} gap={"8"} {...props} />;
};

export const CardBoxItem = (props: StackProps) => {
  return <Stack maxW={{ base: "full", md: "1/2" }} width={"full"} {...props} />;
};

export const CardBoxTitle = (props: Card.TitleProps) => {
  return <Card.Title {...props} />;
};

export const CardBoxDesc = (props: TextProps) => {
  return <Text textStyle={"sm"} color={"fg.muted"} {...props} />;
};

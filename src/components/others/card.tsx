import { Card, Separator } from "@chakra-ui/react";
import React, { PropsWithChildren } from "react";

interface InfoCardProps {}

interface UpdateCardProps extends PropsWithChildren {
  actions: React.ReactNode;
}

export const CardBox = (props: UpdateCardProps) => {
  const { children, actions } = props;

  return (
    <>
      <Card.Root variant={"subtle"}>
        <Card.Body>{children}</Card.Body>
        <Separator variant={"dotted"} paddingBottom={"6"} />
        <Card.Footer justifyContent={"flex-end"}>{actions}</Card.Footer>
      </Card.Root>
    </>
  );
};

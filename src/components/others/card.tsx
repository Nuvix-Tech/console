import { Row } from "@/ui/components";
import {
  Button,
  ButtonProps,
  Card,
  Input,
  InputProps,
  Separator,
  Stack,
  Text,
} from "@chakra-ui/react";
import React, { PropsWithChildren } from "react";
import { Field, FieldProps } from "../ui/field";

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

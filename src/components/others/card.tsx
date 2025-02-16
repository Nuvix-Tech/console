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
import React from "react";
import { Field, FieldProps } from "../ui/field";

interface InfoCardProps {}

interface UpdateCardProps {
  label: string;
  description?: React.ReactNode;
  button?: ButtonProps;
  input?: InputProps;
  field?: FieldProps;
  onSubmit?: () => void;
}

export const CardUpdater = (props: UpdateCardProps) => {
  const { label, description, button, onSubmit, input, field } = props;

  // if (!label || !description || !button || !onSubmit) {
  //     throw new Error("Missing required props");
  // }

  return (
    <>
      <Card.Root variant={"subtle"}>
        <Card.Body>
          <Stack direction={{ base: "column", md: "row" }} width={"full"}>
            <Stack maxW={{ base: "full", md: "1/2" }} width={"full"}>
              <Card.Title>{label}</Card.Title>
              <Text textStyle={"sm"}>{description}</Text>
            </Stack>
            <Stack maxW={{ base: "full", md: "1/2" }} width={"full"}>
              <Field width={"full"} {...field}>
                <Input width={"full"} {...input} />
              </Field>
            </Stack>
          </Stack>
        </Card.Body>
        <Separator variant={"dotted"} paddingBottom={"6"} />
        <Card.Footer justifyContent={"flex-end"}>
          <Button children={"Update"} {...button} onClick={onSubmit} />
        </Card.Footer>
      </Card.Root>
    </>
  );
};

import { Chip, CloseButton, Column, Input, Row, Text } from "@nuvix/ui/components";
import { Pencil } from "lucide-react";
import React from "react";
import { InputField } from "./others/forms";

type CustomIDProps = {
  label: string;
  id?: string;
  setID?: (id: string) => void;
  name?: string;
};

export const CustomID = ({ label, name, id, setID }: CustomIDProps) => {
  const [show, setShow] = React.useState(false);

  return (
    <>
      {!show && (
        <Chip
          selected={false}
          label={label}
          onClick={() => setShow(true)}
          prefixIcon={Pencil}
          iconButtonProps={{
            tooltip: `Custom ${label}`,
            tooltipPosition: "top",
          }}
        />
      )}

      {show && (
        <>
          <Column
            paddingY="16"
            background="neutral-alpha-weak"
            radius="l"
            gap="4"
            position="relative"
          >
            <Column borderBottom="neutral-alpha-weak" paddingBottom="8" paddingX="16">
              <Text variant="label-strong-s">{label}</Text>
              <Text variant="body-default-s" onBackground="neutral-weak">
                Enter custom {label}, or leave it blank to generate a random one.
              </Text>
              <CloseButton className="!absolute !top-2 !right-2" onClick={() => setShow(false)} />
            </Column>
            <Column paddingX="16">
              {name && <InputField name={name} maxLength={36} placeholder={label} />}
              {id && setID && (
                <Input
                  labelAsPlaceholder
                  label={label}
                  maxLength={36}
                  onChange={(e) => {
                    setID?.(e.target.value);
                  }}
                  value={id}
                />
              )}
              <Text
                variant="body-default-xs"
                onBackground="neutral-weak"
                marginTop="4"
                marginLeft="8"
              >
                Allowed characters: lowercase alphanumeric and non-leading hyphens
              </Text>
            </Column>
          </Column>
        </>
      )}
    </>
  );
};

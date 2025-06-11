"use client";
import { SqlEditor } from "@/components/sql-editor";
import { Column, Text } from "@nuvix/ui/components";

export const SqlEditorPage = ({ id }: { id: string }) => {
  return (
    <>
      <Column
        fillHeight
        borderWidth={1}
        background="surface"
        radius="l"
        overflow="hidden"
        vertical="center"
        horizontal="center"
      >
        {/* <SqlEditor /> */}
        <Text variant="heading-strong-m">Comming Soon</Text>
      </Column>
    </>
  );
};

import React from "react";
import { useDataGrid } from "./provider";
import { ActionBar, Portal } from "@chakra-ui/react";
import { Button, CloseButton } from "@/ui/components";

type Props = {
  actions?: React.ReactNode;
};

export const DataActionBar = ({ actions }: Props) => {
  const { table } = useDataGrid();
  const { getSelectedRowModel, toggleAllRowsSelected } = table;

  return (
    <ActionBar.Root open={getSelectedRowModel().rows.length > 0}>
      <Portal>
        <ActionBar.Positioner zIndex={999}>
          <ActionBar.Content
            background={"var(--neutral-background-medium)"}
            css={{ borderRadius: "var(--radius-l)" }}
          >
            <ActionBar.SelectionTrigger borderColor={"var(--neutral-border-medium)"}>
              {getSelectedRowModel().rows.length} selected
            </ActionBar.SelectionTrigger>

            {actions ? <ActionBar.Separator /> : null}
            {actions}

            <ActionBar.CloseTrigger asChild onClick={() => toggleAllRowsSelected(false)}>
              <CloseButton size="s" />
            </ActionBar.CloseTrigger>
          </ActionBar.Content>
        </ActionBar.Positioner>
      </Portal>
    </ActionBar.Root>
  );
};

type ActionButtonProps<T extends unknown> = Omit<React.ComponentProps<typeof Button>, "onClick"> & {
  onClick?: (values: T[]) => void;
  disabled?: boolean;
};

export const ActionButton = <T,>({ onClick, ...props }: ActionButtonProps<T>) => {
  const { table } = useDataGrid<T>();
  const { getSelectedRowModel } = table;
  const selectedRows = getSelectedRowModel().rows.map((r) => r.original);

  return (
    <Button {...(props as any)} onClick={() => onClick?.(selectedRows)}>
      {props.children}
    </Button>
  );
};

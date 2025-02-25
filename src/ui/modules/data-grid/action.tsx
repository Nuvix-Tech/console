import React from "react";
import { useDataGrid } from "./provider";
import { ButtonProps } from "@chakra-ui/react";
import { ActionBar, Button, Portal } from "@chakra-ui/react";
import { CloseButton } from "@/components/ui/close-button";

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
          <ActionBar.Content>
            <ActionBar.SelectionTrigger>
              {getSelectedRowModel().rows.length} selected
            </ActionBar.SelectionTrigger>

            {actions ? <ActionBar.Separator /> : null}
            {actions}

            <ActionBar.CloseTrigger asChild onClick={() => toggleAllRowsSelected(false)}>
              <CloseButton size="sm" />
            </ActionBar.CloseTrigger>
          </ActionBar.Content>
        </ActionBar.Positioner>
      </Portal>
    </ActionBar.Root>
  );
};

type ActionButtonProps<T extends unknown> = Omit<ButtonProps, "onClick"> & {
  onClick?: (values: T[]) => void;
  disabled?: boolean;
};

export const ActionButton = <T,>({ onClick, ...props }: ActionButtonProps<T>) => {
  const { table } = useDataGrid<T>();
  const { getSelectedRowModel } = table;
  const selectedRows = getSelectedRowModel().rows.map((r) => r.original);

  return (
    <Button {...props} onClick={() => onClick?.(selectedRows)}>
      {props.children}
    </Button>
  );
};

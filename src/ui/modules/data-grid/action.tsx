import React from "react";
import {
  ActionBarContent,
  ActionBarRoot,
  ActionBarSelectionTrigger,
  ActionBarSeparator,
} from "@/components/ui/action-bar";
import { useDataGrid } from "./provider";
import { Button, ButtonProps } from "@chakra-ui/react";

type Props = {
  actions?: React.ReactNode;
};

export const DataActionBar = ({ actions }: Props) => {
  const { table } = useDataGrid();
  const { getSelectedRowModel } = table;

  return (
    <ActionBarRoot open={getSelectedRowModel().rows.length > 0}>
      <ActionBarContent>
        <ActionBarSelectionTrigger>
          {getSelectedRowModel().rows.length} selected
        </ActionBarSelectionTrigger>
        {actions ? <ActionBarSeparator /> : null}
        {actions}
      </ActionBarContent>
    </ActionBarRoot>
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

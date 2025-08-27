import type { Key } from "react";
import { TriggerEvent, useContextMenu } from "react-contexify";
import { RenderRowProps, Row } from "react-data-grid";

import { ROW_CONTEXT_MENU_ID } from "../menu";
import type { Models } from "@nuvix/console";

export default function RowRenderer(key: Key, props: RenderRowProps<Models.Document>) {
  const { show: showContextMenu } = useContextMenu();

  function displayMenu(e: TriggerEvent) {
    showContextMenu({
      event: e,
      id: ROW_CONTEXT_MENU_ID,
      props: { rowIdx: props.rowIdx },
    });
  }

  return <Row key={key} {...props} onContextMenu={displayMenu} />;
}

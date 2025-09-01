import { useState } from "react";

import type { SpreadsheetData } from "./SpreadsheetImport.types";
import { Collapsible } from "@chakra-ui/react";
import { SidePanel } from "@/ui/SidePanel";
import { Chip, IconButton, Text } from "@nuvix/ui/components";

interface SpreadSheetImportConfigurationProps {
  spreadsheetData: SpreadsheetData;
  selectedHeaders: string[];
  onToggleHeader: (header: string) => void;
}

const SpreadsheetImportConfiguration = ({
  spreadsheetData,
  selectedHeaders,
  onToggleHeader,
}: SpreadSheetImportConfigurationProps) => {
  const [expandConfiguration, setExpandConfiguration] = useState(false);

  return (
    <Collapsible.Root
      open={expandConfiguration}
      onOpenChange={(d) => setExpandConfiguration(d.open)}
      className={""}
    >
      <Collapsible.Trigger asChild>
        <SidePanel.Content>
          <div className="py-1 flex items-center justify-between">
            <Text as={"p"} variant="label-strong-s">
              Configure import data
            </Text>
            <IconButton
              variant="tertiary"
              icon={expandConfiguration ? "chevronUp" : "chevronDown"}
              onClick={() => setExpandConfiguration(!expandConfiguration)}
            />
          </div>
        </SidePanel.Content>
      </Collapsible.Trigger>
      <Collapsible.Content>
        <SidePanel.Content>
          <div className="py-2 space-y-3">
            <div>
              <p className="text-sm neutral-on-background-medium">Select which columns to import</p>
              <p className="text-sm neutral-on-background-medium">
                By default, all columns are selected to be imported from your CSV
              </p>
            </div>
            <div className="flex items-center flex-wrap gap-2 pl-0.5 pb-0.5">
              {spreadsheetData.headers.map((header) => {
                const isSelected = selectedHeaders.includes(header);
                return (
                  <Chip
                    selected={isSelected}
                    label={header}
                    key={header}
                    onClick={() => onToggleHeader(header)}
                    className="!py-0.5"
                  />
                );
              })}
            </div>
          </div>
        </SidePanel.Content>
      </Collapsible.Content>
    </Collapsible.Root>
  );
};

export default SpreadsheetImportConfiguration;

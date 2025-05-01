import { ChevronDown } from "lucide-react";
import { useState } from "react";

// import { Button, cn, Collapsible, SidePanel } from "ui";
import type { SpreadsheetData } from "./SpreadsheetImport.types";
import { Collapsible } from "@chakra-ui/react";
import { SidePanel } from "@/ui/SidePanel";
import { Button } from "@nuvix/ui/components";
import { cn } from "@nuvix/sui/lib/utils";

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
            <p className="text-sm">Configure import data</p>
            <Button
              type="text"
              prefixIcon={
                <ChevronDown
                  size={18}
                  strokeWidth={2}
                  className={cn("text-foreground-light", expandConfiguration && "rotate-180")}
                />
              }
              className="px-1"
              onClick={() => setExpandConfiguration(!expandConfiguration)}
            />
          </div>
        </SidePanel.Content>
      </Collapsible.Trigger>
      <Collapsible.Content>
        <SidePanel.Content>
          <div className="py-2 space-y-3">
            <div>
              <p className="text-sm text-foreground-light">Select which columns to import</p>
              <p className="text-sm text-foreground-light">
                By default, all columns are selected to be imported from your CSV
              </p>
            </div>
            <div className="flex items-center flex-wrap gap-2 pl-0.5 pb-0.5">
              {spreadsheetData.headers.map((header) => {
                const isSelected = selectedHeaders.includes(header);
                return (
                  <Button
                    key={header}
                    type={isSelected ? "primary" : "default"}
                    className={cn("transition", isSelected ? "opacity-100" : "opacity-75")}
                    onClick={() => onToggleHeader(header)}
                  >
                    {header}
                  </Button>
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

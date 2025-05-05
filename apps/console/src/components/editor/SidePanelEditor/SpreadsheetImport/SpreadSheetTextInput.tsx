import { Textarea } from "@/components/others/ui";
import { Code } from "@chakra-ui/react";

interface SpreadSheetTextInputProps {
  input: string;
  onInputChange: (event: any) => void;
}

const SpreadSheetTextInput = ({ input, onInputChange }: SpreadSheetTextInputProps) => (
  <div className="space-y-10">
    <div>
      <p className="mb-2 text-sm text-foreground-light">
        Copy a table from a spreadsheet program such as Google Sheets or Excel and paste it in the
        field below. The first row should be the headers of the table, and your headers should not
        include any special characters other than hyphens (<Code>-</Code>) or underscores (
        <Code>_</Code>).
      </p>
      <p className="text-sm text-foreground-lighter">
        Tip: Datetime columns should be formatted as YYYY-MM-DD HH:mm:ss
      </p>
    </div>
    <Textarea
      size="sm"
      className="font-mono"
      rows={15}
      style={{ resize: "none" }}
      value={input}
      onChange={onInputChange}
    />
  </div>
);

export default SpreadSheetTextInput;

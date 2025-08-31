// [Unkown] Chuck this into the UI library with proper positioning logic via radix
// and proper width derivation using useRef. Unable to pass a ref to the Input component
//
// For now a couple of things are a bit hacky like width derivation, z-index, selection of suggestion
// with timeouts and a lot of unnecessary defensive guards - but these can go away when we port
// the component over to the UI library

import { noop } from "lodash";
import { List } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@nuvix/sui/components/dropdown-menu";
import type { Suggestion } from "./ColumnEditor.types";
import { IconButton } from "@nuvix/ui/components";
import { Input } from "@/components/others/ui";

const MAX_SUGGESTIONS = 3;

interface InputWithSuggestionsProps {
  label?: string;
  description?: string;
  placeholder?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  layout?: "horizontal" | "vertical";
  disabled?: boolean;
  className?: string;
  value: string;
  suggestions: Suggestion[];
  suggestionsTooltip?: string;
  suggestionsHeader?: string;
  onChange: (event: any) => void;
  onSelectSuggestion: (suggestion: Suggestion) => void;
  "data-testid"?: string;
}

const InputWithSuggestions = ({
  label,
  description,
  placeholder,
  size,
  layout,
  disabled = false,
  className = "",
  value = "",
  suggestions = [],
  suggestionsTooltip,
  suggestionsHeader,
  onChange = noop,
  onSelectSuggestion = noop,
  "data-testid": dataTestId,
}: InputWithSuggestionsProps) => {
  const ref = useRef(null);
  const [filteredSuggestions, setFilteredSuggestions] = useState<Suggestion[]>(suggestions);
  const showSuggestions = filteredSuggestions.length > 0;

  useEffect(() => {
    setFilteredSuggestions(suggestions.slice(0, MAX_SUGGESTIONS));
  }, [suggestions]);

  const onInputChange = (event: any) => {
    onChange(event);

    const inputText = event.target.value;

    if (suggestions.length > MAX_SUGGESTIONS) {
      const filteredSuggestions = inputText
        ? suggestions.filter((suggestion: Suggestion) => {
            return suggestion.name.indexOf(inputText) !== -1;
          })
        : suggestions;
      setFilteredSuggestions(filteredSuggestions.slice(0, MAX_SUGGESTIONS));
    }
  };

  return (
    <div ref={ref} className="relative">
      <Input
        label={label}
        helperText={description}
        placeholder={placeholder}
        size={size}
        orientation={layout}
        disabled={disabled}
        className={className}
        type="text"
        value={value}
        onChange={onInputChange}
        data-testid={dataTestId}
        hasSuffix={
          showSuggestions && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <IconButton
                  variant="ghost"
                  size="s"
                  tooltip={suggestionsTooltip || "Suggestions"}
                  tooltipPosition="bottom"
                >
                  <List strokeWidth={1.5} size={14} />
                </IconButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" side="bottom" className="max-w-[400px]">
                <DropdownMenuLabel>{suggestionsHeader || "Suggestions"}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {filteredSuggestions.map((suggestion: Suggestion) => (
                  <DropdownMenuItem
                    className="space-x-2"
                    key={suggestion.name}
                    onClick={() => onSelectSuggestion(suggestion)}
                  >
                    <div>{suggestion.name}</div>
                    <div className="neutral-on-background-weak">{suggestion.description}</div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )
        }
      />
    </div>
  );
};

export default InputWithSuggestions;

import type { ButtonProps, InputProps } from "@chakra-ui/react";
import { Button, Clipboard as ChakraClipboard, ClipboardRoot, IconButton, Input } from "@chakra-ui/react";
import * as React from "react";
import { LuCheck, LuClipboard, LuLink } from "react-icons/lu";

const ClipboardIcon = React.forwardRef<HTMLDivElement, ChakraClipboard.IndicatorProps>(
    function ClipboardIcon(props, ref) {
        return (
            <ChakraClipboard.Indicator copied={<LuCheck />} {...props} ref={ref}>
                <LuClipboard />
            </ChakraClipboard.Indicator>
        );
    },
);

const ClipboardCopyText = React.forwardRef<HTMLDivElement, ChakraClipboard.IndicatorProps & CopyIDProps>(
    function ClipboardCopyText(props, ref) {
        const { id, text, ...rest } = props;
        return (
            <ChakraClipboard.Indicator copied="Copied" {...rest} ref={ref}>
                {text ?? id}
            </ChakraClipboard.Indicator>
        );
    },
);

interface CopyIDProps {
    id: string;
    text?: string;
}

export const CopyID = React.forwardRef<HTMLButtonElement, ButtonProps & CopyIDProps>(
    function ClipboardButton(props, ref) {
        const { id, text, ...rest } = props;
        return (
            <ClipboardRoot value={id}>
                <ChakraClipboard.Trigger asChild>
                    <Button ref={ref} size="sm" variant="surface" {...rest} onClick={(event) => event.preventDefault()}>
                        <ClipboardCopyText id={id} text={text} />
                        <ClipboardIcon />
                    </Button>
                </ChakraClipboard.Trigger>
            </ClipboardRoot>
        );
    },
);
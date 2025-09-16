"use client";
import { Field as ChakraField, FieldErrorIcon, Stack } from "@chakra-ui/react";
import {
  Input as Input_Cui,
  InputGroup,
  InputProps,
  InputAddonProps,
  Textarea as ChakraTextarea,
  TextareaProps,
} from "@chakra-ui/react";
import * as React from "react";
import { RootFieldProps } from "./types";
import { Editor, EditorProps } from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { Loader } from "lucide-react";
import { useFormikContext } from "formik";

interface RootInputProps extends InputProps {
  addonProps?: InputAddonProps;
  hasSuffix?: React.ReactNode;
  hasPrefix?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, RootInputProps & RootFieldProps>(
  function InputField(props, ref) {
    const {
      addonProps,
      hasPrefix,
      hasSuffix,
      label,
      errorText,
      helperText,
      optionalText,
      orientation,
      ...rest
    } = props;

    const optional =
      typeof optionalText === "string" ? (
        <span className="text-xs ml-1 text-[var(--neutral-on-background-weak)]">
          {optionalText}
        </span>
      ) : (
        optionalText
      );
    const isHoriz = orientation === "horizontal";

    return (
      <ChakraField.Root
        orientation={orientation}
        width="full"
        justifyContent="space-between"
        alignItems={isHoriz ? "flex-start" : undefined}
        required={rest.required}
        invalid={!!errorText}
      >
        {label && (
          <ChakraField.Label
            flexDir={isHoriz ? "column" : undefined}
            alignItems={isHoriz ? "start" : undefined}
          >
            {label}
            <ChakraField.RequiredIndicator fallback={optional} />
          </ChakraField.Label>
        )}
        <Stack width={isHoriz ? "sm" : "full"} gap="2">
          <InputGroup startElement={hasPrefix} endElement={hasSuffix} {...addonProps}>
            <Input_Cui ref={ref} {...rest} />
          </InputGroup>
          {helperText && <ChakraField.HelperText>{helperText}</ChakraField.HelperText>}
          {errorText && <ChakraField.ErrorText>{errorText}</ChakraField.ErrorText>}
        </Stack>
      </ChakraField.Root>
    );
  },
);

interface RootTextareaProps extends TextareaProps {
  hasSuffix?: React.ReactNode;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, RootTextareaProps & RootFieldProps>(
  function TextAreaField(props, ref) {
    const { label, errorText, helperText, optionalText, orientation, hasSuffix, ...rest } = props;

    const optional =
      typeof optionalText === "string" ? (
        <span className="text-xs ml-1 text-[var(--neutral-on-background-weak)]">
          {optionalText}
        </span>
      ) : (
        optionalText
      );
    const isHoriz = orientation === "horizontal";

    return (
      <ChakraField.Root
        orientation={orientation}
        width="full"
        justifyContent="space-between"
        alignItems={isHoriz ? "flex-start" : undefined}
        required={rest.required}
        invalid={!!errorText}
      >
        {label && (
          <ChakraField.Label
            flexDir={isHoriz ? "column" : undefined}
            alignItems={isHoriz ? "start" : undefined}
          >
            {label}
            <ChakraField.RequiredIndicator fallback={optional} />
          </ChakraField.Label>
        )}
        <Stack width={isHoriz ? "sm" : "full"} gap="2">
          <div className="w-full relative">
            <ChakraTextarea ref={ref} paddingRight={hasSuffix ? "4" : undefined} {...rest} />
            {hasSuffix && <div className="absolute !top-2 !right-2">{hasSuffix}</div>}
          </div>
          {helperText && <ChakraField.HelperText>{helperText}</ChakraField.HelperText>}
          {errorText && <ChakraField.ErrorText>{errorText}</ChakraField.ErrorText>}
        </Stack>
      </ChakraField.Root>
    );
  },
);

export { TextArea as Textarea };

interface EditorAreaProps {
  required?: boolean;
}

export const EditorArea = React.forwardRef<
  HTMLTextAreaElement,
  RootFieldProps & EditorProps & EditorAreaProps
>(function EditorField(props, ref) {
  const { label, errorText, helperText, optionalText, orientation, required, ...rest } = props;
  const { resolvedTheme } = useTheme();
  const theme = React.useCallback(() => {
    if (resolvedTheme === "dark") {
      return "vs-dark";
    } else {
      return "light";
    }
  }, [resolvedTheme]);

  const isHoriz = orientation === "horizontal";

  return (
    <>
      <ChakraField.Root
        orientation={orientation}
        width="full"
        justifyContent="space-between"
        alignItems={isHoriz ? "flex-start" : undefined}
        required={required}
        invalid={!!errorText}
      >
        {label && (
          <ChakraField.Label
            flexDir={isHoriz ? "column" : undefined}
            alignItems={isHoriz ? "start" : undefined}
          >
            {label}
            <ChakraField.RequiredIndicator fallback={optionalText} />
          </ChakraField.Label>
        )}
        <Stack width={isHoriz ? "sm" : "full"} gap="2">
          <div className="w-full relative h-48 radius-l overflow-hidden neutral-border-medium border-solid border-1">
            <Editor
              theme={theme()}
              className="monaco-editor !bg-red-100"
              defaultLanguage="markdown"
              loading={<Loader className="animate-spin" strokeWidth={2} size={20} />}
              {...rest}
              options={{
                tabSize: 2,
                fontSize: 13,
                minimap: {
                  enabled: false,
                },
                wordWrap: "on",
                fixedOverflowWidgets: true,
                lineNumbersMinChars: 4,
                ...rest.options,
              }}
              onMount={(editor) => {
                editor.changeViewZones((accessor) => {
                  accessor.addZone({
                    afterLineNumber: 0,
                    heightInPx: 4,
                    domNode: document.createElement("div"),
                  });
                });
                // editor.focus();
              }}
            />
          </div>
          {helperText && <ChakraField.HelperText>{helperText}</ChakraField.HelperText>}
          {errorText && <ChakraField.ErrorText>{errorText}</ChakraField.ErrorText>}
        </Stack>
      </ChakraField.Root>
    </>
  );
});

export const EditorField = ({
  name,
  ...rest
}: React.ComponentProps<typeof EditorArea> & { name: string }) => {
  const { values, initialValues, setFieldValue, errors } = useFormikContext<any>();

  return (
    <EditorArea
      defaultValue={initialValues[name]}
      {...rest}
      value={values[name]}
      onChange={(value) => setFieldValue(name, value)}
      errorText={errors[name]?.toString()}
    />
  );
};

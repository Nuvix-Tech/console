import Editor from "@monaco-editor/react";
import { useEffect, useState } from "react";

type MonacoEditorProps = {
  width?: string | number | undefined;
  height?: string | number | undefined;
  value?: string | undefined;
  language?: string | undefined;
  readOnly?: boolean;
  onChange: (value: string | undefined) => void;
  onMount?: (editor: any) => void;
};

export const MonacoEditor = ({
  width,
  height,
  value,
  language,
  readOnly = false,
  onChange,
  onMount,
}: MonacoEditorProps) => {
  const [theme, setTheme] = useState("light");
  function handleEditorOnMount(editor: any) {
    // add margin above first line
    editor.changeViewZones((accessor: any) => {
      accessor.addZone({
        afterLineNumber: 0,
        heightInPx: 4,
        domNode: document.createElement("div"),
      });
    });

    // move cursor to the end of document
    const model = editor.getModel();
    const position = model.getPositionAt(value?.length);
    editor.setPosition(position);

    // auto focus on mount
    setTimeout(() => {
      editor?.focus();
    }, 0);

    if (onMount) onMount(editor);
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      const htmlElement = document.documentElement;
      const initialTheme = htmlElement.getAttribute("data-theme");

      if (initialTheme) {
        setTheme(initialTheme);
      }

      const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
          if (mutation.type === "attributes" && mutation.attributeName === "data-theme") {
            // Check if the mutated target is an Element before accessing getAttribute
            if (mutation.target instanceof Element) {
              setTheme(mutation.target.getAttribute("data-theme") || "");
            }
          }
        }
      });

      observer.observe(htmlElement, { attributes: true });

      return () => {
        observer.disconnect();
      };
    }
  }, []);

  return (
    <Editor
      width={width}
      height={height || "200px"}
      theme={theme}
      wrapperProps={{
        className: "grid-monaco-editor-container",
      }}
      className="grid-monaco-editor"
      defaultLanguage={language || "plaintext"}
      defaultValue={value}
      onChange={onChange}
      onMount={handleEditorOnMount}
      options={{
        readOnly,
        tabSize: 2,
        fontSize: 13,
        minimap: {
          enabled: false,
        },
        glyphMargin: false,
        folding: false,
        lineNumbers: "off",
        lineNumbersMinChars: 0,
        scrollBeyondLastLine: false,
        wordWrap: "on",
      }}
    />
  );
};

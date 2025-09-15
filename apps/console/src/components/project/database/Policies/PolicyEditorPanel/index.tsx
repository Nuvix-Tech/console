import { Monaco } from "@monaco-editor/react";
import type { PostgresPolicy } from "@nuvix/pg-meta";
import { useQueryClient } from "@tanstack/react-query";
import { isEqual } from "lodash";
import { memo, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import * as y from "yup";

import { useDatabasePolicyUpdateMutation } from "@/data/database-policies/database-policy-update-mutation";
import { databasePoliciesKeys } from "@/data/database-policies/keys";
import { QueryResponseError, useExecuteSqlMutation } from "@/data/sql/execute-sql-mutation";
import { Sheet, SheetContent, SheetFooter } from "@nuvix/sui/components/sheet";
import { LockedCreateQuerySection, LockedRenameQuerySection } from "./LockedQuerySection";
// import { PolicyDetailsV2 } from "./PolicyDetailsV2";
import { checkIfPolicyHasChanged, generateCreatePolicyQuery } from "./PolicyEditorPanel.utils";
import { PolicyEditorPanelHeader } from "./PolicyEditorPanelHeader";
import { PolicyTemplates } from "./PolicyTemplates";
import { QueryError } from "./QueryError";
import { RLSCodeEditor } from "./RLSCodeEditor";
import { useParams } from "next/navigation";
import { useProjectStore } from "@/lib/store";
import { useCheckPermission } from "@/hooks/useCheckPermissions";
import { PermissionAction } from "@/types";
import { cn } from "@nuvix/sui/lib/utils";
import { Checkbox } from "@nuvix/cui/checkbox";
import { Label } from "@nuvix/sui/components/label";
import { Button } from "@nuvix/ui/components";
import { ScrollArea } from "@nuvix/sui/components/scroll-area";
import ConfirmationModal from "@/components/editor/components/_confim_dialog";
import { Tabs } from "@chakra-ui/react";
import { useFormik } from "formik";
import { Form } from "@/components/others/forms";
import { PolicyDetailsV2 } from "./PolicyDetailsV2";

interface PolicyEditorPanelProps {
  visible: boolean;
  schema: string;
  searchString?: string;
  selectedTable?: string;
  selectedPolicy?: PostgresPolicy;
  onSelectCancel: () => void;
  authContext: "database" | "realtime";
}

type IStandaloneCodeEditor = import("monaco-editor").editor.IStandaloneCodeEditor;
const FormSchema = y.object({
  name: y.string().required().min(1, "Please provide a name"),
  table: y.string().required(),
  behavior: y.string().required(),
  command: y.string().required(),
  roles: y.string().required(),
});

export type PolicyFormValues = y.InferType<typeof FormSchema>;

/**
 * Using memo for this component because everything rerenders on window focus because of outside fetches
 */
export const PolicyEditorPanel = memo(function ({
  visible,
  schema,
  searchString,
  selectedTable,
  selectedPolicy,
  onSelectCancel,
  authContext,
}: PolicyEditorPanelProps) {
  const { id: ref } = useParams();
  const queryClient = useQueryClient();
  const { project: selectedProject, sdk } = useProjectStore((s) => s);

  const { can: canUpdatePolicies } = useCheckPermission(
    PermissionAction.TENANT_SQL_ADMIN_WRITE,
    "tables",
  );

  // [Joshen] Hyrid form fields, just spit balling to get a decent POC out
  const [using, setUsing] = useState("");
  const [check, setCheck] = useState("");
  const [fieldError, setFieldError] = useState<string>();
  const [showCheckBlock, setShowCheckBlock] = useState(true);

  const monacoOneRef = useRef<Monaco | null>(null);
  const editorOneRef = useRef<IStandaloneCodeEditor | null>(null);
  const [expOneLineCount, setExpOneLineCount] = useState(1);
  const [expOneContentHeight, setExpOneContentHeight] = useState(0);

  const monacoTwoRef = useRef<Monaco | null>(null);
  const editorTwoRef = useRef<IStandaloneCodeEditor | null>(null);
  const [expTwoLineCount, setExpTwoLineCount] = useState(1);
  const [expTwoContentHeight, setExpTwoContentHeight] = useState(0);

  const [error, setError] = useState<QueryResponseError>();
  const [errorPanelOpen, setErrorPanelOpen] = useState<boolean>(true);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [selectedDiff, setSelectedDiff] = useState<string>();

  const [showTools, setShowTools] = useState<boolean>(false);
  const [isClosingPolicyEditorPanel, setIsClosingPolicyEditorPanel] = useState<boolean>(false);

  const formId = "rls-editor";

  const defaultValues = {
    name: "",
    table: "",
    behavior: "permissive",
    command: "select",
    roles: "",
  };
  const form = useFormik<y.InferType<typeof FormSchema>>({
    initialValues: defaultValues,
    validationSchema: FormSchema,
    onSubmit: () => {}, // we handle submission outside of formik
  });

  const { name, table, behavior, command, roles } = form.values;
  const supportWithCheck = ["update", "all"].includes(command);
  const isRenamingPolicy = selectedPolicy !== undefined && name !== selectedPolicy.name;

  const { mutate: executeMutation, isPending: isExecuting } = useExecuteSqlMutation({
    onSuccess: async () => {
      // refresh all policies
      await queryClient.invalidateQueries({ queryKey: databasePoliciesKeys.list(ref as string) });
      toast.success("Successfully created new policy");
      onSelectCancel();
    },
    onError: (error) => setError(error),
  });

  const { mutate: updatePolicy, isPending: isUpdating } = useDatabasePolicyUpdateMutation({
    onSuccess: () => {
      toast.success("Successfully updated policy");
      onSelectCancel();
    },
  });

  const onClosingPanel = () => {
    const editorOneValue = editorOneRef.current?.getValue().trim() ?? null;
    const editorOneFormattedValue = !editorOneValue ? null : editorOneValue;
    const editorTwoValue = editorTwoRef.current?.getValue().trim() ?? null;
    const editorTwoFormattedValue = !editorTwoValue ? null : editorTwoValue;

    const policyCreateUnsaved =
      selectedPolicy === undefined &&
      (name.length > 0 || roles.length > 0 || editorOneFormattedValue || editorTwoFormattedValue);
    const policyUpdateUnsaved =
      selectedPolicy !== undefined
        ? checkIfPolicyHasChanged(selectedPolicy, {
          name,
          roles: roles.length === 0 ? ["public"] : roles.split(", "),
          definition: editorOneFormattedValue,
          check: command === "INSERT" ? editorOneFormattedValue : editorTwoFormattedValue,
        })
        : false;

    if (policyCreateUnsaved || policyUpdateUnsaved) {
      setIsClosingPolicyEditorPanel(true);
    } else {
      onSelectCancel();
    }
  };

  const onSubmit = (data: y.InferType<typeof FormSchema>) => {
    const { name, table, behavior, command, roles } = data;
    let using = editorOneRef.current?.getValue().trim() ?? undefined;
    let check = editorTwoRef.current?.getValue().trim();

    // [Terry] b/c editorOneRef will be the check statement in this scenario
    if (command === "insert") {
      check = using;
    }

    if (command === "insert" && (check === undefined || check.length === 0)) {
      return setFieldError("Please provide a SQL expression for the WITH CHECK statement");
    } else if (command !== "insert" && (using === undefined || using.length === 0)) {
      return setFieldError("Please provide a SQL expression for the USING statement");
    } else {
      setFieldError(undefined);
    }

    if (selectedPolicy === undefined) {
      const sql = generateCreatePolicyQuery({
        name: name,
        schema,
        table,
        behavior,
        command,
        roles: roles.length === 0 ? "public" : roles,
        using: using ?? "",
        check: command === "insert" ? (using ?? "") : (check ?? ""),
      });

      setError(undefined);
      executeMutation({
        sql,
        projectRef: selectedProject?.$id,
        sdk,
        handleError: (error) => {
          throw error;
        },
      });
    } else if (selectedProject !== undefined) {
      const payload: {
        name?: string;
        definition?: string;
        check?: string;
        roles?: string[];
      } = {};
      const updatedRoles = roles.length === 0 ? ["public"] : roles.split(", ");

      if (name !== selectedPolicy.name) payload.name = name;
      if (!isEqual(selectedPolicy.roles, updatedRoles)) payload.roles = updatedRoles;
      if (selectedPolicy.definition !== null && selectedPolicy.definition !== using)
        payload.definition = using;

      if (selectedPolicy.command === "INSERT") {
        // [Joshen] Cause editorOneRef will be the check statement in this scenario
        if (selectedPolicy.check !== null && selectedPolicy.check !== using) payload.check = using;
      } else {
        if (selectedPolicy.check !== null && selectedPolicy.check !== check) payload.check = check;
      }

      if (Object.keys(payload).length === 0) return onSelectCancel();

      updatePolicy({
        projectRef: selectedProject.$id,
        sdk,
        id: selectedPolicy?.id,
        payload,
      });
    }
  };

  // when the panel is closed, reset all values
  useEffect(() => {
    if (!visible) {
      editorOneRef.current?.setValue("");
      editorTwoRef.current?.setValue("");
      setShowTools(false);
      setIsClosingPolicyEditorPanel(false);
      setError(undefined);
      setShowDetails(false);
      setSelectedDiff(undefined);

      setUsing("");
      setCheck("");
      setShowCheckBlock(false);
      setFieldError(undefined);

      form.resetForm({ values: defaultValues });
    } else {
      if (canUpdatePolicies) setShowTools(true);
      if (selectedPolicy !== undefined) {
        const { name, action, table, command, roles } = selectedPolicy;
        form.resetForm({
          values: {
            name,
            table,
            behavior: action.toLowerCase(),
            command: command.toLowerCase(),
            roles: roles.length === 1 && roles[0] === "public" ? "" : roles.join(", "),
          },
        });
        if (selectedPolicy.definition) setUsing(`  ${selectedPolicy.definition}`);
        if (selectedPolicy.check) setCheck(`  ${selectedPolicy.check}`);
        if (selectedPolicy.check && selectedPolicy.command !== "INSERT") {
          setShowCheckBlock(true);
        }
      } else if (selectedTable !== undefined) {
        form.resetForm({ values: { ...defaultValues, table: selectedTable } });
      }
    }
  }, [visible]);

  // whenever the deps (current policy details, new error or error panel opens) change, recalculate
  // the height of the editor
  useEffect(() => {
    editorOneRef.current?.layout({ width: 0, height: 0 });
    window.requestAnimationFrame(() => {
      editorOneRef.current?.layout();
    });
  }, [showDetails, error, errorPanelOpen]);

  return (
    <>
      <Form {...form}>
        <Sheet open={visible} onOpenChange={() => onClosingPanel()}>
          <SheetContent
            closeIcon={false}
            // size={showTools ? 'lg' : 'default'}
            className={cn(
              "p-0 flex flex-row gap-0",
              showTools ? "!min-w-[100vw] lg:!min-w-[1000px]" : "!min-w-[100vw] lg:!min-w-[600px]",
            )}
          >
            <div className={cn("flex flex-col grow w-full", showTools && "w-[60%]")}>
              <PolicyEditorPanelHeader
                selectedPolicy={selectedPolicy}
                showTools={showTools}
                setShowTools={setShowTools}
              />

              <div className="flex flex-col h-full w-full justify-between overflow-y-auto">
                <PolicyDetailsV2
                  schema={schema}
                  searchString={searchString}
                  selectedTable={selectedTable}
                  isEditing={selectedPolicy !== undefined}
                  onUpdateCommand={(command: string) => {
                    setFieldError(undefined);
                    if (!["update", "all"].includes(command)) {
                      setShowCheckBlock(false);
                    } else {
                      setShowCheckBlock(true);
                    }
                  }}
                  authContext={authContext}
                />
                <div className="h-full">
                  <LockedCreateQuerySection
                    schema={schema}
                    selectedPolicy={selectedPolicy}
                    formFields={{ name, table, behavior, command, roles }}
                  />

                  <div
                    className="mt-1 relative block"
                    style={{
                      height: expOneContentHeight <= 100 ? `${8 + expOneContentHeight}px` : "108px",
                    }}
                  >
                    <RLSCodeEditor
                      disableTabToUsePlaceholder
                      readOnly={!canUpdatePolicies}
                      id="rls-exp-one-editor"
                      placeholder={
                        command === "insert"
                          ? "-- Provide a SQL expression for the with check statement"
                          : "-- Provide a SQL expression for the using statement"
                      }
                      defaultValue={command === "insert" ? check : using}
                      value={command === "insert" ? check : using}
                      editorRef={editorOneRef}
                      monacoRef={monacoOneRef as any}
                      lineNumberStart={6}
                      onChange={() => {
                        setExpOneContentHeight(editorOneRef.current?.getContentHeight() ?? 0);
                        setExpOneLineCount(editorOneRef.current?.getModel()?.getLineCount() ?? 1);
                      }}
                      onMount={() => {
                        setTimeout(() => {
                          setExpOneContentHeight(editorOneRef.current?.getContentHeight() ?? 0);
                          setExpOneLineCount(editorOneRef.current?.getModel()?.getLineCount() ?? 1);
                        }, 200);
                      }}
                    />
                  </div>

                  <div className="bg-surface-300 py-1">
                    <div className="flex items-center" style={{ fontSize: "14px" }}>
                      <div className="w-[57px]">
                        <p className="w-[31px] flex justify-end font-mono text-sm neutral-on-background-medium select-none">
                          {7 + expOneLineCount}
                        </p>
                      </div>
                      <p className="font-mono tracking-tighter">
                        {showCheckBlock ? (
                          <>
                            <span className="text-[#569cd6]">with check</span>{" "}
                            <span className="text-[#ffd700]">(</span>
                          </>
                        ) : (
                          <>
                            <span className="text-[#ffd700]">)</span>;
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  {showCheckBlock && (
                    <>
                      <div
                        className="mt-1 min-h-[28px] relative block"
                        style={{
                          height:
                            expTwoContentHeight <= 100 ? `${8 + expTwoContentHeight}px` : "108px",
                        }}
                      >
                        <RLSCodeEditor
                          disableTabToUsePlaceholder
                          readOnly={!canUpdatePolicies}
                          id="rls-exp-two-editor"
                          placeholder="-- Provide a SQL expression for the with check statement"
                          defaultValue={check}
                          value={check}
                          editorRef={editorTwoRef}
                          monacoRef={monacoTwoRef as any}
                          lineNumberStart={7 + expOneLineCount}
                          onChange={() => {
                            setExpTwoContentHeight(editorTwoRef.current?.getContentHeight() ?? 0);
                            setExpTwoLineCount(
                              editorTwoRef.current?.getModel()?.getLineCount() ?? 1,
                            );
                          }}
                          onMount={() => {
                            setTimeout(() => {
                              setExpTwoContentHeight(editorTwoRef.current?.getContentHeight() ?? 0);
                              setExpTwoLineCount(
                                editorTwoRef.current?.getModel()?.getLineCount() ?? 1,
                              );
                            }, 200);
                          }}
                        />
                      </div>
                      <div className="bg-surface-300 py-1">
                        <div className="flex items-center" style={{ fontSize: "14px" }}>
                          <div className="w-[57px]">
                            <p className="w-[31px] flex justify-end font-mono text-sm neutral-on-background-medium select-none">
                              {8 + expOneLineCount + expTwoLineCount}
                            </p>
                          </div>
                          <p className="font-mono tracking-tighter">
                            <span className="text-[#ffd700]">)</span>;
                          </p>
                        </div>
                      </div>
                    </>
                  )}

                  {isRenamingPolicy && (
                    <LockedRenameQuerySection
                      oldName={selectedPolicy.name}
                      newName={name}
                      schema={schema}
                      table={table}
                      lineNumber={8 + expOneLineCount + (showCheckBlock ? expTwoLineCount : 0)}
                    />
                  )}

                  {fieldError !== undefined && (
                    <p className="px-5 py-2 pb-0 text-sm text-red-900">{fieldError}</p>
                  )}

                  {supportWithCheck && (
                    <div className="px-5 py-3 flex items-center gap-x-2">
                      <Checkbox
                        id="use-check"
                        name="use-check"
                        checked={showCheckBlock}
                        onCheckedChange={() => {
                          setFieldError(undefined);
                          setShowCheckBlock(!showCheckBlock);
                        }}
                      />
                      <Label className="text-xs cursor-pointer" htmlFor="use-check">
                        Use check expression
                      </Label>
                    </div>
                  )}
                </div>

                <div className="flex flex-col">
                  {error !== undefined && (
                    <QueryError error={error} open={errorPanelOpen} setOpen={setErrorPanelOpen} />
                  )}
                  <SheetFooter className="flex flex-row items-center !justify-end px-5 py-4 w-full border-t">
                    <Button
                      type="default"
                      size="s"
                      variant="secondary"
                      disabled={isExecuting || isUpdating}
                      onClick={() => onClosingPanel()}
                    >
                      Cancel
                    </Button>

                    <Button
                      form={formId}
                      type="submit"
                      size="s"
                      loading={isExecuting || isUpdating}
                      disabled={!canUpdatePolicies || isExecuting || isUpdating}
                      tooltip={
                        !canUpdatePolicies
                          ? "You need additional permissions to update policies"
                          : undefined
                      }
                      tooltipPosition="top"
                    >
                      Save policy
                    </Button>
                  </SheetFooter>
                </div>
              </div>
            </div>
            {showTools && (
              <div
                className={cn(
                  "border-l shadow-[rgba(0,0,0,0.13)_-4px_0px_6px_0px] y-10",
                  showTools && "w-[50%]",
                  "neutral-background-alpha-weak",
                )}
              >
                <Tabs.Root
                  defaultValue="templates"
                  className="flex flex-col h-full w-full relative "
                >
                  <Tabs.List className="flex gap-4 px-content sticky top-0 y-10 border-b">
                    <Tabs.Trigger
                      key="templates"
                      value="templates"
                      className="px-0 py-0 data-[state=active]:!bg-transparent"
                    >
                      Templates
                    </Tabs.Trigger>
                  </Tabs.List>

                  <Tabs.Content
                    value="templates"
                    className={cn(
                      "!mt-0 overflow-y-auto h-[calc(100vh-40px)]",
                      "data-[state=active]:flex data-[state=active]:grow",
                    )}
                  >
                    <ScrollArea className="h-full w-full">
                      <PolicyTemplates
                        schema={schema}
                        table={table}
                        selectedPolicy={selectedPolicy}
                        selectedTemplate={selectedDiff}
                        onSelectTemplate={(value) => {
                          form.setFieldValue("name", value.name);
                          form.setFieldValue("behavior", "permissive");
                          form.setFieldValue("command", value.command.toLowerCase());
                          form.setFieldValue("roles", value.roles.join(", ") ?? "");

                          setUsing(`  ${value.definition}`);
                          setCheck(`  ${value.check}`);
                          setExpOneLineCount(1);
                          setExpTwoLineCount(1);
                          setFieldError(undefined);

                          if (!["update", "all"].includes(value.command.toLowerCase())) {
                            setShowCheckBlock(false);
                          } else if (value.check.length > 0) {
                            setShowCheckBlock(true);
                          } else {
                            setShowCheckBlock(false);
                          }
                        }}
                      />
                    </ScrollArea>
                  </Tabs.Content>
                </Tabs.Root>
              </div>
            )}
          </SheetContent>
        </Sheet>
      </Form>

      <ConfirmationModal
        visible={isClosingPolicyEditorPanel}
        title="Discard changes"
        confirmLabel="Discard"
        onCancel={() => setIsClosingPolicyEditorPanel(false)}
        onConfirm={() => {
          onSelectCancel();
          setIsClosingPolicyEditorPanel(false);
        }}
      >
        <p className="text-sm neutral-on-background-medium">
          Are you sure you want to close the editor? Any unsaved changes on your policy and
          conversations with the Assistant will be lost.
        </p>
      </ConfirmationModal>
    </>
  );
});

PolicyEditorPanel.displayName = "PolicyEditorPanel";

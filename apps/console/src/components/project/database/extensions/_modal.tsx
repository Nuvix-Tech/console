import type { PostgresExtension } from "@nuvix/pg-meta";
import { Database, ExternalLinkIcon, Plus, TriangleAlertIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { useDatabaseExtensionEnableMutation } from "@/data/database-extensions/database-extension-enable-mutation";
import { useSchemasQuery } from "@/data/database/schemas-query";
import { executeSql } from "@/data/sql/execute-sql-query";
import { AlertDescription, AlertTitle, Alert } from "@nuvix/sui/components/alert";
import { Button } from "@nuvix/sui/components/button";
import { useProjectStore } from "@/lib/store";
import { Admonition } from "@/ui/admonition";
import { DocsButton } from "@/ui/DocsButton";
import { SkeletonText } from "@nuvix/cui/skeleton";
import { Icon, Input } from "@nuvix/ui/components";
import { useFormik } from "formik";
import { FormDialog, InputField, InputSelectField, SubmitButton } from "@/components/others/forms";

const orioleExtCallOuts = ["vector", "postgis"];

interface EnableExtensionModalProps {
  visible: boolean;
  extension: PostgresExtension;
  onCancel: () => void;
}

const EnableExtensionModal = ({ visible, extension, onCancel }: EnableExtensionModalProps) => {
  const { project, sdk } = useProjectStore((s) => s);
  const isOrioleDb = true; // useIsOrioleDb()
  const [defaultSchema, setDefaultSchema] = useState();
  const [fetchingSchemaInfo, setFetchingSchemaInfo] = useState(false);

  const { data: schemas, isLoading: isSchemasLoading } = useSchemasQuery(
    {
      projectRef: project?.$id,
      sdk,
    },
    { enabled: visible },
  );
  const { mutate: enableExtension, isPending: isEnabling } = useDatabaseExtensionEnableMutation({
    onSuccess: () => {
      toast.success(`Extension "${extension.name}" is now enabled`);
      onCancel();
    },
    onError: (error) => {
      toast.error(`Failed to enable ${extension.name}: ${error.message}`);
    },
  });

  // [Joshen] Worth checking in with users - whether having this schema selection
  // might be confusing, and if we should have a tooltip to explain that schemas
  // are just concepts of namespace, you can use that extension no matter where it's
  // installed in

  useEffect(() => {
    let cancel = false;

    if (visible) {
      const checkExtensionSchema = async () => {
        if (!cancel) {
          setFetchingSchemaInfo(true);
          setDefaultSchema(undefined);
        }
        try {
          const res = await executeSql({
            projectRef: project?.$id,
            sdk,
            sql: `select * from pg_available_extension_versions where name = '${extension.name}'`,
          });
          if (!cancel) setDefaultSchema(res.result[0].schema);
        } catch (error) {}

        setFetchingSchemaInfo(false);
      };
      checkExtensionSchema();
    }

    return () => {
      cancel = true;
    };
  }, [visible, extension.name]);

  const validate = (values: any) => {
    const errors: any = {};
    if (values.schema === "custom" && !values.name) errors.name = "Required field";
    return errors;
  };

  const onSubmit = async (values: any) => {
    if (project === undefined) return console.error("Project is required");

    const schema =
      defaultSchema !== undefined && defaultSchema !== null
        ? defaultSchema
        : values.schema === "custom"
          ? values.name
          : values.schema;

    enableExtension({
      projectRef: project.$id,
      sdk,
      schema,
      name: extension.name,
      version: extension.default_version,
      cascade: true,
      createSchema: !schema.startsWith("pg_"),
    });
  };

  const form = useFormik({
    initialValues: {
      name: extension.name, // Name of new schema, if creating new
      schema: "extensions",
    },
    enableReinitialize: true,
    validateOnBlur: true,
    validateOnChange: false,
    validate,
    onSubmit,
  });

  return (
    <FormDialog
      dialog={{
        isOpen: visible,
        onClose: onCancel,
        title: (
          <div className="flex items-baseline gap-2">
            <h5 className="text-sm text-foreground">Confirm to enable</h5>
            <code className="text-xs">{extension.name}</code>
          </div>
        ),
        footer: (
          <div className="flex items-center justify-end space-x-2">
            <Button variant={"ghost"} size={"sm"} disabled={isEnabling} onClick={() => onCancel()}>
              Cancel
            </Button>
            <SubmitButton disabled={isEnabling} loading={isEnabling} dirtyCheck={false}>
              Enable extension
            </SubmitButton>
          </div>
        ),
      }}
      form={form as any}
    >
      <div className="flex flex-col gap-y-2">
        {isOrioleDb && orioleExtCallOuts.includes(extension.name) && (
          <Admonition type="default" title="Extension is limited by OrioleDB">
            <span className="block">
              {extension.name} cannot be accelerated by indexes on tables that are using the
              OrioleDB access method
            </span>
            <DocsButton abbrev={false} className="mt-2" href="https://supabase.com/docs" />
          </Admonition>
        )}

        {fetchingSchemaInfo || isSchemasLoading ? (
          <div className="space-y-2">
            <SkeletonText noOfLines={2} />
          </div>
        ) : defaultSchema ? (
          <Input
            labelAsPlaceholder
            height="s"
            disabled
            id="schema"
            name="schema"
            value={defaultSchema}
            label="Select a schema to enable the extension for"
            description={`Extension must be installed in ${defaultSchema}.`}
          />
        ) : (
          <InputSelectField
            name="schema"
            label="Select a schema to enable the extension for"
            height="s"
            options={[
              {
                label: "Create a new schema",
                value: "custom",
                hasPrefix: <Icon name="plus" size="s" />,
              },
              ...(schemas
                ? schemas.map((schema) => ({
                    label: schema.name,
                    value: schema.name,
                  }))
                : []),
            ]}
          />
        )}
      </div>

      {form.values.schema === "custom" && (
        <div>
          <InputField name="name" label="Schema name" />
        </div>
      )}

      {/* {extension.name === 'pg_cron' && project?.cloud_provider === 'FLY' && (
                <div>
                    <Alert variant="warning">
                        <TriangleAlertIcon />
                        <AlertTitle>
                            The pg_cron extension is not fully supported for Fly projects
                        </AlertTitle>

                        <AlertDescription>
                            You can still enable the extension, but pg_cron jobs may not run due to the
                            behavior of Fly projects.
                        </AlertDescription>

                        <AlertDescription className="mt-3">
                            <Button
                                asChild
                                type="default"
                                iconRight={<ExternalLinkIcon width={12} height={12} />}
                            >
                                <a
                                    href="/docs/guides/platform/fly-postgres#limitations"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <span>Learn more</span>
                                </a>
                            </Button>
                        </AlertDescription>
                    </Alert>
                </div>
            )} */}
    </FormDialog>
  );
};

export default EnableExtensionModal;

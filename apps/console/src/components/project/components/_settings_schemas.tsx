import {
  CardBox,
  CardBoxBody,
  CardBoxDesc,
  CardBoxItem,
  CardBoxTitle,
} from "@/components/others/card";
import { Form, InputTagField, SubmitButton } from "@/components/others/forms";
import { rootKeys } from "@/lib/keys";
import { sdkForConsole } from "@/lib/sdk";
import { useProjectStore } from "@/lib/store";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { toast } from "sonner";

export const ManageExposedSchemas = () => {
  const project = useProjectStore((state) => state.project);
  const _schemas = useProjectStore((state) => state.schemas);
  const queryClient = useQueryClient();

  const schemas = useMemo(() => {
    if (!project) return [];
    return _schemas.filter((schema) => schema.type !== "document").map((s) => s.name);
  }, [project, _schemas]);

  return (
    <Form
      key={project?.$id}
      initialValues={{
        schemas: (project as any)?.exposedSchemas || [], // types will be fixed later
      }}
      enableReinitialize
      onSubmit={async (values) => {
        try {
          const client = sdkForConsole.client;
          const apiPath = `/projects/${project.$id}/metadata/exposed-schemas`;
          const uri = new URL(client.config.endpoint + apiPath);

          const apiHeaders: { [header: string]: string } = {
            "content-type": "application/json",
          };

          await client.call("put", uri, apiHeaders, values);
          await queryClient.invalidateQueries({
            queryKey: rootKeys.project(project.$id),
          });
          toast.success("Exposed schemas list updated.");
        } catch (e: any) {
          toast.error(e?.message || "Someting went wrong.");
        }
      }}
    >
      <CardBox actions={<SubmitButton label="Update" />}>
        <CardBoxBody>
          <CardBoxItem gap={"4"}>
            <CardBoxTitle>Exposed Schemas</CardBoxTitle>
            <CardBoxDesc>
              Select which database schemas should be accessible via the client API. 
              <br />
              All schemas are always available via server-side SDKs using an API key, regardless of exposure status.
              <br />
              Note: Document schemas are always exposed by default.
            </CardBoxDesc>
          </CardBoxItem>
          <CardBoxItem direction="column" gap="8">
            <InputTagField
              name="schemas"
              label="Allowed Schemas"
              placeholder="Enter schema name and press enter"
              description="List of database schemas that are allowed to be exposed over the API."
              suggestion={schemas}
            />
          </CardBoxItem>
        </CardBoxBody>
      </CardBox>
    </Form>
  );
};

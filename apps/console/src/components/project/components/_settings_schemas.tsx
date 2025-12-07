import {
  CardBox,
  CardBoxBody,
  CardBoxDesc,
  CardBoxItem,
  CardBoxTitle,
} from "@/components/others/card";
import { Form, InputTagField } from "@/components/others/forms";
import { useProjectStore } from "@/lib/store";

export const ManageExposedSchemas = () => {
  const project = useProjectStore((state) => state.project);

  return (
    <Form
      key={project?.$id}
      initialValues={{
        schemas: (project as any)?.metadata?.allowedSchemas || [], // types will be fixed later
      }}
      onSubmit={async (values) => {
        // Update project metadata with allowed schemas
      }}
    >
      <CardBox>
        <CardBoxBody>
          <CardBoxItem gap={"4"}>
            <CardBoxTitle>Exposed Schemas</CardBoxTitle>
            <CardBoxDesc>
              Control which database schemas are exposed over the API for this project.
            </CardBoxDesc>
          </CardBoxItem>
          <CardBoxItem direction="column" gap="8">
            <InputTagField
              name="schemas"
              label="Allowed Schemas"
              placeholder="Enter schema name and press enter"
              description="List of database schemas that are allowed to be exposed over the API."
            />
          </CardBoxItem>
        </CardBoxBody>
      </CardBox>
    </Form>
  );
};

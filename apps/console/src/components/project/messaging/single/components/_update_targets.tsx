import { useProjectStore } from "@/lib/store";
import { useMessageStore } from "./store";
import { CardBox, CardBoxBody, CardBoxItem, CardBoxTitle } from "@/components/others/card";
import { WithDialog } from "@/components/wizard/messaging/targets";
import { XIcon } from "lucide-react";
import { Card, Text } from "@nuvix/ui/components";
import { MessagingProviderType, Models } from "@nuvix/console";
import { Form, SubmitButton } from "@/components/others/forms";
import { useFormikContext } from "formik";
import { useEffect } from "react";

export const UpdateTargets = () => {
  const { message } = useMessageStore((s) => s);
  const { sdk } = useProjectStore((s) => s);

  if (!message) return null;

  const type = message.providerType as MessagingProviderType;
  const isDraft = message.status === "draft";

  return (
    <Form
      initialValues={{
        targets: message.targets,
      }}
      onSubmit={async (values) => {}}
    >
      <CardBox actions={<SubmitButton>Update</SubmitButton>}>
        <CardBoxBody>
          <CardBoxItem gap={"4"}>
            <CardBoxTitle className="flex gap-2 items-center">Targets</CardBoxTitle>
          </CardBoxItem>
          <Updater />
        </CardBoxBody>
      </CardBox>
    </Form>
  );
};

const Updater = () => {
  const { targetsById, setTargetsById, message } = useMessageStore((s) => s);
  const { sdk } = useProjectStore((s) => s);
  const { setFieldValue } = useFormikContext<{ targets: string[] }>();

  if (!message) return null;

  const type = message.providerType as MessagingProviderType;
  const isDraft = message.status === "draft";
  const hasTargets = Object.keys(targetsById).length > 0;

  const removeTarget = (targetId: string) => {
    const updatedTargets = { ...targetsById };
    delete updatedTargets[targetId];
    setTargetsById(updatedTargets);
  };

  useEffect(() => {
    const values = Object.keys(targetsById);
    setFieldValue("targets", values);
  }, [targetsById]);

  return (
    <>
      <CardBoxItem>
        {hasTargets ? (
          <div className="space-y-4">
            <div className="border rounded-lg">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Targets</th>
                    {isDraft && (
                      <th className="w-10 pr-2">
                        <WithDialog
                          type={type}
                          onAddTargets={setTargetsById}
                          sdk={sdk}
                          groups={targetsById}
                          showButton
                        />
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(targetsById).map(([targetId, target]) => (
                    <tr key={targetId} className="border-b">
                      <td className="p-3">{target.name || target.identifier}</td>
                      {isDraft && (
                        <td className="p-3">
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={() => removeTarget(targetId)}
                              className="text-gray-500 hover:text-red-500"
                            >
                              <XIcon size={18} />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <Card
            title="Targets"
            minHeight="160"
            radius="l-4"
            center
            fillWidth
            direction="column"
            gap="12"
          >
            {isDraft ? (
              <>
                <WithDialog
                  type={type}
                  onAddTargets={setTargetsById}
                  sdk={sdk}
                  groups={targetsById}
                />
                <Text variant="body-default-s" onBackground="neutral-medium">
                  No targets selected yet!
                </Text>
              </>
            ) : (
              <Text variant="body-default-s" onBackground="neutral-medium">
                No targets added
              </Text>
            )}
          </Card>
        )}
      </CardBoxItem>
    </>
  );
};

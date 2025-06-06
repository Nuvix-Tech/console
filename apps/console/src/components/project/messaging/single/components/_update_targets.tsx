import { useProjectStore } from "@/lib/store";
import { useMessageStore } from "./store";
import { CardBox, CardBoxBody, CardBoxItem, CardBoxTitle } from "@/components/others/card";
import { TargetsSelectorList, WithDialog } from "@/components/wizard/messaging/targets";
import { Card, Text, useToast } from "@nuvix/ui/components";
import { MessagingProviderType } from "@nuvix/console";
import { Form, SubmitButton } from "@/components/others/forms";
import { useFormikContext } from "formik";
import { useEffect } from "react";

export const UpdateTargets = () => {
  const { message, refresh } = useMessageStore((s) => s);
  const { sdk } = useProjectStore((s) => s);
  const { addToast } = useToast();

  if (!message) return null;

  const type = message.providerType as MessagingProviderType;
  const isDraft = message.status === "draft";

  return (
    <Form
      initialValues={{
        targets: message.targets,
      }}
      enableReinitialize
      onSubmit={async (values) => {
        if (!isDraft) return;
        try {
          switch (type) {
            case MessagingProviderType.Email:
              await sdk.messaging.updateEmail(message.$id, undefined, undefined, values.targets);
              break;
            case MessagingProviderType.Push:
              await sdk.messaging.updatePush(message.$id, undefined, undefined, values.targets);
              break;
            case MessagingProviderType.Sms:
              await sdk.messaging.updateSms(message.$id, undefined, undefined, values.targets);
              break;
          }

          await refresh();
          addToast({
            variant: "success",
            message: "Message targets updated.",
          });
        } catch (e: any) {
          addToast({
            variant: "danger",
            message: e.message,
          });
        }
      }}
    >
      <CardBox actions={isDraft ? <SubmitButton>Update</SubmitButton> : undefined}>
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
          <TargetsSelectorList
            sdk={sdk}
            type={type}
            targets={targetsById}
            addTargets={setTargetsById}
            removeTarget={removeTarget}
            canAdd={isDraft}
          />
        ) : (
          <Card
            title="Targets"
            minHeight="160"
            radius="l-4"
            center
            fillWidth
            direction="column"
            gap="12"
            vertical="center"
            horizontal="center"
            padding="4"
          >
            {isDraft ? (
              <>
                <WithDialog
                  type={type}
                  onAddTargets={setTargetsById}
                  sdk={sdk}
                  groups={targetsById}
                />
                <Text variant="body-default-s" onBackground="neutral-medium" align="center">
                  No recipients selected. Click the button above to add recipients for your message.
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

import { useState } from "react";
import { AlertDescription, AlertTitle, Alert } from "@nuvix/sui/components/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@nuvix/sui/components/dialog";

import { PROTECTED_SCHEMAS } from "@/lib/constants/schemas";
import { AlertCircle } from "lucide-react";
import { Button, Code } from "@chakra-ui/react";

export const ProtectedSchemaModal = ({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) => {
  return (
    <Dialog open={visible} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Schemas managed by Nuvix</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <p className="text-sm neutral-on-background-medium">
            The following schemas are managed by Nuvix and are currently protected from write access
            through the dashboard.
          </p>
          <div className="flex flex-wrap gap-1">
            {PROTECTED_SCHEMAS.map((schema) => (
              <code
                key={schema}
                className="text-xs text-muted-foreground px-2 py-1 bg-muted rounded-full"
              >
                {schema}
              </code>
            ))}
          </div>
          <p className="text-sm !mt-4 neutral-on-background-medium">
            These schemas are critical to the functionality of your Nuvix project and hence we
            highly recommend not altering them.
          </p>
          <p className="text-sm neutral-on-background-medium">
            You can, however, still interact with those schemas through the SQL Editor although we
            advise you only do so if you know what you are doing.
          </p>
        </div>
        <DialogFooter>
          <Button onClick={() => onClose()}>Understood</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const ProtectedSchemaWarning = ({ schema, entity }: { schema: string; entity: string }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Alert>
        <AlertCircle strokeWidth={2} />
        <AlertTitle>Currently viewing {entity} from a protected schema</AlertTitle>
        <AlertDescription>
          <p className="mb-2">
            The <Code className="text-xs">{schema}</Code> schema is managed by Nuvix and is
            read-only through the dashboard.
          </p>
          <Button size={"2xs"} variant="subtle" onClick={() => setShowModal(true)}>
            Learn more
          </Button>
        </AlertDescription>
      </Alert>
      <ProtectedSchemaModal visible={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};

export default ProtectedSchemaWarning;

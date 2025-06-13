import ConfirmationModal from "@/components/editor/components/_confim_dialog";
import { useEnumeratedTypeDeleteMutation } from "@/data/enumerated-types/enumerated-type-delete-mutation";
import { useProjectStore } from "@/lib/store";
import { toast } from "sonner";

interface DeleteEnumeratedTypeModalProps {
  visible: boolean;
  selectedEnumeratedType?: any;
  onClose: () => void;
}

const DeleteEnumeratedTypeModal = ({
  visible,
  selectedEnumeratedType,
  onClose,
}: DeleteEnumeratedTypeModalProps) => {
  const { project, sdk } = useProjectStore((s) => s);
  const { mutate: deleteEnumeratedType, isPending: isDeleting } = useEnumeratedTypeDeleteMutation({
    onSuccess: () => {
      toast.success(`Successfully deleted "${selectedEnumeratedType.name}"`);
      onClose();
    },
  });

  const onConfirmDeleteType = () => {
    if (selectedEnumeratedType === undefined) return console.error("No enumerated type selected");
    if (project?.$id === undefined) return console.error("Project ref required");

    deleteEnumeratedType({
      projectRef: project?.$id,
      sdk,
      name: selectedEnumeratedType.name,
      schema: selectedEnumeratedType.schema,
    });
  };

  return (
    <ConfirmationModal
      variant={"destructive"}
      loading={isDeleting}
      visible={visible}
      title={
        <>
          Confirm to delete enumerated type{" "}
          <code className="text-sm">{selectedEnumeratedType?.name}</code>
        </>
      }
      confirmLabel="Confirm delete"
      confirmLabelLoading="Deleting..."
      onCancel={onClose}
      onConfirm={() => onConfirmDeleteType()}
      alert={{
        title: "This action cannot be undone",
        description:
          "You will need to re-create the enumerated type if you want to revert the deletion.",
      }}
    >
      <p className="text-sm">Before deleting this enumerated type, consider:</p>
      <ul className="space-y-2 mt-2 text-sm text-muted-foreground">
        <li className="list-disc ml-6">
          This enumerated type is no longer in use in any tables or functions
        </li>
      </ul>
    </ConfirmationModal>
  );
};

export default DeleteEnumeratedTypeModal;

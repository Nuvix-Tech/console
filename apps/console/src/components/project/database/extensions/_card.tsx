import { AlertTriangle, Book, Loader2, Settings } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { useDatabaseExtensionDisableMutation } from "@/data/database-extensions/database-extension-disable-mutation";
import { DatabaseExtension } from "@/data/database-extensions/database-extensions-query";
// import { useCheckPermissions } from 'hooks/misc/useCheckPermissions'
// import { useIsOrioleDb } from 'hooks/misc/useSelectedProject'
import { extensions } from "@/data/database-extensions";
import { Tooltip, TooltipContent, TooltipTrigger } from "@nuvix/sui/components/tooltip";
import EnableExtensionModal from "./_modal";
import { EXTENSION_DISABLE_WARNINGS } from "./_constants";
import { useProjectStore } from "@/lib/store";
import { cn } from "@nuvix/sui/lib/utils";
import { Button, Switch } from "@nuvix/ui/components";
import { FaGithub } from "react-icons/fa6";
import ConfirmationModal from "@/components/editor/components/_confim_dialog";
import { Admonition } from "@/ui/admonition";
import { Button as ChakraButton } from "@chakra-ui/react";

interface ExtensionCardProps {
  extension: DatabaseExtension;
}

const ExtensionCard = ({ extension }: ExtensionCardProps) => {
  const { project, sdk } = useProjectStore((s) => s);
  const isOn = extension.installed_version !== null;
  const isOrioleDb = false; //  useIsOrioleDb()

  const [isDisableModalOpen, setIsDisableModalOpen] = useState(false);
  const [showConfirmEnableModal, setShowConfirmEnableModal] = useState(false);

  const canUpdateExtensions = true; // useCheckPermissions(
  //     PermissionAction.TENANT_SQL_ADMIN_WRITE,
  //     'extensions'
  // )
  const orioleDbCheck = false; // isOrioleDb && extension.name === 'orioledb'
  const disabled = !canUpdateExtensions || orioleDbCheck;

  const X_PADDING = "px-5";
  const extensionMeta = extensions.find((item) => item.name === extension.name);
  const docsUrl = extensionMeta?.link.startsWith("/guides")
    ? `https://supabase.com/docs${extensionMeta?.link}`
    : (extensionMeta?.link ?? undefined);

  const { mutate: disableExtension, isPending: isDisabling } = useDatabaseExtensionDisableMutation({
    onSuccess: () => {
      toast.success(`${extension.name} is off.`);
      setIsDisableModalOpen(false);
    },
  });

  const onConfirmDisable = () => {
    if (project === undefined) return console.error("Project is required");

    disableExtension({
      projectRef: project.$id,
      sdk,
      id: extension.name,
    });
  };

  return (
    <>
      <div className="neutral-background-alpha-weak flex flex-col overflow-hidden rounded-md shadow-sm">
        <div className={cn("border-b border-muted flex justify-between w-full py-3", X_PADDING)}>
          <div className="max-w-[85%] flex items-center gap-2 truncate">
            <h3
              title={extension.name}
              className="h-5 m-0 text-sm truncate cursor-pointer text-foreground"
            >
              {extension.name}
            </h3>
            <p className="text-sm text-muted-foreground font-mono tracking-tighter">
              {extension?.installed_version ?? extension.default_version}
            </p>
          </div>

          {isDisabling ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            <Tooltip>
              <TooltipTrigger>
                <Switch
                  disabled={disabled}
                  isChecked={isOn}
                  onToggle={() =>
                    isOn ? setIsDisableModalOpen(true) : setShowConfirmEnableModal(true)
                  }
                />
              </TooltipTrigger>
              {disabled && (
                <TooltipContent side="bottom">
                  {!canUpdateExtensions
                    ? "You need additional permissions to toggle extensions"
                    : orioleDbCheck
                      ? "Project is using OrioleDB and cannot be disabled"
                      : null}
                </TooltipContent>
              )}
            </Tooltip>
          )}
        </div>

        {isOn && (
          <div className={cn("border-b border-muted py-2", X_PADDING)}>
            <p className="text-muted-foreground text-sm">
              Installed in <span className="text-foreground">{extension.schema}</span> schema
            </p>
          </div>
        )}

        <div className={cn("flex h-full flex-col gap-y-3 py-3", X_PADDING)}>
          <p className="text-sm text-muted-foreground capitalize-sentence">{extension.comment}</p>
          <div className="flex items-center gap-x-2 mt-auto">
            {extensionMeta?.github_url && (
              <Button
                variant="tertiary"
                size="s"
                prefixIcon={<FaGithub />}
                className="rounded-full font-mono tracking-tighter !border !border-secondary"
                target="_blank"
                rel="noreferrer"
                href={extensionMeta.github_url}
              >
                {extensionMeta.github_url.split("/").slice(-2).join("/")}
              </Button>
            )}
            {docsUrl !== undefined && (
              <Button
                variant="secondary"
                size="s"
                prefixIcon={<Book />}
                className="rounded-full font-mono tracking-tighter"
                target="_blank"
                rel="noreferrer"
                href={docsUrl}
              >
                Docs
              </Button>
            )}
          </div>
          {extensionMeta?.deprecated && extensionMeta?.deprecated.length > 0 && (
            <ChakraButton
              size={"2xs"}
              className="rounded-full"
              colorPalette={"yellow"}
              title={`The extension is deprecated and will be removed in ${extensionMeta.deprecated.join(", ")}.`}
            >
              <AlertTriangle />
              Deprecated
            </ChakraButton>
          )}
        </div>

        {extensionMeta?.product && (
          <div className={cn("border-t border-muted py-3 flex items-center gap-x-3", X_PADDING)}>
            <div className="min-w-5 w-5 h-5 border border-primary/50 rounded flex items-center justify-center">
              <Settings className="text-primary" size={12} />
            </div>
            <div>
              <p className="text-muted-foreground text-xs">
                <span className="text-foreground">{extension.name}</span> is used by{" "}
                {extensionMeta.product_url ? (
                  <Link
                    href={extensionMeta.product_url.replace("{ref}", project?.$id ?? "")}
                    className="transition hover:text-foreground"
                  >
                    {extensionMeta.product}
                  </Link>
                ) : (
                  extensionMeta.product
                )}
              </p>
              {!isOn && (
                <p className="text-muted-foreground text-xs">
                  Install extension to use {extensionMeta.product}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <EnableExtensionModal
        visible={showConfirmEnableModal}
        extension={extension}
        onCancel={() => setShowConfirmEnableModal(false)}
      />

      <ConfirmationModal
        visible={isDisableModalOpen}
        title="Confirm to disable extension"
        confirmLabel="Disable"
        variant="destructive"
        confirmLabelLoading="Disabling"
        onCancel={() => setIsDisableModalOpen(false)}
        onConfirm={() => onConfirmDisable()}
      >
        <div className="flex flex-col gap-y-3">
          <p className="text-sm text-foreground-light">
            Are you sure you want to turn OFF the "{extension.name}" extension?
          </p>
          {EXTENSION_DISABLE_WARNINGS[extension.name] && (
            <Admonition type="warning" className="m-0">
              {EXTENSION_DISABLE_WARNINGS[extension.name]}
            </Admonition>
          )}
        </div>
      </ConfirmationModal>
    </>
  );
};

export default ExtensionCard;

import { AlertOctagon, Lock, ShieldOff } from "lucide-react";

import { DocsButton } from "@/ui/DocsButton";
import { Feedback } from "@nuvix/ui/components";

export default function RLSDisableModalContent() {
  return (
    <div className="text-sm text-muted-foreground grid gap-4">
      <div className="grid gap-3">
        <Feedback
          textSize="s"
          variant="warning"
          title="This table will be publicly readable and writable"
          icon
          description="Anyone can edit or delete data in this table."
        />
        <ul className="mt-6 space-y-2">
          <li className="flex gap-3">
            <AlertOctagon size={14} />
            <span>All requests to this table will be accepted.</span>
          </li>

          <li className="flex gap-3">
            <ShieldOff size={14} />
            <span>Auth policies will not be enforced.</span>
          </li>

          <li className="flex gap-3">
            <Lock size={14} className="flex-shrink-0" />
            <div className="text-xs">
              <strong>Before you turn off Row Level Security, consider:</strong>
              <ul className="space-y-2 !mt-2">
                <li className="list-disc">
                  Any personal information in this table will be publicly accessible.
                </li>
                <li className="list-disc">
                  Anyone will be able to modify, add or delete any row in this table.
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>

      <DocsButton
        abbrev={false}
        className="w-min mt-3"
        href="https://supabase.com/docs/guides/auth/row-level-security"
      />
    </div>
  );
}

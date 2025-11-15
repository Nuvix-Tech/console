import { motion } from "motion/react";
import { useState } from "react";
import { Row, Text, Checkbox } from "@nuvix/ui/components";

const PreviewCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <motion.div
    data-theme="light"
    initial={{ opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-(--neutral-background-strong) text-(--neutral-on-background-strong) radius-xs p-3 shadow-sm border border-(--surface-border)"
  >
    <Text variant="body-strong-xs" onBackground="neutral-medium" className="mb-1 uppercase">
      {title}
    </Text>
    {children}
  </motion.div>
);

export const O2 = () => {
  const [roles, setRoles] = useState([
    { name: "Public", permissions: ["READ"] },
    { name: "User", permissions: ["CREATE", "READ", "UPDATE"] },
    { name: "Team", permissions: ["CREATE", "READ", "UPDATE", "DELETE"] },
  ]);

  const togglePermission = (roleName: string, permission: string) => {
    setRoles((prev) =>
      prev.map((role) =>
        role.name === roleName
          ? {
              ...role,
              permissions: role.permissions.includes(permission)
                ? role.permissions.filter((p) => p !== permission)
                : [...role.permissions, permission],
            }
          : role,
      ),
    );
  };

  const getPermissions = (roleName: string) => {
    return roles.find((role) => role.name === roleName)?.permissions || [];
  };

  const canPublicRead = getPermissions("Public").includes("READ");
  const canUserRead = getPermissions("User").includes("READ");
  const canUserUpdate = getPermissions("User").includes("UPDATE");
  const canUserCreate = getPermissions("User").includes("CREATE");

  return (
    <div className="p-2.5 size-full flex-grow flex gap-6 relative min-h-[500px] flex-col lg:flex-row">
      {/* LEFT SIDE */}
      <div className="relative lg:w-1/2 h-full flex items-center justify-start pl-4">
        {/* TOP — JSON DOCUMENT CARD */}
        <motion.div
          initial={{ opacity: 0, y: -10, rotate: -3 }}
          animate={{ opacity: 1, y: 150, rotate: -3 }}
          transition={{ duration: 0.35 }}
          className="lg:absolute bg-(--surface-background) radius-xs border border-(--surface-border)/40 p-4 w-72"
          style={{ zIndex: 20 }}
        >
          <pre className="font-mono text-[11px] leading-5 overflow-auto max-h-60">
            <span className="text-blue-400">{"{"}</span>
            <br />
            &nbsp;&nbsp;<span className="text-green-400">"id"</span>
            <span className="text-blue-400">: </span>
            <span className="neutral-on-background-medium">"post_123"</span>,<br />
            &nbsp;&nbsp;<span className="text-green-400">"author"</span>
            <span className="text-blue-400">: </span>
            <span className="neutral-on-background-medium">"john_doe"</span>,<br />
            &nbsp;&nbsp;<span className="text-green-400">"content"</span>
            <span className="text-blue-400">: </span>
            <span className="neutral-on-background-medium">
              "Excited to launch a new feature today!"
            </span>
            ,<br />
            &nbsp;&nbsp;<span className="text-green-400">"tags"</span>
            <span className="text-blue-400">: [</span>
            <span className="text-orange-400">"launch"</span>,
            <span className="text-orange-400">"update"</span>
            <span className="text-blue-400">]</span>,<br />
            &nbsp;&nbsp;<span className="text-green-400">"stats"</span>
            <span className="text-blue-400">: {"{"}</span>
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-400">"likes"</span>
            <span className="text-blue-400">: </span>
            <span className="text-orange-400">234</span>,<br />
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-400">"comments"</span>
            <span className="text-blue-400">: </span>
            <span className="text-orange-400">45</span>
            <br />
            &nbsp;&nbsp;<span className="text-blue-400">{"}"}</span>,<br />
            &nbsp;&nbsp;<span className="text-green-400">"timestamp"</span>
            <span className="text-blue-400">: </span>
            <span className="text-orange-400">1704067200</span>
            <br />
            <span className="text-blue-400">{"}"}</span>
          </pre>
        </motion.div>

        {/* BOTTOM — PERMISSION MATRIX CARD */}
        <motion.div
          initial={{ opacity: 0, y: 40, rotate: 4 }}
          animate={{ opacity: 1, y: 320, rotate: 4 }}
          transition={{ duration: 0.4 }}
          className="lg:absolute lg:left-28 bg-(--neutral-background-medium) radius-xs border border-(--surface-border)/30 w-80 overflow-hidden"
          style={{ zIndex: 10 }}
        >
          <Row gap="12" vertical="center" paddingX="12" paddingY="8" borderBottom="neutral-weak">
            {["ROLE", "CREATE", "READ", "UPDATE", "DELETE"].map((h, i) => (
              <Text
                key={h}
                variant="body-strong-xs"
                onBackground="neutral-medium"
                className={`!text-[10px] ${i === 0 ? "w-24 max-w-24 truncate" : ""}`}
              >
                {h}
              </Text>
            ))}
          </Row>

          {roles.map((role) => (
            <Row
              key={role.name}
              gap="12"
              vertical="center"
              paddingX="12"
              paddingY="4"
              horizontal="space-between"
            >
              <Text
                variant="body-default-s"
                onBackground="neutral-weak"
                className="w-24 max-w-24 truncate"
              >
                {role.name}
              </Text>

              {["CREATE", "READ", "UPDATE", "DELETE"].map((perm) => (
                <Checkbox
                  key={perm}
                  isChecked={role.permissions.includes(perm)}
                  onToggle={() => togglePermission(role.name, perm)}
                  className="mx-auto"
                  checkboxClass="!w-4 !h-4 !min-w-4 !min-h-4"
                />
              ))}
            </Row>
          ))}
        </motion.div>
      </div>

      {/* RIGHT SIDE PREVIEWS */}
      <div className="lg:w-1/2 flex flex-row lg:!flex-col gap-4 justify-center pr-2">
        {/* PUBLIC PREVIEW */}
        <PreviewCard title="Public Preview">
          {canPublicRead ? (
            <div className="text-xs space-y-1 text-(--neutral-on-background-strong)">
              <div className="font-medium">Launch Nuvix Feature</div>
              <div className="text-[10px] opacity-70">By john_doe · 234 likes</div>
              <p className="text-[11px] opacity-70 leading-4">
                Excited to launch a new feature today!
              </p>
            </div>
          ) : (
            <div className="text-xs text-(--danger-on-background-medium)">Content private</div>
          )}
        </PreviewCard>

        {/* AUTH PREVIEW */}
        <PreviewCard title="Authenticated User">
          {canUserRead ? (
            <div className="text-xs text-(--neutral-on-background-strong) space-y-1">
              <div className="font-medium">Launch Nuvix Feature</div>
              <div className="text-[10px] opacity-70">By john_doe · 234 likes · 45 comments</div>

              <p className="text-[11px] opacity-70 leading-4">
                Excited to launch a new feature today!
              </p>

              <div className="flex gap-2 pt-1">
                {canUserUpdate && (
                  <button className="px-2 py-0.5 text-[10px] bg-(--accent-alpha-weak) text-(--accent-on-background-strong) radius-xs">
                    Edit
                  </button>
                )}
                {canUserCreate && (
                  <button className="px-2 py-0.5 text-[10px] bg-(--success-alpha-weak) text-(--success-on-background-strong) radius-xs">
                    Comment
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-(--danger-on-background-medium) text-xs">Access denied</div>
          )}
        </PreviewCard>
      </div>
    </div>
  );
};

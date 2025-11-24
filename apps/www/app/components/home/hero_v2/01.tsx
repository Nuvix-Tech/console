import { AnimatedSpan, Terminal, TypingAnimation } from "components/magicui/terminal";
import { PinIcon } from "lucide-react";
import { motion } from "motion/react";

export const O1 = () => {
  return (
    <div className="p-2.5 bg-(--surface-background) radius-xs size-full flex-grow flex gap-2">
      {/* LEFT SIDE TERMINAL */}
      <div className="bg-(--page-background) radius-xs size-full hidden md:flex lg:w-3/4 xl:8/12 min-h-[500px] p-4">
        <Terminal className="bg-transparent border-0">
          {/* JSON TITLE */}
          <TypingAnimation>Start with simple JSON…</TypingAnimation>

          {/* JSON BLOCK */}
          <AnimatedSpan className="block font-mono text-xs leading-5 mt-2">
            <span className="text-blue-400">{"{"}</span>
            <br />
            &nbsp;&nbsp;<span className="text-green-400">"title"</span>
            <span className="text-blue-400">: </span>
            <span className="neutral-on-background-medium">"Launch Checklist"</span>
            <span className="text-blue-400">,</span>
            <br />
            &nbsp;&nbsp;<span className="text-green-400">"content"</span>
            <span className="text-blue-400">: </span>
            <span className="neutral-on-background-medium">
              "Update docs, publish release, tweet announcement."
            </span>
            <span className="text-blue-400">,</span>
            <br />
            &nbsp;&nbsp;<span className="text-green-400">"tags"</span>
            <span className="text-blue-400">: [</span>
            <span className="neutral-on-background-medium">"release"</span>
            <span className="text-blue-400">, </span>
            <span className="neutral-on-background-medium">"marketing"</span>
            <span className="text-blue-400">],</span>
            <br />
            &nbsp;&nbsp;<span className="text-green-400">"isPinned"</span>
            <span className="text-blue-400">: </span>
            <span className="text-orange-400">true</span>
            <br />
            <span className="text-blue-400">{"}"}</span>
          </AnimatedSpan>

          {/* SQL TITLE */}
          <TypingAnimation className="mt-6">
            …and grow into complex SQL when you need it.
          </TypingAnimation>

          {/* SQL BLOCK */}
          <AnimatedSpan className="block font-mono text-xs leading-5 mt-2">
            <span className="text-green-400">SELECT</span>{" "}
            <span className="neutral-on-background-medium">users.name</span>
            <span className="text-blue-500">,</span> <span className="text-green-400">COUNT</span>
            <span className="text-blue-500">(</span>
            <span className="neutral-on-background-medium">orders.id</span>
            <span className="text-blue-500">)</span> <span className="text-purple-400">AS</span>{" "}
            <span className="neutral-on-background-medium">total_orders</span>
            <br />
            <span className="text-green-400">FROM</span>{" "}
            <span className="neutral-on-background-medium">users</span>
            <br />
            <span className="text-green-400">JOIN</span>{" "}
            <span className="neutral-on-background-medium">orders</span>{" "}
            <span className="text-green-400">ON</span>{" "}
            <span className="neutral-on-background-medium">users.id</span>
            <span className="text-blue-500"> = </span>
            <span className="neutral-on-background-medium">orders.user_id</span>
            <br />
            <span className="text-green-400">WHERE</span>{" "}
            <span className="neutral-on-background-medium">orders.created_at</span>
            <span className="text-blue-500"> &gt;= </span>
            <span className="neutral-on-background-medium">'2023-01-01'</span>
            <br />
            <span className="text-green-400">GROUP BY</span>{" "}
            <span className="neutral-on-background-medium">users.name</span>
            <br />
            <span className="text-green-400">HAVING</span>{" "}
            <span className="neutral-on-background-medium">total_orders</span>
            <span className="text-blue-500"> &gt; </span>
            <span className="text-green-400">5</span>
            <br />
            <span className="text-green-400">ORDER BY</span>{" "}
            <span className="neutral-on-background-medium">total_orders</span>{" "}
            <span className="text-purple-400">DESC</span>
            <span className="text-blue-500">;</span>
          </AnimatedSpan>

          {/* FINAL MESSAGE */}
          <TypingAnimation className="mt-6">
            Simple or complex — Nuvix adapts to your data.
          </TypingAnimation>
        </Terminal>
      </div>

      {/* RIGHT SIDE PREVIEWS */}
      <div className="https://github.com/Nuvix-Techap-2 w-1/4 flex-col hidden lg:flex xl:w-4/12 gap-2">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="p-2 bg-(--page-background) radius-xs h-1/2"
        >
          <AppWindow url="my-todo-app.app">
            <div className="flex flex-col gap-2 h-full">
              <div className="flex items-center gap-2">
                <span className="text-(--warning-on-solid-weak) rotate-45">
                  <PinIcon className="size-4.5" />
                </span>
                <span className="text-(--neutral-on-background-strong) font-medium text-sm">
                  Launch Checklist
                </span>
              </div>

              <p className="text-(--neutral-on-background-weak) text-xs leading-5">
                Update docs, publish release, tweet announcement.
              </p>

              <div className="flex gap-1 mt-auto">
                <span className="text-(--accent-on-background-strong) bg-(--accent-alpha-weak) px-2 py-0.5 text-[10px] radius-xs">
                  release
                </span>
                <span className="text-(--accent-on-background-strong) bg-(--accent-alpha-weak) px-2 py-0.5 text-[10px] radius-xs">
                  marketing
                </span>
              </div>
            </div>
          </AppWindow>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="p-2 bg-(--page-background) radius-xs h-1/2"
        >
          <AppWindow url="orders-dashboard.app">
            <div className="h-full text-xs">
              <table className="w-full">
                <thead>
                  <tr className="text-(--neutral-on-background-strong)">
                    <th className="text-left pb-1">User</th>
                    <th className="text-left pb-1">Total Orders</th>
                  </tr>
                </thead>
                <tbody className="text-(--neutral-on-background-weak)">
                  <tr>
                    <td className="py-1">John Doe</td>
                    <td className="py-1">12</td>
                  </tr>
                  <tr>
                    <td className="py-1">Sarah Lee</td>
                    <td className="py-1">9</td>
                  </tr>
                  <tr>
                    <td className="py-1">Mark Cruz</td>
                    <td className="py-1">7</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </AppWindow>
        </motion.div>
      </div>
    </div>
  );
};

const AppWindow = ({ url, children }: { url: string; children: React.ReactNode }) => {
  return (
    <div className="bg-(--surface-elevated) radius-xs h-full flex flex-col overflow-hidden">
      {/* Top Browser Bar */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-(--page-background) border-b border-(--surface-border)">
        {/* Traffic Light Dots */}
        <div className="flex gap-1">
          <span className="w-2 h-2 bg-red-400 rounded-full"></span>
          <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
          <span className="w-2 h-2 bg-green-400 rounded-full"></span>
        </div>

        {/* URL */}
        <div className="flex items-center justify-center w-full">
          <span className="text-xs text-(--neutral-on-background-weak) font-mono bg-(--surface-background) px-2 py-0.5 rounded-sm">
            {url}
          </span>
        </div>
      </div>

      {/* App Content */}
      <div className="flex-1 p-3 overflow-hidden">{children}</div>
    </div>
  );
};

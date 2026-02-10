import { AnimatedSpan, Terminal, TypingAnimation } from "components/magicui/terminal";
import { BoxIcon, TableIcon } from "lucide-react";
import { motion } from "motion/react";

export const O1 = () => {
  return (
    <div className="p-2.5 bg-(--surface-background) radius-xs size-full flex-grow flex gap-2">
      {/* LEFT SIDE TERMINAL */}
      <div className="bg-(--page-background) radius-xs size-full hidden md:flex lg:w-3/4 xl:8/12 min-h-[500px] p-4">
        <Terminal className="bg-transparent border-0">
          {/* STAGE 1 — NoSQL / Document */}
          <TypingAnimation>Start as a document. No schema required.</TypingAnimation>

          <AnimatedSpan className="block font-mono text-xs leading-5 mt-2">
            <span className="text-zinc-500">{"// nuvix.collection('products').create()"}</span>
            <br />
            <span className="text-blue-400">{"{"}</span>
            <br />
            &nbsp;&nbsp;<span className="text-green-400">"name"</span>
            <span className="text-blue-400">:</span>{" "}
            <span className="neutral-on-background-medium">"Mechanical Keyboard Pro"</span>
            <span className="text-blue-400">,</span>
            <br />
            &nbsp;&nbsp;<span className="text-green-400">"price"</span>
            <span className="text-blue-400">:</span> <span className="text-orange-400">129.99</span>
            <span className="text-blue-400">,</span>
            <br />
            &nbsp;&nbsp;<span className="text-green-400">"tags"</span>
            <span className="text-blue-400">: [</span>
            <span className="neutral-on-background-medium">"wireless"</span>
            <span className="text-blue-400">, </span>
            <span className="neutral-on-background-medium">"rgb"</span>
            <span className="text-blue-400">, </span>
            <span className="neutral-on-background-medium">"tenkeyless"</span>
            <span className="text-blue-400">],</span>
            <br />
            &nbsp;&nbsp;<span className="text-green-400">"specs"</span>
            <span className="text-blue-400">: {"{"}</span>
            <span className="text-green-400">"switch"</span>
            <span className="text-blue-400">: </span>
            <span className="neutral-on-background-medium">"brown"</span>
            <span className="text-blue-400">, </span>
            <span className="text-green-400">"battery"</span>
            <span className="text-blue-400">: </span>
            <span className="neutral-on-background-medium">"4000mAh"</span>
            <span className="text-blue-400">{"}"}</span>
            <br />
            <span className="text-blue-400">{"}"}</span>
            <br />
            <span className="text-zinc-500">{"// Stored. No migration. No ALTER TABLE."}</span>
          </AnimatedSpan>

          {/* STAGE 2 — Grow into relational SQL */}
          <TypingAnimation className="mt-6">
            Grow into relations when your data demands it.
          </TypingAnimation>

          <AnimatedSpan className="block font-mono text-xs leading-5 mt-2">
            <span className="text-zinc-500">{"// Same project. Now with relational power."}</span>
            <br />
            <span className="text-green-400">SELECT</span>{" "}
            <span className="neutral-on-background-medium">p.name</span>
            <span className="text-blue-500">,</span>{" "}
            <span className="neutral-on-background-medium">p.price</span>
            <span className="text-blue-500">,</span> <span className="text-green-400">AVG</span>
            <span className="text-blue-500">(</span>
            <span className="neutral-on-background-medium">r.rating</span>
            <span className="text-blue-500">)</span> <span className="text-purple-400">AS</span>{" "}
            <span className="neutral-on-background-medium">avg_rating</span>
            <br />
            <span className="text-green-400">FROM</span>{" "}
            <span className="neutral-on-background-medium">products p</span>
            <br />
            <span className="text-green-400">JOIN</span>{" "}
            <span className="neutral-on-background-medium">reviews r</span>{" "}
            <span className="text-green-400">ON</span>{" "}
            <span className="neutral-on-background-medium">p.id</span>
            <span className="text-blue-500"> = </span>
            <span className="neutral-on-background-medium">r.product_id</span>
            <br />
            <span className="text-green-400">WHERE</span>{" "}
            <span className="neutral-on-background-medium">p.tags</span>
            <span className="text-blue-500"> @&gt; </span>
            <span className="neutral-on-background-medium">'["wireless"]'</span>
            <br />
            <span className="text-green-400">GROUP BY</span>{" "}
            <span className="neutral-on-background-medium">p.id</span>
            <span className="text-blue-500">,</span>{" "}
            <span className="neutral-on-background-medium">p.name</span>
            <span className="text-blue-500">,</span>{" "}
            <span className="neutral-on-background-medium">p.price</span>
            <br />
            <span className="text-green-400">ORDER BY</span>{" "}
            <span className="neutral-on-background-medium">avg_rating</span>{" "}
            <span className="text-purple-400">DESC</span>
            <span className="text-blue-500">;</span>
          </AnimatedSpan>

          {/* FINAL MESSAGE — echoes the tab */}
          <TypingAnimation className="mt-6">
            One API. One permission system. Any data shape.
          </TypingAnimation>
        </Terminal>
      </div>

      {/* RIGHT SIDE PREVIEWS */}
      <div className="w-1/4 flex-col hidden lg:flex xl:w-4/12 gap-2">
        {/* Top card — NoSQL document view */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="p-2 bg-(--page-background) radius-xs h-1/2"
        >
          <AppWindow url="console.nuvix.dev/collections">
            <div className="flex flex-col gap-2 h-full">
              <div className="flex items-center gap-2">
                <BoxIcon className="size-4 text-(--accent-on-background-strong)" />
                <span className="text-(--neutral-on-background-strong) font-medium text-sm">
                  products
                </span>
                <span className="ml-auto text-[10px] text-blue-400 bg-blue-400/10 px-2 py-0.5 radius-xs">
                  document
                </span>
              </div>

              <div className="font-mono text-[10px] text-(--neutral-on-background-weak) leading-5 space-y-0.5">
                <p>
                  <span className="text-green-400">name</span>{" "}
                  <span className="text-blue-400">→</span> Mechanical Keyboard Pro
                </p>
                <p>
                  <span className="text-green-400">price</span>{" "}
                  <span className="text-blue-400">→</span> 129.99
                </p>
                <p>
                  <span className="text-green-400">tags</span>{" "}
                  <span className="text-blue-400">→</span> wireless, rgb, tenkeyless
                </p>
                <p>
                  <span className="text-green-400">specs.switch</span>{" "}
                  <span className="text-blue-400">→</span> brown
                </p>
              </div>

              <div className="flex gap-1 mt-auto">
                <span className="text-(--accent-on-background-strong) bg-(--accent-alpha-weak) px-2 py-0.5 text-[10px] radius-xs">
                  no migration
                </span>
                <span className="text-(--accent-on-background-strong) bg-(--accent-alpha-weak) px-2 py-0.5 text-[10px] radius-xs">
                  flexible schema
                </span>
              </div>
            </div>
          </AppWindow>
        </motion.div>

        {/* Bottom card — Relational SQL result */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="p-2 bg-(--page-background) radius-xs h-1/2"
        >
          <AppWindow url="console.nuvix.dev/query">
            <div className="h-full text-xs">
              <div className="flex items-center gap-1.5 mb-2">
                <TableIcon className="size-3.5 text-(--accent-on-background-strong)" />
                <span className="text-(--neutral-on-background-strong) font-medium">
                  Top Rated · Wireless
                </span>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="text-(--neutral-on-background-strong)">
                    <th className="text-left pb-1 font-medium">Product</th>
                    <th className="text-left pb-1 font-medium">Rating</th>
                  </tr>
                </thead>
                <tbody className="text-(--neutral-on-background-weak)">
                  <tr>
                    <td className="py-0.5 truncate max-w-[100px]">MK Pro</td>
                    <td className="py-0.5">★ 4.9</td>
                  </tr>
                  <tr>
                    <td className="py-0.5 truncate max-w-[100px]">Slim 65%</td>
                    <td className="py-0.5">★ 4.7</td>
                  </tr>
                  <tr>
                    <td className="py-0.5 truncate max-w-[100px]">TypeMaster</td>
                    <td className="py-0.5">★ 4.5</td>
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
      <div className="flex items-center gap-2 px-3 py-1.5 bg-(--page-background) border-b border-(--surface-border)">
        <div className="flex gap-1">
          <span className="w-2 h-2 bg-red-400 rounded-full"></span>
          <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
          <span className="w-2 h-2 bg-green-400 rounded-full"></span>
        </div>
        <div className="flex items-center justify-center w-full">
          <span className="text-xs text-(--neutral-on-background-weak) font-mono bg-(--surface-background) px-2 py-0.5 rounded-sm">
            {url}
          </span>
        </div>
      </div>
      <div className="flex-1 p-3 overflow-hidden">{children}</div>
    </div>
  );
};

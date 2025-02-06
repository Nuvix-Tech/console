import ConsoleWrapper from "@/components/console/wrapper";

export default function ConsoleLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ConsoleWrapper>{children}</ConsoleWrapper>;
}

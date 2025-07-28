import { Column, Text, Card, PasswordInput, Button } from "@nuvix/ui/components";
import { cookies } from "next/headers";
import { redirect, RedirectType } from "next/navigation";

export default function Placeholder() {
  const submitForm = async (data: FormData) => {
    "use server";
    const pass = data.get("pass");
    if (pass !== process.env.DEV_PASS) return;
    const cookieStore = await cookies();
    cookieStore.set("dev_secret", pass, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
    });
    redirect("/", RedirectType.replace);
  };

  return (
    <Column fill horizontal="center" vertical="center">
      <Card
        minWidth={24}
        minHeight={24}
        radius="l"
        padding="24"
        horizontal="center"
        vertical="space-between"
        direction="column"
        gap="8"
      >
        <div className="flex flex-col justify-center mb-4 items-center space-y-5">
          <div className="h-12 w-12 rounded-full bg-[var(--brand-alpha-strong)] flex items-center justify-center">
            {/* <LockIcon className="h-6 w-6 text-white" /> */}
          </div>

          <div className="flex flex-col justify-center items-center text-wrap">
            <Text variant="heading-strong-l">Dev Mode Access</Text>
            <Text variant="body-default-s" onBackground="neutral-weak">
              This environment is protected. Enter your development secret to continue.
            </Text>
          </div>
        </div>
        <form action={submitForm} className="w-full">
          <div className="w-full flex flex-col space-y-4">
            <PasswordInput
              placeholder="Enter your dev secret"
              labelAsPlaceholder
              name="pass"
              required
              autoFocus
            />
            <Button fillWidth type="submit">
              Access Development Environment
            </Button>
          </div>
        </form>
        <div className="px-6 pb-4 text-xs text-gray-500 text-center">
          <p>A security measure for development environments.</p>
        </div>
      </Card>
    </Column>
  );
}

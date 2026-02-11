import { Button, Card } from "@nuvix/ui/components";

export default function NuvixAlphaNotice() {
  return (
    <div className="w-full min-h-[60vh] flex items-center justify-center p-6">
      <Card className="max-w-xl w-full shadow-lg rounded-2xl">
        <div className="p-8 space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold">Nuvix Cloud is in Alpha</h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your account has been created successfully. At the moment, organization creation and
              cloud resources are not yet enabled while we finalize the infrastructure for the
              public cloud release.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              If you want to start building today, you can use the self‑hosted version of Nuvix. We
              will notify all users once Nuvix Cloud becomes available.
            </p>
          </div>

          <div className="flex justify-between items-center pt-2">
            <Button
              variant="secondary"
              href="/docs/self-hosting"
              target="_blank"
              rel="noopener noreferrer"
            >
              View self-hosting guide
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

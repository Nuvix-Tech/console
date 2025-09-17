import { Button, Text } from "@nuvix/ui/components";
import {
  Drawer,
  // DrawerClose,
  DrawerContent,
  // DrawerDescription,
  // DrawerFooter,
  // DrawerHeader,
  // DrawerTitle,
  DrawerTrigger,
} from "@nuvix/sui/components/drawer";

export const ConnectButton = () => {
  return (
    <Drawer modal>
      <DrawerTrigger asChild>
        <Button size="s" variant="secondary">
          Connect
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-w-3xl mx-auto min-h-[calc(100vh_-_100px)]">
        <div className="p-10 text-center">
          <Text as="h4" variant="display-strong-s">
            Direct Database Connections Coming Soon!
          </Text>
          <Text as="p" variant="body-default-m" className="!mt-4 text-muted-foreground">
            We’ll soon provide full Postgres connection details so you can connect directly. In the
            meantime, you can integrate your apps with Nuvix or use our APIs from your server.
          </Text>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

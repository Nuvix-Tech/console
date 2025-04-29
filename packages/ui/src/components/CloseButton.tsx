import { IconButton } from "./IconButton";

export const CloseButton = (props: React.ComponentProps<typeof IconButton>) => {
  return <IconButton icon="close" size="s" variant="ghost" {...props} />;
};

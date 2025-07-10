import { Card, SmartLink } from "@nuvix/ui/components";

export const GridCard = ({
  href,
  ...props
}: React.ComponentProps<typeof Card> & { href?: string }) => {
  return (
    <SmartLink unstyled fillWidth href={href}>
      <Card
        radius="l"
        direction="column"
        vertical="space-between"
        horizontal="start"
        padding="m"
        fillWidth
        className="!bg-(--neutral-alpha-weak) dark:!bg-(--neutral-background-medium) hover:!bg-(--neutral-alpha-medium) dark:hover:!bg-(--neutral-alpha-medium)"
        {...props}
      />
    </SmartLink>
  );
};

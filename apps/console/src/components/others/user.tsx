import { Badge, BadgeProps } from "@chakra-ui/react";
import { Models } from "@nuvix/console";

export function getStatus(user?: Models.User<any>) {
  if (!user) return "";
  if (!user.status) {
    return "blocked";
  }
  if (user.email && user.phone) {
    if (user.emailVerification && user.phoneVerification) {
      return "verified";
    }
    return user.emailVerification
      ? "verified email"
      : user.phoneVerification
        ? "verified phone"
        : "unverfied";
  } else if (user.email) {
    return user.emailVerification ? "verified email" : "unverfied";
  } else if (user.phone) {
    return user.phoneVerification ? "verified phone" : "unverfied";
  }
  return "active";
}

export const Status = ({ user, ...props }: { user: Models.User<any> } & BadgeProps) => {
  const status = getStatus(user);

  return (
    <Badge
      variant="subtle"
      size="lg"
      borderRadius={"2xl"}
      colorPalette={status === "blocked" ? "red" : status.startsWith("verified") ? "green" : "gray"}
      {...props}
    >
      {status}
    </Badge>
  );
};

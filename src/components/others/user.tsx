import { Badge, BadgeProps } from "@chakra-ui/react";
import { Models } from "@nuvix/console";

function getStatusAndColor(user: Models.User<any>) {
  if (!user.status) {
    return {
      status: "blocked",
      color: "red.500",
    };
  }
  if (user.email && user.phone) {
    if (user.emailVerification && user.phoneVerification) {
      return {
        status: "verified",
        color: "green",
      };
    }
    if (user.emailVerification) {
      return {
        status: "email verified",
        color: "yellow",
      };
    }
    if (user.phoneVerification) {
      return {
        status: "phone verified",
        color: "yellow",
      };
    }
  } else if ((user.email && user.emailVerification) || (user.phone && user.phoneVerification))
    return { status: "verified", color: "green" };
  else if (user.email || user.phone) return { status: "unverified", color: "gray" };
  else return { status: "blocked", color: "red" };
}

export const Status = ({ user, ...props }: { user: Models.User<any> } & BadgeProps) => {
  const { status, color } = getStatusAndColor(user) as { status: string; color: string };

  return (
    <Badge variant="subtle" size="lg" borderRadius={"2xl"} colorPalette={color} {...props}>
      {status}
    </Badge>
  );
};

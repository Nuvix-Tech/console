import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { sdkForConsole } from "@/lib/sdk";
import { useApp } from "@/lib/store";

export function UserProfile() {
  const { user } = useApp();
  const { avatars, account } = sdkForConsole;

  return user ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="p-0 rounded-full items-center justify-center">
          <Avatar>
            <AvatarImage src={avatars.getInitials(user.name, 100, 100)} alt={user.name} />
            <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="py-2.5 px-3">Dashboard</DropdownMenuItem>
          <DropdownMenuItem className="py-2.5 px-3">Your Account</DropdownMenuItem>
          <DropdownMenuItem className="py-2.5 px-3">Create Team</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => account.deleteSession("current").then()}>
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <Skeleton className="h-8 w-8 rounded-full" />
  );
}

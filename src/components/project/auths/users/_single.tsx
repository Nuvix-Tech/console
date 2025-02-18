"use client";
import { IDChip, TopCard, UserStatus } from "@/components/others";
import { CardUpdater } from "@/components/others/card";
import { Avatar } from "@/components/ui/avatar";
import { SkeletonText } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import { getUserPageState, userPageState } from "@/state/page";
import { getProjectState, projectState } from "@/state/project-state";
import { Background, Column, Line, Row, useToast } from "@/ui/components";
import { Button, ButtonProps, HStack, Stack, Text, VStack } from "@chakra-ui/react";
import { Models } from "@nuvix/console";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverRoot,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getStatus } from "@/components/others/user";

const UserPage: React.FC<{ id: string }> = ({ id }) => {
  const { user } = getUserPageState();
  const [userState, setUserState] = React.useState<Models.User<any>>();
  const state = getProjectState();
  const { sdk } = state;

  return (
    <>
      <Column fillWidth gap="20" paddingX="12" paddingY="20">
        <TopUserInfo />

        <CardUpdater
          label="Name"
          button={{
            disabled: user?.name === userState?.name,
          }}
          field={{
            label: "Name",
          }}
          input={{
            placeholder: "Name",
            type: "text",
            value: userState?.name,
            onChange: (e) => {
              setUserState((prev: any) => ({ ...prev, name: e.target.value }));
            },
          }}
          onSubmit={() => sdk?.users.updateName(user?.$id!, userState?.name!)}
        />

        <CardUpdater
          label="Email"
          description="Update user's email. An Email should be formatted as: name@example.com."
          button={{
            disabled: user?.email === userState?.email,
          }}
          field={{
            label: "Email",
          }}
          input={{
            placeholder: "Email",
            type: "email",
            value: userState?.email,
            onChange: (e) => {
              setUserState((prev: any) => ({ ...prev, email: e.target.value }));
            },
          }}
          onSubmit={() => {}}
        />
      </Column>
    </>
  );
};

const TopUserInfo = () => {
  const { user } = getUserPageState();
  const { sdk } = getProjectState();
  const status = getStatus(user);
  const { addToast } = useToast();

  const onBlockUnblock = async () => {
    try {
      let _user: any;
      if (status === "blocked") {
        _user = await sdk?.users.updateStatus(user?.$id!, true);
        addToast({
          variant: "success",
          message: "You have successfully blocked this user.",
        });
      } else {
        _user = await sdk?.users.updateStatus(user?.$id!, false);
        addToast({
          variant: "success",
          message: "You have successfully unblocked this user.",
        });
      }
      _user && (userPageState.user = _user);
    } catch (e: any) {
      addToast({
        variant: "danger",
        message: e.message,
      });
    }
  };

  const onVerify = async (emailVerification?: boolean, phoneVerification?: boolean) => {
    try {
      let _user: any;
      if (emailVerification) {
        _user = await sdk?.users.updateEmailVerification(user?.$id!, true);
        addToast({
          variant: "success",
          message: "You have successfully verified this user's email.",
        });
      } else if (phoneVerification) {
        _user = await sdk?.users.updatePhoneVerification(user?.$id!, true);
        addToast({
          variant: "success",
          message: "You have successfully verified this user's phone.",
        });
      }
      _user && (userPageState.user = _user);
    } catch (e: any) {
      addToast({
        variant: "danger",
        message: e.message,
      });
    }
  };

  const onUnverify = async (emailVerification?: boolean, phoneVerification?: boolean) => {
    try {
      let _user: any;
      if (emailVerification) {
        _user = await sdk?.users.updateEmailVerification(user?.$id!, false);
        addToast({
          variant: "success",
          message: "You have successfully unverified this user's email.",
        });
      } else if (phoneVerification) {
        _user = await sdk?.users.updatePhoneVerification(user?.$id!, false);
        addToast({
          variant: "success",
          message: "You have successfully unverified this user's phone.",
        });
      }
      _user && (userPageState.user = _user);
    } catch (e: any) {
      addToast({
        variant: "danger",
        message: e.message,
      });
    }
  };

  return (
    <TopCard>
      <Row fill background="neutral-alpha-weak" radius="l" padding="20" horizontal="space-between">
        <Stack
          direction={{ base: "column", md: "row" }}
          gap={"2.5"}
          justifyContent={"space-between"}
          width={"full"}
          zIndex={1}
        >
          <VStack
            width={{ base: "full", md: "1/2" }}
            alignItems={"flex-start"}
            justifyContent={"space-between"}
          >
            <HStack alignSelf={"flex-start"} width={"full"}>
              <Avatar
                size={"lg"}
                src={user ? sdk?.avatars.getInitials(user.name, 120, 120) : undefined}
              />
              <Text textStyle={{ base: "xl", mdOnly: "lg" }} fontWeight={"semibold"} truncate>
                {user?.name}
              </Text>
            </HStack>
            <IDChip id={user?.$id} />
          </VStack>
          <VStack width={{ base: "full", md: "1/2" }} alignItems={"flex-start"}>
            {[
              user?.email,
              user?.phone,
              "Joined: " + formatDate(user?.$createdAt),
              "Last Activity: " + (formatDate(user?.accessedAt) ?? "never"),
            ]
              .filter(Boolean)
              .map((item, _) => (
                <Text key={_} textStyle={{ base: "sm", mdOnly: "xs" }} color={"fg.muted"} truncate>
                  {item}
                </Text>
              ))}
          </VStack>
        </Stack>
      </Row>
      <VStack
        width={{ base: "full", lg: "1/3" }}
        alignItems={"flex-end"}
        justifyContent={"space-between"}
      >
        {user && <UserStatus variant={"surface"} size={"lg"} user={user!} />}
        <Stack
          direction={{ base: "row", lg: "column" }}
          gap={"2"}
          alignItems={"flex-end"}
          width={"full"}
        >
          {status === "blocked" ? (
            <UpdaterButton
              variant={"outline"}
              width={{ base: "1/2", lg: "full" }}
              callBackFn={onBlockUnblock}
            >
              Unblock Account
            </UpdaterButton>
          ) : (
            <>
              <UpdaterButton
                variant={"outline"}
                width={{ base: "1/2", lg: "full" }}
                callBackFn={onBlockUnblock}
              >
                Block Account
              </UpdaterButton>
              {user?.email && user?.phone ? (
                <>
                  <PopoverRoot>
                    <PopoverTrigger asChild>
                      <Button variant={"solid"} width={{ base: "1/2", lg: "full" }}>
                        {status === "verified" ? "Unverify Account" : "Verify Account"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <PopoverArrow />
                      <PopoverBody>
                        <VStack width={"full"}>
                          <UpdaterButton
                            variant={"subtle"}
                            width={"full"}
                            callBackFn={async () => {
                              user?.emailVerification
                                ? await onUnverify(true)
                                : await onVerify(true);
                            }}
                          >
                            {user?.emailVerification ? "Unverify Email" : "Verify Email"}
                          </UpdaterButton>
                          <UpdaterButton
                            variant={"subtle"}
                            width={"full"}
                            callBackFn={async () => {
                              user?.phoneVerification
                                ? await onUnverify(false, true)
                                : await onVerify(false, true);
                            }}
                          >
                            {user?.phoneVerification ? "Unverify Phone" : "Verify Phone"}
                          </UpdaterButton>
                        </VStack>
                      </PopoverBody>
                    </PopoverContent>
                  </PopoverRoot>
                </>
              ) : (
                <UpdaterButton
                  variant={"solid"}
                  width={{ base: "1/2", lg: "full" }}
                  callBackFn={async () => {
                    if (user?.email) {
                      user?.emailVerification ? await onUnverify(true) : await onVerify(true);
                    } else if (user?.phone) {
                      user?.phoneVerification
                        ? await onUnverify(false, true)
                        : await onVerify(false, true);
                    }
                  }}
                >
                  {status.startsWith("verified") ? "Unverify Account" : "Verify Account"}
                </UpdaterButton>
              )}
            </>
          )}
        </Stack>
      </VStack>
    </TopCard>
  );
};

interface UpdaterButtonProps extends ButtonProps {
  callBackFn: () => Promise<void>;
}

const UpdaterButton = ({ children, callBackFn, ...props }: UpdaterButtonProps) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    await callBackFn();
    setLoading(false);
  };

  return (
    <Button loading={loading} onClick={handleClick} {...props}>
      {children}
    </Button>
  );
};

export default UserPage;

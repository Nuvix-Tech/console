"use client";
import { IDChip, TopCard, UserStatus } from "@/components/others";
import { Avatar } from "@/components/cui/avatar";
import { SkeletonText } from "@/components/cui/skeleton";
import { formatDate } from "@/lib/utils";
import { getUserPageState, userPageState } from "@/state/page";
import { getProjectState } from "@/state/project-state";
import { Column, Row, useToast } from "@/ui/components";
import { Button, ButtonProps, HStack, Skeleton, Stack, Text, VStack } from "@chakra-ui/react";
import React, { useState } from "react";
import {
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverRoot,
  PopoverTrigger,
} from "@/components/cui/popover";
import { getStatus } from "@/components/others/user";
import {
  DeleteUser,
  UpdateEmail,
  UpdateLabels,
  UpdateName,
  UpdatePassword,
  UpdatePhone,
  UpdatePrefs,
} from "./components";

const UserPage: React.FC<{ id: string }> = ({ id }) => {
  const { user } = getUserPageState();

  return (
    <>
      {user ? (
        <Column fillWidth gap="20" paddingX="12" paddingY="20">
          <TopUserInfo />
          <UpdateName />
          <UpdateEmail />
          <UpdatePhone />
          <UpdatePassword />
          <UpdateLabels />
          <UpdatePrefs />
          <DeleteUser />
        </Column>
      ) : (
        <>
          <Column fillWidth gap="20" paddingX="12" paddingY="20">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} width={"full"} height={"28"} />
            ))}
          </Column>
        </>
      )}
    </>
  );
};

const TopUserInfo = () => {
  const { user, _update } = getUserPageState();
  const { sdk } = getProjectState();
  const status = getStatus(user);
  const { addToast } = useToast();

  const onBlockUnblock = async () => {
    try {
      let _user: any;
      if (status === "blocked") {
        await sdk?.users.updateStatus(user?.$id!, true);
        await _update();
        addToast({
          variant: "success",
          message: "You have successfully unblocked this user.",
        });
      } else {
        await sdk?.users.updateStatus(user?.$id!, false);
        await _update();
        addToast({
          variant: "success",
          message: "You have successfully blocked this user.",
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
      if (emailVerification) {
        await sdk?.users.updateEmailVerification(user?.$id!, true);
        addToast({
          variant: "success",
          message: "You have successfully verified this user's email.",
        });
      } else if (phoneVerification) {
        await sdk?.users.updatePhoneVerification(user?.$id!, true);
        addToast({
          variant: "success",
          message: "You have successfully verified this user's phone.",
        });
      }
      await _update();
    } catch (e: any) {
      addToast({
        variant: "danger",
        message: e.message,
      });
    }
  };

  const onUnverify = async (emailVerification?: boolean, phoneVerification?: boolean) => {
    try {
      if (emailVerification) {
        await sdk?.users.updateEmailVerification(user?.$id!, false);
        addToast({
          variant: "success",
          message: "You have successfully unverified this user's email.",
        });
      } else if (phoneVerification) {
        await sdk?.users.updatePhoneVerification(user?.$id!, false);
        addToast({
          variant: "success",
          message: "You have successfully unverified this user's phone.",
        });
      }
      await _update();
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

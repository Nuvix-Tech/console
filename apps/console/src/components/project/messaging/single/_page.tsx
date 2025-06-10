"use client";

import { PageContainer } from "@/components/others";
import { useProjectStore } from "@/lib/store";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMessageStore } from "./components/store";
import { useEffect } from "react";
import { DeleteMessage, TopMeta, UpdateMessage, UpdateTargets, UpdateTopics } from "./components";
import { Models } from "@nuvix/console";

export const MessageSinglePage = ({ messageId }: { messageId: string }) => {
  const { sdk } = useProjectStore((state) => state);
  const {
    setMessage,
    setLoading,
    setRefresh,
    setTopicsById,
    setTargetsById,
    setUsersById,
    setMessageRecipients,
  } = useMessageStore((s) => s);

  // TODO: find a way to handle this better
  const fetcher = async (messageId: string) => {
    const message = await sdk.messaging.getMessage(messageId);

    const topicsById: Record<string, Models.Topic> = {};
    const topicsPromise = Promise.allSettled(
      message.topics.map((topicId) => sdk.messaging.getTopic(topicId)),
    ).then((results) => {
      results.forEach((result) => {
        if (result.status === "fulfilled") {
          topicsById[result.value.$id] = result.value;
        }
      });
    });

    const targetsById: Record<string, Models.Target> = {};
    const targetsPromise = sdk.messaging.listTargets(messageId).then((response) => {
      response.targets.forEach((target) => {
        targetsById[target.$id] = target;
      });
    });

    await Promise.allSettled([topicsPromise, targetsPromise]);

    const usersById: Record<string, Models.User<Models.Preferences>> = {};
    const usersPromise = Object.values(targetsById).map((target) =>
      sdk.users.get(target.userId).then((user) => {
        usersById[user.$id] = user;
      }),
    );

    const messageRecipients: Record<string, Models.User<Models.Preferences>> = {};
    const messageRecipientsPromise = Object.values(message.users).map((userId) =>
      sdk.users
        .get(userId)
        .then((user) => {
          messageRecipients[user.$id] = user;
        })
        .catch(() => {
          messageRecipients[userId] = null as unknown as Models.User<Models.Preferences>;
        }),
    );

    await Promise.allSettled([usersPromise, messageRecipientsPromise]);

    return { message, topicsById, targetsById, usersById, messageRecipients };
  };

  const { data } = useSuspenseQuery({
    queryKey: ["message", messageId],
    queryFn: async () => await fetcher(messageId),
  });

  useEffect(() => {
    setMessage(data.message);
    setTopicsById(data.topicsById);
    setTargetsById(data.targetsById);
    setUsersById(data.usersById);
    setMessageRecipients(data.messageRecipients);
    setLoading(false);
    setRefresh(async () => {
      const data = await fetcher(messageId);
      if (data) {
        setMessage(data.message);
        setTopicsById(data.topicsById);
        setTargetsById(data.targetsById);
        setUsersById(data.usersById);
        setMessageRecipients(data.messageRecipients);
      }
    });
  }, [data]);

  return (
    <>
      <PageContainer marginTop="8">
        <TopMeta />
        <UpdateMessage />
        <UpdateTargets />
        <UpdateTopics />
        <DeleteMessage />
      </PageContainer>
    </>
  );
};

import React, { useState, useEffect } from "react";
import { Models, Query } from "@nuvix/console";
import { Button, HStack, Text, VStack, Input, Box } from "@chakra-ui/react";
import { Avatar } from "@nuvix/ui/components";
import { SelectDialog } from "@/components/others";
import { ProjectSdk } from "@/lib/sdk";
import { DialogTrigger } from "@/components/cui/dialog";
import { Checkbox } from "@/components/cui/checkbox";

export type TopicsProps = {
  add: (topic: Models.Topic) => void;
  onClose: VoidFunction;
  groups: Map<string, string>;
} & { sdk: ProjectSdk };

export const Topics = ({ add, sdk, onClose, groups }: TopicsProps) => {
  const [search, setSearch] = useState("");
  const [offset, setOffset] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [topics, setTopics] = useState<Models.Topic[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  const limit = 5;

  const fetchTopics = async () => {
    setLoading(true);
    try {
      const queries = [Query.limit(limit), Query.offset(offset)];
      const res = await sdk.messaging.listTopics(queries, search || undefined);
      setTopics(res.topics);
      setTotalResults(res.total);
    } catch (error) {
      console.error("Failed to fetch topics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, [search, offset]);

  const handleTopicSelection = (topicId: string, checked: boolean) => {
    const newSelection = new Set(selectedTopics);
    if (checked) {
      newSelection.add(topicId);
    } else {
      newSelection.delete(topicId);
    }
    setSelectedTopics(newSelection);
  };

  const onSave = () => {
    for (const topicId of selectedTopics) {
      const topic = topics.find(t => t.$id === topicId);
      if (topic) {
        add(topic);
      }
    }
    onClose?.();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setOffset(0);
  };

  return (
    <>
      <SelectDialog
        title="Select topics"
        description="Select existing topics you want to send this message to its targets."
        actions={
          <>
            <DialogTrigger asChild>
              <Button variant="outline">Cancel</Button>
            </DialogTrigger>
            <Button disabled={selectedTopics.size === 0} onClick={onSave}>
              Add ({selectedTopics.size})
            </Button>
          </>
        }
      >
        <VStack gap={4} width="full">
          <Input
            placeholder="Search for topics"
            value={search}
            onChange={handleSearchChange}
            disabled={totalResults === 0 && !search}
          />

          {topics.length > 0 ? (
            <VStack gap={2} width="full" maxHeight="400px" overflowY="auto">
              {topics.map((topic) => {
                const isExists = groups.has(topic.$id);
                const isSelected = selectedTopics.has(topic.$id);

                return (
                  <HStack
                    key={topic.$id}
                    width="full"
                    p={3}
                    borderRadius="md"
                    border="1px solid"
                    borderColor="gray.200"
                    _hover={{ bg: "gray.50" }}
                  >
                    <Checkbox
                      checked={isExists || isSelected}
                      disabled={isExists}
                      onCheckedChange={({ checked }) => handleTopicSelection(topic.$id, !!checked)}
                    />
                    <Avatar
                      size="s"
                      src={sdk.avatars.getInitials(topic.name)}
                      about={topic.name}
                    />
                    <VStack align="start" gap={0} flex={1}>
                      <Text fontWeight="medium">{topic.name}</Text>
                      <Text fontSize="sm" color="gray.500">{topic.$id}</Text>
                    </VStack>
                  </HStack>
                );
              })}
            </VStack>
          ) : (
            <Box textAlign="center" py={8}>
              <Text color="gray.500">
                {search ? "No topics found" : "No topics available"}
              </Text>
            </Box>
          )}

          {topics.length > 0 && (
            <HStack justify="space-between" width="full">
              <Text fontSize="sm" color="gray.500">
                Total results: {totalResults}
              </Text>
              <HStack>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={offset === 0}
                  onClick={() => setOffset(Math.max(0, offset - limit))}
                >
                  Previous
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={offset + limit >= totalResults}
                  onClick={() => setOffset(offset + limit)}
                >
                  Next
                </Button>
              </HStack>
            </HStack>
          )}
        </VStack>
      </SelectDialog>
    </>
  );
};

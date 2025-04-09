"use client";
import { FunctionComponent } from "react";
import { Box, Heading, Text } from "@chakra-ui/react";

export const StoragePage: FunctionComponent = () => {
  return (
    <Box mt={8}>
      <Heading size="lg">Storage</Heading>
      <Text mt={4}>Manage your project's storage here.</Text>
      {/* <StorageTable /> */}
    </Box>
  );
};

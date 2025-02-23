"use client";
import { projectState } from '@/state/project-state';
import { Column } from '@/ui/components';
import { Heading, Text } from '@chakra-ui/react';
import React from 'react';
import { SettingsSidebar } from './components';

const ProjectSettings: React.FC = () => {

  projectState.sidebar.first = null;
  projectState.sidebar.middle = <SettingsSidebar />;

  return (
    <Column gap="20" fillWidth padding="20">
      <Column gap="4">
        <Heading as={"h2"} size={"xl"}>
          Project Settings
        </Heading>
        <Text textStyle="sm" color="fg.subtle">
          Configure your project settings here.
        </Text>
      </Column>


    </Column>
  );
};

export { ProjectSettings };
import { TeamLayout } from '@/components/project/auths/teams';
import { PropsWithParams } from '@/types';
import React, { PropsWithChildren } from 'react';

export default async function ({ children, params }: PropsWithChildren & PropsWithParams<{ teamId: string }>) {
  const { teamId } = await params;
  return (
    <TeamLayout teamId={teamId}>
      {children}
    </TeamLayout>
  );
};
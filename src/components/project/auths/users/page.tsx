"use client";

import { getProjectState } from "@/state/project-state";

import { Avatar } from "@/ui/components";

import { Models } from "@nuvix/console";
import React, { useEffect } from "react";

export const UserPage: React.FC<{ id: string }> = ({ id }) => {
  const [user, setUser] = React.useState<Models.User<any>>();
  const state = getProjectState();

  const { sdk } = state;

  useEffect(() => {
    if (!sdk) return;
    const fetchUser = async () => {
      const user = await sdk.users.get(id);
      setUser(user);
    };

    fetchUser();
  }, [sdk, id]);

  return (
    <>
      <div className="u-flex u-gap-24">
        <Avatar size="l" src={sdk?.avatars.getInitials(user?.name)} />
        <div className="u-flex u-flex-column">
          <h1 className="u-text-heading-2">{user?.name}</h1>
          <p className="u-text-body-2">{user?.email}</p>
        </div>
      </div>
    </>
  );
};

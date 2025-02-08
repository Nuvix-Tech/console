"use client";
import { useProject } from "@/hooks/useProject";
import React from "react";

const UsersPage: React.FC = () => {
  const { sdk } = useProject();
  const [users, setUsers] = React.useState<any[]>([]);

  if (!sdk) return null;

  React.useEffect(() => {
    const fetchUsers = async () => {
      const users = await sdk.users.list();
      setUsers(users.users);
    };

    fetchUsers();
  }, [sdk]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user.$id} className="border p-2 mb-2">
            {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersPage;

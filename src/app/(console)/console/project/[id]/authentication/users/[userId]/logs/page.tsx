import { PropsWithParams } from "@/types";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface Params {
  id: string;
  userId: string;
}

export const metadata: Metadata = {
  title: "User Logs",
};

export default async function UserLogs({ params }: PropsWithParams<Params>) {
  return <p>No logs found</p>;
}

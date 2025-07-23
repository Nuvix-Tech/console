import type { Route } from "./+types/home";
import { HeroSection } from "~/components/home";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Nuvix - Backend as a Service for Modern Applications" },
    {
      name: "description",
      content:
        "Nuvix is a powerful Backend as a Service (BaaS) platform that helps developers build scalable applications without managing infrastructure. Get started for free.",
    },
  ];
}

export default function Home() {
  return (
    <>
      <HeroSection />
    </>
  );
}

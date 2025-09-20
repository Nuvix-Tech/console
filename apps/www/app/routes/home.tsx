import type { Route } from "./+types/home";
import { HeroSection, FeaturesSection, BottomCtaSection, UseWithSection } from "~/components/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Nuvix - Open Source Backend for Modern Applications" },
    {
      name: "description",
      content:
        "Nuvix is a powerful Open Source Backend platform that helps developers build modern applications with ease. It offers a range of features including authentication, database management, and real-time capabilities.",
    },
  ];
}

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <UseWithSection />
      <BottomCtaSection />
    </>
  );
}

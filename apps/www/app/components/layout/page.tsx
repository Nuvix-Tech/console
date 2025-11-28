import { Outlet } from "react-router";
import Header from "../header/header";
import { Footer } from "./footer";

export default function PageLayout() {
  return (
    <div className="relative min-h-screen flex flex-col">
      <Header defaultTransBg={false} />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

import { Outlet } from "react-router";
import Header from "../header/header";
import { Footer } from "./footer";

export default function MainLayout() {
  return (
    <div className="relative min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

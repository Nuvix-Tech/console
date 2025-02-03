import { ReactNode } from "react";


export const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      {/* <Header /> */}
      {children}
      {/* <Footer /> */}
    </div>
  );
}
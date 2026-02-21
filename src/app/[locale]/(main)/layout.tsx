import React from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col relative">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};

export default MainLayout;

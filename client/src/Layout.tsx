import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="max-w-[1280px] mx-auto px-4">
        <Header />
        {children}
      </div>
      <Footer />
    </div>
  );
}

export default Layout;

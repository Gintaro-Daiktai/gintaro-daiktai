import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    // make the whole page a column that fills the viewport so header + content + footer
    // are contained and don't create an unnecessary scrollbar
    <div className="min-h-screen flex flex-col">
      <div className="max-w-[1280px] mx-auto px-4 flex-1 flex flex-col w-full min-h-0">
        <Header />
        {/* children (pages) should be allowed to grow inside this flex column */}
        {children}
      </div>
      <Footer />
    </div>
  );
}

export default Layout;

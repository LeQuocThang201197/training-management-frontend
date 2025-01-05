import { useState } from "react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  children: React.ReactNode;
  currentPage?: string;
  onPageChange?: (page: string) => void;
}

export function AppLayout({
  children,
  currentPage = "Tổng quan",
  onPageChange = () => {},
}: AppLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
          currentPage={currentPage}
          onPageChange={onPageChange}
        />
        <main
          className={cn(
            "flex-1 p-4 mt-16",
            "transition-[margin] duration-300",
            collapsed ? "ml-16" : "ml-64"
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

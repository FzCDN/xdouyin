import { ReactNode } from "react";
import TopNavigation from "@/components/TopNavigation";
import BottomNavigation from "@/components/BottomNavigation";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="relative flex flex-col h-screen overflow-hidden font-inter text-white">
      <TopNavigation />
      <main className="flex-1 overflow-hidden">{children}</main>
      <BottomNavigation />
    </div>
  );
}

"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Plus, Calendar, List, FileText, LayoutDashboard } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function AppSidebar() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;
  
  const getLinkClasses = (path: string) =>
    `flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm font-medium transition-all ${
      isActive(path)
        ? "bg-white text-black"
        : "text-gray-300 hover:text-white hover:bg-gray-800"
    }`;

  return (
    <Sidebar className="!bg-black border-r border-gray-800 min-h-screen w-56 flex flex-col">
      <SidebarHeader className="!bg-black border-b border-gray-800 px-4 py-3">
        <h2 className="text-xl font-bold text-white">VocalHire</h2>
      </SidebarHeader>
      
      <SidebarContent className="!bg-black flex-1 px-3 py-4 space-y-1">
        <Link href="/dashboard" className={getLinkClasses("/dashboard")}>
          <LayoutDashboard size={18} className="text-inherit" />
          Dashboard
        </Link>
        
        <Link href="/create-interview" className={getLinkClasses("/create-interview")}>
          <Plus size={18} className="text-inherit" />
          Create Interview
        </Link>
        
        <div className="mt-2 mb-1 px-3 py-1">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Management
          </p>
        </div>
        
        <Link href="/scheduled-interviews" className={getLinkClasses("/scheduled-interviews")}>
          <Calendar size={18} className="text-inherit" />
          Scheduled Interviews
        </Link>
        
        <Link href="/all-interviews" className={getLinkClasses("/all-interviews")}>
          <List size={18} className="text-inherit" />
          All Interviews
        </Link>
        
        <div className="mt-2 mb-1 px-3 py-1">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Account
          </p>
        </div>
        
        <Link href="/pricing" className={getLinkClasses("/pricing")}>
          <FileText size={18} className="text-inherit" />
          Pricing
        </Link>
      </SidebarContent>
      
      <SidebarFooter className="!bg-black border-t border-gray-800 px-4 py-3 flex items-center">
        <UserButton />
        <div className="ml-3">
          <p className="text-xs text-gray-400">Your Account</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
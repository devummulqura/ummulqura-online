"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Newspaper, 
  Image as ImageIcon, 
  Settings, 
  LogOut,
  Menu,
  BellRing,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
  { icon: Users, label: "Admissions", href: "/admin/admissions" },
  { icon: Newspaper, label: "News & Events", href: "/admin/news" },
  { icon: ImageIcon, label: "Gallery", href: "/admin/gallery" },
  { icon: BellRing, label: "Notifications", href: "/admin/notifications" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
];

interface SidebarContentProps {
  collapsed: boolean;
  pathname: string;
  router: ReturnType<typeof useRouter>;
  handleLogout: () => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const SidebarContent = ({
  collapsed,
  pathname,
  router,
  handleLogout,
  isCollapsed,
  setIsCollapsed,
}: SidebarContentProps) => (
  <div className="h-full flex flex-col bg-white dark:bg-zinc-950 border-r border-border shadow-sm transition-all duration-300">
    <div className={`p-6 border-b border-border flex items-center transition-all ${collapsed ? 'justify-center px-4' : 'justify-between'}`}>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-primary to-emerald-600 text-white rounded-xl flex items-center justify-center font-heading font-bold shadow-md shrink-0">
          U
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span 
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="font-heading font-bold text-xl text-foreground whitespace-nowrap overflow-hidden"
            >
              Admin Panel
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>

    <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-2">
      <TooltipProvider delay={0}>
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Tooltip key={item.href}>
              <TooltipTrigger 
                onClick={() => router.push(item.href)}
                className="w-full text-left appearance-none bg-transparent border-none p-0 cursor-pointer"
              >
                <div className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                }`}>
                  <item.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'group-hover:scale-110 transition-transform'}`} />
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span 
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        className="font-medium whitespace-nowrap overflow-hidden"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {isActive && !collapsed && (
                    <motion.div layoutId="active-indicator" className="absolute right-2 w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </div>
              </TooltipTrigger>
              {collapsed && (
                <TooltipContent side="right" className="font-medium">
                  {item.label}
                </TooltipContent>
              )}
            </Tooltip>
          );
        })}
      </TooltipProvider>
    </nav>

    <div className="p-4 border-t border-border flex flex-col gap-2">
      <TooltipProvider delay={0}>
        <Tooltip>
          <TooltipTrigger 
            className={buttonVariants({ variant: "ghost", className: `w-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors ${collapsed ? 'justify-center px-0' : 'justify-start'}` })}
            onClick={handleLogout}
          >
            <LogOut className={`h-5 w-5 ${collapsed ? '' : 'mr-3'}`} />
            {!collapsed && <span>Logout</span>}
          </TooltipTrigger>
          {collapsed && (
            <TooltipContent side="right" className="font-medium text-red-500">
              Logout
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>

      <div className="hidden md:flex justify-end pt-2 border-t border-border/50">
         <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-muted-foreground hover:text-foreground h-8 w-8"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
      </div>
    </div>
  </div>
);

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = async () => {
    // Basic logout handling (needs actual implementation based on auth mechanism)
    window.location.href = "/admin/login";
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.div 
        animate={{ width: isCollapsed ? 80 : 260 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="hidden md:block fixed inset-y-0 left-0 z-40 bg-background"
      >
        <SidebarContent
          collapsed={isCollapsed}
          pathname={pathname}
          router={router}
          handleLogout={handleLogout}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />
      </motion.div>

      {/* Mobile Sidebar Trigger */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Sheet>
          <SheetTrigger
            render={
              <Button variant="outline" size="icon" className="bg-white/80 backdrop-blur-md dark:bg-zinc-900/80 shadow-sm border-border">
                <Menu className="h-5 w-5" />
              </Button>
            }
          />
          <SheetContent side="left" className="p-0 w-64 border-none pt-12">
            <SidebarContent
              collapsed={false}
              pathname={pathname}
              router={router}
              handleLogout={handleLogout}
              isCollapsed={isCollapsed}
              setIsCollapsed={setIsCollapsed}
            />
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content Spacer for Desktop */}
      <div className="hidden md:block" style={{ width: isCollapsed ? 80 : 260, flexShrink: 0, transition: 'width 0.3s ease-in-out' }} />
    </>
  );
}

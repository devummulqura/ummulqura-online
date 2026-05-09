"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

import { siteConfig } from "@/lib/constants";

const routes = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/news", label: "News" },
  { href: "/gallery", label: "Gallery" },
  { href: "/admission", label: "Admission" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`w-full transition-all duration-300 ${isScrolled
        ? "bg-white/80 dark:bg-black/80 backdrop-blur-md shadow-md py-3 border-b border-white/20"
        : "bg-transparent py-5"
        }`}
    >
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          {siteConfig.logoUrl ? (
            <img src={siteConfig.logoUrl} alt={siteConfig.instituteName} className="h-10 w-auto object-contain" />
          ) : (
            <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-heading font-bold text-xl">
              {siteConfig.instituteName.charAt(0)}
            </div>
          )}
          <span className="font-heading font-bold text-2xl md:text-4xl tracking-tight text-primary dark:text-white">
            {siteConfig.instituteName}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <NavigationMenu>
            <NavigationMenuList className="gap-2">
              {routes.map((route) => (
                <NavigationMenuItem key={route.href}>
                  <NavigationMenuLink
                    render={<Link href={route.href} />}
                    className={`${navigationMenuTriggerStyle()} bg-transparent hover:bg-primary/10 dark:hover:bg-primary/20 ${pathname === route.href ? "text-primary font-semibold" : ""
                      }`}
                  >
                    {route.label}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center">
          <Sheet>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-11 w-11 rounded-2xl border border-border/50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl shadow-sm hover:bg-primary hover:text-white transition-all duration-300"
                />
              }
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="
        w-[320px]
        p-0
        border-l
        border-border/40
        bg-white/95
        dark:bg-black/95
        backdrop-blur-2xl
      "
            >

              {/* Header */}
              <div className="relative overflow-hidden border-b border-border/40">

                {/* Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />

                <div className="relative p-6">

                  <SheetTitle className="text-left">

                    <div className="flex items-center gap-4">

                      {/* Logo */}
                      <div
                        className="
                  h-14 w-14
                  rounded-2xl
                  bg-primary/10
                  border border-primary/20
                  flex items-center justify-center
                  shadow-sm
                "
                      >
                        <span className="text-primary text-2xl font-bold">
                          U
                        </span>
                      </div>

                      {/* Text */}
                      <div>
                        <h2 className="text-xl font-bold font-heading text-foreground">
                          Ummul Qura
                        </h2>

                        <p className="text-sm text-muted-foreground">
                          Islamic Institute
                        </p>
                      </div>
                    </div>
                  </SheetTitle>
                </div>
              </div>

              {/* Menu Items */}
              <div className="flex flex-col p-5">

                <div className="space-y-2">
                  {routes.map((route) => {
                    const active = pathname === route.href;

                    return (
                      <Link
                        key={route.href}
                        href={route.href}
                        className={`
                  group
                  relative
                  flex items-center justify-between
                  rounded-2xl
                  px-4 py-3.5
                  text-[15px]
                  font-medium
                  transition-all duration-300

                  ${active
                            ? "bg-primary text-white shadow-lg"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          }
                `}
                      >
                        <span>{route.label}</span>

                        <div
                          className={`
                    h-2 w-2 rounded-full transition-all duration-300

                    ${active
                              ? "bg-white scale-100"
                              : "bg-primary/30 scale-0 group-hover:scale-100"
                            }
                  `}
                        />
                      </Link>
                    );
                  })}
                </div>

                {/* Divider */}
                <div className="my-6 border-t border-border/40" />

                {/* Admin Login
                <Link href="/admin/login">
                  <Button
                    className="
              w-full
              h-12
              rounded-2xl
              bg-primary
              hover:bg-primary/90
              text-white
              text-base
              font-semibold
              shadow-lg
            "
                  >
                    Admin Login
                  </Button>
                </Link> */}

                {/* Footer */}
                <div className="mt-8 text-center">
                  <p className="text-xs text-muted-foreground">
                    © 2026 Ummul Qura Institute
                  </p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

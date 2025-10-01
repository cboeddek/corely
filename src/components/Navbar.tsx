"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Receipt,
  FileText,
  User,
  Settings,
  Building2,
} from "lucide-react";

const navigationItems = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Alle Transaktionen",
    href: "/transactions",
    icon: FileText,
  },
  {
    name: "Belege",
    href: "/receipts",
    icon: Receipt,
  },
  {
    name: "Account",
    href: "/account",
    icon: User,
  },
  {
    name: "Einstellungen",
    href: "/settings",
    icon: Settings,
  },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="w-64 bg-card border-r border-border flex flex-col h-full">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-2">
          <Building2 className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-lg font-bold text-foreground">Corely</h1>
            <p className="text-xs text-muted-foreground">
              Für kleine Unternehmen
            </p>
          </div>
        </div>
      </div>
      {/* Navigation Items */}
      <div className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground">
          <p>Version 1.0.0</p>
        </div>
      </div>
    </nav>
  );
}

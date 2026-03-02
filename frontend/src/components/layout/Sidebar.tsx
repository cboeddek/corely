"use client";

import React from 'react';
import { 
  LayoutDashboard, 
  Receipt, 
  CreditCard, 
  BarChart3, 
  Settings, 
  HelpCircle, 
  User,
  Building2,
  FileText,
  PieChart
} from 'lucide-react';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Separator } from '../ui/separator';

interface SidebarProps {
  activeItem?: string;
  onItemClick?: (item: string) => void;
}

const navigationItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    id: 'transactions',
    label: 'Transaktionen',
    icon: CreditCard,
  },
  {
    id: 'receipts',
    label: 'Belege',
    icon: Receipt,
  },
  {
    id: 'analytics',
    label: 'Analysen',
    icon: BarChart3,
  },
  {
    id: 'reports',
    label: 'Berichte',
    icon: FileText,
  },
  {
    id: 'categories',
    label: 'Kategorien',
    icon: PieChart,
  },
];

const bottomItems = [
  {
    id: 'settings',
    label: 'Einstellungen',
    icon: Settings,
  },
  {
    id: 'help',
    label: 'Hilfe',
    icon: HelpCircle,
  },
];

export default function Sidebar({ activeItem = 'dashboard', onItemClick = () => {} }: SidebarProps) {
  return (
    <div className="sidebar w-64 h-full flex flex-col">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-[hsl(var(--sidebar-border))]">
        <div className="flex items-center gap-2">
          <Building2 className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-lg font-semibold">FinanzPro</h1>
            <p className="text-xs text-muted-foreground">Kleinunternehmen</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onItemClick(item.id)}
              className={`sidebar-nav-item w-full ${
                activeItem === item.id ? 'active' : ''
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <Separator className="mx-4" />

      {/* Bottom Navigation */}
      <div className="p-4 space-y-1">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onItemClick(item.id)}
              className={`sidebar-nav-item w-full ${
                activeItem === item.id ? 'active' : ''
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </button>
          );
        })}
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-[hsl(var(--sidebar-border))]">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=user" />
            <AvatarFallback>MU</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Max Mustermann</p>
            <p className="text-xs text-muted-foreground truncate">max@beispiel.de</p>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <User className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
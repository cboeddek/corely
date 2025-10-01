"use client";

import React from "react";
import Navbar from "@/components/Navbar";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex h-screen bg-background">
      <Navbar />
      <main className="flex-1 overflow-auto p-6">
        {children}
      </main>
    </div>
  );
}
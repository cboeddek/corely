"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, PlusCircle, ListFilter, Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import FinancialSummary from "@/components/dashboard/FinancialSummary";
import AnalyticsCharts from "@/components/dashboard/AnalyticsCharts";

export default function DashboardPage() {
  const [activeItem, setActiveItem] = useState('dashboard');

  return (
    <div className="flex h-screen bg-background">
      {/* Temporary sidebar placeholder */}
      <div className="w-64 bg-card border-r">
        <div className="p-4">
          <h2 className="font-semibold">Navigation</h2>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b bg-card/50 backdrop-blur-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold text-foreground">
                Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Suchen..." 
                  className="pl-9 w-64 bg-background/50"
                />
              </div>
              <Button variant="ghost" size="icon">
                <Bell className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {/* Quick Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <Link href="/upload">
                <Button className="gap-2 bg-primary hover:bg-primary/90">
                  <Upload size={16} />
                  Beleg hochladen
                </Button>
              </Link>
              <Button variant="outline" className="gap-2 border-border hover:bg-accent">
                <PlusCircle size={16} />
                Einnahme hinzufügen
              </Button>
              <Link href="/transactions">
                <Button variant="outline" className="gap-2 border-border hover:bg-accent">
                  <ListFilter size={16} />
                  Alle Transaktionen anzeigen
                </Button>
              </Link>
            </div>

            {/* Financial Summary Cards */}
            <section>
              <h2 className="text-lg font-semibold mb-4 text-foreground">Finanzübersicht</h2>
              <FinancialSummary />
            </section>

            {/* Analytics Charts */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">Analysen</h2>
                <Tabs defaultValue="month">
                  <TabsList className="bg-muted/50">
                    <TabsTrigger value="month">Monat</TabsTrigger>
                    <TabsTrigger value="quarter">Quartal</TabsTrigger>
                    <TabsTrigger value="year">Jahr</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <Card className="border-border bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <AnalyticsCharts />
                </CardContent>
              </Card>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
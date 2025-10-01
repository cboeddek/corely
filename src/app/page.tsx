"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, PlusCircle, ListFilter, Bell, Search, FileSpreadsheet } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import FinancialSummary from "@/components/dashboard/FinancialSummary";
import AnalyticsCharts from "@/components/dashboard/AnalyticsCharts";
import AppLayout from "@/components/AppLayout";

export default function DashboardPage() {
  const [activeItem, setActiveItem] = useState('dashboard');

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">
              Willkommen zurück! Hier ist Ihre Finanzübersicht.
            </p>
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

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <Link href="/upload">
            <Button className="gap-2 bg-primary hover:bg-primary/90">
              <Upload size={16} />
              Beleg hochladen
            </Button>
          </Link>
          <Link href="/manual-entry">
            <Button variant="outline" className="gap-2 border-border hover:bg-accent">
              <PlusCircle size={16} />
              Einnahme hinzufügen
            </Button>
          </Link>
          <Link href="/csv-import">
            <Button variant="outline" className="gap-2 border-border hover:bg-accent">
              <FileSpreadsheet size={16} />
              CSV importieren
            </Button>
          </Link>
          <Link href="/transactions">
            <Button variant="outline" className="gap-2 border-border hover:bg-accent">
              <ListFilter size={16} />
              Alle Transaktionen anzeigen
            </Button>
          </Link>
        </div>

        {/* Financial Summary Cards */}
        <section>
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
    </AppLayout>
  );
}
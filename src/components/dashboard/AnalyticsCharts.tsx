"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  PieChart,
  BarChart3,
  LineChart,
} from "lucide-react";

interface AnalyticsChartsProps {
  monthlyData?: {
    month: string;
    income: number;
    expenses: number;
  }[];
  categoryData?: {
    category: string;
    amount: number;
    color: string;
  }[];
  recentTransactions?: {
    date: string;
    description: string;
    amount: number;
    type: "income" | "expense";
  }[];
}

export default function AnalyticsCharts({
  monthlyData = [
    { month: "Jan", income: 4500, expenses: 3200 },
    { month: "Feb", income: 5200, expenses: 3800 },
    { month: "Mär", income: 4800, expenses: 3500 },
    { month: "Apr", income: 6000, expenses: 4200 },
    { month: "Mai", income: 5500, expenses: 3900 },
    { month: "Jun", income: 7000, expenses: 4500 },
  ],
  categoryData = [
    { category: "Bürobedarf", amount: 1200, color: "#3b82f6" },
    { category: "Marketing", amount: 2500, color: "#10b981" },
    { category: "Nebenkosten", amount: 800, color: "#f59e0b" },
    { category: "Miete", amount: 3500, color: "#ef4444" },
    { category: "Reisen", amount: 1500, color: "#8b5cf6" },
  ],
  recentTransactions = [
    {
      date: "2023-06-15",
      description: "Kundenzahlung - ABC GmbH",
      amount: 2500,
      type: "income",
    },
    {
      date: "2023-06-12",
      description: "Büromiete",
      amount: 1800,
      type: "expense",
    },
    {
      date: "2023-06-10",
      description: "Marketing-Dienstleistungen",
      amount: 750,
      type: "expense",
    },
    {
      date: "2023-06-05",
      description: "Kundenzahlung - XYZ Ltd",
      amount: 3200,
      type: "income",
    },
    {
      date: "2023-06-01",
      description: "Nebenkosten",
      amount: 420,
      type: "expense",
    },
  ],
}: AnalyticsChartsProps) {
  return (
    <div className="w-full space-y-4 bg-background">
      <Tabs defaultValue="monthly" className="w-full">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Analysen</h2>
          <TabsList>
            <TabsTrigger value="monthly">Monatlich</TabsTrigger>
            <TabsTrigger value="categories">Kategorien</TabsTrigger>
            <TabsTrigger value="recent">Aktuell</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="monthly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5" />
                <span>Einnahmen vs. Ausgaben</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                {/* This would be a real chart component in production */}
                <div className="flex h-full flex-col">
                  <div className="flex h-[240px] items-end justify-between gap-2 border-b border-l">
                    {monthlyData.map((data, index) => (
                      <div
                        key={index}
                        className="group relative flex w-full flex-col items-center"
                      >
                        <div className="relative flex w-full justify-center gap-1">
                          <div
                            className="w-4 bg-blue-500 transition-all"
                            style={{
                              height: `${(data.income / 8000) * 240}px`,
                            }}
                          />
                          <div
                            className="w-4 bg-red-500 transition-all"
                            style={{
                              height: `${(data.expenses / 8000) * 240}px`,
                            }}
                          />
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground">
                          {data.month}
                        </div>
                        <div className="absolute -top-7 hidden rounded bg-black px-2 py-1 text-xs text-white group-hover:block">
                          Einnahmen: {data.income}€ | Ausgaben: {data.expenses}€
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex justify-center gap-6">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 bg-blue-500"></div>
                      <span className="text-sm text-muted-foreground">
                        Einnahmen
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 bg-red-500"></div>
                      <span className="text-sm text-muted-foreground">
                        Ausgaben
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                <span>Ausgaben nach Kategorie</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex h-[300px] items-center justify-center">
                <div className="relative h-[220px] w-[220px] rounded-full">
                  {/* Simple pie chart visualization */}
                  {categoryData.map((category, index, arr) => {
                    const total = arr.reduce((sum, cat) => sum + cat.amount, 0);
                    const startAngle = arr
                      .slice(0, index)
                      .reduce(
                        (sum, cat) => sum + (cat.amount / total) * 360,
                        0,
                      );
                    const angle = (category.amount / total) * 360;

                    return (
                      <div
                        key={index}
                        className="absolute left-0 top-0 h-full w-full"
                        style={{
                          background: `conic-gradient(${category.color} ${startAngle}deg, ${category.color} ${startAngle + angle}deg, transparent ${startAngle + angle}deg)`,
                          clipPath: "circle(50%)",
                        }}
                      />
                    );
                  })}
                  <div className="absolute left-1/2 top-1/2 flex h-[100px] w-[100px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-background">
                    <DollarSign className="h-8 w-8 text-muted-foreground" />
                  </div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
                {categoryData.map((category, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium">
                        {category.category}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {category.amount}€
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                <span>Aktuelle Transaktionen</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((transaction, index) => {
                  const date = new Date(transaction.date);
                  const formattedDate = date.toLocaleDateString("de-DE", {
                    month: "short",
                    day: "numeric",
                  });

                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between border-b pb-3 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full ${transaction.type === "income" ? "bg-green-100" : "bg-red-100"}`}
                        >
                          {transaction.type === "income" ? (
                            <ArrowUpRight className="h-5 w-5 text-green-600" />
                          ) : (
                            <ArrowDownRight className="h-5 w-5 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {transaction.description}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formattedDate}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`text-sm font-medium ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}
                      >
                        {transaction.type === "income" ? "+" : "-"}
                        {transaction.amount}€
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
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
import { useTransactions } from "@/contexts/TransactionContext";

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

export default function AnalyticsCharts({}: AnalyticsChartsProps) {
  const { transactions } = useTransactions();

  // Generate monthly data from real transactions
  const generateMonthlyData = () => {
    const monthlyStats: { [key: string]: { income: number; expenses: number } } = {};
    const monthNames = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
    
    // Initialize last 6 months
    const currentDate = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      const monthName = monthNames[date.getMonth()];
      monthlyStats[monthKey] = { income: 0, expenses: 0 };
    }

    // Aggregate transaction data
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      
      if (monthlyStats[monthKey]) {
        if (transaction.type === "income") {
          monthlyStats[monthKey].income += transaction.amount;
        } else {
          monthlyStats[monthKey].expenses += transaction.amount;
        }
      }
    });

    // Convert to array format
    return Object.keys(monthlyStats).map(key => {
      const [year, month] = key.split('-');
      const monthName = monthNames[parseInt(month)];
      return {
        month: monthName,
        income: monthlyStats[key].income,
        expenses: monthlyStats[key].expenses
      };
    });
  };

  // Generate category data from real transactions
  const generateCategoryData = () => {
    const categoryStats: { [key: string]: number } = {};
    const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#84cc16", "#f97316"];
    
    transactions
      .filter(t => t.type === "expense")
      .forEach(transaction => {
        categoryStats[transaction.category] = (categoryStats[transaction.category] || 0) + transaction.amount;
      });

    return Object.entries(categoryStats).map(([category, amount], index) => ({
      category,
      amount,
      color: colors[index % colors.length]
    }));
  };

  // Generate recent transactions from real data
  const generateRecentTransactions = () => {
    return transactions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5)
      .map(transaction => ({
        date: transaction.date.toISOString().split('T')[0],
        description: `${transaction.supplier} - ${transaction.comment || transaction.category}`,
        amount: transaction.amount,
        type: transaction.type as "income" | "expense"
      }));
  };

  const monthlyData = generateMonthlyData();
  const categoryData = generateCategoryData();
  const recentTransactions = generateRecentTransactions();

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
                {monthlyData.length === 0 || monthlyData.every(d => d.income === 0 && d.expenses === 0) ? (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Keine Daten verfügbar</p>
                      <p className="text-sm">Fügen Sie Transaktionen hinzu, um Analysen zu sehen</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex h-full flex-col">
                    <div className="flex h-[240px] items-end justify-between gap-2 border-b border-l">
                      {monthlyData.map((data, index) => {
                        const maxValue = Math.max(...monthlyData.map(d => Math.max(d.income, d.expenses))) || 1;
                        return (
                          <div
                            key={index}
                            className="group relative flex w-full flex-col items-center"
                          >
                            <div className="relative flex w-full justify-center gap-1">
                              <div
                                className="w-4 bg-blue-500 transition-all"
                                style={{
                                  height: `${(data.income / maxValue) * 240}px`,
                                }}
                              />
                              <div
                                className="w-4 bg-red-500 transition-all"
                                style={{
                                  height: `${(data.expenses / maxValue) * 240}px`,
                                }}
                              />
                            </div>
                            <div className="mt-2 text-xs text-muted-foreground">
                              {data.month}
                            </div>
                            <div className="absolute -top-7 hidden rounded bg-black px-2 py-1 text-xs text-white group-hover:block">
                              Einnahmen: {data.income.toFixed(2)}€ | Ausgaben: {data.expenses.toFixed(2)}€
                            </div>
                          </div>
                        );
                      })}
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
                )}
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
                {categoryData.length === 0 ? (
                  <div className="text-center text-muted-foreground">
                    <PieChart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Keine Ausgaben-Kategorien verfügbar</p>
                    <p className="text-sm">Fügen Sie Ausgaben hinzu, um die Kategorieverteilung zu sehen</p>
                  </div>
                ) : (
                  <>
                    <div className="relative h-[220px] w-[220px] rounded-full">
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
                  </>
                )}
              </div>
              {categoryData.length > 0 && (
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
                          {category.amount.toFixed(2)}€
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
                {recentTransactions.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Keine Transaktionen verfügbar</p>
                    <p className="text-sm">Fügen Sie Ihre erste Transaktion hinzu</p>
                  </div>
                ) : (
                  recentTransactions.map((transaction, index) => {
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
                          {transaction.amount.toFixed(2)}€
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
"use client";

import {
  ArrowDownIcon,
  ArrowUpIcon,
  DollarSignIcon,
  FileTextIcon,
  PieChartIcon,
  AlertCircleIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface FinancialMetric {
  title: string;
  value: string;
  change: {
    value: string;
    isPositive: boolean;
  };
  icon: React.ReactNode;
}

interface FinancialSummaryProps {
  metrics?: FinancialMetric[];
}

export default function FinancialSummary({ metrics }: FinancialSummaryProps) {
  // Default metrics if none are provided
  const defaultMetrics: FinancialMetric[] = [
    {
      title: "Einnahmen diesen Monat",
      value: "12.450€",
      change: {
        value: "12%",
        isPositive: true,
      },
      icon: <DollarSignIcon className="h-5 w-5 text-emerald-500" />,
    },
    {
      title: "Gesamtausgaben",
      value: "8.230€",
      change: {
        value: "8%",
        isPositive: false,
      },
      icon: <PieChartIcon className="h-5 w-5 text-red-500" />,
    },
    {
      title: "Nettogewinn",
      value: "4.220€",
      change: {
        value: "23%",
        isPositive: true,
      },
      icon: <DollarSignIcon className="h-5 w-5 text-blue-500" />,
    },
    {
      title: "Ausstehende Abstimmungen",
      value: "12",
      change: {
        value: "3",
        isPositive: false,
      },
      icon: <FileTextIcon className="h-5 w-5 text-amber-500" />,
    },
  ];

  const displayMetrics = metrics || defaultMetrics;

  return (
    <div className="w-full bg-background">
      <h2 className="text-2xl font-semibold mb-4">Finanzübersicht</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayMetrics.map((metric, index) => (
          <Card
            key={index}
            className="shadow-sm hover:shadow-md transition-shadow"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-full bg-muted">{metric.icon}</div>
                  <span className="text-sm font-medium text-muted-foreground">
                    {metric.title}
                  </span>
                </div>
                {metric.title.toLowerCase().includes("abstimmung") && (
                  <AlertCircleIcon className="h-4 w-4 text-amber-500" />
                )}
              </div>
              <div className="mt-4">
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className="flex items-center mt-1">
                  {metric.change.isPositive ? (
                    <ArrowUpIcon className="h-4 w-4 text-emerald-500 mr-1" />
                  ) : (
                    <ArrowDownIcon className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span
                    className={`text-xs font-medium ${
                      metric.change.isPositive
                        ? "text-emerald-500"
                        : "text-red-500"
                    }`}
                  >
                    {metric.change.value}{" "}
                    {metric.title.toLowerCase().includes("abstimmung")
                      ? "neue"
                      : "vs. letzter Monat"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
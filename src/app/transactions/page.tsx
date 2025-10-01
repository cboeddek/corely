"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import TransactionTable from "@/components/transactions/TransactionTable";

export default function TransactionsPage() {
  return (
    <div className="flex h-screen bg-background">
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="border-b bg-card/50 backdrop-blur-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <h1 className="text-xl font-semibold text-foreground">Alle Transaktionen</h1>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <Card className="border-border bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <TransactionTable />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}



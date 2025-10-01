"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, PlusCircle, FileSpreadsheet } from "lucide-react";
import Link from "next/link";
import TransactionTable from "@/components/transactions/TransactionTable";
import AppLayout from "@/components/AppLayout";

export default function TransactionsPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Transaktionen</h1>
            <p className="text-muted-foreground">
              Verwalten Sie alle Ihre Einnahmen und Ausgaben
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/csv-import">
              <Button variant="outline" className="gap-2">
                <FileSpreadsheet className="h-4 w-4" />
                CSV importieren
              </Button>
            </Link>
            <Link href="/manual-entry">
              <Button className="gap-2">
                <PlusCircle className="h-4 w-4" />
                Neue Transaktion
              </Button>
            </Link>
          </div>
        </div>

        {/* Transaction Table */}
        <TransactionTable />
      </div>
    </AppLayout>
  );
}
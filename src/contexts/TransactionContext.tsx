"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Transaction {
  id: string;
  date: Date;
  amount: number;
  category: string;
  supplier: string;
  comment: string;
  type: "income" | "expense";
}

interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, "id">) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  getFinancialSummary: () => {
    totalIncome: number;
    totalExpenses: number;
    netProfit: number;
    transactionCount: number;
  };
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export function TransactionProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([
    // Sample data to start with
    {
      id: "1",
      date: new Date("2024-01-15"),
      amount: 2500,
      category: "business",
      supplier: "Kunde ABC GmbH",
      comment: "Beratungsleistung Januar",
      type: "income"
    },
    {
      id: "2",
      date: new Date("2024-01-10"),
      amount: 1200,
      category: "business",
      supplier: "Freelancer XYZ",
      comment: "Webdesign Projekt",
      type: "income"
    },
    {
      id: "3",
      date: new Date("2024-01-08"),
      amount: 450,
      category: "office",
      supplier: "Bürobedarf GmbH",
      comment: "Büromaterial",
      type: "expense"
    }
  ]);

  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    setTransactions(prev => [...prev, newTransaction]);
  };

  const updateTransaction = (id: string, updatedTransaction: Partial<Transaction>) => {
    setTransactions(prev =>
      prev.map(transaction =>
        transaction.id === id ? { ...transaction, ...updatedTransaction } : transaction
      )
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(transaction => transaction.id !== id));
  };

  const getFinancialSummary = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const currentMonthTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear;
    });

    const totalIncome = currentMonthTransactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = currentMonthTransactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const netProfit = totalIncome - totalExpenses;

    return {
      totalIncome,
      totalExpenses,
      netProfit,
      transactionCount: currentMonthTransactions.length
    };
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        getFinancialSummary,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error("useTransactions must be used within a TransactionProvider");
  }
  return context;
}
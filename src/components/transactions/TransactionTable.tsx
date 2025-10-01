"use client";

import React, { useState } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
  Download,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { format } from "date-fns";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { useTransactions, Transaction } from "@/contexts/TransactionContext";

interface TransactionTableProps {
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (transactionId: string) => void;
  onViewReceipt?: (receiptId: string) => void;
  onBulkAction?: (action: string, transactionIds: string[]) => void;
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  onEdit = () => {},
  onDelete = () => {},
  onViewReceipt = () => {},
  onBulkAction = () => {},
}) => {
  const { transactions, deleteTransaction } = useTransactions();
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>(
    [],
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({ from: undefined, to: undefined });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Extract unique categories for filter dropdown
  const categories = [
    "all",
    ...Array.from(new Set(transactions.map((t) => t.category))),
  ];

  // Convert transactions to display format
  const displayTransactions = transactions.map(transaction => ({
    id: transaction.id,
    date: transaction.date,
    description: `${transaction.supplier}${transaction.comment ? ` - ${transaction.comment}` : ''}`,
    amount: transaction.amount,
    category: transaction.category,
    type: transaction.type === "income" ? "Einnahme" : "Ausgabe",
    status: "Abgestimmt", // For now, all manual entries are considered reconciled
    receiptId: undefined, // Manual entries don't have receipts
  }));

  const filteredTransactions = displayTransactions.filter((transaction) => {
    // Search filter
    const matchesSearch = transaction.description
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    // Date range filter
    const matchesDateRange =
      (!dateRange.from || transaction.date >= dateRange.from) &&
      (!dateRange.to || transaction.date <= dateRange.to);

    // Category filter
    const matchesCategory =
      categoryFilter === "all" || transaction.category === categoryFilter;

    // Type filter
    const matchesType = typeFilter === "all" || transaction.type === typeFilter;

    // Status filter
    const matchesStatus =
      statusFilter === "all" || transaction.status === statusFilter;

    return (
      matchesSearch &&
      matchesDateRange &&
      matchesCategory &&
      matchesType &&
      matchesStatus
    );
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTransactions(filteredTransactions.map((t) => t.id));
    } else {
      setSelectedTransactions([]);
    }
  };

  const handleSelectTransaction = (transactionId: string, checked: boolean) => {
    if (checked) {
      setSelectedTransactions([...selectedTransactions, transactionId]);
    } else {
      setSelectedTransactions(
        selectedTransactions.filter((id) => id !== transactionId),
      );
    }
  };

  const handleBulkAction = (action: string) => {
    if (action === "delete") {
      selectedTransactions.forEach(id => deleteTransaction(id));
      setSelectedTransactions([]);
    } else {
      onBulkAction(action, selectedTransactions);
      setSelectedTransactions([]);
    }
  };

  const handleDelete = (transactionId: string) => {
    deleteTransaction(transactionId);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setDateRange({ from: undefined, to: undefined });
    setCategoryFilter("all");
    setTypeFilter("all");
    setStatusFilter("all");
  };

  return (
    <Card className="w-full bg-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold">Transaktionen</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          {/* Filters and search */}
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Transaktionen suchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {/* Date Range Filter */}
              <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    {dateRange.from ? (
                      dateRange.to ? (
                        <span>
                          {format(dateRange.from, "d. MMM yyyy")} -{" "}
                          {format(dateRange.to, "d. MMM yyyy")}
                        </span>
                      ) : (
                        <span>{format(dateRange.from, "d. MMM yyyy")}</span>
                      )
                    ) : (
                      <span>Datumsbereich</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="range"
                    selected={{
                      from: dateRange.from,
                      to: dateRange.to,
                    }}
                    onSelect={(range) => {
                      setDateRange(range || { from: undefined, to: undefined });
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              {/* Category Filter */}
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Kategorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "Alle Kategorien" : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Type Filter */}
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Typ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Typen</SelectItem>
                  <SelectItem value="Einnahme">Einnahme</SelectItem>
                  <SelectItem value="Ausgabe">Ausgabe</SelectItem>
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Status</SelectItem>
                  <SelectItem value="Abgestimmt">Abgestimmt</SelectItem>
                  <SelectItem value="Ausstehend">Ausstehend</SelectItem>
                </SelectContent>
              </Select>

              {/* Clear Filters */}
              <Button variant="ghost" onClick={clearFilters}>
                Löschen
              </Button>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedTransactions.length > 0 && (
            <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
              <span className="text-sm font-medium">
                {selectedTransactions.length} ausgewählt
              </span>
              <div className="ml-auto flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction("categorize")}
                >
                  Kategorisieren
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction("export")}
                >
                  <Download className="h-4 w-4 mr-1" /> Exportieren
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleBulkAction("delete")}
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Löschen
                </Button>
              </div>
            </div>
          )}

          {/* Transactions Table */}
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]">
                    <Checkbox
                      checked={
                        selectedTransactions.length ===
                          filteredTransactions.length &&
                        filteredTransactions.length > 0
                      }
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="w-[100px]">Datum</TableHead>
                  <TableHead className="min-w-[200px]">Beschreibung</TableHead>
                  <TableHead className="w-[120px]">Betrag</TableHead>
                  <TableHead className="w-[120px]">Kategorie</TableHead>
                  <TableHead className="w-[100px]">Typ</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead className="w-[80px]">Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      {transactions.length === 0 ? (
                        <div className="text-muted-foreground">
                          <p>Keine Transaktionen vorhanden.</p>
                          <p className="text-sm">Fügen Sie Ihre erste Transaktion über "Einnahme hinzufügen" hinzu.</p>
                        </div>
                      ) : (
                        "Keine Transaktionen gefunden."
                      )}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedTransactions.includes(
                            transaction.id,
                          )}
                          onCheckedChange={(checked) =>
                            handleSelectTransaction(transaction.id, !!checked)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        {format(transaction.date, "d. MMM yyyy")}
                      </TableCell>
                      <TableCell className="font-medium">
                        {transaction.description}
                      </TableCell>
                      <TableCell
                        className={
                          transaction.type === "Einnahme"
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {transaction.type === "Einnahme" ? "+" : "-"}
                        {Math.abs(transaction.amount).toFixed(2)}€
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{transaction.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            transaction.type === "Einnahme"
                              ? "secondary"
                              : "default"
                          }
                        >
                          {transaction.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-xs">{transaction.status}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Aktionen</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleDelete(transaction.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" /> Löschen
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionTable;
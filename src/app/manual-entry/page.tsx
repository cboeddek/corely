"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, ArrowLeft, Save } from "lucide-react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransactions } from "@/contexts/TransactionContext";

interface ManualEntryData {
  date: Date;
  amount: string;
  category: string;
  supplier: string;
  comment: string;
}

export default function ManualEntryPage() {
  const router = useRouter();
  const { addTransaction } = useTransactions();
  const [formData, setFormData] = useState<ManualEntryData>({
    date: new Date(),
    amount: "",
    category: "business",
    supplier: "",
    comment: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { value: "business", label: "Geschäftlich" },
    { value: "private", label: "Privat" },
    { value: "office", label: "Bürobedarf" },
    { value: "travel", label: "Reisekosten" },
    { value: "marketing", label: "Marketing" },
    { value: "equipment", label: "Ausrüstung" },
    { value: "utilities", label: "Nebenkosten" },
    { value: "other", label: "Sonstiges" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Add transaction to context
    addTransaction({
      date: formData.date,
      amount: parseFloat(formData.amount),
      category: formData.category,
      supplier: formData.supplier,
      comment: formData.comment,
      type: "income", // Manual entries are treated as income
    });

    // Redirect back to dashboard
    router.push("/");
    setIsSubmitting(false);
  };

  const handleInputChange = (field: keyof ManualEntryData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-xl font-semibold text-foreground">
              Einnahme manuell hinzufügen
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Neue Einnahme erfassen</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Date Field */}
                <div className="space-y-2">
                  <Label htmlFor="date">Datum *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.date ? (
                          format(formData.date, "PPP", { locale: de })
                        ) : (
                          <span>Datum auswählen</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.date}
                        onSelect={(date) => date && handleInputChange("date", date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Amount Field */}
                <div className="space-y-2">
                  <Label htmlFor="amount">Betrag *</Label>
                  <div className="relative">
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      placeholder="0,00"
                      value={formData.amount}
                      onChange={(e) => handleInputChange("amount", e.target.value)}
                      className="pr-8"
                      required
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                      €
                    </span>
                  </div>
                </div>

                {/* Category Field */}
                <div className="space-y-2">
                  <Label htmlFor="category">Kategorie *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleInputChange("category", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Kategorie auswählen" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Supplier Field */}
                <div className="space-y-2">
                  <Label htmlFor="supplier">Lieferant/Kunde *</Label>
                  <Input
                    id="supplier"
                    type="text"
                    placeholder="Name des Lieferanten oder Kunden"
                    value={formData.supplier}
                    onChange={(e) => handleInputChange("supplier", e.target.value)}
                    required
                  />
                </div>

                {/* Comment Field */}
                <div className="space-y-2">
                  <Label htmlFor="comment">Kommentar</Label>
                  <Textarea
                    id="comment"
                    placeholder="Zusätzliche Notizen oder Beschreibung..."
                    value={formData.comment}
                    onChange={(e) => handleInputChange("comment", e.target.value)}
                    rows={3}
                  />
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-3 pt-4">
                  <Link href="/" className="flex-1">
                    <Button type="button" variant="outline" className="w-full">
                      Abbrechen
                    </Button>
                  </Link>
                  <Button 
                    type="submit" 
                    className="flex-1 gap-2"
                    disabled={isSubmitting || !formData.amount || !formData.supplier}
                  >
                    <Save className="h-4 w-4" />
                    {isSubmitting ? "Speichert..." : "Einnahme speichern"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
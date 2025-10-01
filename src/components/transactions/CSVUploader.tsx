"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, FileText, CheckCircle, AlertCircle, Download, X } from "lucide-react";
import Papa from "papaparse";
import { useTransactions, Transaction } from "@/contexts/TransactionContext";

interface CSVRow {
  [key: string]: string;
}

interface MappedTransaction {
  date: string;
  amount: string;
  category: string;
  supplier: string;
  comment: string;
  type: "income" | "expense";
  isValid: boolean;
  errors: string[];
}

interface CSVUploaderProps {
  onUploadComplete?: (count: number) => void;
}

export default function CSVUploader({ onUploadComplete }: CSVUploaderProps) {
  const { addTransaction } = useTransactions();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [csvData, setCsvData] = useState<CSVRow[]>([]);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [mappedTransactions, setMappedTransactions] = useState<MappedTransaction[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStep, setUploadStep] = useState<"upload" | "mapping" | "preview" | "complete">("upload");
  const [fieldMapping, setFieldMapping] = useState({
    date: "",
    amount: "",
    category: "",
    supplier: "",
    comment: "",
    type: ""
  });
  const [error, setError] = useState<string>("");

  const categories = [
    "business", "private", "office", "travel", "marketing", 
    "equipment", "utilities", "other"
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError("Bitte wählen Sie eine CSV-Datei aus.");
      return;
    }

    setError("");
    setIsUploading(true);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          setError("Fehler beim Lesen der CSV-Datei: " + results.errors[0].message);
          setIsUploading(false);
          return;
        }

        const data = results.data as CSVRow[];
        const headers = Object.keys(data[0] || {});
        
        setCsvData(data);
        setCsvHeaders(headers);
        setUploadStep("mapping");
        setIsUploading(false);
      },
      error: (error) => {
        setError("Fehler beim Lesen der CSV-Datei: " + error.message);
        setIsUploading(false);
      }
    });
  };

  const handleFieldMappingChange = (field: keyof typeof fieldMapping, value: string) => {
    setFieldMapping(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateAndMapTransactions = () => {
    const mapped: MappedTransaction[] = csvData.map((row, index) => {
      const errors: string[] = [];
      
      // Extract values based on mapping
      const date = fieldMapping.date ? row[fieldMapping.date] : "";
      const amount = fieldMapping.amount ? row[fieldMapping.amount] : "";
      const category = fieldMapping.category ? row[fieldMapping.category] : "other";
      const supplier = fieldMapping.supplier ? row[fieldMapping.supplier] : "";
      const comment = fieldMapping.comment ? row[fieldMapping.comment] : "";
      const type = fieldMapping.type ? row[fieldMapping.type] : "";

      // Validate date
      if (!date || isNaN(Date.parse(date))) {
        errors.push("Ungültiges Datum");
      }

      // Validate amount
      const numAmount = parseFloat(amount.replace(/[^\d.-]/g, ''));
      if (!amount || isNaN(numAmount)) {
        errors.push("Ungültiger Betrag");
      }

      // Validate supplier
      if (!supplier.trim()) {
        errors.push("Lieferant fehlt");
      }

      // Determine transaction type
      let transactionType: "income" | "expense" = "expense";
      if (type) {
        const typeValue = type.toLowerCase();
        if (typeValue.includes("income") || typeValue.includes("einnahme") || typeValue.includes("+")) {
          transactionType = "income";
        } else if (typeValue.includes("expense") || typeValue.includes("ausgabe") || typeValue.includes("-")) {
          transactionType = "expense";
        }
      } else if (numAmount > 0) {
        transactionType = "income";
      }

      return {
        date,
        amount: Math.abs(numAmount).toString(),
        category: categories.includes(category.toLowerCase()) ? category.toLowerCase() : "other",
        supplier: supplier.trim(),
        comment: comment.trim(),
        type: transactionType,
        isValid: errors.length === 0,
        errors
      };
    });

    setMappedTransactions(mapped);
    setUploadStep("preview");
  };

  const importTransactions = () => {
    const validTransactions = mappedTransactions.filter(t => t.isValid);
    
    validTransactions.forEach(transaction => {
      addTransaction({
        date: new Date(transaction.date),
        amount: parseFloat(transaction.amount),
        category: transaction.category,
        supplier: transaction.supplier,
        comment: transaction.comment,
        type: transaction.type
      });
    });

    setUploadStep("complete");
    onUploadComplete?.(validTransactions.length);
  };

  const resetUpload = () => {
    setCsvData([]);
    setCsvHeaders([]);
    setMappedTransactions([]);
    setFieldMapping({
      date: "",
      amount: "",
      category: "",
      supplier: "",
      comment: "",
      type: ""
    });
    setUploadStep("upload");
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const downloadTemplate = () => {
    const template = [
      ["Datum", "Betrag", "Kategorie", "Lieferant", "Kommentar", "Typ"],
      ["2024-01-15", "1500.00", "business", "Kunde ABC", "Beratungsleistung", "income"],
      ["2024-01-10", "450.50", "office", "Bürobedarf GmbH", "Büromaterial", "expense"]
    ];
    
    const csv = Papa.unparse(template);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "transaktionen_vorlage.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full space-y-6 bg-background">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            CSV-Import von Transaktionen
          </CardTitle>
        </CardHeader>
        <CardContent>
          {uploadStep === "upload" && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">CSV-Datei hochladen</h3>
                  <p className="text-muted-foreground mb-4">
                    Wählen Sie eine CSV-Datei mit Ihren Transaktionen aus
                  </p>
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="csv-upload"
                  />
                  <Label htmlFor="csv-upload">
                    <Button asChild disabled={isUploading}>
                      <span>
                        {isUploading ? "Lade hoch..." : "Datei auswählen"}
                      </span>
                    </Button>
                  </Label>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Benötigen Sie eine Vorlage?
                  </p>
                </div>
                <Button variant="outline" onClick={downloadTemplate} className="gap-2">
                  <Download className="h-4 w-4" />
                  Vorlage herunterladen
                </Button>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {uploadStep === "mapping" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Spalten zuordnen</h3>
                <Button variant="outline" onClick={resetUpload}>
                  <X className="h-4 w-4 mr-2" />
                  Abbrechen
                </Button>
              </div>
              
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Ordnen Sie die CSV-Spalten den entsprechenden Feldern zu. Datum, Betrag und Lieferant sind Pflichtfelder.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Datum *</Label>
                  <Select value={fieldMapping.date} onValueChange={(value) => handleFieldMappingChange("date", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Spalte auswählen" />
                    </SelectTrigger>
                    <SelectContent>
                      {csvHeaders.map(header => (
                        <SelectItem key={header} value={header}>{header}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Betrag *</Label>
                  <Select value={fieldMapping.amount} onValueChange={(value) => handleFieldMappingChange("amount", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Spalte auswählen" />
                    </SelectTrigger>
                    <SelectContent>
                      {csvHeaders.map(header => (
                        <SelectItem key={header} value={header}>{header}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Lieferant *</Label>
                  <Select value={fieldMapping.supplier} onValueChange={(value) => handleFieldMappingChange("supplier", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Spalte auswählen" />
                    </SelectTrigger>
                    <SelectContent>
                      {csvHeaders.map(header => (
                        <SelectItem key={header} value={header}>{header}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Kategorie</Label>
                  <Select value={fieldMapping.category} onValueChange={(value) => handleFieldMappingChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Spalte auswählen (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {csvHeaders.map(header => (
                        <SelectItem key={header} value={header}>{header}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Kommentar</Label>
                  <Select value={fieldMapping.comment} onValueChange={(value) => handleFieldMappingChange("comment", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Spalte auswählen (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {csvHeaders.map(header => (
                        <SelectItem key={header} value={header}>{header}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Typ (Einnahme/Ausgabe)</Label>
                  <Select value={fieldMapping.type} onValueChange={(value) => handleFieldMappingChange("type", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Spalte auswählen (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {csvHeaders.map(header => (
                        <SelectItem key={header} value={header}>{header}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button 
                  onClick={validateAndMapTransactions}
                  disabled={!fieldMapping.date || !fieldMapping.amount || !fieldMapping.supplier}
                >
                  Vorschau anzeigen
                </Button>
              </div>
            </div>
          )}

          {uploadStep === "preview" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Vorschau der Transaktionen</h3>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setUploadStep("mapping")}>
                    Zurück
                  </Button>
                  <Button variant="outline" onClick={resetUpload}>
                    <X className="h-4 w-4 mr-2" />
                    Abbrechen
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="font-medium">
                    {mappedTransactions.filter(t => t.isValid).length} gültige Transaktionen
                  </span>
                </div>
                {mappedTransactions.some(t => !t.isValid) && (
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                    <span className="font-medium text-red-600">
                      {mappedTransactions.filter(t => !t.isValid).length} fehlerhafte Transaktionen
                    </span>
                  </div>
                )}
              </div>

              <div className="max-h-96 overflow-auto border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Status</TableHead>
                      <TableHead>Datum</TableHead>
                      <TableHead>Betrag</TableHead>
                      <TableHead>Lieferant</TableHead>
                      <TableHead>Kategorie</TableHead>
                      <TableHead>Typ</TableHead>
                      <TableHead>Fehler</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mappedTransactions.map((transaction, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {transaction.isValid ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-red-500" />
                          )}
                        </TableCell>
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell>{transaction.amount}€</TableCell>
                        <TableCell>{transaction.supplier}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{transaction.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={transaction.type === "income" ? "secondary" : "default"}>
                            {transaction.type === "income" ? "Einnahme" : "Ausgabe"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {transaction.errors.length > 0 && (
                            <span className="text-red-600 text-sm">
                              {transaction.errors.join(", ")}
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button 
                  onClick={importTransactions}
                  disabled={mappedTransactions.filter(t => t.isValid).length === 0}
                  className="gap-2"
                >
                  <Upload className="h-4 w-4" />
                  {mappedTransactions.filter(t => t.isValid).length} Transaktionen importieren
                </Button>
              </div>
            </div>
          )}

          {uploadStep === "complete" && (
            <div className="text-center space-y-4">
              <CheckCircle className="h-16 w-16 mx-auto text-green-500" />
              <h3 className="text-lg font-medium">Import erfolgreich!</h3>
              <p className="text-muted-foreground">
                Die Transaktionen wurden erfolgreich importiert und sind jetzt in Ihrem Dashboard verfügbar.
              </p>
              <Button onClick={resetUpload}>
                Weitere Datei importieren
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
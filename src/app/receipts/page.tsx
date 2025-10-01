"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Trash2, 
  Upload,
  FileText,
  Calendar,
  Euro
} from "lucide-react";

import AppLayout from "@/components/AppLayout"; // Added import for AppLayout

// Mock data for receipts - in a real app this would come from your backend
const mockReceipts = [
  {
    id: "1",
    filename: "rechnung_001.pdf",
    uploadDate: "2024-01-15",
    amount: 1250.00,
    supplier: "Bürobedarf GmbH",
    category: "office",
    status: "processed",
    thumbnailUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=200&q=80"
  },
  {
    id: "2", 
    filename: "beleg_002.jpg",
    uploadDate: "2024-01-12",
    amount: 89.50,
    supplier: "Tankstelle Nord",
    category: "travel",
    status: "processed",
    thumbnailUrl: "https://images.unsplash.com/photo-1554224154-26032fced8bd?w=200&q=80"
  },
  {
    id: "3",
    filename: "rechnung_003.pdf", 
    uploadDate: "2024-01-10",
    amount: 2100.00,
    supplier: "Software Solutions AG",
    category: "business",
    status: "pending",
    thumbnailUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=200&q=80"
  }
];

export default function ReceiptsPage() {
  return (
    <AppLayout>
      {/* Existing content with slight modification: wrapping entire component in AppLayout */}
      <div className="space-y-6 bg-background">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Belege</h1>
            <p className="text-muted-foreground">
              Verwalten Sie alle hochgeladenen Belege und Rechnungen
            </p>
          </div>
          <Button className="gap-2">
            <Upload className="h-4 w-4" />
            Neuen Beleg hochladen
          </Button>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Belege suchen..."
                  className="pl-9"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Exportieren
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Receipts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockReceipts.map((receipt) => (
            <Card key={receipt.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                <img
                  src={receipt.thumbnailUrl}
                  alt={receipt.filename}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Badge 
                    variant={receipt.status === "processed" ? "secondary" : "destructive"}
                  >
                    {receipt.status === "processed" ? "Verarbeitet" : "Ausstehend"}
                  </Badge>
                </div>
              </div>
              
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium truncate">
                  {receipt.filename}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {new Date(receipt.uploadDate).toLocaleDateString("de-DE")}
                  </div>
                  
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Euro className="h-3 w-3" />
                    {receipt.amount.toFixed(2)}€
                  </div>
                  
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <FileText className="h-3 w-3" />
                    {receipt.supplier}
                  </div>
                  
                  <Badge variant="outline" className="text-xs">
                    {receipt.category}
                  </Badge>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline" className="flex-1 gap-1">
                    <Eye className="h-3 w-3" />
                    Anzeigen
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State (when no receipts) */}
        {mockReceipts.length === 0 && (
          <Card className="p-12">
            <div className="text-center">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">Keine Belege vorhanden</h3>
              <p className="text-muted-foreground mb-4">
                Laden Sie Ihren ersten Beleg hoch, um zu beginnen.
              </p>
              <Button className="gap-2">
                <Upload className="h-4 w-4" />
                Ersten Beleg hochladen
              </Button>
            </div>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
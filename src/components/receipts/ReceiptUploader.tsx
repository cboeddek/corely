"use client";

import React, { useState } from "react";
import {
  Upload,
  FileUp,
  Camera,
  Mail,
  X,
  Check,
  AlertCircle,
  Loader2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

interface ReceiptData {
  vendor: string;
  date: string;
  amount: string;
  category: string;
  items?: Array<{ name: string; price: string }>;
}

interface ReceiptUploaderProps {
  onUploadComplete?: (data: ReceiptData) => void;
  defaultTab?: string;
}

export default function ReceiptUploader({
  onUploadComplete = () => {},
  defaultTab = "upload",
}: ReceiptUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<ReceiptData | null>(null);

  // Mock email address for receipt forwarding
  const receiptEmail = "belege@kleinunternehmen-finanzen.de";

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (newFiles: File[]) => {
    // Filter for supported file types (PDF, JPG, PNG)
    const supportedFiles = newFiles.filter((file) => {
      const fileType = file.type.toLowerCase();
      return (
        fileType === "application/pdf" ||
        fileType === "image/jpeg" ||
        fileType === "image/png"
      );
    });

    if (supportedFiles.length === 0) {
      setUploadError("Bitte laden Sie nur PDF-, JPG- oder PNG-Dateien hoch.");
      return;
    }

    setFiles(supportedFiles);
    setUploadError(null);
    uploadFiles(supportedFiles);
  };

  const uploadFiles = (filesToUpload: File[]) => {
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setIsProcessing(true);
          simulateAIProcessing();
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const simulateAIProcessing = () => {
    // Simulate AI processing delay
    setTimeout(() => {
      setIsProcessing(false);
      // Mock extracted data
      setExtractedData({
        vendor: "Bürobedarf GmbH",
        date: "15.05.2023",
        amount: "127,84€",
        category: "Bürobedarf",
        items: [
          { name: "Druckerpapier", price: "45,99€" },
          { name: "Tintenpatronen", price: "65,99€" },
          { name: "Stifte (12er Pack)", price: "15,86€" },
        ],
      });
    }, 2000);
  };

  const handleConfirm = () => {
    if (extractedData) {
      onUploadComplete(extractedData);
      // Reset the form
      setFiles([]);
      setExtractedData(null);
    }
  };

  const handleCancel = () => {
    setFiles([]);
    setExtractedData(null);
    setUploadProgress(0);
    setUploadError(null);
  };

  const captureImage = () => {
    // This would trigger the device camera in a real implementation
    alert("Kamera-Funktionalität würde die Gerätekamera öffnen");
  };

  return (
    <Card className="w-full max-w-3xl mx-auto bg-white">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Beleg hochladen</CardTitle>
        <CardDescription>
          Laden Sie Ihre Belege für die automatische Verarbeitung und Kategorisierung hoch
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={defaultTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="upload">
              <FileUp className="mr-2 h-4 w-4" /> Datei hochladen
            </TabsTrigger>
            <TabsTrigger value="camera">
              <Camera className="mr-2 h-4 w-4" /> Kamera
            </TabsTrigger>
            <TabsTrigger value="email">
              <Mail className="mr-2 h-4 w-4" /> E-Mail
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload">
            {!extractedData ? (
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center ${isDragging ? "border-primary bg-primary/5" : "border-gray-300"}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center justify-center space-y-4">
                  <Upload className="h-12 w-12 text-gray-400" />
                  <div>
                    <p className="text-lg font-medium">
                      Ziehen Sie Ihren Beleg hierher
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Unterstützt PDF-, JPG- und PNG-Dateien
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={() =>
                        document.getElementById("fileInput")?.click()
                      }
                    >
                      Dateien durchsuchen
                    </Button>
                    <input
                      id="fileInput"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      onChange={handleFileInput}
                      multiple
                    />
                  </div>
                </div>
              </div>
            ) : null}
          </TabsContent>

          <TabsContent value="camera">
            <div className="flex flex-col items-center justify-center space-y-4 border-2 border-dashed rounded-lg p-8">
              <Camera className="h-12 w-12 text-gray-400" />
              <p className="text-lg font-medium">
                Fotografieren Sie Ihren Beleg
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Positionieren Sie den Beleg im Rahmen und sorgen Sie für gute Beleuchtung
              </p>
              <Button onClick={captureImage}>Kamera öffnen</Button>
            </div>
          </TabsContent>

          <TabsContent value="email">
            <div className="flex flex-col items-center justify-center space-y-4 border-2 border-dashed rounded-lg p-8">
              <Mail className="h-12 w-12 text-gray-400" />
              <p className="text-lg font-medium">Belege per E-Mail weiterleiten</p>
              <p className="text-sm text-gray-500 mt-1">
                Senden Sie Ihre Belege an die unten stehende E-Mail-Adresse
              </p>
              <div className="bg-gray-100 p-3 rounded-md font-mono text-sm w-full text-center">
                {receiptEmail}
              </div>
              <p className="text-xs text-gray-500">
                Belege werden automatisch verarbeitet, wenn sie empfangen werden
              </p>
            </div>
          </TabsContent>
        </Tabs>

        {uploadError && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Fehler</AlertTitle>
            <AlertDescription>{uploadError}</AlertDescription>
          </Alert>
        )}

        {isUploading && (
          <div className="mt-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Lade {files.length} Datei(en) hoch...</span>
              <span>{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
          </div>
        )}

        {isProcessing && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-center space-x-2 text-primary">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>KI analysiert Ihren Beleg...</span>
            </div>
            <Progress value={50} className="h-2" />
          </div>
        )}

        {extractedData && (
          <div className="mt-6 border rounded-lg p-4">
            <h3 className="text-lg font-medium mb-4">Extrahierte Belegdaten</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Anbieter</p>
                <p className="font-medium">{extractedData.vendor}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Datum</p>
                <p className="font-medium">{extractedData.date}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Betrag</p>
                <p className="font-medium">{extractedData.amount}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Kategorie</p>
                <p className="font-medium">{extractedData.category}</p>
              </div>
            </div>

            {extractedData.items && extractedData.items.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-2">Artikel</p>
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left">Artikel</th>
                        <th className="px-4 py-2 text-right">Preis</th>
                      </tr>
                    </thead>
                    <tbody>
                      {extractedData.items.map((item, index) => (
                        <tr key={index} className="border-t">
                          <td className="px-4 py-2">{item.name}</td>
                          <td className="px-4 py-2 text-right">{item.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {files.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium mb-2">Hochgeladene Dateien</h3>
            <div className="space-y-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-50 p-2 rounded-md"
                >
                  <div className="flex items-center">
                    <FileUp className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-sm truncate max-w-xs">
                      {file.name}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {(file.size / 1024).toFixed(1)} KB
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      {extractedData && (
        <CardFooter className="flex justify-end space-x-2 border-t p-4 mt-4">
          <Button variant="outline" onClick={handleCancel}>
            <X className="h-4 w-4 mr-2" /> Abbrechen
          </Button>
          <Button onClick={handleConfirm}>
            <Check className="h-4 w-4 mr-2" /> Bestätigen & Speichern
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
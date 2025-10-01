"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  CreditCard,
  Shield,
  Edit,
  Save
} from "lucide-react";

export default function AccountPage() {
  return (
    <div className="space-y-6 bg-background">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Account</h1>
          <p className="text-muted-foreground">
            Verwalten Sie Ihre Kontoinformationen und Einstellungen
          </p>
        </div>
        <Button className="gap-2">
          <Edit className="h-4 w-4" />
          Profil bearbeiten
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profil Informationen
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=user" />
                <AvatarFallback>MU</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-medium">Max Mustermann</h3>
                <p className="text-muted-foreground">Geschäftsführer</p>
                <Badge variant="secondary" className="mt-1">Premium Account</Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Vorname</Label>
                <Input id="firstName" defaultValue="Max" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nachname</Label>
                <Input id="lastName" defaultValue="Mustermann" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-Mail</Label>
                <Input id="email" type="email" defaultValue="max@mustermann.de" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefon</Label>
                <Input id="phone" defaultValue="+49 123 456789" />
              </div>
            </div>

            <div className="flex justify-end">
              <Button className="gap-2">
                <Save className="h-4 w-4" />
                Änderungen speichern
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Account Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Account Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Plan</span>
              <Badge>Premium</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Status</span>
              <Badge variant="secondary">Aktiv</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Mitglied seit</span>
              <span className="text-sm text-muted-foreground">Jan 2024</span>
            </div>
            <Button variant="outline" className="w-full">
              Plan upgraden
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Company Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Unternehmensinformationen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Firmenname</Label>
              <Input id="companyName" defaultValue="Mustermann GmbH" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxId">Steuernummer</Label>
              <Input id="taxId" defaultValue="123/456/78901" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Adresse</Label>
              <Input id="address" defaultValue="Musterstraße 123" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">Stadt</Label>
              <Input id="city" defaultValue="12345 Musterstadt" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Zahlungsinformationen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <CreditCard className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="font-medium">•••• •••• •••• 1234</p>
                <p className="text-sm text-muted-foreground">Läuft ab 12/26</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Bearbeiten
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
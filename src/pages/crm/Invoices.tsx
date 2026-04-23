import { useMemo, useState } from "react";
import { jsPDF } from "jspdf";
import { z } from "zod";
import { CalendarDays, CarFront, Download, Landmark, Mail, MapPin, Phone, ReceiptText } from "lucide-react";
import ProtectedRoute from "@/components/crm/ProtectedRoute";
import CrmLayout from "@/components/crm/CrmLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import mrsLogo from "@/assets/mrs-logo.png";
import toyotaCamryImage from "@/assets/toyota-camry.jpg";
import hondaAccordImage from "@/assets/honda-accord.jpg";
import suvImage from "@/assets/suv.jpg";
import hondaPilotImage from "@/assets/honda-pilot.jpg";
import mercedesEClassImage from "@/assets/mercedes-e-class.jpg";
import bmw5SeriesImage from "@/assets/bmw-5-series.jpg";
import hiaceImage from "@/assets/hiace.jpg";
import coasterImage from "@/assets/coaster.jpg";

const companyDetails = {
  name: "MRS Car Rental",
  address: "2 Akin Adesola Street, Victoria Island, Lagos 101241, Nigeria",
  email: "info@mrscarrental.com",
  phonePrimary: "+234 802 614 9390",
  phoneSecondary: "+234 803 364 7423",
};

const carOptions = [
  {
    id: "toyota-camry",
    name: "Toyota Camry",
    category: "Saloon Car",
    description: "Comfortable and economical choice for city travel and airport transfers.",
    seats: "4 Seats",
    features: ["AC", "Professional Chauffeur", "Fuel Efficient"],
    image: toyotaCamryImage,
  },
  {
    id: "honda-accord",
    name: "Honda Accord",
    category: "Saloon Car",
    description: "Reliable and comfortable sedan perfect for business travel.",
    seats: "4 Seats",
    features: ["AC", "Professional Chauffeur", "Premium Sound"],
    image: hondaAccordImage,
  },
  {
    id: "toyota-prado",
    name: "Toyota Prado",
    category: "SUV",
    description: "Spacious and luxurious SUV for business meetings and premium travel.",
    seats: "7 Seats",
    features: ["AC", "Professional Chauffeur", "Premium Interior", "4WD"],
    image: suvImage,
  },
  {
    id: "honda-pilot",
    name: "Honda Pilot",
    category: "SUV",
    description: "Premium SUV with advanced features for executive travel.",
    seats: "7 Seats",
    features: ["AC", "Professional Chauffeur", "Leather Seats", "Entertainment System"],
    image: hondaPilotImage,
  },
  {
    id: "mercedes-e-class",
    name: "Mercedes-Benz E-Class",
    category: "Luxury Sedan",
    description: "Ultimate luxury experience with top-of-the-line features and service.",
    seats: "4 Seats",
    features: ["AC", "Professional Chauffeur", "Luxury Features", "Premium Sound"],
    image: mercedesEClassImage,
  },
  {
    id: "bmw-5-series",
    name: "BMW 5 Series",
    category: "Luxury Sedan",
    description: "Premium luxury sedan for discerning executives and VIPs.",
    seats: "4 Seats",
    features: ["AC", "Professional Chauffeur", "Premium Leather", "Advanced Tech"],
    image: bmw5SeriesImage,
  },
  {
    id: "toyota-hiace",
    name: "Toyota Hiace",
    category: "Hiace Bus (14 seats)",
    description: "Perfect for group transportation, events, and airport transfers.",
    seats: "14 Seats",
    features: ["AC", "Professional Chauffeur", "Group Travel", "Spacious Interior"],
    image: hiaceImage,
  },
  {
    id: "toyota-coaster",
    name: "Toyota Coaster",
    category: "Coaster Bus (25 seats)",
    description: "Large capacity bus ideal for corporate events and group transportation.",
    seats: "25 Seats",
    features: ["AC", "Professional Chauffeur", "Event Transportation", "Comfortable Seating"],
    image: coasterImage,
  },
] as const;

const invoiceSchema = z.object({
  invoiceNumber: z.string().trim().min(3).max(40),
  issueDate: z.string().trim().min(1),
  clientName: z.string().trim().min(2).max(100),
  clientPhone: z.string().trim().min(7).max(30),
  clientAddress: z.string().trim().min(5).max(300),
  carId: z.string().trim().min(1),
  amount: z.coerce.number().positive().max(1000000000),
  accountName: z.string().trim().min(2).max(120),
  bankName: z.string().trim().min(2).max(120),
  accountNumber: z.string().trim().min(4).max(30),
});

type InvoiceFormState = {
  invoiceNumber: string;
  issueDate: string;
  clientName: string;
  clientPhone: string;
  clientAddress: string;
  carId: string;
  amount: string;
  accountName: string;
  bankName: string;
  accountNumber: string;
};

const today = new Date().toISOString().split("T")[0];
const initialInvoiceNumber = `MRS-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${new Date().getTime().toString().slice(-4)}`;

async function assetToDataUrl(url: string) {
  const response = await fetch(url);
  const blob = await response.blob();

  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Unable to load logo for PDF export."));
    reader.readAsDataURL(blob);
  });
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 2,
  }).format(value);
}

export default function Invoices() {
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);
  const [form, setForm] = useState<InvoiceFormState>({
    invoiceNumber: initialInvoiceNumber,
    issueDate: today,
    clientName: "",
    clientPhone: "",
    clientAddress: "",
    carId: carOptions[0].id,
    amount: "",
    accountName: "MRS Car Rental",
    bankName: "",
    accountNumber: "",
  });

  const selectedCar = useMemo(
    () => carOptions.find((car) => car.id === form.carId) ?? carOptions[0],
    [form.carId],
  );

  const amountValue = Number(form.amount || 0);

  const handleChange = (field: keyof InvoiceFormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleDownload = async () => {
    const validation = invoiceSchema.safeParse({
      ...form,
      amount: Number(form.amount),
    });

    if (!validation.success) {
      toast({
        title: "Incomplete invoice",
        description: validation.error.issues[0]?.message ?? "Please complete all required invoice fields.",
        variant: "destructive",
      });
      return;
    }

    setIsDownloading(true);

    try {
      const data = validation.data;
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const logoDataUrl = await assetToDataUrl(mrsLogo);
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 42;
      const lineWidth = pageWidth - margin * 2;
      let y = 50;

      doc.addImage(logoDataUrl, "PNG", margin, y - 6, 86, 42);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.text(companyDetails.name, pageWidth - margin, y + 8, { align: "right" });
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(companyDetails.address, pageWidth - margin, y + 24, { align: "right", maxWidth: 220 });
      doc.text(`${companyDetails.phonePrimary}  |  ${companyDetails.phoneSecondary}`, pageWidth - margin, y + 38, {
        align: "right",
      });
      doc.text(companyDetails.email, pageWidth - margin, y + 52, { align: "right" });

      y += 78;
      doc.setDrawColor(210, 180, 80);
      doc.line(margin, y, pageWidth - margin, y);

      y += 28;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.text("INVOICE", margin, y);
      doc.setFontSize(11);
      doc.text(`Invoice No: ${data.invoiceNumber}`, pageWidth - margin, y - 4, { align: "right" });
      doc.text(`Issue Date: ${data.issueDate}`, pageWidth - margin, y + 12, { align: "right" });

      y += 34;
      doc.setFillColor(248, 246, 240);
      doc.roundedRect(margin, y, lineWidth, 88, 8, 8, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("Bill To", margin + 16, y + 22);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.text(data.clientName, margin + 16, y + 42);
      doc.text(data.clientPhone, margin + 16, y + 58);
      const clientAddressLines = doc.splitTextToSize(data.clientAddress, lineWidth / 2 - 24);
      doc.text(clientAddressLines, margin + 16, y + 74);

      doc.setFont("helvetica", "bold");
      doc.text("Payment Details", margin + lineWidth / 2 + 8, y + 22);
      doc.setFont("helvetica", "normal");
      const paymentLines = [
        `Account Name: ${data.accountName}`,
        `Bank: ${data.bankName}`,
        `Account Number: ${data.accountNumber}`,
      ];
      doc.text(paymentLines, margin + lineWidth / 2 + 8, y + 42);

      y += 120;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("Booked Vehicle", margin, y);

      y += 16;
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(margin, y, lineWidth, 148, 8, 8);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text(selectedCar.name, margin + 16, y + 24);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`${selectedCar.category} • ${selectedCar.seats}`, margin + 16, y + 42);
      const descriptionLines = doc.splitTextToSize(selectedCar.description, lineWidth - 32);
      doc.text(descriptionLines, margin + 16, y + 62);
      const featureLines = doc.splitTextToSize(`Features: ${selectedCar.features.join(", ")}`, lineWidth - 32);
      doc.text(featureLines, margin + 16, y + 96);

      y += 176;
      doc.setFillColor(34, 45, 73);
      doc.roundedRect(margin, y, lineWidth, 62, 8, 8, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("Amount Due", margin + 18, y + 24);
      doc.setFontSize(24);
      doc.text(formatCurrency(data.amount), pageWidth - margin - 18, y + 40, { align: "right" });

      doc.setTextColor(33, 37, 41);
      y += 92;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      const footerLines = doc.splitTextToSize(
        "Thank you for choosing MRS Car Rental. Please use the payment details above and contact us for any clarification regarding this invoice.",
        lineWidth,
      );
      doc.text(footerLines, margin, y);

      doc.save(`${data.invoiceNumber}.pdf`);

      toast({
        title: "Invoice downloaded",
        description: "Your PDF invoice has been exported successfully.",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: error instanceof Error ? error.message : "Unable to generate the invoice PDF.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <ProtectedRoute>
      <CrmLayout>
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Invoice Generator</h2>
            <p className="text-muted-foreground">
              Create branded MRS invoices with vehicle details, client information, and PDF export.
            </p>
          </div>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.9fr)]">
            <Card>
              <CardHeader>
                <CardTitle>Invoice details</CardTitle>
                <CardDescription>Fill in the client, vehicle, payment, and amount information.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="invoice-number">Invoice number</Label>
                    <Input
                      id="invoice-number"
                      value={form.invoiceNumber}
                      onChange={(event) => handleChange("invoiceNumber", event.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="issue-date">Issue date</Label>
                    <Input
                      id="issue-date"
                      type="date"
                      value={form.issueDate}
                      onChange={(event) => handleChange("issueDate", event.target.value)}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <ReceiptText className="h-4 w-4 text-primary" />
                    Client information
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="client-name">Client name</Label>
                      <Input
                        id="client-name"
                        value={form.clientName}
                        onChange={(event) => handleChange("clientName", event.target.value)}
                        placeholder="Enter client full name"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="client-phone">Phone number</Label>
                      <Input
                        id="client-phone"
                        value={form.clientPhone}
                        onChange={(event) => handleChange("clientPhone", event.target.value)}
                        placeholder="Enter client phone number"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="client-address">Address</Label>
                      <Textarea
                        id="client-address"
                        value={form.clientAddress}
                        onChange={(event) => handleChange("clientAddress", event.target.value)}
                        placeholder="Enter client address"
                        rows={4}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <CarFront className="h-4 w-4 text-primary" />
                    Vehicle booked
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="car-option">Select car</Label>
                    <Select value={form.carId} onValueChange={(value) => handleChange("carId", value)}>
                      <SelectTrigger id="car-option">
                        <SelectValue placeholder="Choose a vehicle" />
                      </SelectTrigger>
                      <SelectContent>
                        {carOptions.map((car) => (
                          <SelectItem key={car.id} value={car.id}>
                            {car.name} — {car.category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.amount}
                      onChange={(event) => handleChange("amount", event.target.value)}
                      placeholder="Enter invoice amount"
                    />
                  </div>
                  <div className="rounded-md border border-border bg-accent/40 px-4 py-3">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Formatted total</p>
                    <p className="mt-2 text-2xl font-semibold">{formatCurrency(amountValue || 0)}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <Landmark className="h-4 w-4 text-primary" />
                    Payment account details
                  </div>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2 md:col-span-3">
                      <Label htmlFor="account-name">Account name</Label>
                      <Input
                        id="account-name"
                        value={form.accountName}
                        onChange={(event) => handleChange("accountName", event.target.value)}
                        placeholder="Enter account name"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="bank-name">Bank name</Label>
                      <Input
                        id="bank-name"
                        value={form.bankName}
                        onChange={(event) => handleChange("bankName", event.target.value)}
                        placeholder="Enter bank name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="account-number">Account number</Label>
                      <Input
                        id="account-number"
                        value={form.accountNumber}
                        onChange={(event) => handleChange("accountNumber", event.target.value)}
                        placeholder="Enter account number"
                      />
                    </div>
                  </div>
                </div>

                <Button type="button" className="w-full gap-2" onClick={handleDownload} disabled={isDownloading}>
                  <Download className="h-4 w-4" />
                  {isDownloading ? "Generating PDF..." : "Download invoice PDF"}
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="overflow-hidden">
                <CardHeader className="border-b border-border bg-accent/40">
                  <div className="flex items-center gap-4">
                    <img src={mrsLogo} alt="MRS Car Rental logo" className="h-12 w-auto" />
                    <div>
                      <CardTitle>{companyDetails.name}</CardTitle>
                      <CardDescription>Invoice preview</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5 p-6">
                  <div className="grid gap-3 text-sm text-muted-foreground">
                    <div className="flex items-start gap-2">
                      <MapPin className="mt-0.5 h-4 w-4 text-primary" />
                      <span>{companyDetails.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-primary" />
                      <span>{companyDetails.phonePrimary} · {companyDetails.phoneSecondary}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-primary" />
                      <span>{companyDetails.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-primary" />
                      <span>Issue date: {form.issueDate || "—"}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2 text-sm">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Invoice number</p>
                    <p className="font-semibold text-foreground">{form.invoiceNumber || "—"}</p>
                  </div>

                  <div className="space-y-2 text-sm">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Client</p>
                    <p className="font-semibold text-foreground">{form.clientName || "Client name"}</p>
                    <p className="text-muted-foreground">{form.clientPhone || "Phone number"}</p>
                    <p className="text-muted-foreground">{form.clientAddress || "Client address"}</p>
                  </div>

                  <div className="rounded-lg border border-border bg-accent/40 p-4">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Amount due</p>
                    <p className="mt-2 text-3xl font-semibold text-foreground">{formatCurrency(amountValue || 0)}</p>
                  </div>

                  <div className="space-y-2 text-sm">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Payment account</p>
                    <p className="font-medium text-foreground">{form.accountName || "Account name"}</p>
                    <p className="text-muted-foreground">{form.bankName || "Bank name"}</p>
                    <p className="text-muted-foreground">{form.accountNumber || "Account number"}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden">
                <img src={selectedCar.image} alt={selectedCar.name} className="h-52 w-full object-cover" loading="lazy" />
                <CardContent className="space-y-4 p-6">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Booked vehicle</p>
                    <h3 className="mt-2 text-xl font-semibold">{selectedCar.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedCar.category} · {selectedCar.seats}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{selectedCar.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedCar.features.map((feature) => (
                      <span key={feature} className="rounded-full bg-secondary/10 px-3 py-1 text-xs font-medium text-secondary">
                        {feature}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </CrmLayout>
    </ProtectedRoute>
  );
}
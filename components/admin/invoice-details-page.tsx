"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { orderService } from "@/services/order.service";
import { Loader2, Printer, Send, User } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function InvoiceDetailsPage({ invoiceId }: { invoiceId: string }) {
    const [invoice, setInvoice] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [downloadingPdf, setDownloadingPdf] = useState(false);
    const [statusUpdating, setStatusUpdating] = useState(false);

    const fetchInvoiceDetails = async () => {
        try {
            setLoading(true);
            const response = await orderService.getInvoicePdf(invoiceId); // Reuse getInvoicePdf as it returns details JSON now
            setInvoice(response.data);
        } catch (error) {
            console.error("Failed to fetch invoice details:", error);
            toast.error("Failed to load invoice details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (invoiceId) {
            fetchInvoiceDetails();
        }
    }, [invoiceId]);

    const updateStatus = async (status: string) => {
        try {
            setStatusUpdating(true);
            await orderService.updateInvoiceStatus(invoiceId, status);
            toast.success(`Invoice marked as ${status}`);
            fetchInvoiceDetails(); // Refresh details
        } catch (error: any) {
            console.error("Failed to update status:", error);
            toast.error(error.message || "Failed to update status");
        } finally {
            setStatusUpdating(false);
        }
    };

    const handlePrint = async () => {
        if (!invoice) return;
        try {
            setDownloadingPdf(true);

            const jsPDF = (await import("jspdf")).default;
            const autoTable = (await import("jspdf-autotable")).default;

            const doc = new jsPDF();

            // -- Colors & Config --
            const PRIMARY_COLOR = [100, 100, 255]; // Lightish Blue/Purple
            const TEXT_COLOR = [40, 40, 40];
            const GRAY_COLOR = [128, 128, 128];

            // -- Helper: Draw Logo (Mocking the UI 'L' box) --
            // Box: x=14, y=10, w=10, h=10
            doc.setFillColor(240, 240, 255); // Light bg
            doc.setDrawColor(200, 200, 255);
            doc.roundedRect(14, 10, 10, 10, 2, 2, 'FD');

            doc.setFontSize(14);
            doc.setTextColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]); // Primary color text
            doc.setFont("helvetica", "bold");
            doc.text("L", 19, 17, { align: "center" }); // Center inside box

            // "Your Logo" text
            doc.setFontSize(16);
            doc.setTextColor(0, 0, 0);
            doc.text("Your Logo", 28, 17);

            // -- Header Right: INVOICE --
            doc.setFontSize(24);
            doc.setTextColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
            doc.text("INVOICE", 196, 20, { align: "right" });

            doc.setLineWidth(0.5);
            doc.setDrawColor(200, 200, 200);
            doc.line(14, 25, 196, 25); // Separator line

            // -- Info Section --
            const startY = 35;

            // Left: Company Info (Static)
            doc.setFontSize(10);
            doc.setTextColor(GRAY_COLOR[0], GRAY_COLOR[1], GRAY_COLOR[2]);
            doc.setFont("helvetica", "bold");
            doc.text("FROM:", 14, startY);

            doc.setFont("helvetica", "normal");
            doc.setTextColor(0, 0, 0);
            doc.text("Rental System Inc.", 14, startY + 5);
            doc.setTextColor(GRAY_COLOR[0], GRAY_COLOR[1], GRAY_COLOR[2]);
            doc.text("1234 Tech Street", 14, startY + 10);
            doc.text("Innovation City, 56789", 14, startY + 15);
            doc.text("support@rentalsystem.com", 14, startY + 20);

            // Right: Invoice Metadata
            doc.setFont("helvetica", "bold");
            doc.text("DETAILS:", 115, startY);

            doc.setFont("helvetica", "normal");
            doc.text("Invoice No:", 115, startY + 6);
            doc.text("Date:", 115, startY + 12);
            doc.text("Status:", 115, startY + 18);

            doc.setTextColor(0, 0, 0);
            doc.text(invoice.invoiceNumber, 196, startY + 6, { align: "right" });
            doc.text(new Date(invoice.createdAt).toLocaleDateString(), 196, startY + 12, { align: "right" });
            doc.text(invoice.isPaid ? "PAID" : "UNPAID", 196, startY + 18, { align: "right" });

            // -- Bill To Section --
            const billToY = startY + 35;
            doc.setFillColor(245, 245, 245);
            doc.rect(14, billToY - 5, 182, 25, 'F'); // Gray background block

            doc.setTextColor(GRAY_COLOR[0], GRAY_COLOR[1], GRAY_COLOR[2]);
            doc.setFont("helvetica", "bold");
            doc.text("BILL TO:", 18, billToY);

            doc.setFont("helvetica", "bold");
            doc.setTextColor(0, 0, 0);
            doc.text(invoice.order.customer.name, 18, billToY + 6);

            doc.setFont("helvetica", "normal");
            doc.setTextColor(GRAY_COLOR[0], GRAY_COLOR[1], GRAY_COLOR[2]);
            if (invoice.order.customer.address) {
                doc.text(invoice.order.customer.address, 18, billToY + 11);
            } else {
                doc.text("No address provided", 18, billToY + 11);
            }

            // -- Table --
            const tableColumn = ["Item Description", "Qty", "Unit Price", "Total"];
            const tableRows: any[] = [];

            invoice.order.details.forEach((item: any) => {
                const row = [
                    item.product.name,
                    item.quantity,
                    `Rs ${Number(item.unitPrice).toFixed(2)}`,
                    `Rs ${Number(item.subtotal).toFixed(2)}`,
                ];
                tableRows.push(row);
            });

            autoTable(doc, {
                startY: billToY + 25,
                head: [tableColumn],
                body: tableRows,
                theme: 'grid',
                headStyles: {
                    fillColor: [240, 240, 240],
                    textColor: [40, 40, 40],
                    lineColor: [200, 200, 200],
                    lineWidth: 0.1,
                },
                styles: {
                    lineColor: [200, 200, 200],
                    lineWidth: 0.1,
                    textColor: [60, 60, 60]
                },
                columnStyles: {
                    0: { cellWidth: 'auto' }, // Description
                    1: { halign: 'center' },  // Qty
                    2: { halign: 'right' },   // Price
                    3: { halign: 'right' },   // Total
                }
            });

            // -- Total Section --
            const finalY = (doc as any).lastAutoTable.finalY + 10;
            const rightMargin = 182; // Approx right align position (196 - padding)

            doc.setFontSize(10);
            doc.setTextColor(GRAY_COLOR[0], GRAY_COLOR[1], GRAY_COLOR[2]);

            // Subtotal (Calculated from untaxed)
            const untaxed = Number(invoice.grandTotal) - Number(invoice.taxAmount);

            doc.text("Subtotal:", 140, finalY);
            doc.setTextColor(0, 0, 0);
            doc.text(`Rs ${untaxed.toFixed(2)}`, 196, finalY, { align: "right" });

            doc.setTextColor(GRAY_COLOR[0], GRAY_COLOR[1], GRAY_COLOR[2]);
            doc.text("Tax:", 140, finalY + 5);
            doc.setTextColor(0, 0, 0);
            doc.text(`Rs ${Number(invoice.taxAmount).toFixed(2)}`, 196, finalY + 5, { align: "right" });

            // Grand Total Line
            doc.setLineWidth(0.5);
            doc.line(140, finalY + 8, 196, finalY + 8);

            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.text("Grand Total:", 140, finalY + 14);
            doc.setTextColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
            doc.text(`Rs ${Number(invoice.grandTotal).toFixed(2)}`, 196, finalY + 14, { align: "right" });

            // -- Footer --
            const pageHeight = doc.internal.pageSize.height;
            doc.setFontSize(8);
            doc.setTextColor(150, 150, 150);
            doc.text("Thank you for your business!", 105, pageHeight - 15, { align: "center" });

            doc.save(`Invoice-${invoice.invoiceNumber}.pdf`);
        } catch (error: any) {
            console.error("Download PDF failed:", error);
            toast.error("Failed to generate invoice PDF");
        } finally {
            setDownloadingPdf(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!invoice) {
        return <div className="container mx-auto py-6 px-4">Invoice not found</div>;
    }

    return (
        <div className="container mx-auto py-6 px-4 max-w-screen-xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 border-b pb-4">
                <div>
                    <h1 className="text-2xl font-bold">
                        Invoice {invoice.invoiceNumber}
                    </h1>
                    <p className="text-muted-foreground">
                        Invoice for {invoice.order.customer.name}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={handlePrint}
                        disabled={downloadingPdf}
                    >
                        {downloadingPdf ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Printer className="h-4 w-4" />
                        )}
                        Print Invoice
                    </Button>

                    {/* Conditional Action Buttons - Delivery Status Workflow */}
                    {invoice.deliveryStatus === "PROCESSING" && (
                        <Button
                            size="sm"
                            className="gap-2 bg-blue-600 hover:bg-blue-700"
                            onClick={() => updateStatus("DISPATCHED")}
                            disabled={statusUpdating}
                        >
                            {statusUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                            Dispatch Order
                        </Button>
                    )}

                    {invoice.deliveryStatus === "DISPATCHED" && (
                        <Button
                            size="sm"
                            className="gap-2 bg-green-600 hover:bg-green-700"
                            onClick={() => updateStatus("DELIVERED")}
                            disabled={statusUpdating}
                        >
                            {statusUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                            Mark Delivered
                        </Button>
                    )}

                    {invoice.deliveryStatus === "DELIVERED" && (
                        <Button
                            size="sm"
                            disabled
                            className="gap-2 bg-gray-500 hover:bg-gray-600 cursor-not-allowed"
                        >
                            Delivered
                        </Button>
                    )}

                    {/* Payment Status (Keep generic 'Paid' or 'Register' if needed, or remove if conflicting) */}
                    {/* The user didn't ask to remove payment buttons, but might clutter. Keeping concise. */}
                    {invoice.isPaid && (
                        <Button
                            size="sm"
                            disabled
                            variant="outline"
                            className="gap-2 cursor-not-allowed"
                        >
                            Paid
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Left Column */}
                <div className="space-y-4">
                    <div>
                        <Label className="mb-2 block">Customer</Label>
                        <div className="flex gap-2">
                            <Input value={invoice.order.customer.name} readOnly />
                            {invoice.order.customerId && (
                                <Button variant="outline" size="icon" asChild>
                                    <a href={`/admin/customer/${invoice.order.customerId}`}>
                                        <User className="h-4 w-4" />
                                        <span className="sr-only">View Customer</span>
                                    </a>
                                </Button>
                            )}
                        </div>
                    </div>
                    <div>
                        <Label className="mb-2 block">Start Date</Label>
                        <Input
                            value={new Date(invoice.order.details[0]?.start_date).toLocaleDateString() || '-'}
                            readOnly
                        />
                    </div>
                    {/* Add more fields as needed based on design */}
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                    <div>
                        <Label className="mb-2 block">Invoice Date</Label>
                        <Input
                            type="text"
                            defaultValue={new Date(invoice.createdAt).toDateString()}
                            readOnly
                            className="bg-muted"
                        />
                    </div>
                    <div>
                        <Label className="mb-2 block">Payment Terms</Label>
                        <Input
                            type="text"
                            defaultValue={invoice.order.paymentPlan} // e.g. FULL_UPFRONT
                            readOnly
                        />
                    </div>
                </div>
            </div>

            <Separator className="my-6" />

            {/* Invoice Lines */}
            <div className="mb-6">
                <h3 className="font-semibold mb-4">Invoice Lines</h3>
                <div className="border rounded-md">
                    {/* Table Header */}
                    <div className="grid grid-cols-12 gap-4 p-3 bg-muted/50 border-b font-medium text-sm">
                        <div className="col-span-4">Product</div>
                        <div className="col-span-1">Quantity</div>
                        {/* Adjusted columns slightly for simplified view */}
                        <div className="col-span-3">Unit Price</div>
                        <div className="col-span-2">Tax</div>
                        <div className="col-span-2 text-right">Amount</div>
                    </div>

                    {/* Rows */}
                    <div className="divide-y">
                        {invoice.order.details.map((line: any) => (
                            <div
                                key={line.id}
                                className="grid grid-cols-12 gap-4 p-3 items-center"
                            >
                                <div className="col-span-4 font-medium">{line.product.name}</div>
                                <div className="col-span-1">{line.quantity}</div>
                                <div className="col-span-3">
                                    Rs {Number(line.unitPrice).toLocaleString()}
                                </div>
                                <div className="col-span-2"> - </div>
                                <div className="col-span-2 text-right font-semibold">
                                    Rs {Number(line.subtotal).toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer Section */}
            <div className="flex justify-end items-start">
                <div className="space-y-2 min-w-[300px]">
                    <div className="flex justify-between text-sm">
                        <span>Tax:</span>
                        <span className="font-semibold">
                            Rs {Number(invoice.taxAmount).toLocaleString()}
                        </span>
                    </div>
                    <div className="flex justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span>Rs {Number(invoice.grandTotal).toLocaleString()}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Check, X, Printer, Send } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface InvoiceLine {
    id: number
    product: string
    quantity: number
    unit: string
    unitPrice: number
    taxes: number
    amount: number
}

type InvoiceStatus = "DRAFT" | "POSTED"

interface Invoice {
    id: string
    reference: string
    status: InvoiceStatus
    customer: string
    invoiceAddress: string
    deliveryAddress: string
    rentalStart?: Date
    rentalEnd?: Date
    invoiceDate: Date
    dueDate: Date
    invoiceLines: InvoiceLine[]
}

const MOCK_INVOICE_DETAILS = {
    invoiceAddress: "123 Main St, City",
    deliveryAddress: "456 Oak Ave, Town",
    rentalStart: new Date(2024, 0, 15),
    rentalEnd: new Date(2024, 0, 30),
    invoiceDate: new Date(2024, 0, 10),
    dueDate: new Date(2024, 1, 10),
    invoiceLines: [
        { id: 1, product: "Computers", quantity: 20, unit: "Units", unitPrice: 20000, taxes: 0, amount: 400000 },
        { id: 2, product: "Downpayment", quantity: 20, unit: "Units", unitPrice: 0, taxes: 0, amount: 0 },
    ]
}

// Mock invoices data - in real app, this would come from API
const MOCK_INVOICES = [
    { id: "1", reference: "INV/2026/0001", status: "DRAFT" as const, customer: "Spectacular Goshawk" },
    { id: "2", reference: "INV/2026/0002", status: "POSTED" as const, customer: "Vigorous Seahorse" },
]

export function InvoiceDetailsPage({ invoiceId }: { invoiceId: string }) {
    // Fetch invoice from mock data
    const invoiceFromList = MOCK_INVOICES.find(i => i.id === invoiceId)

    if (!invoiceFromList) {
        return <div className="container mx-auto py-6 px-4">Invoice not found</div>
    }

    const invoice = {
        ...invoiceFromList,
        ...MOCK_INVOICE_DETAILS
    }

    const [startDate, setStartDate] = useState<Date | undefined>(invoice.rentalStart)
    const [endDate, setEndDate] = useState<Date | undefined>(invoice.rentalEnd)

    const untaxedAmount = invoice.invoiceLines.reduce((sum, line) => sum + line.amount, 0)
    const totalAmount = untaxedAmount

    return (
        <div className="container mx-auto py-6 px-4 max-w-screen-xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 border-b pb-4">
                <div className="flex items-center gap-4">
                    <div className="bg-purple-100 text-purple-700 px-4 py-1 rounded font-semibold">New</div>
                    <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <X className="h-4 w-4 text-red-600" />
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                        <Printer className="h-4 w-4" />
                        Print
                    </Button>

                    {invoice.status === "DRAFT" && (
                        <>
                            <Button size="sm" className="gap-2 bg-green-600 hover:bg-green-700">
                                <Send className="h-4 w-4" />
                                Send
                            </Button>
                            <Button size="sm" className="gap-2 bg-blue-600 hover:bg-blue-700">
                                Confirm
                            </Button>
                        </>
                    )}

                    {invoice.status === "POSTED" && (
                        <Badge className="bg-green-100 text-green-700 text-sm px-4 py-2">
                            Posted
                        </Badge>
                    )}
                </div>
            </div>

            {/* Invoice Reference & Status */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">{invoice.reference}</h1>
                <div className="flex items-center gap-2">
                    <Badge
                        className={cn(
                            "text-sm px-4 py-1",
                            invoice.status === "DRAFT" && "bg-gray-100 text-gray-700",
                            invoice.status === "POSTED" && "bg-green-100 text-green-700"
                        )}
                    >
                        {invoice.status === "DRAFT" ? "Draft" : "Posted"}
                    </Badge>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Left Column */}
                <div className="space-y-4">
                    <div>
                        <Label>Customer</Label>
                        <Select defaultValue={invoice.customer}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Spectacular Goshawk">Spectacular Goshawk</SelectItem>
                                <SelectItem value="Vigorous Seahorse">Vigorous Seahorse</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label>Invoice Address</Label>
                        <Input defaultValue={invoice.invoiceAddress} />
                    </div>
                    <div>
                        <Label>Delivery Address</Label>
                        <Input defaultValue={invoice.deliveryAddress} />
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                    <div>
                        <Label>Rental Period</Label>
                        <div className="flex items-center gap-2">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="justify-start text-left font-normal flex-1">
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {startDate ? startDate.toDateString() : <span>Start date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar mode="single" selected={startDate} onSelect={setStartDate} />
                                </PopoverContent>
                            </Popover>
                            <span>→</span>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="justify-start text-left font-normal flex-1">
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {endDate ? endDate.toDateString() : <span>End date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar mode="single" selected={endDate} onSelect={setEndDate} />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                    <div>
                        <Label>Invoice date</Label>
                        <Input type="text" defaultValue={invoice.invoiceDate.toDateString()} readOnly className="bg-muted" />
                    </div>
                    <div>
                        <Label>Due Date</Label>
                        <Input type="text" defaultValue={invoice.dueDate.toDateString()} />
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
                        <div className="col-span-2">Unit</div>
                        <div className="col-span-2">Unit Price</div>
                        <div className="col-span-1">Taxes</div>
                        <div className="col-span-2 text-right">Amount</div>
                    </div>

                    {/* Rows */}
                    <div className="divide-y">
                        {invoice.invoiceLines.map((line) => (
                            <div key={line.id} className="grid grid-cols-12 gap-4 p-3 items-center">
                                <div className="col-span-4 font-medium">{line.product}</div>
                                <div className="col-span-1">{line.quantity}</div>
                                <div className="col-span-2">{line.unit}</div>
                                <div className="col-span-2">Rs {line.unitPrice.toLocaleString()}</div>
                                <div className="col-span-1">—</div>
                                <div className="col-span-2 text-right font-semibold">Rs {line.amount.toLocaleString()}</div>
                            </div>
                        ))}
                    </div>

                    {/* Footer / Add Buttons */}
                    <div className="p-3 bg-muted/10 flex gap-4">
                        <Button variant="link" className="text-primary -ml-2 h-8">
                            Add a Product
                        </Button>
                        <Button variant="link" className="text-primary h-8">
                            Add a note
                        </Button>
                    </div>
                </div>
            </div>

            {/* Footer Section */}
            <div className="flex justify-between items-start">
                <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                        Terms & Conditions: <a href="#" className="text-primary underline">https://xxxxx.xxx.xxx/terms</a>
                    </p>
                </div>

                <div className="space-y-2 min-w-[300px]">
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">Coupon Code</Button>
                        <Button variant="outline" size="sm" className="flex-1">Discount</Button>
                        <Button variant="outline" size="sm" className="flex-1">Add Shipping</Button>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-sm">
                        <span>Untaxed Amount:</span>
                        <span className="font-semibold">Rs {untaxedAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span>Rs {totalAmount.toLocaleString()}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

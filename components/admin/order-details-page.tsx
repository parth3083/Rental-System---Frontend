"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Check, X, Printer, Send, Trash2 } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { MOCK_ORDERS } from "@/components/admin/orders-page"

interface OrderLine {
    id: number
    product: string
    quantity: number
    unit: string
    unitPrice: number
    taxes: number
    amount: number
}

type OrderStatus = "DRAFT" | "SENT" | "APPROVED" | "REJECTED" | "CONFIRMED" | "CANCELLED"

interface Order {
    id: string
    reference: string
    status: OrderStatus
    customer: string
    invoiceAddress: string
    deliveryAddress: string
    rentalStart?: Date
    rentalEnd?: Date
    orderDate: Date
    orderLines: OrderLine[]
}

const MOCK_ORDER_DETAILS = {
    invoiceAddress: "123 Main St, City",
    deliveryAddress: "456 Oak Ave, Town",
    rentalStart: new Date(2024, 0, 15),
    rentalEnd: new Date(2024, 0, 30),
    orderDate: new Date(2024, 0, 10),
    orderLines: [
        { id: 1, product: "Computers", quantity: 20, unit: "Units", unitPrice: 20000, taxes: 0, amount: 400000 },
        { id: 2, product: "Downpayment", quantity: 20, unit: "Units", unitPrice: 0, taxes: 0, amount: 0 },
    ]
}

export function OrderDetailsPage({ orderId }: { orderId: string }) {
    // Fetch order from mock data
    const orderFromList = MOCK_ORDERS.find(o => o.id === orderId)

    if (!orderFromList) {
        return <div className="container mx-auto py-6 px-4">Order not found</div>
    }

    const order = {
        ...orderFromList,
        ...MOCK_ORDER_DETAILS
    }

    const [startDate, setStartDate] = useState<Date | undefined>(order.rentalStart)
    const [endDate, setEndDate] = useState<Date | undefined>(order.rentalEnd)

    const untaxedAmount = order.orderLines.reduce((sum, line) => sum + line.amount, 0)
    const totalAmount = untaxedAmount // + taxes if needed

    return (
        <div className="container mx-auto py-6 px-4 max-w-screen-xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 border-b pb-4">
                {/* <div className="flex items-center gap-4">
                    <div className="bg-purple-100 text-purple-700 px-4 py-1 rounded font-semibold">New</div>
                    <span className="text-xl font-semibold">Rental order</span>
                    <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <X className="h-4 w-4 text-red-600" />
                    </div>
                </div> */}
                <div>
                    <h1 className="text-2xl font-bold">Quotation</h1>
                    <p className="text-muted-foreground">Quotation for {order.customer}</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                        <Printer className="h-4 w-4" />
                        Print
                    </Button>

                    {/* Conditional Action Buttons */}
                    {order.status === "DRAFT" && (
                        <Button size="sm" className="gap-2 bg-green-600 hover:bg-green-700">
                            <Send className="h-4 w-4" />
                            Send to Customer
                        </Button>
                    )}

                    {order.status === "SENT" && (
                        <Button size="sm" disabled className="gap-2 bg-yellow-500 hover:bg-yellow-500 cursor-not-allowed">
                            Waiting for Approval
                        </Button>
                    )}

                    {order.status === "APPROVED" && (
                        <Button size="sm" disabled className="gap-2 bg-yellow-500 hover:bg-yellow-500 cursor-not-allowed">
                            Waiting for Payment
                        </Button>
                    )}

                    {order.status === "CONFIRMED" && (
                        <Button size="sm" className="gap-2 bg-purple-600 hover:bg-purple-700">
                            Create Invoice
                        </Button>
                    )}

                    {(order.status === "REJECTED" || order.status === "CANCELLED") && (
                        <Button size="sm" disabled className="gap-2 bg-red-500 hover:bg-red-500 cursor-not-allowed">
                            Quotation Rejected
                        </Button>
                    )}
                </div>
            </div>

            {/* Order Reference & Status */}
            {/* <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">{order.reference}</h1>
                <div className="flex items-center gap-2">
                    <Badge
                        className={cn(
                            "text-sm",
                            order.status === "DRAFT" && "bg-gray-100 text-gray-700",
                            order.status === "SENT" && "bg-yellow-100 text-yellow-700",
                            order.status === "APPROVED" && "bg-blue-100 text-blue-700",
                            order.status === "CONFIRMED" && "bg-green-100 text-green-700",
                            order.status === "REJECTED" && "bg-red-100 text-red-700",
                            order.status === "CANCELLED" && "bg-red-100 text-red-700"
                        )}
                    >   
                        {order.displayStatus || order.status}
                    </Badge>
                </div>
            </div> */}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Left Column */}
                <div className="space-y-4">
                    <div>
                        <Label className="mb-2 block">Customer</Label>
                        <Select defaultValue={order.customer}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Gracious Chinchilla">Gracious Chinchilla</SelectItem>
                                <SelectItem value="Glorious Walrus">Glorious Walrus</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label className="mb-2 block">Invoice Address</Label>
                        <Input defaultValue={order.invoiceAddress} />
                    </div>
                    <div>
                        <Label className="mb-2 block">Delivery Address</Label>
                        <Input defaultValue={order.deliveryAddress} />
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                    <div>
                        <Label className="mb-2 block">Rental Period</Label>
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
                        <Label className="mb-2 block">Order date</Label>
                        <Input type="text" defaultValue={order.orderDate.toDateString()} readOnly className="bg-muted" />
                    </div>
                </div>
            </div>

            <Separator className="my-6" />

            {/* Order Lines */}
            <div className="mb-6">
                <h3 className="font-semibold mb-4">Order Line</h3>
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
                        {order.orderLines.map((line) => (
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
                    <Button variant="outline" size="sm" className="mt-4">
                        Send Quotation to Customer
                    </Button>
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

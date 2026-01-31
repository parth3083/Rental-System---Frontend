"use client"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface Order {
    id: string
    reference: string
    date: string
    customer: string
    product: string
    total: number
    status: string
    displayStatus: string
}

interface OrderListViewProps {
    orders: Order[]
}

const STATUS_STYLES: Record<string, string> = {
    "Sale order": "bg-orange-100 text-orange-700 hover:bg-orange-100 border-orange-200",
    "Confirmed": "bg-green-100 text-green-700 hover:bg-green-100 border-green-200",
    "Invoiced": "bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200",
    "Cancelled": "bg-red-100 text-red-700 hover:bg-red-100 border-red-200",
    "Rejected": "bg-red-100 text-red-700 hover:bg-red-100 border-red-200",
    "Quotation": "bg-purple-100 text-purple-700 hover:bg-purple-100 border-purple-200",
    "Quotation Sent": "bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-yellow-200",
}

export function OrderListView({ orders }: OrderListViewProps) {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[50px]">
                            <Checkbox />
                        </TableHead>
                        <TableHead>Order Reference</TableHead>
                        <TableHead>Order Date</TableHead>
                        <TableHead>Customer Name</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Rental Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.map((order) => (
                        <Link href={`/admin/orders/${order.id}`} key={order.id} className="contents">
                            <TableRow className="cursor-pointer hover:bg-muted/50">
                                <TableCell>
                                    <Checkbox />
                                </TableCell>
                                <TableCell className="font-medium">{order.reference}</TableCell>
                                <TableCell>{order.date}</TableCell>
                                <TableCell>{order.customer}</TableCell>
                                <TableCell>{order.product}</TableCell>
                                <TableCell>${order.total}</TableCell>
                                <TableCell>
                                    <Badge
                                        className={cn("rounded-full px-3 py-1 font-normal border", STATUS_STYLES[order.displayStatus] || "bg-gray-100 text-gray-700")}
                                    >
                                        {order.displayStatus}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        </Link>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

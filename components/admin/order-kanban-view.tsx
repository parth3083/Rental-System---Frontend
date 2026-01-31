"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
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

interface OrderKanbanViewProps {
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

export function OrderKanbanView({ orders }: OrderKanbanViewProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {orders.map((order) => (
                <Link href={`/admin/orders/${order.id}`} key={order.id}>
                    <Card className="bg-card hover:bg-accent/5 transition-colors cursor-pointer border-l-4" style={{ borderLeftColor: getStatusColor(order.displayStatus) }}>
                        <CardContent className="p-4 space-y-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold text-sm">{order.customer}</p>
                                    <p className="text-xs text-muted-foreground">{order.reference}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-sm">{order.product}</p>
                                    <p className="font-bold text-base">${order.total}</p>
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-2">
                                <span className="text-xs text-muted-foreground">Rental Duration</span>
                                <Badge
                                    className={cn("rounded px-2 py-0.5 text-[10px] font-normal border shadow-none", STATUS_STYLES[order.displayStatus] || "bg-gray-100 text-gray-700")}
                                >
                                    {order.displayStatus}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
    )
}

function getStatusColor(status: string) {
    switch (status) {
        case "Sale order": return "#f97316";
        case "Confirmed": return "#22c55e";
        case "Invoiced": return "#3b82f6";
        case "Cancelled": return "#ef4444";
        case "Rejected": return "#ef4444";
        case "Quotation": return "#a855f7";
        case "Quotation Sent": return "#eab308";
        default: return "#9ca3af";
    }
}

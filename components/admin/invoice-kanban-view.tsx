"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface Invoice {
    id: string
    reference: string
    date: string
    customer: string
    total: number
    status: string
    displayStatus: string
}

interface InvoiceKanbanViewProps {
    invoices: Invoice[]
}

const STATUS_STYLES: Record<string, string> = {
    "Draft": "bg-gray-100 text-gray-700 hover:bg-gray-100 border-gray-200",
    "Posted": "bg-green-100 text-green-700 hover:bg-green-100 border-green-200",
}

export function InvoiceKanbanView({ invoices }: InvoiceKanbanViewProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {invoices.map((invoice) => (
                <Link href={`/admin/invoices/${invoice.id}`} key={invoice.id}>
                    <Card className="bg-card hover:bg-accent/5 transition-colors cursor-pointer border-l-4" style={{ borderLeftColor: getStatusColor(invoice.displayStatus) }}>
                        <CardContent className="p-4 space-y-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold text-sm">{invoice.customer}</p>
                                    <p className="text-xs text-muted-foreground">{invoice.reference}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-base">Rs {invoice.total.toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-2">
                                <span className="text-xs text-muted-foreground">{invoice.date}</span>
                                <Badge
                                    className={cn("rounded px-2 py-0.5 text-[10px] font-normal border shadow-none", STATUS_STYLES[invoice.displayStatus] || "bg-gray-100 text-gray-700")}
                                >
                                    {invoice.displayStatus}
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
        case "Draft": return "#9ca3af";
        case "Posted": return "#22c55e";
        default: return "#9ca3af";
    }
}

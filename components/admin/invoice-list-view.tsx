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

interface Invoice {
    id: string
    reference: string
    date: string
    customer: string
    total: number
    status: string
    displayStatus: string
}

interface InvoiceListViewProps {
    invoices: Invoice[]
}

const STATUS_STYLES: Record<string, string> = {
    "Draft": "bg-gray-100 text-gray-700 hover:bg-gray-100 border-gray-200",
    "Posted": "bg-green-100 text-green-700 hover:bg-green-100 border-green-200",
}

export function InvoiceListView({ invoices }: InvoiceListViewProps) {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[50px]">
                            <Checkbox />
                        </TableHead>
                        <TableHead>Invoice Reference</TableHead>
                        <TableHead>Invoice Date</TableHead>
                        <TableHead>Customer Name</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {invoices.map((invoice) => (
                        <Link href={`/admin/invoices/${invoice.id}`} key={invoice.id} className="contents">
                            <TableRow className="cursor-pointer hover:bg-muted/50">
                                <TableCell>
                                    <Checkbox />
                                </TableCell>
                                <TableCell className="font-medium">{invoice.reference}</TableCell>
                                <TableCell>{invoice.date}</TableCell>
                                <TableCell>{invoice.customer}</TableCell>
                                <TableCell>Rs {invoice.total.toLocaleString()}</TableCell>
                                <TableCell>
                                    <Badge
                                        className={cn("rounded-full px-3 py-1 font-normal border", STATUS_STYLES[invoice.displayStatus] || "bg-gray-100 text-gray-700")}
                                    >
                                        {invoice.displayStatus}
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

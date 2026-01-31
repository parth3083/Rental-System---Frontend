"use client"

import { Checkbox } from "@/components/ui/checkbox"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import Link from "next/link"

interface Product {
    id: string
    name: string
    price: number // Sales Price
    vendor: string
    qty: number
    unit: string
    published: boolean
}

interface ProductListViewProps {
    products: Product[]
}

export function ProductListView({ products }: ProductListViewProps) {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[50px]">
                            <Checkbox />
                        </TableHead>
                        <TableHead>Product name</TableHead>
                        <TableHead>Vendor name</TableHead>
                        <TableHead>QTY</TableHead>
                        <TableHead>Unit</TableHead>
                        <TableHead>Sales Price</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.map((product) => (
                        <TableRow key={product.id}>
                            <TableCell>
                                <Checkbox />
                            </TableCell>
                            <TableCell className="font-medium">
                                <Link href={`/admin/products/${product.id}`} className="hover:underline">
                                    {product.name}
                                </Link>
                            </TableCell>
                            <TableCell>{product.vendor}</TableCell>
                            <TableCell>{product.qty}</TableCell>
                            <TableCell>{product.unit}</TableCell>
                            <TableCell>${product.price}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

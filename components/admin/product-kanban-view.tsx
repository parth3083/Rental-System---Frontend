"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"

interface Product {
    id: string
    name: string
    price: number
    vendor: string
    image: string
    published: boolean
}

interface ProductKanbanViewProps {
    products: Product[]
}

export function ProductKanbanView({ products }: ProductKanbanViewProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {products.map((product) => (
                <Link href={`/admin/products/${product.id}`} key={product.id}>
                    <Card className="overflow-hidden group cursor-pointer hover:border-primary/50 transition-colors h-full flex flex-col relative">
                        {/* Unpublished Overlay */}
                        {!product.published && (
                            <div className="absolute top-0 right-0 z-10 overflow-hidden w-28 h-28 pointer-events-none">
                                <div className="absolute top-[18px] -right-[34px] bg-neutral-800 text-white text-[10px] py-1 text-center w-[140px] rotate-45 shadow-sm font-medium tracking-wide uppercase">
                                    Unpublished
                                </div>
                            </div>
                        )}

                        <div className="relative aspect-video w-full bg-muted flex items-center justify-center p-4">
                            <Image
                                src={product.image}
                                alt={product.name}
                                width={200}
                                height={200}
                                className="object-contain max-h-32"
                            />
                        </div>
                        <CardContent className="p-4 flex-1">
                            <div className="flex justify-between items-start gap-2">
                                <h3 className="font-semibold text-lg">{product.name}</h3>
                            </div>
                            <p className="text-xl font-bold mt-1">Price</p> {/* Placeholder for actual price if needed, or keeping explicit 'Price' label as per mock */}
                        </CardContent>
                        <CardFooter className="p-4 pt-0 text-sm text-muted-foreground border-t bg-muted/20">
                            {product.vendor}
                        </CardFooter>
                    </Card>
                </Link>
            ))}
        </div>
    )
}

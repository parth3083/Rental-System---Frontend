"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CalendarIcon, Edit, Trash2, ArrowLeft, EyeOff, Eye } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"

// Reusing the dummy data to ensure data consistency across views
// In a real app, this would be a shared constant or API call
const PRODUCTS: any[] = [
    {
        id: "1", title: "Gaming PC Set", image: "/products/pc1.png",
        price: "Rs 1200", unit: "per Set", monthlyPrice: 1200, dailyPrice: 100,
        brand: "TechWorld", color: "RGB", description: "High-end gaming setup including PC, Monitor, and Peripherals.", inStock: true, published: true
    },
    {
        id: "2", title: "Office Workstation", image: "/products/pc2.png",
        price: "Rs 800", unit: "per Set", monthlyPrice: 800, dailyPrice: 80,
        brand: "Office Supplies Co", color: "Black", description: "Complete office workstation for professionals.", inStock: true, published: true
    },
    {
        id: "3", title: "High-End Server", image: "/products/pc3.png",
        price: "Rs 2500", unit: "per Unit", monthlyPrice: 2500, dailyPrice: 300,
        brand: "TechWorld", color: "Silver", description: "Enterprise grade server for data processing.", inStock: true, published: false
    },
    {
        id: "4", title: "Standard Monitor", image: "/products/monitor.png",
        price: "Rs 150", unit: "per Pcs", monthlyPrice: 150, dailyPrice: 20,
        brand: "DisplayPros", color: "Black", description: "24-inch 1080p Monitor.", inStock: true, published: true
    },
    {
        id: "5", title: "Mechanical Keyboard", image: "/products/keyboard.png",
        price: "Rs 80", unit: "per Pcs", monthlyPrice: 80, dailyPrice: 10,
        brand: "TechWorld", color: "RGB", description: "Mechanical keyboard with Blue switches.", inStock: true, published: true
    },
    {
        id: "6", title: "Ergonomic Mouse", image: "/products/mouse.png",
        price: "Rs 50", unit: "per Pcs", monthlyPrice: 50, dailyPrice: 5,
        brand: "TechWorld", color: "Black", description: "Wireless ergonomic mouse.", inStock: true, published: true
    },
]

export function ProductDetailsPage({ productId }: { productId: string }) {

    // Simulate fetching
    const product = PRODUCTS.find(p => p.id === productId) || PRODUCTS[0] // Fallback to first item if not found for demo

    if (!product) {
        return (
            <div className="container mx-auto py-12 text-center">
                <h1 className="text-2xl font-bold">Product not found</h1>
                <Link href="/admin/products" className="text-primary hover:underline mt-4 inline-block">
                    Return to Products
                </Link>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-8 px-4 md:px-8">
            <Link href="/admin/products" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Products
            </Link>

            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                {/* Left: Image Section */}
                <div className="w-full lg:w-3/5 bg-muted/20 rounded-xl flex items-center justify-center relative min-h-[400px] lg:min-h-[600px]">
                    {/* Unpublished Overlay for details view too */}
                    {!product.published && (
                        <div className="absolute top-4 right-4 z-10">
                            <Badge variant="destructive" className="text-lg py-1 px-3">Unpublished</Badge>
                        </div>
                    )}

                    <div className="relative w-full h-full min-h-[400px]">
                        <Image
                            src={product.image}
                            alt={product.title}
                            fill
                            className="object-contain p-8 mix-blend-multiply"
                        />
                    </div>
                </div>

                {/* Right: Details Section */}
                <div className="w-full lg:w-2/5 flex flex-col gap-6">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex gap-2">
                                <Badge variant="secondary">{product.brand}</Badge>
                                <span className={cn("text-xs font-medium px-2 py-0.5 rounded", product.inStock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>
                                    {product.inStock ? "In Stock" : "Out of Stock"}
                                </span>
                            </div>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{product.title}</h1>
                        <p className="text-muted-foreground mt-4 text-base leading-relaxed">
                            {product.description || "No description available for this product."}
                        </p>
                    </div>

                    {/* Specs / Color */}
                    <div className="flex items-center gap-4 text-sm">
                        {product.color && (
                            <div className="flex items-center gap-2">
                                <span className="font-medium">Color:</span>
                                <div className="flex items-center gap-1">
                                    <div className="h-4 w-4 rounded-full border" style={{ backgroundColor: product.color.toLowerCase().includes('rgb') ? 'purple' : product.color.toLowerCase() }}></div>
                                    <span className="capitalize text-muted-foreground">{product.color}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <Separator />

                    {/* Pricing Cards */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold">Rental Rates (Configuration)</h3>
                        <div className="grid grid-cols-3 gap-3">
                            {product.hourlyPrice && (
                                <div className="border rounded-lg p-3 text-center bg-card">
                                    <div className="font-bold text-lg">${product.hourlyPrice}</div>
                                    <div className="text-[10px] text-muted-foreground uppercase">Per Hour</div>
                                </div>
                            )}
                            {product.dailyPrice && (
                                <div className="border rounded-lg p-3 text-center border-primary bg-primary/5">
                                    <div className="font-bold text-lg text-primary">${product.dailyPrice}</div>
                                    <div className="text-[10px] text-muted-foreground uppercase">Per Day</div>
                                </div>
                            )}
                            {product.monthlyPrice && (
                                <div className="border rounded-lg p-3 text-center bg-card">
                                    <div className="font-bold text-lg">${product.monthlyPrice}</div>
                                    <div className="text-[10px] text-muted-foreground uppercase">Per Month</div>
                                </div>
                            )}
                        </div>
                    </div>

                    <Separator />

                    {/* Admin Actions */}
                    <div className="mt-4 flex flex-col gap-3">
                        <h3 className="text-sm font-semibold">Actions</h3>
                        <div className="flex gap-3">
                            <Button className="flex-1 h-12 text-base">
                                <Edit className="mr-2 h-5 w-5" />
                                Edit Product
                            </Button>
                            <Button variant="outline" className="flex-1 h-12 text-base">
                                {product.published ? <EyeOff className="mr-2 h-5 w-5" /> : <Eye className="mr-2 h-5 w-5" />}
                                {product.published ? "Unpublish" : "Publish"}
                            </Button>
                        </div>
                        <Button variant="destructive" className="h-12 text-base">
                            <Trash2 className="mr-2 h-5 w-5" />
                            Delete Product
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

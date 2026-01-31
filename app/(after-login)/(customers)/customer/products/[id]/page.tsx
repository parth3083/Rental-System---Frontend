"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CalendarIcon, ShoppingCart, Heart, Share2, Minus, Plus, ArrowLeft } from "lucide-react"
import { useState, use } from "react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { useWishlist } from "@/contexts/wishlist-context"

// Reusing the dummy data for now to simulate data fetching
const PRODUCTS: any[] = [
    {
        id: "1", title: "Sofa Set", image: "https://placehold.co/400x300/png?text=Sofa",
        price: "Rs 500", unit: "per Month", monthlyPrice: 500, dailyPrice: 50,
        brand: "IKEA", color: "Blue", description: "Comfortable 3-seater sofa ideal for living rooms. Soft cushioning and durable fabric.", inStock: true
    },
    {
        id: "2", title: "Office Desk", image: "https://placehold.co/400x300/png?text=Desk",
        price: "Rs 50", unit: "per hour", hourlyPrice: 50, dailyPrice: 200,
        brand: "Herman Miller", color: "Black", description: "Ergonomic office desk with adjustable height. Perfect for work from home setups.", inStock: false
    },
    {
        id: "3", title: "Smart TV", image: "https://placehold.co/400x300/png?text=TV",
        price: "Rs 800", unit: "per month", monthlyPrice: 800, dailyPrice: 100,
        brand: "Samsung", color: "Black", description: "55 inch 4K Smart TV with HDR support. Built-in streaming apps.", inStock: true
    },
    {
        id: "4", title: "Desktop PC", image: "https://placehold.co/400x300/png?text=PC",
        price: "Rs 200", unit: "per day", dailyPrice: 200, hourlyPrice: 40,
        brand: "Dell", color: "Silver", description: "High performance workstation for editing/gaming. i7 Processor, 32GB RAM.", inStock: true
    },
    {
        id: "5", title: "Laptop", image: "https://placehold.co/400x300/png?text=Laptop",
        price: "Rs 150", unit: "per day", dailyPrice: 150, hourlyPrice: 30,
        brand: "Apple", color: "Space Gray", description: "MacBook Pro M2 with 16GB RAM. Excellent battery life.", inStock: true
    },
    {
        id: "6", title: "PlayStation 5", image: "https://placehold.co/400x300/png?text=PS5",
        price: "Rs 100", unit: "per hour", hourlyPrice: 100, dailyPrice: 500,
        brand: "Sony", color: "White", description: "Next-gen gaming console with DualSense controller. Includes 2 games.", inStock: true
    },
    {
        id: "7", title: "Bedroom Set", image: "https://placehold.co/400x300/png?text=Bed",
        price: "Rs 1200", unit: "per month", monthlyPrice: 1200,
        brand: "Urban Ladder", color: "Brown", description: "Queen size bed with mattress and two side tables. Solid wood construction.", inStock: true
    },
    {
        id: "8", title: "Speakers", image: "https://placehold.co/400x300/png?text=Speakers",
        price: "Rs 80", unit: "per day", dailyPrice: 80, hourlyPrice: 20,
        brand: "JBL", color: "Black", description: "Portable Bluetooth speaker with 20h battery life. Waterproof design.", inStock: true
    },
    {
        id: "9", title: "Camera", image: "https://placehold.co/400x300/png?text=Camera",
        price: "Rs 300", unit: "per hour", hourlyPrice: 300, dailyPrice: 2000,
        brand: "Canon", color: "Black", description: "Canon EOS R5 with 24-70mm lens. Great for professional photography.", inStock: true
    },
    {
        id: "10", title: "Projector", image: "https://placehold.co/400x300/png?text=Projector",
        price: "Rs 500", unit: "per day", dailyPrice: 500,
        brand: "Epson", color: "White", description: "Full HD projector for home cinema or presentations. 3000 lumens brightness.", inStock: true
    },
]

export default function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params)
    const [startDate, setStartDate] = useState<Date | undefined>(new Date())
    const [endDate, setEndDate] = useState<Date | undefined>(undefined)
    const [quantity, setQuantity] = useState(1)
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()

    // Simulate fetching
    const product = PRODUCTS.find(p => p.id === resolvedParams.id)

    if (!product) {
        return (
            <div className="container mx-auto py-12 text-center">
                <h1 className="text-2xl font-bold">Product not found</h1>
                <Link href="/customer/products" className="text-primary hover:underline mt-4 inline-block">
                    Return to Products
                </Link>
            </div>
        )
    }

    const inWishlist = isInWishlist(product.id)

    const toggleWishlist = () => {
        if (inWishlist) {
            removeFromWishlist(product.id)
        } else {
            addToWishlist({
                id: product.id,
                title: product.title,
                image: product.image,
                price: product.price,
                unit: product.unit
            })
        }
    }

    return (
        <div className="container mx-auto py-8 px-4 md:px-8">
            <Link href="/customer/products" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Browse
            </Link>

            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                {/* Left: Image Section */}
                <div className="w-full lg:w-3/5 bg-muted/20 rounded-xl flex items-center justify-center relative min-h-[400px] lg:min-h-[600px]">
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
                            <Badge variant="secondary">{product.brand}</Badge>
                            <span className={cn("text-xs font-medium px-2 py-0.5 rounded", product.inStock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>
                                {product.inStock ? "In Stock" : "Out of Stock"}
                            </span>
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
                                    <div className="h-4 w-4 rounded-full border" style={{ backgroundColor: product.color.toLowerCase() }}></div>
                                    <span className="capitalize text-muted-foreground">{product.color}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <Separator />

                    {/* Pricing Cards */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold">Rental Rates</h3>
                        <div className="grid grid-cols-3 gap-3">
                            {product.hourlyPrice && (
                                <div className="border rounded-lg p-3 text-center cursor-pointer hover:border-primary transition-colors bg-card hover:bg-accent/5">
                                    <div className="font-bold text-lg">${product.hourlyPrice}</div>
                                    <div className="text-[10px] text-muted-foreground uppercase">Per Hour</div>
                                </div>
                            )}
                            {product.dailyPrice && (
                                <div className="border rounded-lg p-3 text-center cursor-pointer border-primary bg-primary/5">
                                    <div className="font-bold text-lg text-primary">${product.dailyPrice}</div>
                                    <div className="text-[10px] text-muted-foreground uppercase">Per Day</div>
                                </div>
                            )}
                            {product.monthlyPrice && (
                                <div className="border rounded-lg p-3 text-center cursor-pointer hover:border-primary transition-colors bg-card hover:bg-accent/5">
                                    <div className="font-bold text-lg">${product.monthlyPrice}</div>
                                    <div className="text-[10px] text-muted-foreground uppercase">Per Month</div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Date & Quantity */}
                    {/* Dates */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold">Start Date</label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {startDate ? startDate.toDateString() : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold">End Date</label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {endDate ? endDate.toDateString() : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    {/* Quantity */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold">Quantity</label>
                        <div className="flex items-center border rounded-md w-fit">
                            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                                <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setQuantity(quantity + 1)}>
                                <Plus className="h-3 w-3" />
                            </Button>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-8 flex gap-3">
                        <Button className="flex-1 h-12 text-base" size="lg">
                            <ShoppingCart className="mr-2 h-5 w-5" />
                            Add to Cart
                        </Button>
                        <Button
                            variant={inWishlist ? "default" : "outline"}
                            size="icon"
                            className={cn(
                                "h-12 w-12",
                                inWishlist && "bg-red-500 hover:bg-red-600 text-white"
                            )}
                            onClick={toggleWishlist}
                        >
                            <Heart className={cn("h-5 w-5", inWishlist && "fill-current")} />
                        </Button>
                        <Button variant="outline" size="icon" className="h-12 w-12">
                            <Share2 className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

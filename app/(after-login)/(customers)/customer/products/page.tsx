"use client"

import { ProductFilters } from "@/components/product-filters"
import { ProductCard } from "@/components/product-card"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { useAppSelector } from "@/redux/hook"
import Link from "next/link"

// Dummy Data with full details
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

export default function CustomerBrowsePage() {
    const searchQuery = useAppSelector((state) => state.search.query)

    // Filter logic
    const filteredProducts = PRODUCTS.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="flex flex-col lg:flex-row gap-8 py-8 px-4 md:px-6">
            {/* Sidebar Filters */}
            <aside className="w-full lg:w-64 flex-shrink-0">
                <ProductFilters />
            </aside>

            {/* Main Content */}
            <div className="flex-1 space-y-8">

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map((product, i) => (
                        <Link key={i} href={`/customer/products/${product.id}`} className="block h-full">
                            <ProductCard {...product} />
                        </Link>
                    ))}
                    {filteredProducts.length === 0 && (
                        <div className="col-span-full text-center py-12 text-muted-foreground">
                            No products found matching "{searchQuery}"
                        </div>
                    )}
                </div>

                {/* Pagination */}
                <div className="flex justify-center mt-8">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious href="#" />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink href="#" isActive>1</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink href="#">2</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationNext href="#" />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>
        </div>
    )
}

import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"

interface ProductCardProps {
    title: string
    image: string
    price: string
    unit: string
    inStock?: boolean
}

export function ProductCard({ title, image, price, unit, inStock = true }: ProductCardProps) {
    return (
        <Card
            className="group overflow-hidden border-none shadow-none hover:shadow-md transition-shadow bg-transparent h-full cursor-pointer relative"
        >
            <CardContent className="p-0 relative aspect-square bg-white rounded-xl border overflow-hidden">
                {!inStock && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60 text-white font-medium">
                        Out of stock
                    </div>
                )}

                {/* Wishlist Button - Only for in-stock items */}
                {inStock && (
                    <div className="absolute top-2 right-2 z-20">
                        <Button
                            variant="secondary"
                            size="icon"
                            className="h-8 w-8 rounded-full bg-white/80 hover:bg-white text-muted-foreground hover:text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-all"
                            onClick={(e) => {
                                e.preventDefault(); // Prevent Link navigation
                                e.stopPropagation();
                                // Add wishlist logic here
                                console.log("Added to wishlist");
                            }}
                        >
                            <Heart className="h-4 w-4" />
                            <span className="sr-only">Add to Wishlist</span>
                        </Button>
                    </div>
                )}

                <div className="relative h-full w-full p-4 flex items-center justify-center">
                    {/* Using a placeholder if no image provided or fallback */}
                    <div className="relative h-full w-full">
                        <Image
                            src={image}
                            alt={title}
                            height={100}
                            width={100}
                            className="object-contain transition-transform group-hover:scale-105"
                        />
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start p-2 pt-3">
                {/* <h3 className="font-medium text-sm line-clamp-1">{title}</h3> */}
                <div className="w-full text-center">
                    <span className="font-semibold text-sm">{price}</span>
                    <span className="text-muted-foreground text-xs"> / {unit}</span>
                </div>
            </CardFooter>
        </Card>
    )
}

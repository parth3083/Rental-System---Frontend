"use client"

import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { useWishlist } from "@/contexts/wishlist-context"
import { cn } from "@/lib/utils"

interface ProductCardProps {
    id: string
    title: string
    image: string
    price: string
    unit: string
    inStock?: boolean
}

export function ProductCard({ id, title, image, price, unit, inStock = true }: ProductCardProps) {
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
    const inWishlist = isInWishlist(id)

    const toggleWishlist = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (inWishlist) {
            removeFromWishlist(id)
        } else {
            addToWishlist({ id, title, image, price, unit })
        }
    }

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

                {/* Wishlist Button - Always visible when in wishlist, otherwise on hover */}
                {inStock && (
                    <div className="absolute top-2 right-2 z-20">
                        <Button
                            variant="secondary"
                            size="icon"
                            className={cn(
                                "h-8 w-8 rounded-full shadow-sm transition-all",
                                inWishlist
                                    ? "bg-red-500 hover:bg-red-600 text-white opacity-100"
                                    : "bg-white/80 hover:bg-white text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100"
                            )}
                            onClick={toggleWishlist}
                        >
                            <Heart className={cn("h-4 w-4", inWishlist && "fill-current")} />
                            <span className="sr-only">{inWishlist ? "Remove from" : "Add to"} Wishlist</span>
                        </Button>
                    </div>
                )}

                <div className="relative h-full w-full p-4 flex items-center justify-center">
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
                <div className="w-full text-center">
                    <span className="font-semibold text-sm">{price}</span>
                    <span className="text-muted-foreground text-xs"> / {unit}</span>
                </div>
            </CardFooter>
        </Card>
    )
}

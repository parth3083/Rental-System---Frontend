"use client";

import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag } from "lucide-react";
import { useWishlist } from "@/contexts/wishlist-context";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  id: string;
  title: string;
  image: string;
  price: string;
  unit: string;
  inStock?: boolean;
}

export function ProductCard({
  id,
  title,
  image,
  price,
  unit,
  inStock = true,
  showWishlistButton = true,
}: ProductCardProps & { showWishlistButton?: boolean }) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(id);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (inWishlist) {
      removeFromWishlist(id);
    } else {
      addToWishlist(id);
    }
  };

  return (
    <Card className="group relative h-full overflow-hidden border-border/40 bg-card transition-all duration-300 hover:shadow-xl hover:border-primary/20 rounded-xl">
      <CardContent className="p-0">
        <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50">
          {!inStock && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60 text-white font-medium backdrop-blur-[2px]">
              Out of stock
            </div>
          )}

          {/* Badges/Actions Overlay */}
          <div className="absolute top-3 right-3 z-20 flex flex-col gap-2">
            {showWishlistButton && (
              <Button
                variant="secondary"
                size="icon"
                className={cn(
                  "h-8 w-8 rounded-full backdrop-blur-md transition-all duration-300 shadow-sm",
                  inWishlist
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-white/80 hover:bg-white text-gray-700 hover:text-red-500 dark:bg-black/50 dark:text-gray-200",
                )}
                onClick={toggleWishlist}
              >
                <Heart
                  className={cn("h-4 w-4", inWishlist && "fill-current")}
                />
                <span className="sr-only">Wishlist</span>
              </Button>
            )}
          </div>

          <div className="relative h-full w-full p-6 transition-transform duration-500 group-hover:scale-105">
            <Image
              src={image}
              alt={title}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>

          {/* Quick Action Overlay */}
          <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            <Button className="w-full rounded-lg shadow-lg font-medium bg-primary/90 hover:bg-primary backdrop-blur-sm">
              View Details
            </Button>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col items-start p-5 space-y-3">
        <div className="space-y-1.5 w-full">
          <h3 className="font-semibold text-lg leading-tight line-clamp-1 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">
              {inStock ? "Available" : "Unavailable"}
            </span>
          </div>
        </div>

        <div className="flex w-full items-end justify-between border-t border-border/40 pt-3 mt-auto">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
              Price
            </span>
            <div className="flex items-baseline gap-1">
              <span className="font-bold text-xl text-foreground">{price}</span>
              <span className="text-sm text-muted-foreground font-medium">
                /{unit}
              </span>
            </div>
          </div>

          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 delay-75">
            <ShoppingBag className="h-4 w-4" />
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

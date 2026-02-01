"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CalendarIcon,
  ShoppingCart,
  Heart,
  Share2,
  Minus,
  Plus,
  ArrowLeft,
} from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useState, use, useEffect } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useWishlist } from "@/contexts/wishlist-context";
import { useCart } from "@/contexts/cart-context";
import { productService, ProductDetails } from "@/services/product.service";
import { toast } from "sonner";

export default function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const response = await productService.getProductById(resolvedParams.id);
        if (response.success) {
          setProduct(response.data);
        } else {
          toast.error("Failed to load product details");
        }
      } catch (error) {
        console.error("Error fetching product", error);
        toast.error("Error fetching product");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [resolvedParams.id]);

  const handleAddToCart = async () => {
    if (!product) return;

    if (!startDate || !endDate) {
      toast.error("Please select both start and end dates");
      return;
    }

    if (endDate < startDate) {
      toast.error("End date cannot be before start date");
      return;
    }

    try {
      await addToCart({
        productId: product.id,
        quantity,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        isService: true,
      });
      router.push("/customer/cart");
    } catch (error) {
      // Error is already handled/toasted in context, but good to catch here if needed
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-20 flex justify-center">
        <Spinner className="h-10 w-10 text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <Link
          href="/customer/products"
          className="text-primary hover:underline mt-4 inline-block"
        >
          Return to Products
        </Link>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);

  const toggleWishlist = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-8">
      <Link
        href="/customer/products"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Browse
      </Link>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Left: Image Section */}
        <div className="w-full lg:w-3/5 bg-muted/20 rounded-xl flex items-center justify-center relative min-h-[400px] lg:min-h-[600px]">
          <div className="relative w-full h-full min-h-[400px]">
            <Image
              src={
                product.imageUrl ||
                "https://placehold.co/400x300/png?text=No+Image"
              }
              alt={product.name}
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
              <span
                className={cn(
                  "text-xs font-medium px-2 py-0.5 rounded",
                  product.isAvailable
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700",
                )}
              >
                {product.isAvailable ? "In Stock" : "Out of Stock"}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              {product.name}
            </h1>
            <p className="text-muted-foreground mt-4 text-base leading-relaxed">
              {product.description ||
                "No description available for this product."}
            </p>
          </div>

          {/* Specs / Color */}
          <div className="flex items-center gap-4 text-sm">
            {product.color && (
              <div className="flex items-center gap-2">
                <span className="font-medium">Color:</span>
                <div className="flex items-center gap-1">
                  <div
                    className="h-4 w-4 rounded-full border"
                    style={{ backgroundColor: product.color.toLowerCase() }}
                  ></div>
                  <span className="capitalize text-muted-foreground">
                    {product.color}
                  </span>
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
                  <div className="font-bold text-lg">
                    Rs {product.hourlyPrice}
                  </div>
                  <div className="text-[10px] text-muted-foreground uppercase">
                    Per Hour
                  </div>
                </div>
              )}
              {product.dailyPrice && (
                <div className="border rounded-lg p-3 text-center cursor-pointer border-primary bg-primary/5">
                  <div className="font-bold text-lg text-primary">
                    Rs {product.dailyPrice}
                  </div>
                  <div className="text-[10px] text-muted-foreground uppercase">
                    Per Day
                  </div>
                </div>
              )}
              {product.monthlyPrice && (
                <div className="border rounded-lg p-3 text-center cursor-pointer hover:border-primary transition-colors bg-card hover:bg-accent/5">
                  <div className="font-bold text-lg">
                    Rs {product.monthlyPrice}
                  </div>
                  <div className="text-[10px] text-muted-foreground uppercase">
                    Per Month
                  </div>
                </div>
              )}
            </div>
            {product.discountPercentage > 0 && (
              <div className="text-xs text-green-600 font-medium text-center mt-2">
                {product.discountPercentage}% Discount Available
              </div>
            )}
          </div>

          <Separator />

          {/* Additional Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Security Deposit:</span>
              <span className="font-medium">Rs {product.securityDeposit}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax:</span>
              <span className="font-medium">{product.taxPercentage}%</span>
            </div>
          </div>

          <Separator />

          {/* Date & Quantity */}
          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold">Start Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? (
                      startDate.toDateString()
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold">End Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? (
                      endDate.toDateString()
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <label className="text-xs font-semibold">Quantity</label>
            <div className="flex items-center border rounded-md w-fit">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-8 text-center text-sm font-medium">
                {quantity}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex gap-3">
            <Button
              className="flex-1 h-12 text-base"
              size="lg"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
            <Button
              variant={inWishlist ? "default" : "outline"}
              size="icon"
              className={cn(
                "h-12 w-12",
                inWishlist && "bg-red-500 hover:bg-red-600 text-white",
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
  );
}

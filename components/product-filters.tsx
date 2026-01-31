"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  ProductFilters as ProductFiltersType,
  productService,
  Category,
  ProductSummary,
} from "@/services/product.service";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductFiltersProps {
  filters: ProductFiltersType;
  setFilters: Dispatch<SetStateAction<ProductFiltersType>>;
  className?: string;
  products?: ProductSummary[];
}

export function ProductFilters({
  filters,
  setFilters,
  className,
  products = [],
}: ProductFiltersProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({
    min: 0,
    max: 10000,
  });
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);

  // Fetch Categories from API (independent of products)
  useEffect(() => {
    const fetchCategories = async () => {
      setIsCategoriesLoading(true);
      try {
        const catResponse = await productService.getCategories();
        if (catResponse.success) {
          setCategories(catResponse.data);
        }
      } catch (error) {
        console.error("Failed to fetch categories", error);
        toast.error("Failed to fetch categories");
      } finally {
        setIsCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Derive other filters from the fetched product list
  useEffect(() => {
    if (products.length > 0) {
      const uniqueBrands = Array.from(
        new Set(products.map((p) => p.brand)),
      ).sort();
      const uniqueColors = Array.from(
        new Set(products.map((p) => p.color)),
      ).sort();

      const prices = products.map((p) => p.finalPrice);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);

      setBrands(uniqueBrands);
      setColors(uniqueColors);
      setPriceRange({ min: Math.floor(minPrice), max: Math.ceil(maxPrice) });
    }
  }, [products]);

  const handleCategoryChange = (categoryId: number) => {
    setFilters((prev) => ({
      ...prev,
      categoryId: prev.categoryId === categoryId ? undefined : categoryId,
      pageNumber: 1,
    }));
  };

  const handleBrandChange = (brand: string) => {
    const currentBrands = filters.brands || [];
    const newBrands = currentBrands.includes(brand)
      ? currentBrands.filter((b) => b !== brand)
      : [...currentBrands, brand];

    setFilters((prev) => ({ ...prev, brands: newBrands, pageNumber: 1 }));
  };

  const handleColorChange = (color: string) => {
    const currentColors = filters.colors || [];
    const newColors = currentColors.includes(color)
      ? currentColors.filter((c) => c !== color)
      : [...currentColors, color];

    setFilters((prev) => ({ ...prev, colors: newColors, pageNumber: 1 }));
  };

  const handlePriceChange = (value: number[]) => {
    setFilters((prev) => ({ ...prev, maxPrice: value[0], pageNumber: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      pageNumber: 1,
      pageSize: 10,
    });
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Filters</h2>
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          Clear
        </Button>
      </div>

      {/* Category Filter */}
      <div className="space-y-4">
        <h3 className="font-semibold text-sm">Category</h3>
        <div className="space-y-2">
          {isCategoriesLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))
          ) : (
            <>
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={filters.categoryId === category.id}
                    onCheckedChange={() => handleCategoryChange(category.id)}
                  />
                  <Label
                    htmlFor={`category-${category.id}`}
                    className="text-sm font-normal text-muted-foreground peer-aria-checked:text-foreground cursor-pointer"
                  >
                    {category.name}
                  </Label>
                </div>
              ))}
              {categories.length === 0 && (
                <div className="text-sm text-muted-foreground">
                  No categories found
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Separator />

      {/* Brand Filter */}
      <div className="space-y-4">
        <h3 className="font-semibold text-sm">Brand</h3>
        <div className="space-y-2">
          {brands.map((brand) => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox
                id={`brand-${brand}`}
                checked={filters.brands?.includes(brand)}
                onCheckedChange={() => handleBrandChange(brand)}
              />
              <Label
                htmlFor={`brand-${brand}`}
                className="text-sm font-normal text-muted-foreground peer-aria-checked:text-foreground cursor-pointer"
              >
                {brand}
              </Label>
            </div>
          ))}
          {brands.length === 0 && (
            <div className="text-sm text-muted-foreground">
              No brands found (in current list)
            </div>
          )}
        </div>
      </div>

      <Separator />

      {/* Color Filter */}
      <div className="space-y-4">
        <h3 className="font-semibold text-sm">Color</h3>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <div
              key={color}
              onClick={() => handleColorChange(color)}
              className={cn(
                "h-6 w-6 rounded-full border cursor-pointer ring-offset-background hover:ring-2 ring-ring flex items-center justify-center relative",
                filters.colors?.includes(color) && "ring-2 ring-primary",
              )}
              style={{ backgroundColor: color.toLowerCase() }}
              title={color}
            />
          ))}
          {colors.length === 0 && (
            <div className="text-sm text-muted-foreground">No colors found</div>
          )}
        </div>
      </div>

      <Separator />

      {/* Price Range Filter */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">Max Price</h3>
          <span className="text-xs text-muted-foreground">
            {filters.maxPrice ? `Up to Rs ${filters.maxPrice}` : "Any"}
          </span>
        </div>
        <Slider
          defaultValue={[filters.maxPrice || priceRange.max]}
          max={priceRange.max || 10000}
          min={priceRange.min}
          step={100}
          onValueChange={handlePriceChange}
          className="py-4"
        />
      </div>
    </div>
  );
}

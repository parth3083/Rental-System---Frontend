"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"
import { cn } from "@/lib/utils"

export function ProductFilters({ className }: { className?: string }) {
    const [priceRange, setPriceRange] = useState([5000])

    return (
        <div className={cn("space-y-6", className)}>
            {/* Brand Filter */}
            <div className="space-y-4">
                <h3 className="font-semibold text-sm">Brand</h3>
                <div className="space-y-2">
                    {["xxxxxxx", "yUyhjh", "Abcdef"].map((brand, i) => (
                        <div key={i} className="flex items-center space-x-2">
                            <Checkbox id={`brand-${i}`} />
                            <Label htmlFor={`brand-${i}`} className="text-sm font-normal text-muted-foreground peer-aria-checked:text-foreground">
                                {brand}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            <Separator />

            {/* Color Filter */}
            <div className="space-y-4">
                <h3 className="font-semibold text-sm">Color</h3>
                <div className="flex flex-wrap gap-2">
                    {["#1a1a1a", "#e11d48", "#2563eb", "#d97706", "#16a34a"].map((color, i) => (
                        <div
                            key={i}
                            className="h-6 w-6 rounded-full border cursor-pointer ring-offset-background hover:ring-2 ring-ring"
                            style={{ backgroundColor: color }}
                        />
                    ))}
                </div>
            </div>

            <Separator />

            {/* Duration Filter */}
            <div className="space-y-4">
                <h3 className="font-semibold text-sm">Duration</h3>
                <div className="space-y-2">
                    {["1 Month", "6 Month", "1 Year", "2 Years"].map((duration, i) => (
                        <div key={i} className="flex items-center space-x-2">
                            <Checkbox id={`duration-${i}`} />
                            <Label htmlFor={`duration-${i}`} className="text-sm font-normal text-muted-foreground">
                                {duration}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            <Separator />

            {/* Price Range Filter */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm">Price Range</h3>
                    <span className="text-xs text-muted-foreground">$0 - ${priceRange[0]}</span>
                </div>
                <Slider
                    defaultValue={[5000]}
                    max={10000}
                    step={100}
                    onValueChange={setPriceRange}
                    className="py-4"
                />
            </div>
        </div>
    )
}

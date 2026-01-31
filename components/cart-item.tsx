"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Minus, Plus, Trash2 } from "lucide-react"
import Image from "next/image"

interface CartItemProps {
    item: {
        id: string
        title: string
        brand: string
        image: string
        price: number
        unit: string
        quantity: number
        startDate: Date
        endDate: Date
    }
    onUpdateQuantity: (id: string, delta: number) => void
    onRemove: (id: string) => void
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
    const diffTime = Math.abs(item.endDate.getTime() - item.startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

    const calculateItemTotal = () => {
        return item.price * diffDays * item.quantity
    }

    return (
        <Card className="overflow-hidden border-none shadow-sm bg-card/50">
            <div className="p-4 sm:p-6 flex flex-col sm:flex-row gap-6">
                {/* Image */}
                <div className="relative aspect-square w-full sm:w-32 h-32 rounded-lg bg-white border flex items-center justify-center flex-shrink-0">
                    <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-contain p-2"
                    />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-semibold text-lg">{item.title}</h3>
                            <p className="text-sm text-muted-foreground">{item.brand}</p>
                            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                                <span>Start: <span className="text-foreground font-medium">{item.startDate.toLocaleDateString()}</span></span>
                                <span>End: <span className="text-foreground font-medium">{item.endDate.toLocaleDateString()}</span></span>
                                <span>Duration: <span className="text-foreground font-medium">{diffDays} days</span></span>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-destructive -mr-2 -mt-2"
                            onClick={() => onRemove(item.id)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mt-4">
                        {/* Quantity */}
                        <div className="flex items-center border rounded-md bg-background">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onUpdateQuantity(item.id, -1)}>
                                <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onUpdateQuantity(item.id, 1)}>
                                <Plus className="h-3 w-3" />
                            </Button>
                        </div>

                        {/* Price Calculation */}
                        <div className="text-right">
                            <div className="text-xs text-muted-foreground mb-1">
                                ${item.price}/{item.unit} × {diffDays} days × {item.quantity}
                            </div>
                            <div className="text-xl font-bold text-primary">
                                ${calculateItemTotal()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    )
}

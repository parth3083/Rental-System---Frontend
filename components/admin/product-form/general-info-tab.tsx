"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Image as ImageIcon } from "lucide-react"

export function GeneralInfoTab() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
            {/* Left: Form Fields */}
            <div className="lg:col-span-2 space-y-6">

                {/* Product Type */}
                <div className="flex items-center gap-6">
                    <Label className="text-base font-semibold w-32">Product Type</Label>
                    <RadioGroup defaultValue="goods" className="flex items-center gap-6">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="goods" id="goods" />
                            <Label htmlFor="goods">Goods</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="service" id="service" />
                            <Label htmlFor="service">Service</Label>
                        </div>
                    </RadioGroup>
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-6">
                    <Label className="text-base font-semibold w-32">Quantity on Hand</Label>
                    <div className="w-1/3">
                        <Input type="number" placeholder="0.00" defaultValue="100.00" />
                    </div>
                </div>

                {/* Sales Price */}
                <div className="flex items-center gap-6">
                    <Label className="text-base font-semibold w-32">Sales Price</Label>
                    <div className="flex items-center gap-4 flex-1 max-w-md">
                        <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                            <Input className="pl-6" placeholder="0.00" />
                        </div>
                        <div className="w-32">
                            <Select defaultValue="units">
                                <SelectTrigger>
                                    <SelectValue placeholder="Unit" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="units">Per Units</SelectItem>
                                    <SelectItem value="hours">Per Hour</SelectItem>
                                    <SelectItem value="days">Per Day</SelectItem>
                                    <SelectItem value="months">Per Month</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Cost Price */}
                <div className="flex items-center gap-6">
                    <Label className="text-base font-semibold w-32">Cost Price</Label>
                    <div className="flex items-center gap-4 flex-1 max-w-md">
                        <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                            <Input className="pl-6" placeholder="0.00" />
                        </div>
                        <div className="w-32">
                            <Select defaultValue="units">
                                <SelectTrigger>
                                    <SelectValue placeholder="Unit" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="units">Per Units</SelectItem>
                                    <SelectItem value="hours">Per Hour</SelectItem>
                                    <SelectItem value="days">Per Day</SelectItem>
                                    <SelectItem value="months">Per Month</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Category */}
                <div className="flex items-center gap-6">
                    <Label className="text-base font-semibold w-32">Category</Label>
                    <div className="flex-1 max-w-md">
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Furniture/ Electronics" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="furniture">Furniture</SelectItem>
                                <SelectItem value="electronics">Electronics</SelectItem>
                                <SelectItem value="vehicles">Vehicles</SelectItem>
                                <SelectItem value="equipments">Equipments</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Vendor Name */}
                <div className="flex items-center gap-6">
                    <Label className="text-base font-semibold w-32">Vendor Name:</Label>
                    <div className="flex-1 max-w-md">
                        <Input defaultValue="Current Vendor Name" disabled className="bg-muted" />
                        <p className="text-xs text-muted-foreground mt-1">Autofill Vendor&apos;s name</p>
                    </div>
                </div>
            </div>

            {/* Right: Image & Publish */}
            <div className="space-y-6 flex flex-col items-end">
                {/* Publish Switch */}
                <div className="flex items-center gap-4 mb-8">
                    <Label className="font-semibold">Publish</Label>
                    <Switch />
                </div>

                {/* Image Placeholder */}
                <div className="w-48 h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-muted-foreground bg-muted/20 hover:bg-muted/30 cursor-pointer transition-colors">
                    <ImageIcon className="h-10 w-10 mb-2" />
                    <span className="text-sm">Upload Image</span>
                </div>
            </div>
        </div>
    )
}

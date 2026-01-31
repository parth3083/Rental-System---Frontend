"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, X } from "lucide-react"
import Link from "next/link"
import { GeneralInfoTab } from "./product-form/general-info-tab"
import { AttributesTab } from "./product-form/attributes-tab"

export function NewProductPage() {
    return (
        <div className="container mx-auto py-6 px-4 max-w-screen-2xl h-[calc(100vh-100px)] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between gap-4 mb-6 border-b pb-4">
                <div className="flex items-center gap-4">
                    <div className="bg-purple-100 text-purple-700 px-4 py-1 rounded font-semibold">New</div>
                    <span className="text-xl font-semibold">Product</span>
                </div>
                <div className="flex items-center gap-2">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 h-8 w-8 p-0 rounded-sm">
                        <Check className="h-5 w-5" />
                    </Button>
                    <Link href="/admin/products">
                        <Button size="sm" variant="destructive" className="h-8 w-8 p-0 rounded-sm">
                            <X className="h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="flex-1 overflow-auto">
                <div className="w-full">
                    {/* Product Name Input */}
                    <div className="mb-6 space-y-1">
                        <label className="text-sm font-medium text-muted-foreground">Product</label>
                        <Input
                            className="text-lg font-semibold border-x-0 border-t-0 border-b-2 rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary bg-transparent"
                            placeholder="e.g. Computers"
                        />
                    </div>

                    <Tabs defaultValue="general" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
                            <TabsTrigger value="general">General Information</TabsTrigger>
                            <TabsTrigger value="attributes">Attributes & Variants</TabsTrigger>
                        </TabsList>
                        <TabsContent value="general" className="pb-10 pl-4 pr-4">
                            <GeneralInfoTab />
                        </TabsContent>
                        <TabsContent value="attributes" className="pb-10 pl-4 pr-4">
                            <AttributesTab />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}

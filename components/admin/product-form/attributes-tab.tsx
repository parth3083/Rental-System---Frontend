"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2 } from "lucide-react"
import { useState } from "react"

interface AttributeRow {
    id: number
    name: string
    values: string
    isFixed: boolean
}

export function AttributesTab() {
    const [attributes, setAttributes] = useState<AttributeRow[]>([
        { id: 1, name: "Brand", values: "", isFixed: true },
        { id: 2, name: "Color", values: "", isFixed: true },
    ])

    const addAttribute = () => {
        const newId = Math.max(...attributes.map(a => a.id), 0) + 1
        setAttributes([...attributes, { id: newId, name: "", values: "", isFixed: false }])
    }

    const removeAttribute = (id: number) => {
        setAttributes(attributes.filter(a => a.id !== id))
    }

    const updateAttribute = (id: number, field: 'name' | 'values', value: string) => {
        setAttributes(attributes.map(a =>
            a.id === id ? { ...a, [field]: value } : a
        ))
    }

    return (
        <div className="mt-6 space-y-4">
            <h3 className="font-semibold text-lg">Attributes</h3>

            <div className="border rounded-md">
                {/* Header */}
                <div className="grid grid-cols-12 gap-4 p-3 bg-muted/50 border-b font-medium text-sm">
                    <div className="col-span-4">Name of the Attributes (Brand, Color, Size...)</div>
                    <div className="col-span-7">Values (e.g. Red, Green, Blue...)</div>
                    <div className="col-span-1 text-center">Configure</div>
                </div>

                {/* Rows */}
                <div className="divide-y">
                    {attributes.map((attr) => (
                        <div key={attr.id} className="grid grid-cols-12 gap-4 p-3 items-center">
                            <div className="col-span-4">
                                <Input
                                    placeholder="Attribute Name"
                                    value={attr.name}
                                    readOnly={attr.isFixed}
                                    className={attr.isFixed ? "bg-muted font-medium" : ""}
                                    onChange={(e) => updateAttribute(attr.id, 'name', e.target.value)}
                                />
                            </div>
                            <div className="col-span-7">
                                <Input
                                    placeholder="Values"
                                    value={attr.values}
                                    onChange={(e) => updateAttribute(attr.id, 'values', e.target.value)}
                                />
                            </div>
                            <div className="col-span-1 flex justify-center">
                                {!attr.isFixed && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                        onClick={() => removeAttribute(attr.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer / Add Button */}
                <div className="p-3 bg-muted/10">
                    <Button variant="ghost" className="text-primary hover:text-primary hover:bg-primary/10 -ml-2 h-8" onClick={addAttribute}>
                        Add a line
                    </Button>
                </div>
            </div>
        </div>
    )
}

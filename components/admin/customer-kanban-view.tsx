"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"

interface Customer {
    id: string
    name: string
    email: string
    phone: string
    avatar: string
}

interface CustomerKanbanViewProps {
    customers: Customer[]
}

export function CustomerKanbanView({ customers }: CustomerKanbanViewProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {customers.map((customer) => (
                <Card key={customer.id} className="bg-card hover:bg-muted/50 transition-colors">
                    <CardContent className="p-6 flex gap-4 items-center">
                        <Avatar className="h-16 w-16">
                            <AvatarImage src={customer.avatar} alt={customer.name} />
                            <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
                        </Avatar>

                        <div className="space-y-1">
                            <div className="text-xs text-muted-foreground uppercase tracking-wider">Customer name</div>
                            <h3 className="font-semibold text-lg leading-none">{customer.name}</h3>
                            <p className="text-sm text-muted-foreground">{customer.email}</p>
                            <p className="text-sm text-muted-foreground">{customer.phone}</p>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

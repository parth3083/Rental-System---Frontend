"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useAppSelector } from "@/redux/hook"
import { Clock, CheckCircle2, CreditCard } from "lucide-react"
import Link from "next/link"

const STATUS_MAP = {
    quotation_pending: { label: 'Quotation Pending', color: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100', icon: Clock },
    payment_pending: { label: 'Payment Pending', color: 'bg-blue-100 text-blue-700 hover:bg-blue-100', icon: CreditCard },
    completed: { label: 'Completed', color: 'bg-green-100 text-green-700 hover:bg-green-100', icon: CheckCircle2 },
    cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700 hover:bg-red-100', icon: Clock },
}

export default function MyOrdersPage() {
    const orders = useAppSelector((state) => state.orders.orders)

    return (
        <div className="container mx-auto py-8 px-4 md:px-8">
            <h1 className="text-2xl font-bold mb-6">My Orders</h1>

            <div className="space-y-6">
                {orders.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        You have no orders yet.
                    </div>
                ) : (
                    orders.map((order) => {
                        const StatusConfig = STATUS_MAP[order.status]

                        return (
                            <Card key={order.id}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <div className="space-y-1">
                                        <CardTitle className="text-base">Order #{order.id}</CardTitle>
                                        <CardDescription>{new Date(order.date).toLocaleDateString()}</CardDescription>
                                    </div>
                                    <Badge className={StatusConfig.color} variant="secondary">
                                        <StatusConfig.icon className="mr-1 h-3 w-3" />
                                        {StatusConfig.label}
                                    </Badge>
                                </CardHeader>
                                <CardContent>
                                    <div className="mt-4 space-y-4">
                                        {order.items && order.items.length > 0 ? (
                                            <div className="space-y-2">
                                                {order.items.map((item: any, i: number) => (
                                                    <div key={i} className="flex justify-between text-sm">
                                                        <span>{item.title} <span className="text-muted-foreground">x{item.quantity}</span></span>
                                                        <span className="font-medium">${item.price}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-sm text-muted-foreground italic">Items details not available</div>
                                        )}

                                        <Separator />

                                        <div className="flex items-center justify-between">
                                            <div className="font-semibold">Total Amount</div>
                                            <div className="text-lg font-bold">${order.total}</div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex justify-end gap-3 mt-4">
                                            <Button variant="outline">View Details</Button>
                                            {order.status === 'payment_pending' && (
                                                <Link href={`/customer/orders/${order.id}/payment`}>
                                                    <Button>Pay Now</Button>
                                                </Link>
                                            )}
                                        </div>

                                        {order.status === 'quotation_pending' && (
                                            <div className="bg-yellow-50 dark:bg-yellow-900/10 text-xs p-3 rounded text-yellow-800 dark:text-yellow-200 mt-2">
                                                Waiting for vendor to accept the quotation. You will be notified once approved.
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })
                )}
            </div>
        </div>
    )
}

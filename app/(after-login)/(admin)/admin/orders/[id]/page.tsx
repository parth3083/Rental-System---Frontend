import { OrderDetailsPage } from "@/components/admin/order-details-page"
import { use } from "react"

export default function Page({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params)
    return <OrderDetailsPage orderId={resolvedParams.id} />
}

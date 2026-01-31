import { ProductDetailsPage } from "@/components/admin/product-details-page"
import { use } from "react"

export default function Page({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params)
    return <ProductDetailsPage productId={resolvedParams.id} />
}

import { InvoiceDetailsPage } from "@/components/admin/invoice-details-page"
import { use } from "react"

export default function Page({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params)
    return <InvoiceDetailsPage invoiceId={resolvedParams.id} />
}

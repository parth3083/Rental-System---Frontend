import { CustomerDetailsPage } from "@/components/admin/customer-details-page";
import { use } from "react";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  return <CustomerDetailsPage customerId={resolvedParams.id} />;
}

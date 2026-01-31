import { AdminNav } from "@/components/admin-nav"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen flex-col">
            <div className="container mx-auto px-4 md:px-8">
                <AdminNav />
                <main className="flex-1">{children}</main>
            </div>
        </div>
    )
}

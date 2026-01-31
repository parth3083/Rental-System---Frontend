import { AdminNav } from "@/components/admin-nav"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex flex-col">
            <div className="border-b bg-white dark:bg-black">
                <div className="flex h-16 items-center px-4 md:px-8">
                    <div className="mr-4 hidden md:flex">
                        <div className="text-xl font-bold mr-8">RentalSys Admin</div>
                        <AdminNav role="admin" />
                    </div>
                    <div className="ml-auto flex items-center space-x-4">
                        {/* UserNav / Search / ThemeToggle would go here */}
                        <div className="h-8 w-8 rounded-full bg-gray-200"></div>
                    </div>
                </div>
            </div>
            <div className="flex-1 space-y-4 p-8 pt-6">
                {children}
            </div>
        </div>
    )
}

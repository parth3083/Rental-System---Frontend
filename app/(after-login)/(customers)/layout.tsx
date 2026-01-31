import { CustomerNav } from "@/components/customer-nav"

export default function CustomerLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex flex-col">
            <div className="border-b bg-white dark:bg-black">
                <div className="flex h-16 items-center px-4 md:px-8 container mx-auto">
                    <CustomerNav />
                    {/* <div className="ml-auto flex items-center space-x-4">
                        Cart / Search / UserNav
                        <span className="text-sm font-medium">Cart (0)</span>
                        <div className="h-8 w-8 rounded-full bg-gray-200"></div>
                    </div> */}
                </div>
            </div>
            <main className="flex-1 container mx-auto py-6">
                {children}
            </main>
        </div>
    )
}

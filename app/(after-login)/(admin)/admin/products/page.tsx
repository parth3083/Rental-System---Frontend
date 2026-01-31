export default function AdminProductsPage() {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Products</h2>
                <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2">
                    Add New Product
                </button>
            </div>
            <div className="rounded-md border p-4">
                <p className="text-sm text-muted-foreground">Product List / Kanban View will appear here.</p>
            </div>
        </div>
    )
}

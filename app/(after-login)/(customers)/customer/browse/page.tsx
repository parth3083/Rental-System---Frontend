export default function CustomerBrowsePage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl">
                    Rent Equipment
                </h1>
                <p className="text-lg text-muted-foreground">
                    Find the perfect gear for your next project or event.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="group relative overflow-hidden rounded-lg border bg-background shadow-md transition-all hover:shadow-lg">
                        <div className="aspect-square bg-muted/50 object-cover transition-transform group-hover:scale-105" />
                        <div className="p-4">
                            <h3 className="text-lg font-semibold">Premium Camera Lens {i + 1}</h3>
                            <p className="text-sm text-muted-foreground">Vendor Name</p>
                            <div className="mt-2 flex items-center justify-between">
                                <span className="font-bold">$49/day</span>
                                <button className="rounded-full bg-primary px-3 py-1 text-xs text-primary-foreground">
                                    Rent
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

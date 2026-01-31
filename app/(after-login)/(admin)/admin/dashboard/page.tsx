export default function AdminDashboardPage() {
    return (
        <div>
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground">
                Welcome to the admin dashboard. Overview of system stats will go here.
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Placeholders for stats cards */}
                <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                    <div className="text-sm font-medium">Total Revenue</div>
                    <div className="text-2xl font-bold">$45,231.89</div>
                </div>
                <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                    <div className="text-sm font-medium">Active Rentals</div>
                    <div className="text-2xl font-bold">+2350</div>
                </div>
            </div>
        </div>
    )
}

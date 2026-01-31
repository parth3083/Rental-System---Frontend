export default function AfterLoginLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
            {/* Authentication check provider could go here */}
            {children}
        </div>
    )
}

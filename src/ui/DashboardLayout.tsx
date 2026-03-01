import Sidebar from '../components/layout/Sidebar'

interface DashboardLayoutProps {
    children: React.ReactNode
}

function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <div className="flex h-screen bg-bg-app overflow-hidden selection:bg-primary/30 relative">
            <Sidebar />
            <main className="flex-1 h-full overflow-y-auto w-full">
                {children}
            </main>
        </div>
    )
}

export default DashboardLayout

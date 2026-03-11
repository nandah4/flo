import { useState } from 'react'
import Sidebar from '../components/layout/Sidebar'
import SearchOverlay from '../components/common/SearchOverlay'

interface DashboardLayoutProps {
    children: React.ReactNode
}

function DashboardLayout({ children }: DashboardLayoutProps) {
    const [searchOpen, setSearchOpen] = useState(false)

    return (
        <div className="flex h-screen bg-bg-app overflow-hidden selection:bg-primary/30 relative">
            <Sidebar onSearchOpen={() => setSearchOpen(true)} />
            <main className="flex-1 h-full overflow-y-auto overflow-x-hidden w-full pb-24 sm:pb-0">
                {children}
            </main>
            <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
        </div>
    )
}

export default DashboardLayout

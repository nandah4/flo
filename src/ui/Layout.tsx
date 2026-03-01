import Header from './Header'
import Footer from './Footer'

function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen bg-bg-app">
            <Header />
            <main className="pt-20">
                {children}
            </main>
            <Footer />
        </div>
    )
}

export default Layout

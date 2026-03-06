import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import floLogo from '../assets/images/flo-logo.png'
const navLinks = [
    { label: 'Home', href: '#hero' },
    { label: 'Features', href: '#features' },
    { label: 'How to Use', href: '#how-to-use' },
    { label: 'Testimonials', href: '#testimonials' },
]

function Header() {
    const [menuOpen, setMenuOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)

    // Detect scroll to show/hide border
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Lock body scroll when menu is open
    useEffect(() => {
        if (menuOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => {
            document.body.style.overflow = ''
        }
    }, [menuOpen])

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        if (href.startsWith('#')) {
            e.preventDefault()
            const targetId = href.replace('#', '')

            setMenuOpen(false)

            setTimeout(() => {
                const targetElement = document.getElementById(targetId)
                if (targetElement) {
                    const headerOffset = 80
                    const elementPosition = targetElement.getBoundingClientRect().top
                    const offsetPosition = elementPosition + window.scrollY - headerOffset

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    })
                }
            }, 50)
        }
    }

    return (
        <>
            {/* Header Bar - always above overlay, sticky at top */}
            <motion.header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 rounded-br-md rounded-bl-md px-6 md:px-10
                    ${isScrolled
                        ? "bg-white border-b border-gray-200"
                        : "bg-bg-app border-b border-transparent"
                    }`}
                initial={{ y: -40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
            >
                <div className="2xl:max-w-[1700px] mx-auto w-full flex justify-between items-center py-5">
                    {/* Logo */}
                    <Link to="/" className="flex gap-3 items-center logo">
                        <img src={floLogo} alt="Flo" className="h-8 md:h-10 object-contain" />
                        <h2 className="text-3xl 2xl:text-4xl font-medium text-text-primary">Flo.</h2>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:block">
                        <ul className="flex gap-x-14">
                            {navLinks.map((link, i) => (
                                <motion.li
                                    key={link.label}
                                    initial={{ y: -10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.15 + i * 0.07, duration: 0.35 }}
                                >
                                    <a
                                        href={link.href}
                                        onClick={(e) => handleNavClick(e, link.href)}
                                        className="text-sm! 2xl:text-base! font-normal! text-text-secondary! transition-colors duration-200"
                                    >
                                        {link.label}
                                    </a>
                                </motion.li>
                            ))}
                        </ul>
                    </nav>
                    {/* </div> */}

                    {/* Desktop CTA */}
                    <motion.div
                        className="hidden md:block"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.35 }}
                    >
                        <Link to="/dashboard" target="_blank">
                            <button className="bg-linear-to-t from-primary to-primary/75 hover:bg-primary! text-text-primary px-4! py-2.5! text-sm! 2xl:text-base! font-medium! cursor-pointer! border-none! hover:scale-105 transition-all duration-300 rounded-md">
                                Get Started
                            </button>
                        </Link>
                    </motion.div>

                    {/* Mobile Hamburger */}
                    <div className="flex items-center gap-4 md:hidden">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.25, duration: 0.3 }}
                        >
                            <Link to="/notes" target="_blank">
                                <button className="w-full bg-linear-to-t from-primary to-primary/75 hover:bg-primary! text-text-primary px-4! py-2.5! text-sm! font-medium! cursor-pointer! border-none! rounded-lg">
                                    Get Started
                                </button>
                            </Link>
                        </motion.div>
                        <button
                            className="md:hidden flex flex-col gap-[5px] bg-transparent! border-none! cursor-pointer! p-2!"
                            onClick={() => setMenuOpen(!menuOpen)}
                            aria-label="Toggle menu"
                        >
                            <motion.span
                                className="block w-5 h-[2px] bg-black rounded-full"
                                animate={menuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                                transition={{ duration: 0.3 }}
                            />
                            <motion.span
                                className="block w-5 h-[2px] bg-black rounded-full"
                                animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
                                transition={{ duration: 0.2 }}
                            />
                            <motion.span
                                className="block w-5 h-[2px] bg-black rounded-full"
                                animate={menuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                                transition={{ duration: 0.3 }}
                            />
                        </button>
                    </div>
                </div>
            </motion.header>

            {/* Overlay*/}
            <AnimatePresence>
                {menuOpen && (
                    <>
                        {/* Dark overlay */}
                        <motion.div
                            className="fixed inset-0 bg-black/50 z-40 md:hidden"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onClick={() => setMenuOpen(false)}
                        />

                        {/* Menu panel */}
                        <motion.div
                            className="fixed top-[70px] left-0 w-full bg-bg-app shadow-md md:hidden z-50 rounded-br-md rounded-bl-md"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                        >
                            <nav className="px-6 py-6">
                                <ul className="flex flex-col gap-3">
                                    {navLinks.map((link, i) => (
                                        <motion.li
                                            key={link.label}
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: i * 0.06, duration: 0.3 }}
                                        >
                                            <a
                                                href={link.href}
                                                onClick={(e) => handleNavClick(e, link.href)}
                                                className="text-lg! font-semibold! text-text-primary! transition-colors duration-200"
                                            >
                                                {link.label}
                                            </a>
                                        </motion.li>
                                    ))}
                                </ul>
                            </nav>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}

export default Header
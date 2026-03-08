import { FiInstagram, FiTwitter, FiYoutube } from "react-icons/fi";
import floLogo from "../assets/images/flo-logo.png";

function Footer() {
    return (
        <footer className="relative mt-20 pt-24 pb-10 overflow-hidden bg-bg-app">


            <div className="relative z-10 w-full max-w-[1920px] mx-auto px-6 md:px-10 2xl:px-20">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-16">
                    {/* Brand Column */}
                    <div className="md:col-span-4 flex items-center lg:items-start flex-col gap-4">
                        <div className="flex justify-center lg:justify-start gap-2.5 items-center logo">
                            <img src={floLogo} alt="Flo" className="h-11 md:h-12 object-contain" />
                            <h2 className="text-2xl 2xl:text-3xl font-normal text-text-secondary">Flo.</h2>
                        </div>
                        <p className="text-text-secondary text-sm md:text-base leading-relaxed max-w-sm text-center lg:text-left">
                            Your smart academic companion. Manage notes, track tasks, and focus better, all in one place.
                        </p>
                    </div>

                    {/* Links Columns */}
                    <div className="md:col-span-8 flex flex-col md:items-end justify-center gap-4 mt-6 md:mt-0">
                        <h4 className="font-medium! text-text-primary text-center md:text-right">Quick Links</h4>
                        <div className="flex flex-wrap gap-x-8 gap-y-4 justify-center md:justify-end">
                            <a href="#hero" className="text-text-secondary! hover:text-primary! transition-colors text-sm md:text-base font-normal">Home</a>
                            <a href="#features" className="text-text-secondary! hover:text-primary! transition-colors text-sm md:text-base font-normal">Features</a>
                            <a href="#how-to-use" className="text-text-secondary! hover:text-primary! transition-colors text-sm md:text-base font-normal">How to Use</a>
                            <a href="#testimonials" className="text-text-secondary! hover:text-primary! transition-colors text-sm md:text-base font-normal">Testimonials</a>
                        </div>
                    </div>
                </div>

                {/* Sub-footer */}
                <div className="pt-8 border-t border-gray-300 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-sm font-normal md:text-base text-text-secondary">
                        &copy; {new Date().getFullYear()} Flo. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4">
                        <a href="#" className="w-10 h-10 md:w-11 md:h-11 rounded-lg bg-primary/20 flex items-center justify-center text-secondary!">
                            <FiInstagram size={20} />
                        </a>
                        <a href="#" className="w-10 h-10 md:w-11 md:h-11 rounded-lg bg-primary/20 flex items-center justify-center text-secondary!">
                            <FiTwitter size={20} />
                        </a>
                        <a href="#" className="w-10 h-10 md:w-11 md:h-11 rounded-lg bg-primary/20 flex items-center justify-center text-secondary!">
                            <FiYoutube size={20} />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer

import { FiInstagram, FiTwitter, FiYoutube } from "react-icons/fi";

function Footer() {
    return (
        <footer className="relative mt-20 pt-24 pb-10 overflow-hidden bg-bg-app">


            <div className="relative z-10 w-full 2xl:max-w-[1700px] mx-auto px-6 md:px-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-16">
                    {/* Brand Column */}
                    <div className="md:col-span-4 flex flex-col gap-4">
                        <h2 className="text-4xl font-semibold text-text-primary mb-2 text-center lg:text-left">Flo.</h2>
                        <p className="text-text-secondary text-sm md:text-base leading-relaxed max-w-sm text-center lg:text-left">
                            Your smart academic companion. Manage notes, track tasks, and focus better, all in one place.
                        </p>
                    </div>

                    {/* Links Columns */}
                    <div className="md:col-span-8 flex flex-col md:items-end justify-center gap-4 mt-6 md:mt-0">
                        <h4 className="font-semibold text-text-primary text-center md:text-right">Quick Links</h4>
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
                    <p className="text-sm font-normal md:text-base text-text-primary">
                        &copy; {new Date().getFullYear()} Flo. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4">
                        <a href="#" className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-text-primary! hover:shadow-md transition-all">
                            <FiInstagram size={18} />
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-text-primary! hover:shadow-md transition-all">
                            <FiTwitter size={18} />
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-text-primary! hover:shadow-md transition-all">
                            <FiYoutube size={18} />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer

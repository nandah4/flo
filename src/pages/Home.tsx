
"use client";

import { motion, AnimatePresence, useScroll, useTransform, useSpring, type Variants } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { FaTrophy, FaBullseye, FaBrain, FaClock } from "react-icons/fa";


import Layout from '../ui/Layout'
import bgHero from '../assets/images/bg-hero.png'
// import aiAssistant from './assets/images/icon-ai-assistant.png'
import fAIAssistant from '../assets/images/assets-ai-assistant.png'
import fNotesAi from '../assets/images/f-notes-ai.png'
import fNotesTask from '../assets/images/assets-task-management.png'
import fNotesFlashcard from '../assets/images/assets-flashcards.png'
import fPomodoro from '../assets/images/assets-pomodoro.png'


import testimonial1 from '../assets/images/testi-1.jpeg'
import testimonial2 from '../assets/images/testi-2.jpeg'
import testimonial3 from '../assets/images/testi-3.jpeg'
import testimonial4 from '../assets/images/testi-4.jpeg'
import testimonial5 from '../assets/images/testi-5.jpeg'


import {
    FiHome,
    FiLayout,
    FiFileText,
    FiUpload,
    FiEdit3
} from "react-icons/fi";

import whyChooseUsImage from '../assets/images/why-choose-us.png'

const emojis = ["📚", "📝", "💻", "🎓", "✏️"];


const container: Variants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.1,
        },
    },
};

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 24, filter: "blur(4px)" },
    show: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
};

const STEPS = [
    {
        icon: <FiHome />,
        title: "Open Flo",
        description:
            'Head to the Flo homepage and click "Try Flo" or "Get Started" to begin your journey.',
    },
    {
        icon: <FiLayout />,
        title: "Enter the Dashboard",
        description:
            "You'll land on your personal dashboard — your central hub for everything academic.",
    },
    {
        icon: <FiFileText />,
        title: "Go to Notes",
        description:
            "Navigate to the Notes section from the sidebar or the quick-access menu.",
    },
    {
        icon: <FiUpload />,
        title: "Add Notes or Upload a PDF",
        description:
            'Click "Add Note" to start writing, or upload a PDF/Word file to auto-summarize.',
    },
    {
        icon: <FiEdit3 />,
        title: "Start Writing",
        description:
            "Write freely, let Flo's AI assist you, and watch your notes become smarter over time.",
    },
];

function HowToUseSteps() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start 0.8", "end 0.3"],
    });
    const scaleY = useSpring(scrollYProgress, { stiffness: 80, damping: 20 });

    return (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12" ref={containerRef}>
            {/* Title and description */}
            <div className="hidden md:flex md:col-span-2 flex-col justify-start pt-1">
                <h2 className="text-3xl lg:text-4xl font-medium text-text-primary mb-4 text-left">Get Started in Minutes.</h2>
                <p className="text-sm sm:text-base w-[80%] text-text-secondary text-left">
                    From sign-up to your first smart note — Flo makes it effortless. Here's how.
                </p>
            </div>

            {/* steps with vertical progress */}
            <div className="md:col-span-3">
                <div className="relative flex gap-10">
                    {/* Segmented vertical track column */}
                    <div className="hidden sm:flex flex-col flex-none gap-8">
                        {STEPS.map((_, i) => {
                            const from = i / STEPS.length;
                            const to = (i + 1) / STEPS.length;
                            const fillH = useTransform(scaleY, [from, to], ["0%", "100%"]);
                            return (
                                <div key={i} className="relative w-[3px] flex-1 bg-gray-200 rounded-full min-h-[80px]">
                                    <motion.div
                                        className="absolute top-0 left-0 right-0 bg-primary rounded-full origin-top"
                                        style={{ height: fillH }}
                                    />
                                </div>
                            );
                        })}
                    </div>

                    {/* Steps list */}
                    <div className="flex flex-col gap-2">
                        {STEPS.map((step, i) => (
                            <motion.div
                                key={i}
                                className="flex items-center gap-5 flex-1 min-h-[80px]"
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-60px" }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                            >
                                <div className="w-10 h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 xl:w-14 xl:h-14 shrink-0 rounded-lg xl:rounded-xl bg-primary/10 text-sm md:text-base lg:text-lg xl:text-2xl text-primary flex items-center justify-center">
                                    {step.icon}
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <h4 className="text-base sm:text-lg font-medium text-text-primary">{step.title}</h4>
                                    <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

const TESTIMONIALS = [
    {
        image: testimonial3,
        quote: "Flo completely changed how I handle my assignments. The AI assistant helps me break down complex topics instantly, and I never miss a deadline anymore.",
        name: "Anya Maharani",
        school: "Universitas Indonesia",
        initials: "AM",
    },
    {
        image: testimonial2,
        quote: "I used to spend hours making flashcards. Now I just upload my PDF and Flo does it for me in seconds. It's honestly insane how much time I save every week.",
        name: "Rizky Pratama",
        school: "Institut Teknologi Bandung",
        initials: "RP",
    },
    {
        image: testimonial4,
        quote: "The Pomodoro timer combined with the notes feature keeps me in the zone. I've never been this consistent with studying before.",
        name: "Siti Nuraini",
        school: "Universitas Gadjah Mada",
        initials: "SN",
    },
    {
        image: testimonial1,
        quote: "What I love most is how everything is in one place. Notes, tasks, timers — no more switching between five different apps just to stay organized.",
        name: "Daffa Wirawan",
        school: "Universitas Brawijaya",
        initials: "DW",
    },
    {
        image: testimonial5,
        quote: "Flo's AI actually understands what I need. I described a project and it helped me build a full study plan. It felt like having a personal academic coach.",
        name: "Laila Azzahra",
        school: "Universitas Airlangga",
        initials: "LA",
    },
];

function TestimonialsCarousel() {
    const [active, setActive] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setActive((prev) => (prev + 1) % TESTIMONIALS.length);
        }, 7000);
        return () => clearInterval(timer);
    }, []);

    const current = TESTIMONIALS[active];

    return (
        <div className="flex flex-col items-center gap-10">
            {/* Quote + attribution */}
            <div className="flex flex-col items-center gap-6 min-h-[200px] sm:min-h-[160px] mt-16 sm:mt-20 lg:mt-30">
                <AnimatePresence mode="wait">
                    <motion.p
                        key={active}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="text-center max-w-4xl text-xl sm:text-2xl md:text-3xl font-normal text-text-secondary leading-snug px-4"
                    >
                        "{current.quote}"
                    </motion.p>
                </AnimatePresence>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={`meta-${active}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col items-center gap-0.5 mt-14"
                    >
                        <span className="text-sm sm:text-base lg:text-lg font-medium text-text-primary">{current.name}</span>
                        <span className="text-xs sm:text-sm lg:text-base text-gray-400">{current.school}</span>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Avatar selectors */}
            <div className="flex items-end gap-4 sm:gap-5">
                {TESTIMONIALS.map((t, i) => {
                    const isActive = i === active;
                    return (
                        <motion.button
                            key={i}
                            onClick={() => setActive(i)}
                            animate={{
                                y: isActive ? -10 : 0,
                                opacity: isActive ? 1 : 0.35,
                                scale: isActive ? 1 : 0.88,
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 24 }}
                            className={`relative overflow-hidden flex-none rounded-full! cursor-pointer transition-shadow p-0!
                                ${isActive
                                    ? "w-14 h-14 sm:w-16 sm:h-16 shadow-lg shadow-primary/30 ring-2 ring-primary ring-offset-2"
                                    : "w-11 h-11 sm:w-12 sm:h-12"
                                }`}
                        >
                            <img
                                src={t.image}
                                alt={t.name}
                                className="block w-full h-full object-cover"
                            />
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}

function Home() {
    const [emojiIndex, setEmojiIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setEmojiIndex((prev) => (prev + 1) % emojis.length);
        }, 5800);
        return () => clearInterval(interval);
    }, []);



    return (
        <Layout>
            {/* Section Hero */}
            <section id="hero" className="relative px-6 md:px-10 w-full pt-14 min-h-[70vh] md:h-screen flex flex-col items-center">
                {/* Hero Background Elements */}
                <div className="absolute -bottom-25 left-0 right-0 w-full h-full z-0 pointer-events-none">
                    <div className="absolute inset-0 bg-linear-to-t from-transparent to-bg-app h-10 z-10"></div>
                    <img
                        src={bgHero}
                        alt="Hero Background"
                        className="w-full h-full object-cover object-top opacity-50"
                    />
                </div>

                <motion.div
                    className="relative z-10 flex flex-col items-center justify-center gap-y-6 md:gap-y-8 max-w-3xl 2xl:max-w-4xl mx-auto mt-8 md:mt-0"
                    variants={container}
                    initial="hidden"
                    animate="show"
                >
                    {/* Badge */}
                    <motion.div variants={fadeUp}>
                        <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-gray-200 bg-white text-secondary  text-xs font-medium tracking-wide uppercase text-center">
                            <FaTrophy className="md:text-md text-xs shrink-0" />
                            1st Student Productivity Tool
                        </span>
                    </motion.div>

                    <div className="flex flex-col gap-y-4">
                        {/* Heading */}
                        <motion.h1
                            variants={fadeUp}
                            className="font-medium text-center text-text-primary text-4xl! sm:text-5xl! md:text-[3.5rem]! leading-[1.2] md:leading-[1.1] tracking-tight"
                        >
                            Take C
                            <span className="relative inline-flex text-3xl sm:text-4xl items-center justify-center bg-linear-to-t from-primary to-primary/50 border border-primary text-white mx-1 sm:mx-1.5 h-12 w-12 sm:h-16 sm:w-16 rounded-xl sm:rounded-2xl rotate-4 overflow-hidden"
                                style={{ minWidth: "2.5rem", verticalAlign: "middle" }}
                            >
                                <AnimatePresence mode="popLayout">
                                    <motion.span
                                        key={emojiIndex}
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: -20, opacity: 0 }}
                                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                                        className="inline-block"
                                    >
                                        {emojis[emojiIndex]}
                                    </motion.span>
                                </AnimatePresence>
                            </span>
                            ntrol of Your Academic Life with Flo.
                        </motion.h1>

                        {/* Description */}
                        <motion.p
                            variants={fadeUp}
                            className="text-center text-sm sm:text-base text-text-secondary px-4 md:px-0"
                        >
                            Flo is your all-in-one productivity tool built for students. Plan
                            assignments, track deadlines, manage daily tasks, and never miss what
                            matters most.
                        </motion.p>
                    </div>

                    <motion.div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4 px-4 sm:px-0">
                        <button className="w-full sm:w-auto bg-linear-to-t from-primary to-primary/75 hover:bg-primary! text-text-primary px-6! py-3.5! text-sm! font-medium! cursor-pointer! border-none! hover:scale-105 transition-all duration-300 rounded-lg!">Try Flo Now</button>
                        <button className="w-full sm:w-auto bg-white border! border-gray-200! text-text-primary px-6! py-3.5! text-sm! font-medium! cursor-pointer! hover:scale-105 transition-all duration-300 rounded-lg!">Watch Video</button>
                    </motion.div>
                </motion.div>

            </section>

            {/* Section Video */}
            <section className="relative z-10 md:px-10 -mt-12 sm:-mt-56 ">
                <div className="p-2.5 md:p-3.5 max-w-[90%] md:max-w-7xl mx-auto h-[300px] sm:h-[400px] md:h-[600px] bg-white/50 backdrop-blur-xs rounded-2xl md:rounded-4xl border border-white shadow-sm">
                    <div className="h-full w-full bg-white rounded-2xl md:rounded-3xl"></div>
                </div>

            </section>


            {/* Section How We Help You */}
            <section id="features" className="mt-16 sm:mt-24 px-6 md:px-10 mx-auto">
                <div className="2xl:max-w-7xl  mx-auto">
                    <h2 className="text-3xl sm:text-4xl font-medium text-text-primary mb-8 sm:mb-10 text-center md:text-left">How Flo Helps You Stay on Track.</h2>

                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col lg:grid lg:grid-cols-5 gap-4">
                            {/* Your 24/7 Academic Assistant */}
                            <div className="lg:col-span-2 bg-white rounded-2xl overflow-hidden">
                                <div className="h-56 sm:h-48 w-full flex items-center justify-center p-4">
                                    {/* Image with infinite tilt */}
                                    <img
                                        src={fAIAssistant}
                                        alt="AI Assistant"
                                        className="h-16 sm:h-20 md:h-24 lg:h-28 object-cover shrink-0"
                                    />
                                </div>
                                <div className="p-5 sm:p-6 lg:p-8">
                                    <h4 className="text-lg sm:text-xl font-medium text-text-primary mb-2 sm:mb-3 text-center lg:text-left">Your 24/7 Academic Assistant</h4>
                                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed text-center lg:text-left">Stuck on an assignment? Need guidance? Flo's AI Assistant helps you brainstorm ideas, clarify tasks, and stay on track anytime you need support.</p>
                                </div>
                            </div>

                            {/* Smart Notes That Think With You */}
                            <div className="lg:col-span-3 bg-white rounded-2xl overflow-hidden">
                                <div className="h-48 sm:h-56 w-full flex items-center justify-center overflow-hidden">
                                    <div className="flex items-center md:w-[55%] h-full">
                                        {/* Image */}
                                        <div className="h-full w-full flex items-center justify-center pt-8 px-4 sm:px-8">
                                            <img
                                                src={fNotesAi}
                                                alt="AI Smart Notes"
                                                className="w-full h-full object-cover object-top rounded-t-xl sm:rounded-t-2xl"
                                            />
                                        </div>
                                    </div>

                                </div>
                                <div className="p-5 sm:p-6 lg:p-8">
                                    <h4 className="text-lg sm:text-xl font-medium text-text-primary mb-2 sm:mb-3 text-center lg:text-left">Smart Notes That Think With You</h4>
                                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed text-center lg:text-left">Write notes manually or upload your PDF and Word files to instantly generate summaries and AI-powered reviews. Flo helps you understand faster, organize better, and study smarter.</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col lg:grid lg:grid-cols-6 gap-4">

                            {/* Plan */}
                            <div className="lg:col-span-2 bg-white rounded-2xl overflow-hidden">
                                <div className="h-48 sm:h-56 w-full flex items-center justify-center">
                                    {/* Image with infinite tilt */}
                                    <img
                                        src={fNotesTask}
                                        alt="Flashcards"
                                        className="h-16 sm:h-20 md:h-24 lg:h-28 object-cover"
                                    />

                                </div>
                                <div className="p-5 sm:p-6 lg:p-8">
                                    <h4 className="text-lg sm:text-xl font-medium text-text-primary mb-2 sm:mb-3 text-center lg:text-left">Plan Every Task with Clarity</h4>
                                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed text-center lg:text-left">Add tasks manually or describe what you need to do—Flo helps you break them down into clear steps.</p>
                                </div>
                            </div>

                            {/* Focus Deep. Finish Faster. */}
                            <div className="lg:col-span-2 bg-white rounded-2xl overflow-hidden">
                                <div className="h-48 sm:h-56 w-full flex items-center justify-center">


                                    <motion.img
                                        src={fPomodoro}
                                        alt="Focus Timer"
                                        className="h-16 sm:h-20 md:h-24 lg:h-28 object-cover"
                                        animate={{ rotate: [0, 4, 0, -4, 0] }}
                                        transition={{
                                            duration: 3,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                        }}
                                    />


                                </div>
                                <div className="p-5 sm:p-6 lg:p-8">
                                    <h4 className="text-lg sm:text-xl font-medium text-text-primary mb-2 sm:mb-3 text-center lg:text-left">Focus Deep. Finish Faster.</h4>
                                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed text-center lg:text-left">Use the built-in Pomodoro timer to stay focused and productive.</p>
                                </div>
                            </div>

                            {/* Turn Notes into Flashcards Instantly */}
                            <div className="lg:col-span-2 bg-white rounded-2xl overflow-hidden">
                                <div className="h-48 sm:h-56 w-full flex items-center justify-center">

                                    {/* Image with infinite tilt */}
                                    <img
                                        src={fNotesFlashcard}
                                        alt="Flashcards"
                                        className="h-16 sm:h-20 md:h-24 lg:h-28 object-cover"

                                    />


                                </div>
                                <div className="p-5 sm:p-6 lg:p-8">
                                    <h4 className="text-lg sm:text-xl font-medium text-text-primary mb-2 sm:mb-3 text-center lg:text-left">Turn Notes into Flashcards Instantly</h4>
                                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed text-center lg:text-left">Transform your notes into ready-to-use flashcards with one click.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </section>


            {/* Why choose Flo */}
            <section className="mt-20 sm:mt-32 px-6 md:px-10">
                <div className="2xl:max-w-7xl mx-auto">
                    <div className="flex flex-col items-center mb-12 md:mb-20">
                        <h2 className="text-3xl sm:text-4xl font-medium text-text-primary mb-4 text-center">Why Choose Flo?</h2>
                        <p className="text-center max-w-2xl text-sm sm:text-base text-text-secondary px-4 md:px-0">
                            Experience a productivity tool designed specifically for students, bringing everything you need into one smart platform.
                        </p>
                    </div>

                    {/* Mobile (< md): stacked list, same icon/text style */}
                    <div className="flex flex-col gap-8 md:hidden">
                        {/* Image */}
                        <div className="w-48 h-48 sm:w-56 sm:h-56 mx-auto rounded-t-full">
                            <img src={whyChooseUsImage} alt="Student using Flo" className="w-full h-full object-cover" />
                        </div>
                        {/* Features */}
                        {[
                            { Icon: FaBullseye, title: "Built for Students, Not Just Users", desc: "Flo is designed specifically for academic life—assignments, deadlines, exams, and daily campus routines. Everything fits the way students actually work." },
                            { Icon: FaBrain, title: "Smarter Productivity with AI", desc: "Flo doesn't just store your tasks — it helps you prioritize, organize, and stay focused." },
                            { Icon: FaClock, title: "Simple, Clean, and Distraction-Free", desc: "Built-in Pomodoro timers and distraction-free modes to maximize your study sessions." },
                        ].map(({ Icon, title, desc }, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.15 }}
                                className="flex flex-col items-center text-center"
                            >
                                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center mb-3">
                                    <Icon className="text-primary text-xl" />
                                </div>
                                <h4 className="font-medium text-text-primary text-base mb-2">{title}</h4>
                                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Arc layout */}
                    <div className="hidden md:block ">
                        <div className="relative w-full max-w-5xl mx-auto h-[500px] lg:h-[560px] xl:h-[620px] flex items-end justify-center">

                            {/* Semi-circle guide */}
                            <div className="absolute bottom-0
                                w-[640px] h-[320px]
                                md:w-[740px] md:h-[370px]
                                lg:w-[900px] lg:h-[450px]
                                xl:w-[1060px] xl:h-[530px]
                                border-t border-x border-dashed border-gray-200 rounded-t-full pointer-events-none" />

                            {/* Center Image */}
                            <div className="relative z-10
                                w-52 h-52
                                md:w-64 md:h-64
                                lg:w-80 lg:h-80
                                xl:w-96 xl:h-96
                                rounded-t-full overflow-hidden flex items-center justify-center">
                                <img
                                    src={whyChooseUsImage}
                                    alt="Student using Flo"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Feature 1: Left */}
                            <motion.div
                                initial={{ opacity: 0, x: -50, y: 50 }}
                                whileInView={{ opacity: 1, x: 0, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="absolute
                                    bottom-16 left-0
                                    md:bottom-20 md:left-0
                                    lg:bottom-24 lg:-left-10
                                    xl:bottom-28 xl:-left-16
                                    max-w-[180px] md:max-w-[220px] lg:max-w-[270px] xl:max-w-[310px]
                                    z-20"
                            >
                                <div className="w-10 h-10 md:w-11 md:h-11 rounded-lg bg-primary/20 flex items-center justify-center mb-3">
                                    <FaBullseye className="text-primary text-lg md:text-xl" />
                                </div>
                                <h4 className="font-medium text-text-primary mb-2 text-sm md:text-base lg:text-lg">Built for Students, Not Just Users</h4>
                                <p className="text-xs md:text-sm text-gray-500 leading-relaxed">Flo is designed specifically for academic life—assignments, deadlines, exams, and daily campus routines. Everything fits the way students actually work.</p>
                            </motion.div>

                            {/* Feature 2: Top Center */}
                            <motion.div
                                initial={{ opacity: 0, y: -50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="absolute
                                    top-6
                                    md:top-4
                                    lg:top-0
                                    xl:-top-4
                                    left-1/2 -translate-x-1/2
                                    max-w-[180px] md:max-w-[220px] lg:max-w-[270px] xl:max-w-[310px]
                                    z-20"
                            >
                                <div className="w-10 h-10 md:w-11 md:h-11 rounded-lg bg-primary/20 flex items-center justify-center mb-3">
                                    <FaBrain className="text-primary text-lg md:text-xl" />
                                </div>
                                <h4 className="font-medium text-text-primary mb-2 text-sm md:text-base lg:text-lg">Smarter Productivity with AI</h4>
                                <p className="text-xs md:text-sm text-gray-500 leading-relaxed">Flo doesn't just store your tasks — it helps you prioritize, organize, and stay focused.</p>
                            </motion.div>

                            {/* Feature 3: Right */}
                            <motion.div
                                initial={{ opacity: 0, x: 50, y: 50 }}
                                whileInView={{ opacity: 1, x: 0, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.6 }}
                                className="absolute
                                    bottom-16 right-0
                                    md:bottom-20 md:right-0
                                    lg:bottom-24 lg:-right-10
                                    xl:bottom-28 xl:-right-16
                                    max-w-[180px] md:max-w-[220px] lg:max-w-[270px] xl:max-w-[310px]
                                    z-20"
                            >
                                <div className="w-10 h-10 md:w-11 md:h-11 rounded-lg bg-primary/20 flex items-center justify-center mb-3">
                                    <FaClock className="text-primary text-lg md:text-xl" />
                                </div>
                                <h4 className="font-medium text-text-primary mb-2 text-sm md:text-base lg:text-lg">Simple, Clean, and Distraction-Free</h4>
                                <p className="text-xs md:text-sm text-gray-500 leading-relaxed">Built-in Pomodoro timers and distraction-free modes to maximize your study sessions.</p>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section How to Use */}
            <section id="how-to-use" className="mt-20 sm:mt-32 px-6 md:px-10">
                <div className="2xl:max-w-7xl mx-auto">
                    {/* Mobile-only header*/}
                    <div className="md:hidden flex flex-col items-center mb-10">
                        <h2 className="text-3xl sm:text-4xl font-medium text-text-primary mb-4 text-center">Get Started in Minutes.</h2>
                        <p className="text-center max-w-2xl text-sm sm:text-base text-text-secondary">
                            From sign-up to your first smart note — Flo makes it effortless. Here's how.
                        </p>
                    </div>

                    <HowToUseSteps />
                </div>
            </section>


            {/* Testimonials */}
            <section id="testimonials" className="mt-20 sm:mt-32 px-6 md:px-10">
                <div className="2xl:max-w-7xl mx-auto">
                    <h2
                        className="text-3xl sm:text-4xl font-medium text-text-primary text-center"
                    >
                        Loved by Students Everywhere
                    </h2>
                    <motion.div
                        initial={{ opacity: 0, y: 32 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                    >
                        <TestimonialsCarousel />
                    </motion.div>
                </div>
            </section>
        </Layout>
    )
}

export default Home

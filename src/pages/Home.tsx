
"use client";

import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaTrophy } from "react-icons/fa";


import Layout from '../ui/Layout'
import bgHero from '../assets/images/bg-hero.png'
import fAIAssistant from '../assets/images/assets-ai-assistant.png'
import notesPic from '../assets/images/notes-pic.png'
import notesVideoStep from '../assets/videos/notes-video.mp4'

import featureSmartNotesImage from "../assets/images/feature-smart-notes.png"
import featureTaskManagementImage from "../assets/images/feature-tasks.png"
import featurePomodoroImage from "../assets/images/feature-pomodoro.png"
import featureCalendarImage from "../assets/images/feature-planning.png"

import { CopyCheck, Bot, BellOff, Play, LogInIcon } from "lucide-react"

import testimonial1 from '../assets/images/testi-1.jpeg'
import testimonial2 from '../assets/images/testi-2.jpeg'
import testimonial3 from '../assets/images/testi-3.jpeg'
import testimonial4 from '../assets/images/testi-4.jpeg'
import testimonial5 from '../assets/images/testi-5.jpeg'

import videoNotes from '../assets/videos/video.mov';


import whyChooseUsImage from '../assets/images/why-choose-us.png'
import { Highlighter } from "@/components/ui/highlighter";

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



function HowToUseSteps() {
    return (
        <div className="flex flex-col gap-5">
            {/* Title and description */}
            <div className="flex flex-col md:items-start mb-6 text-center md:text-left">
                <h2 className="text-3xl lg:text-4xl font-medium text-text-primary mb-4">Start organizing in seconds.</h2>
                <p className="text-sm sm:text-base text-text-secondary max-w-2xl">
                    From signing up to writing your first smart note — Flo makes productivity effortless. See how fast it is.
                </p>
            </div>

            {/* Row 1 */}
            <div className="flex flex-col lg:grid lg:grid-cols-5 gap-5">
                {/* Col 1: Step 1 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="lg:col-span-2 bg-white rounded-2xl overflow-hidden p-6 lg:p-8 flex flex-col justify-center "
                >
                    <div className="flex flex-col gap-2 relative z-10">
                        <h4 className="text-lg sm:text-xl font-medium text-text-primary mb-2 sm:mb-3 text-center lg:text-left">Click Get Started or Try Flo Now</h4>
                        <p className="text-sm sm:text-base text-text-secondary leading-relaxed mb-6 text-center lg:text-left">
                            Enter your dashboard, open the Notes tab from the sidebar, and start writing your first note in seconds.
                        </p>

                    </div>
                </motion.div>

                {/* Col 2: Step 2 Video + Action  */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-3 bg-white rounded-2xl overflow-hidden  flex flex-col"
                >
                    <div className="w-full bg-gray-50 flex items-center justify-center relative overflow-hidden">
                        <video
                            src={notesVideoStep}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-auto z-10 pointer-events-none"
                        />
                    </div>
                </motion.div>
            </div>

            {/* Row 2 */}
            <div className="flex flex-col lg:grid lg:grid-cols-5 gap-5 ">
                {/* Col 1: Step 3 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-3 bg-white rounded-2xl overflow-hidden flex flex-col items-center"
                >
                    <div className="w-full bg-gray-50  flex items-center justify-center relative overflow-hidden">
                        <img
                            src={notesPic}
                            alt="Dashboard Overview"
                            className="w-full h-auto z-10 pointer-events-none"
                        />
                    </div>

                </motion.div>

                {/* Col 2: Step 4 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="lg:col-span-2 bg-white rounded-2xl overflow-hidden p-6 lg:p-8 flex flex-col justify-center "
                >
                    <div className="flex flex-col gap-2 relative z-10">
                        <h4 className="text-lg sm:text-xl font-medium text-text-primary mb-2 sm:mb-3 text-center lg:text-left">
                            You’re all set
                        </h4>

                        <p className="text-sm sm:text-base text-text-secondary leading-relaxed mb-6 text-center lg:text-left">
                            Explore tasks, focus sessions, and planning tools to stay organized in both academic and daily life.
                        </p>
                    </div>
                </motion.div>
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
                        className="text-center max-w-5xl text-xl sm:text-2xl md:text-3xl font-normal text-text-secondary leading-snug px-4"
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
            <section id="hero" className="relative px-6 md:px-10 w-full pt-14 min-h-[75vh] 2xl:h-fit flex flex-col items-center">
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

                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4 px-4 sm:px-0">
                        <Link to="/dashboard" className="w-full sm:w-auto">
                            <button className="w-full h-full bg-linear-to-t from-primary to-primary/75 hover:bg-primary! text-text-primary px-6! py-3! text-sm! font-medium! cursor-pointer! border-none! hover:scale-105 transition-all duration-300 rounded-lg! flex items-center justify-center gap-2">
                                <LogInIcon size={16} className="inline-block" /> Try Flo Now
                            </button>
                        </Link>
                        <button
                            onClick={() => {
                                const el = document.getElementById('video-section');
                                if (el) {
                                    const headerOffset = 80;
                                    const elementPosition = el.getBoundingClientRect().top;
                                    window.scrollTo({
                                        top: elementPosition + window.scrollY - headerOffset,
                                        behavior: 'smooth'
                                    });
                                }
                            }}
                            className="w-full sm:w-auto bg-white border! border-gray-200! text-text-primary px-6! py-3! text-sm! font-medium! cursor-pointer! hover:scale-105 transition-all duration-300 rounded-lg! flex items-center justify-center gap-2"><Play size={16} className="inline-block" /> Watch Video </button>
                    </div>
                </motion.div>

            </section>

            {/* Section Video */}
            <section id="video-section" className="relative z-10 md:px-10 mt-5 sm:-mt-32 lg:-mt-20  2xl:-mt-40">

                <div className="w-[90%] md:w-full max-w-[1200px] 2xl:max-w-[1520px] mx-auto aspect-13/7 bg-white/50 backdrop-blur-xs rounded-xl md:rounded-4xl overflow-hidden  shadow-lg">
                    <video
                        src={videoNotes}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover z-10 pointer-events-none"
                    />
                </div>

            </section>


            {/* Section How We Help You */}
            <section id="features" className="mt-16 sm:mt-24 px-6 md:px-10 2xl:px-20 mx-auto">
                <div className="max-w-[1920px] mx-auto transition-all">
                    <h2 className="text-3xl sm:text-4xl font-medium text-text-primary mb-8 sm:mb-10 text-center md:text-left">How Flo Helps You Stay on Track.</h2>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col lg:grid lg:grid-cols-5 gap-4">
                            {/* Your 24/7 Academic Assistant */}
                            <div className="lg:col-span-2 bg-white rounded-2xl overflow-hidden">
                                <div className="h-48 sm:h-56 w-full  flex items-center justify-center p-4">
                                    <img
                                        src={fAIAssistant}
                                        alt="AI Assistant"
                                        className="h-24 md:h-24 lg:h-28 xl:h-32 object-cover shrink-0"
                                    />
                                </div>
                                <div className="p-5 sm:p-6 lg:p-8">
                                    <h4 className="text-lg sm:text-xl font-medium text-text-primary mb-2 sm:mb-3 text-center lg:text-left">Flo, Your 24/7 Academic Assistant</h4>
                                    <p className="text-xs sm:text-sm xl:text-base text-text-secondary leading-relaxed text-center lg:text-left">Stuck on an assignment? Flo helps you brainstorm ideas, review your tasks and notes, and keep your academic work on track.</p>
                                </div>
                            </div>

                            {/* Smart Notes That Think With You */}
                            <div className="lg:col-span-3 bg-white rounded-2xl overflow-hidden">
                                <div className="h-48 sm:h-56  w-full flex items-center justify-center overflow-hidden">
                                    <div className="flex items-center h-full">
                                        {/* Image */}
                                        <div className="max-w-[80%] max-h-[80%] mx-auto flex items-center justify-center pt-8 px-4 sm:px-8">
                                            <img
                                                src={featureSmartNotesImage}
                                                alt="AI Smart Notes"
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                    </div>

                                </div>
                                <div className="p-5 sm:p-6 lg:p-8">
                                    <h4 className="text-lg sm:text-xl font-medium text-text-primary mb-2 sm:mb-3 text-center lg:text-left">Turn Anything Into Smart Notes</h4>
                                    <p className="text-xs sm:text-sm xl:text-base text-text-secondary leading-relaxed text-center lg:text-left">Upload documents or voice notes to generate summaries, refine your writing, and turn key ideas into flashcards for smarter studying.</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col lg:grid lg:grid-cols-6 gap-4">

                            {/* Plan */}
                            <div className="lg:col-span-2 bg-white rounded-2xl overflow-hidden">
                                <div className="h-48 sm:h-56 w-full flex items-center justify-center">
                                    <img
                                        src={featureTaskManagementImage}
                                        alt="Flashcards"
                                        className="h-20 sm:h-24 md:h-28 object-cover"
                                    />

                                </div>
                                <div className="p-5 sm:p-6 lg:p-8">
                                    <h4 className="text-lg sm:text-xl font-medium text-text-primary mb-2 sm:mb-3 text-center lg:text-left">Plan Your Tasks Smarter</h4>
                                    <p className="text-xs sm:text-sm xl:text-base text-gray-600 leading-relaxed text-center lg:text-left">Turn your ideas into organized tasks, break them into steps, and track your progress until every assignment is complete.</p>
                                </div>
                            </div>

                            {/* Focus Deep. Finish Faster. */}
                            <div className="lg:col-span-2 bg-white rounded-2xl overflow-hidden">
                                <div className="h-48 sm:h-56 w-full flex items-center justify-center">


                                    <motion.img
                                        src={featurePomodoroImage}
                                        alt="Focus Timer"
                                        className="h-20 sm:h-24 md:h-28  object-cover"
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
                                    <p className="text-xs sm:text-sm xl:text-base text-gray-600 leading-relaxed text-center lg:text-left">Enter Zen Mode with a built-in Pomodoro timer. Stay fully focused and capture quick notes during each focus session.</p>
                                </div>
                            </div>

                            {/* Turn Notes into Flashcards Instantly */}
                            <div className="lg:col-span-2 bg-white rounded-2xl overflow-hidden">
                                <div className="h-48 sm:h-56 w-full flex items-center justify-center">

                                    {/* Image with infinite tilt */}
                                    <img
                                        src={featureCalendarImage}
                                        alt="Flashcards"
                                        className="h-24 sm:h-28 md:h-28 lg:h-32 xl:h-40 sm:translate-y-4 object-cover"

                                    />


                                </div>
                                <div className="p-5 sm:p-6 lg:p-8">
                                    <h4 className="text-lg sm:text-xl font-medium text-text-primary mb-2 sm:mb-3 text-center lg:text-left">Planning Your Activities</h4>
                                    <p className="text-xs sm:text-sm xl:text-base text-gray-600 leading-relaxed text-center lg:text-left">Stay on top of your schedule with a calendar connected to your tasks. Track deadlines and plan events ahead.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </section>


            {/* Why choose Flo */}
            <section className="mt-20 sm:mt-32 px-6 md:px-10 2xl:px-20">
                <div className="max-w-[1920px] mx-auto transition-all">
                    <div className="flex flex-col items-center mb-12 md:mb-20">
                        <h2 className="text-3xl sm:text-4xl font-medium text-text-primary mb-4 text-center">
                            Why Choose Flo?
                        </h2>
                    </div>

                    {/* Mobile (< md): stacked list, same icon/text style */}
                    <div className="flex flex-col gap-8 md:hidden">
                        {/* Image */}
                        <div className="w-48 h-48 sm:w-56 sm:h-56 mx-auto rounded-t-full">
                            <img src={whyChooseUsImage} alt="Student using Flo" className="w-full h-full object-cover" />
                        </div>
                        {/* Features */}
                        {[
                            { Icon: CopyCheck, title: "Built for Student Life", desc: "Designed for assignments, deadlines, and daily study routines—Flo fits the way students actually work." },
                            { Icon: Bot, title: "AI That Helps You Stay Organized", desc: "Flo doesn't just store your tasks — it helps you prioritize, organize, and stay focused." },
                            { Icon: BellOff, title: "Focus Without Distractions", desc: "Pomodoro timers and Zen Mode help you stay focused and make every study session more productive." },
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
                                <h4 className="font-medium text-text-primary text-lg mb-2">{title}</h4>
                                <p className="text-sm text-text-secondary leading-relaxed">{desc}</p>
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
                                2xl:w-[1200px] 2xl:h-[600px]
                                border-t 2xl:border-t-2 border-x border-dashed border-gray-200 rounded-t-full pointer-events-none" />

                            <div className="absolute bottom-0
                                w-[440px] h-[220px]
                                md:w-[490px] md:h-[245px]
                                lg:w-[550px] lg:h-[275px]
                                xl:w-[630px] xl:h-[315px]
                                2xl:w-[700px] 2xl:h-[350px]
                                border-t 2xl:border-t-2 border-x border-dashed border-gray-200 rounded-t-full pointer-events-none" />

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
                                    xl:bottom-28 xl:-left-20 2xl:-left-30
                                    max-w-[180px] md:max-w-[220px] lg:max-w-[270px] xl:max-w-[380px] 2xl:max-w-[400px]
                                    z-20"
                            >
                                <div className="w-10 h-10 md:w-11 md:h-11 rounded-lg bg-primary/15 flex items-center justify-center mb-3">
                                    <CopyCheck size={22} className="text-primary" />
                                </div>
                                <h4 className="font-medium text-text-primary mb-2 text-sm md:text-base lg:text-lg">Built for Student Life</h4>
                                <p className="text-xs md:text-sm  xl:text-base text-gray-500 leading-relaxed">Designed for assignments, deadlines, and daily study routines—Flo fits the way students actually work.</p>
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
                                    max-w-[180px] md:max-w-[220px] lg:max-w-[270px] xl:max-w-[310px] 2xl:max-w-[380px]
                                    z-20"
                            >
                                <div className="w-10 h-10 md:w-11 md:h-11 rounded-lg bg-primary/15 flex items-center justify-center mb-3">
                                    <Bot size={24} className="text-primary" />
                                </div>
                                <h4 className="font-medium text-text-primary mb-2 text-sm md:text-base lg:text-lg">AI That Helps You Stay Organized</h4>
                                <p className="text-xs md:text-sm xl:text-base text-gray-500 leading-relaxed">Flo doesn't just store your tasks — it helps you prioritize, organize, and stay focused.</p>
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
                                    xl:bottom-28 xl:-right-28 2xl:-right-32
                                    max-w-[180px] md:max-w-[220px] lg:max-w-[270px] xl:max-w-[370px] 2xl:max-w-[400px]
                                    z-20"
                            >
                                <div className="w-10 h-10 md:w-11 md:h-11 rounded-lg bg-primary/15 flex items-center justify-center mb-3">
                                    <BellOff size={22} className="text-primary " />
                                </div>
                                <h4 className="font-medium text-text-primary mb-2 text-sm md:text-base lg:text-lg">Focus Without Distractions</h4>
                                <p className="text-xs md:text-sm xl:text-base text-gray-500 leading-relaxed">Pomodoro timers and Zen Mode help you stay focused and make every study session more productive.</p>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Highlighter Section */}
            <section id="highlighter" className="mt-20 sm:mt-28 mb-20 px-6 md:px-10 2xl:px-20">
                <div className="max-w-[1920px] mx-auto transition-all">
                    <div className="flex flex-col items-center gap-6 text-center">

                        {/* Main quote */}
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium text-text-primary max-w-4xl leading-[1.3] tracking-tight">
                            Stop{" "}
                            <Highlighter color="#FFD400" action="highlight" strokeWidth={2} animationDuration={800} isView>
                                wasting hours
                            </Highlighter>
                            {" "}on chaos.{" "}
                            <br className="hidden sm:block" />
                            Start{" "}
                            <Highlighter color="#FF8C00" action="underline" strokeWidth={2.5} animationDuration={600} isView>
                                owning your time
                            </Highlighter>
                            {" "}with Flo.
                        </h2>

                        {/* Sub-taglines */}
                        <p className="text-base sm:text-lg text-text-secondary max-w-2xl leading-relaxed">
                            Every minute you{" "}
                            <Highlighter color="#FFD400" action="box" strokeWidth={1.5} animationDuration={500} padding={4} isView>
                                plan well
                            </Highlighter>
                            {" "}is a minute you can{" "}
                            <Highlighter color="#FF8C00" action="circle" strokeWidth={1.5} animationDuration={500} isView>
                                focus freely
                            </Highlighter>
                            .
                        </p>
                    </div>
                </div>
            </section>



            {/* Section How to Use  */}
            <section id="how-to-use" className="mt-20 sm:mt-32 px-6 md:px-10 2xl:px-20">
                <div className="max-w-[1920px] mx-auto transition-all flex flex-col items-center">

                    <HowToUseSteps />
                </div>
            </section>


            {/* Testimonials */}
            <section id="testimonials" className="mt-20 sm:mt-32 px-6 md:px-10 2xl:px-20">
                <div className="max-w-[1920px] mx-auto transition-all">
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


"use client";

import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useEffect, useState } from "react";
import { FaTrophy } from "react-icons/fa";

import Layout from './ui/Layout'
import bgHero from './assets/images/bg-hero.png'
import aiAssistant from './assets/images/icon-ai-assistant.png'

const emojis = ["📚", "📝", "💻", "🎓", "✏️"];
const FULL_TEXT = "How can I help you today?";


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

function Home() {
    const [emojiIndex, setEmojiIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setEmojiIndex((prev) => (prev + 1) % emojis.length);
        }, 5800);
        return () => clearInterval(interval);
    }, []);


    // Writing effect
    const [displayed, setDisplayed] = useState("");
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (index < FULL_TEXT.length) {
            const timeout = setTimeout(() => {
                setDisplayed((prev) => prev + FULL_TEXT[index]);
                setIndex((prev) => prev + 1);
            }, 45);
            return () => clearTimeout(timeout);
        } else {
            const timeout = setTimeout(() => {
                setDisplayed("");
                setIndex(0);
            }, 5000);
            return () => clearTimeout(timeout);
        }
    }, [index]);

    return (
        <Layout>
            {/* Section Hero */}
            <section className="relative px-6 md:px-10 w-full pt-14 min-h-[70vh] md:h-screen flex flex-col items-center">
                {/* Hero Background Elements */}
                <div className="absolute -bottom-25 left-0 right-0 w-full h-full z-0 pointer-events-none">
                    <div className="absolute inset-0 bg-linear-to-t from-transparent to-background h-10 z-10"></div>
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
                        <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-gray-200 bg-white text-secondary-app text-xs font-semibold tracking-wide uppercase text-center">
                            <FaTrophy className="text-md shrink-0" />
                            1st Student Productivity Tool
                        </span>
                    </motion.div>

                    <div className="flex flex-col gap-y-4">
                        {/* Heading */}
                        <motion.h1
                            variants={fadeUp}
                            className="font-medium text-center text-black text-4xl! sm:text-5xl! md:text-[3.5rem]! leading-[1.2] md:leading-[1.1] tracking-tight"
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
                            className="text-center text-sm sm:text-base text-secondary px-4 md:px-0"
                        >
                            Flow is your all-in-one productivity tool built for students. Plan
                            assignments, track deadlines, manage daily tasks, and never miss what
                            matters most.
                        </motion.p>
                    </div>

                    <motion.div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4 px-4 sm:px-0">
                        <button className="w-full sm:w-auto bg-linear-to-t from-primary to-primary/75 hover:bg-primary! text-black px-6! py-3.5! text-sm! font-medium! cursor-pointer! border-none! hover:scale-105 transition-all duration-300 rounded-lg!">Try Flow Now</button>
                        <button className="w-full sm:w-auto bg-white border! border-gray-200! text-black px-6! py-3.5! text-sm! font-medium! cursor-pointer! hover:scale-105 transition-all duration-300 rounded-lg!">Watch Video</button>
                    </motion.div>
                </motion.div>

            </section>

            {/* Section Video */}
            <section className="relative z-10 md:px-10 -mt-20 sm:-mt-56 ">
                <div className="p-2.5 md:p-3.5 max-w-[90%] md:max-w-7xl mx-auto h-[300px] sm:h-[400px] md:h-[600px] bg-white/50 backdrop-blur-xs rounded-2xl md:rounded-4xl border border-white shadow-sm">
                    <div className="h-full w-full bg-white rounded-2xl md:rounded-3xl"></div>
                </div>

            </section>
        

            {/* Section How We Help You */}
            <section className="mt-24 px-10">
                <h2 className="text-5xl font-medium text-black mb-10">How Flow Helps You Stay on Track.</h2>

                <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-5 gap-4">
                        {/* Your 24/7 Academic Assistant */}
                        <div className="col-span-2 bg-white rounded-xl overflow-hidden">
                            <div className="h-48 w-full bg-white-500 flex items-center justify-center">
                                <div className="flex gap-x-5 items-center">
                                    {/* Image with infinite tilt */}
                                    <motion.img
                                        src={aiAssistant}
                                        alt="AI Assistant"
                                        className="h-20 object-cover"
                                        animate={{ rotate: [0, 4, 0, -4, 0] }}
                                        transition={{
                                            duration: 3,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                        }}
                                    />

                                    {/* Typing text */}
                                    <p className="text-xl font-medium text-secondary">
                                        {displayed}
                                        <motion.span
                                            className="inline-block w-0.5 h-6 ml-1 bg-current align-middle"
                                            animate={{ opacity: [1, 0] }}
                                            transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                                        />
                                    </p>
                                </div>

                            </div>
                            <div className="p-5">
                                <h4 className="text-xl font-medium text-black mb-2">Your 24/7 Academic Assistant</h4>
                                <p className="text-base text-gray-600">Stuck on an assignment? Need guidance? Flo's AI Assistant helps you brainstorm ideas, clarify tasks, and stay on track anytime you need support.</p>
                            </div>
                        </div>

                        {/* Smart Notes That Think With You */}
                        <div className="col-span-3 bg-white rounded-xl overflow-hidden">
                            <div className="h-48 w-full bg-white-500 flex items-center justify-center">
                                <div className="flex gap-x-5 items-center">
                                    {/* Image with infinite tilt */}
                                    <motion.img
                                        src={aiAssistant}
                                        alt="AI Assistant"
                                        className="h-20 object-cover"
                                        animate={{ rotate: [0, 4, 0, -4, 0] }}
                                        transition={{
                                            duration: 3,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                        }}
                                    />

                                    {/* Typing text */}
                                    <p className="text-xl font-medium text-secondary">
                                        {displayed}
                                        <motion.span
                                            className="inline-block w-0.5 h-6 ml-1 bg-current align-middle"
                                            animate={{ opacity: [1, 0] }}
                                            transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                                        />
                                    </p>
                                </div>

                            </div>
                            <div className="p-5">
                                <h4 className="text-xl font-medium text-black mb-2">Smart Notes That Think With You</h4>
                                <p className="text-base text-gray-600">Write notes manually or upload your PDF and Word files to instantly generate summaries and AI-powered reviews. Flow helps you understand faster, organize better, and study smarter.</p>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-6 gap-4">

                        {/* Plan */}
                        <div className="col-span-2 bg-white rounded-xl overflow-hidden">
                            <div className="h-48 w-full bg-white-500 flex items-center justify-center">
                                <div className="flex gap-x-5 items-center">
                                    {/* Image with infinite tilt */}
                                    <motion.img
                                        src={aiAssistant}
                                        alt="AI Assistant"
                                        className="h-20 object-cover"
                                        animate={{ rotate: [0, 4, 0, -4, 0] }}
                                        transition={{
                                            duration: 3,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                        }}
                                    />

                                    {/* Typing text */}
                                    <p className="text-xl font-medium text-secondary">
                                        {displayed}
                                        <motion.span
                                            className="inline-block w-0.5 h-6 ml-1 bg-current align-middle"
                                            animate={{ opacity: [1, 0] }}
                                            transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                                        />
                                    </p>
                                </div>

                            </div>
                            <div className="p-5">
                                <h4 className="text-xl font-medium text-black mb-2">Plan Every Task with Clarity</h4>
                                <p className="text-base text-gray-600">Add tasks manually or describe what you need to do—Flow helps you break them down into clear</p>
                            </div>
                        </div>

                        {/* Focus Deep. Finish Faster. */}
                        <div className="col-span-2 bg-white rounded-xl overflow-hidden">
                            <div className="h-48 w-full bg-white-500 flex items-center justify-center">
                                <div className="flex gap-x-5 items-center">
                                    {/* Image with infinite tilt */}
                                    <motion.img
                                        src={aiAssistant}
                                        alt="AI Assistant"
                                        className="h-20 object-cover"
                                        animate={{ rotate: [0, 4, 0, -4, 0] }}
                                        transition={{
                                            duration: 3,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                        }}
                                    />

                                    {/* Typing text */}
                                    <p className="text-xl font-medium text-secondary">
                                        {displayed}
                                        <motion.span
                                            className="inline-block w-0.5 h-6 ml-1 bg-current align-middle"
                                            animate={{ opacity: [1, 0] }}
                                            transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                                        />
                                    </p>
                                </div>

                            </div>
                            <div className="p-5">
                                <h4 className="text-xl font-medium text-black mb-2">Focus Deep. Finish Faster.</h4>
                                <p className="text-base text-gray-600">Use the built-in Pomodoro timer to stay focused and productive.</p>
                            </div>
                        </div>
                        <div className="col-span-2 bg-white rounded-xl overflow-hidden">
                            <div className="h-48 w-full bg-white-500 flex items-center justify-center">
                                <div className="flex gap-x-5 items-center">
                                    {/* Image with infinite tilt */}
                                    <motion.img
                                        src={aiAssistant}
                                        alt="AI Assistant"
                                        className="h-20 object-cover"
                                        animate={{ rotate: [0, 4, 0, -4, 0] }}
                                        transition={{
                                            duration: 3,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                        }}
                                    />

                                    {/* Typing text */}
                                    <p className="text-xl font-medium text-secondary">
                                        {displayed}
                                        <motion.span
                                            className="inline-block w-0.5 h-6 ml-1 bg-current align-middle"
                                            animate={{ opacity: [1, 0] }}
                                            transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                                        />
                                    </p>
                                </div>

                            </div>
                            <div className="p-5">
                                <h4 className="text-xl font-medium text-black mb-2">Turn Notes into Flashcards Instantly</h4>
                                <p className="text-base text-gray-600">Transform your notes into ready-to-use flashcards with one click.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    )
}

export default Home

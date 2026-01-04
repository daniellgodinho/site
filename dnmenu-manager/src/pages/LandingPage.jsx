import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
    Menu, X, Package, Crosshair, Shield, Eye, MousePointer, Bookmark, Car, Users as UsersIcon,
    Lock, Bomb, User, Toolbox, Building2, CheckCircle, HandFist
} from 'lucide-react';
import { FaDiscord } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { supabase } from '../supabase';
export default function LandingPage() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [resellers, setResellers] = useState([]);
    useEffect(() => {
        const fetchResellers = async () => {
            const { data } = await supabase.from('resellers').select('*');
            setResellers(data || []);
        };
        fetchResellers();
    }, []);
    return (
        <div className="min-h-screen bg-gradient-to-br from-black to-purple-950/20 text-white overflow-x-hidden"> {/* Enhanced gradient */}
            <Header mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
            <Hero />
            <Problem />
            <Solution />
            <KeyFeatures />
            <AllFeatures />
            <Pricing />
            <Compatibility />
            <Revendedores resellers={resellers} />
            <Termos />
            <Footer />
        </div>
    );
}
function Header({ mobileMenuOpen, setMobileMenuOpen }) {
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    return (
        <motion.header
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black/80 backdrop-blur-md border-b border-purple-800/20 shadow-lg' : 'bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <Link to="/" className="flex items-center space-x-3">
                        <Logo className="w-20 h-20 md:w-20 h-20 lg:w-40 h-40 drop-shadow-xl" /> {/* Softer shadow */}
                        <span className="font-bold text-2xl bg-gradient-to-r from-purple-300 to-purple-200 bg-clip-text text-transparent">
                            Home
                        </span>
                    </Link>
                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <a href="#features" className="text-gray-300 hover:text-purple-200 transition-colors">
                            Features
                        </a>
                        <a href="#pricing" className="text-gray-300 hover:text-purple-200 transition-colors">
                            Pricing
                        </a>
                        <a href="https://discord.gg/k3CUqNs3UW" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-purple-200 transition-colors">
                            Discord
                        </a>
                        <a href="#revendedores" className="text-gray-300 hover:text-purple-200 transition-colors">
                            Resellers
                        </a>
                        <a href="#termos" className="text-gray-300 hover:text-purple-200 transition-colors">
                            Terms
                        </a>
                        <Link
                            to="/login"
                            className="px-6 py-2.5 bg-purple-900/50 hover:bg-purple-800/50 rounded-xl transition-all duration-300 shadow-md shadow-purple-900/20"
                        >
                            Dashboard
                        </Link>
                    </nav>
                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden text-white p-2"
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="md:hidden py-4 space-y-4"
                    >
                        <a href="#features" className="block text-gray-300 hover:text-purple-200 transition-colors py-2">
                            Features
                        </a>
                        <a href="#pricing" className="block text-gray-300 hover:text-purple-200 transition-colors py-2">
                            Pricing
                        </a>
                        <a href="https://discord.gg/k3CUqNs3UW" target="_blank" rel="noopener noreferrer" className="block text-gray-300 hover:text-purple-200 transition-colors py-2">
                            Discord
                        </a>
                        <a href="#revendedores" className="block text-gray-300 hover:text-purple-200 transition-colors py-2">
                            Resellers
                        </a>
                        <a href="#termos" className="block text-gray-300 hover:text-purple-200 transition-colors py-2">
                            Terms
                        </a>
                        <Link
                            to="/login"
                            className="block px-6 py-2.5 bg-purple-900/50 hover:bg-purple-800/50 rounded-xl transition-all duration-300 text-center"
                        >
                            Dashboard
                        </Link>
                    </motion.div>
                )}
            </div>
        </motion.header>
    );
}
function Hero() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    return (
        <section ref={ref} className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-black to-purple-900/5"></div> {/* Softer gradient */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-900/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-900/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
            <div className="max-w-7xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="text-center max-w-4xl mx-auto"
                >
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-300 to-purple-200 bg-clip-text text-transparent"
                    >
                        DN Menu & DN Farm
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : {}}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-xl sm:text-2xl text-gray-300 mb-8 leading-relaxed"
                    >
                        The most advanced menu for Roleplay in Roblox (DN Menu - main product), and automated farming tools (DN Farm).
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <a
                            href="https://discord.gg/k3CUqNs3UW"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative px-8 py-4 bg-purple-900/50 rounded-2xl font-semibold text-lg overflow-hidden transition-all duration-300 hover:scale-105 shadow-md shadow-purple-900/20"
                        >
                            <span className="relative z-10">Get Access</span>
                            <div className="absolute inset-0 bg-purple-800/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </a>
                        <a
                            href="#features"
                            className="px-8 py-4 bg-white/5 backdrop-blur-sm border border-purple-800/30 rounded-2xl font-semibold text-lg hover:bg-white/10 transition-all duration-300"
                        >
                            View Features
                        </a>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
function Problem() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    return (
        <section ref={ref} className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent">
            <div className="max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-white">
                        The Challenge
                    </h2>
                    <p className="text-xl text-gray-400 leading-relaxed">
                        Roleplay servers in Roblox are competitive by nature. Players limited by standard mechanics often face difficulties in critical situations, whether in combat, mobility or resource management. The difference between surviving and losing everything can be a matter of milliseconds.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
function Solution() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    return (
        <section ref={ref} className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-white">
                        The Solution
                    </h2>
                    <p className="text-xl text-gray-400 leading-relaxed mb-8">
                        DN Menu offers total control over the game environment. With 51 carefully developed features, you get tactical advantages that transform every session. It's not about brute force, but about having the right tools at the right time. DN Farm complements with automated farming.
                    </p>
                </motion.div>
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-purple-900/20 blur-3xl"></div>
                    <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 border border-purple-800/30 shadow-2xl shadow-purple-900/20">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span className="ml-4 text-gray-400 text-sm">DN Menu v4.5.3</span>
                        </div>
                        <div className="bg-black/50 rounded-xl p-6 font-mono text-sm">
                            <div className="text-purple-300 mb-2">[System] Initializing DN Menu...</div> {/* Purple accent */}
                            <div className="text-gray-400 mb-2">Loading combat modules...</div>
                            <div className="text-green-300 mb-2">[OK] Aimbot active</div>
                            <div className="text-green-300 mb-2">[OK] Full ESP loaded</div>
                            <div className="text-green-300 mb-2">[OK] Invisible solo session initialized</div>
                            <div className="text-green-300 mb-2">[OK] Delete vehicles ready</div>
                            <div className="text-green-300 mb-2">[OK] Pull weapons enabled</div>
                            <div className="text-purple-300 mt-4">51 features available. System operational.</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
function KeyFeatures() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const keyFeatures = [
        {
            icon: Package,
            title: "Trunk Manipulation",
            description: "View and steal items from any trunk. Instant inventory transfer without direct interaction."
        },
        {
            icon: Crosshair,
            title: "Ghost Pull Weapons",
            description: "Pull weapons without generating elimination logs. Completely bypassed system for silent actions."
        },
        {
            icon: Shield,
            title: "God Mode (In development)",
            description: "Complete invulnerability against damage. Ignore all city combat mechanics."
        },
        {
            icon: Eye,
            title: "Full ESP",
            description: "Wall-through visualization with Skeleton, RGB and admin detection. Customizable Chams."
        },
        {
            icon: MousePointer,
            title: "Configurable Aimbot and Silent",
            description: "Adjustable FOV, customizable smoothness and wall check. Settings sufficient for legit appearance."
        },
        {
            icon: Car,
            title: "Vehicle Control",
            description: "Unlock, delete or launch other people's vehicles. Vehicle fly and noclip to move undetected."
        },
        {
            icon: UsersIcon,
            title: "Player Manipulation",
            description: "Eat players (+18), eliminate everyone from the server or perform specific individual actions."
        },
        {
            icon: Lock,
            title: "Bypass System",
            description: "Protection against screening and screenshare. Automatic cleaning when closing the menu."
        }
    ];
    return (
        <section id="features" ref={ref} className="py-20 px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-white">
                        Main Features
                    </h2>
                    <p className="text-xl text-gray-400">
                        Most requested resources by advanced users
                    </p>
                </motion.div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {keyFeatures.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="group relative p-6 bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-purple-800/20 hover:border-purple-800/50 transition-all duration-300 shadow-md shadow-purple-900/10"
                        >
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-900/50 to-purple-800/50 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                <feature.icon className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-lg font-bold mb-2 text-white">{feature.title}</h3>
                            <p className="text-gray-400 text-sm">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
function AllFeatures() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const allFeatures = {
        "Player": {
            icon: User,
            features: [
                "Speed Hack",
                "Adjustable Speed",
                "Invulnerability",
                "Noclip",
                "Invisible Solo Session"
            ]
        },
        "Visuals": {
            icon: Eye,
            features: [
                "ESP Players",
                "ESP Skeleton",
                "ESP RGB",
                "ESP Admins",
                "Chams",
                "Fullbright",
                "ESP Colors Customization",
                "Admin ESP Customization",
                "Customizable Chams Colors"
            ]
        },
        "Combat": {
            icon: HandFist,
            features: [
                "Aimbot",
                "Silent Aim",
                "Aimbot FOV",
                "Silent Aim FOV",
                "Wall Check",
                "Smoothness",
                "Hitbox Expander",
                "Hitbox Size",
                "Hitbox Transparency",
                "Friends List (Anti TK)"
            ]
        },
        "Exploits": {
            icon: Bomb,
            features: [
                "Pull weapons without logs/team verification",
                "Eat players (+18)",
                "Exorcism",
                "Kill all players (Kill All)",
                "Performance Optimization"
            ]
        },
        "Vehicles": {
            icon: Car,
            features: [
                "Unlock All",
                "Auto Unlock",
                "Vehicle Fly",
                "Vehicle Noclip",
                "Vehicle Delete",
                "Teleport to Nearest Vehicle",
                "Neither mine nor yours (Throw Vehicle)"
            ]
        },
        "Trunk": {
            icon: Package,
            features: [
                "View other people's Trunk",
                "Clone Inventory",
                "Steal items from other people's Trunk",
                "Clear Trunk UI, if bugged"
            ]
        },
        "Players List": {
            icon: UsersIcon,
            features: [
                "Select Player",
                "Clean player with car (Inspired by Shark Menu Fivem)",
                "Teleport to Player",
                "Add Friend (Anti TK)",
                "Remove Friend"
            ]
        },
        "Security": {
            icon: Lock,
            features: [
                "Anti Cheat Bypass",
                "Screenshare/Telagem Bypass",
                "Unique Menu",
                "Disable Features",
                "Automatic Bypass"
            ]
        }
    };
    return (
        <section ref={ref} className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-white">
                        51 Available Features
                    </h2>
                    <p className="text-xl text-gray-400">
                        Complete arsenal organized by category
                    </p>
                </motion.div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Object.entries(allFeatures).map(([category, data], catIndex) => {
                        const Icon = data.icon;
                        return (
                            <motion.div
                                key={category}
                                initial={{ opacity: 0, y: 30 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.5, delay: catIndex * 0.1 }}
                                className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border border-purple-800/20 shadow-md"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-purple-900/20 border border-purple-800/40 rounded-lg flex items-center justify-center">
                                        <Icon className="w-5 h-5 text-purple-300" /> {/* Purple icon */}
                                    </div>
                                    <h3 className="text-lg font-bold text-white">{category}</h3>
                                </div>
                                <ul className="space-y-2">
                                    {data.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-gray-300">
                                            <span className="text-purple-300 mt-1 text-xs">▸</span> {/* Purple arrow */}
                                            <span className="text-sm">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
function Pricing() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const plans = [
        {
            name: "Daily",
            price: "R$ 20",
            duration: "24 hours",
            features: [
                "Full access for 24h",
                "All 51 features",
                "Discord support"
            ],
            highlighted: false
        },
        {
            name: "Weekly",
            price: "R$ 35",
            duration: "7 days",
            features: [
                "Full access for 7 days",
                "All 51 features",
                "Included updates",
                "Priority support"
            ],
            highlighted: false
        },
        {
            name: "Monthly",
            price: "R$ 50",
            duration: "30 days",
            features: [
                "Full access for 30 days",
                "All 51 features",
                "Constant updates",
                "VIP priority support"
            ],
            highlighted: false
        },
        {
            name: "Lifetime",
            price: "R$ 97,99",
            duration: "Lifetime",
            features: [
                "Permanent access",
                "All 51 features",
                "Constant updates",
                "Lifetime VIP support",
                "Priority access to new features",
                "Never expires"
            ],
            highlighted: true,
            badge: "Best Seller"
        },
        {
            name: "Resale",
            price: "R$ 120",
            duration: "Full panel",
            features: [
                "Complete resale panel",
                "Unlimited customers",
                "Automatic key creation",
                "All 51 features",
                "Dedicated technical support",
                "Make money selling the most sought after menu in the scene"
            ],
            highlighted: true,
            badge: "Make Money"
        }
    ];
    return (
        <section id="pricing" ref={ref} className="py-32 px-4 sm:px-6 lg:px-8 relative bg-gradient-to-b from-black via-purple-900/10 to-black">
            <div className="max-w-7xl mx-auto">
                {/* Title */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 1 }}
                    className="text-center mb-24"
                >
                    <h2 className="text-5xl sm:text-6xl font-extrabold mb-6 bg-gradient-to-r from-purple-300 to-purple-200 bg-clip-text text-transparent">
                        Choose your Plan
                    </h2>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                        Immediate access • Constant updates • Exclusive Discord support
                    </p>
                </motion.div>
                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 60, scale: 0.95 }}
                            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                            transition={{ duration: 0.8, delay: index * 0.15 }}
                            whileHover={{
                                y: -20,
                                scale: 1.05,
                                boxShadow: "0 40px 80px rgba(147, 51, 234, 0.3)"
                            }}
                            className={`relative p-12 rounded-3xl border-2 transition-all duration-700 shadow-2xl ${plan.highlighted
                                ? 'bg-gradient-to-br from-purple-900/40 to-purple-900/20 border-purple-800/50 shadow-purple-900/50'
                                : 'bg-gradient-to-br from-gray-950/95 to-black/95 border-purple-800/40 hover:border-purple-800/50'
                                }`}
                        >
                            {/* Badge */}
                            {plan.badge && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.6, delay: 0.4 }}
                                    className={`absolute -top-6 left-1/2 -translate-x-1/2 px-8 py-3 rounded-full font-extrabold text-sm shadow-2xl whitespace-nowrap ${plan.name === "Resale"
                                        ? 'bg-gradient-to-r from-purple-300 to-purple-200 text-black'
                                        : 'bg-gradient-to-r from-purple-900/50 to-purple-800/50 text-white'
                                        }`}
                                >
                                    {plan.badge}
                                </motion.div>
                            )}
                            <motion.h3
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-3xl font-bold text-center mb-10 text-white"
                            >
                                {plan.name}
                            </motion.h3>
                            <motion.div
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                                className="text-center mb-12"
                            >
                                <div className="text-7xl font-extrabold bg-gradient-to-r from-purple-300 via-purple-200 to-pink-300 bg-clip-text text-transparent">
                                    {plan.price}
                                </div>
                                <p className="text-gray-300 mt-4 text-xl">{plan.duration}</p>
                            </motion.div>
                            <ul className="space-y-6 mb-14">
                                {plan.features.map((feature, i) => (
                                    <motion.li
                                        key={i}
                                        initial={{ opacity: 0, x: -40 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.5 + i * 0.1 }}
                                        className="flex items-start text-gray-200"
                                    >
                                        <CheckCircle className="w-7 h-7 text-purple-300 mr-4 flex-shrink-0 mt-0.5" /> {/* Purple check */}
                                        <span className="text-lg leading-relaxed">{feature}</span>
                                    </motion.li>
                                ))}
                            </ul>
                            <motion.a
                                href="https://discord.gg/k3CUqNs3UW"
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.08 }}
                                whileTap={{ scale: 0.95 }}
                                className={`block w-full py-6 rounded-2xl text-center font-extrabold text-xl transition-all duration-300 shadow-xl ${plan.highlighted
                                    ? 'bg-gradient-to-r from-purple-900/50 to-purple-800/50 hover:from-purple-800/50 hover:to-purple-700/50 text-white'
                                    : 'bg-white/5 hover:bg-white/10 text-white border-2 border-purple-800/40'
                                    }`}
                            >
                                Acquire Now
                            </motion.a>
                        </motion.div>
                    ))}
                </div>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 1, delay: 1 }}
                    className="text-center mt-24 text-gray-300 text-lg"
                >
                    All plans include the 51 features • Secure payment • Instant activation
                </motion.p>
            </div>
        </section>
    );
}
function Compatibility() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    return (
        <section ref={ref} className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 border border-purple-800/30 shadow-md"
                >
                    <h2 className="text-3xl font-bold mb-6 text-center text-white">
                        Compatibility
                    </h2>
                    <div className="space-y-4 text-gray-300">
                        <div className="flex items-start gap-3">
                            <Toolbox className="w-6 h-6 text-purple-300 flex-shrink-0 mt-0.5" /> {/* Purple icon */}
                            <p>
                                <strong className="text-white">A-Chassis:</strong> Compatible with all servers that use the A-Chassis system for vehicles.
                            </p>
                        </div>
                        <div className="flex items-start gap-3">
                            <Crosshair className="w-6 h-6 text-purple-300 flex-shrink-0 mt-0.5" />
                            <p>
                                <strong className="text-white">ACS (Advanced Combat System):</strong> Full support for servers with ACS combat system.
                            </p>
                        </div>
                        <div className="flex items-start gap-3">
                            <Shield className="w-6 h-6 text-purple-300 flex-shrink-0 mt-0.5" />
                            <p>
                                <strong className="text-white">Protection System:</strong> Integrated bypass against screening and screenshare. Automatic trace cleaning.
                            </p>
                        </div>
                        <div className="flex items-start gap-3">
                            <Building2 className="w-6 h-6 text-purple-300 flex-shrink-0 mt-0.5" />
                            <p>
                                <strong className="text-white">Roleplay Servers:</strong> Works in all major RP cities that use the mentioned systems.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
function Revendedores({ resellers }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    return (
        <section id="revendedores" ref={ref} className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-white">
                        Authorized Resellers
                    </h2>
                    <p className="text-xl text-gray-400">
                        Acquire with our official partners
                    </p>
                </motion.div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {resellers.map((res, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border border-purple-800/20 hover:border-purple-800/50 transition-all duration-300 shadow-md"
                        >
                            <h3 className="text-lg font-bold mb-4 text-white">{res.name}</h3>
                            <a
                                href={res.discord_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-900/50 rounded-lg font-semibold hover:bg-purple-800/50 transition-colors"
                            >
                                <FaDiscord className="w-5 h-5" />
                                Discord
                            </a>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
function Termos() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const termsSections = [
        {
            title: "1. Acceptance of Terms",
            icon: Bookmark,
            content: "1.1. By making any purchase on our platform, you confirm that you have read, understood and fully agree with these Terms of Purchase and Service.\n1.2. Continued use of our products and services implies automatic acceptance of any updates to these terms.\n1.3. These terms may be changed at any time, and it is the user's responsibility to periodically check for possible updates."
        },
        {
            title: "2. Nature of the Product",
            icon: Bookmark,
            content: "2.1. The products marketed are digital software licenses for educational and entertainment purposes.\n2.2. IMPORTANT NOTICE: As it is modification software (cheats/hacks), there is an inherent risk of ban or suspension on gaming platforms. The user assumes full responsibility for use.\n2.3. We are not responsible for bans, account suspensions, data loss or any consequences resulting from the use of our products.\n2.4. We work continuously to minimize detection, but we do not guarantee absolute invisibility to anti-cheat systems."
        },
        {
            title: "3. Purchase and Delivery Process",
            icon: Bookmark,
            content: "3.1. Products will be delivered exclusively after payment confirmation by the system.\n3.2. Delivery is carried out solely through our official channels. Do not download or accept files from unverified or third-party sources.\n3.3. After purchase, wait for delivery instructions. It is your responsibility to securely store the credentials and files received.\n3.4. Delivery time may vary depending on the payment method used (instant for PIX, up to 72h for bank slip)."
        },
        {
            title: "4. Confidentiality",
            icon: Bookmark,
            content: "4.1. You undertake not to disclose, share, resell or distribute the purchased products, technical information, files or access credentials.\n4.2. Unauthorized sharing will result in permanent ban from our database and immediate cancellation of the license, without right to refund.\n4.3. Each license is personal and non-transferable, linked to the original buyer."
        },
        {
            title: "5. Refund Policy",
            icon: Bookmark,
            content: "5.1. Due to the digital and non-revocable nature of the products (software licenses), we do not offer refunds after delivery.\n5.2. All sales are considered final and irreversible, except in cases provided by law or proven billing error.\n5.3. It is the user's responsibility to verify:\n* Operating system compatibility\n* Minimum technical requirements\n* Product specifications before purchase\n5.4. There is no refund for technical incompatibility, change of mind, misuse or ignorance of the terms.\n5.5. We do not offer free trial periods, free days or demos for prior evaluation."
        },
        {
            title: "6. Chargebacks and Disputes",
            icon: Bookmark,
            content: "6.1. Attempts to open chargeback on credit card, PayPal or other payment methods without prior contact will result in:\n* Permanent ban from our database\n* Blocking of future purchases\n* Immediate cancellation of all active licenses\n6.2. In case of problems, contact our support before contacting your payment operator."
        },
        {
            title: "7. License Types",
            icon: Bookmark,
            content: "7.1. Lifetime License: Valid as long as the product exists and is being maintained. Does not guarantee perpetual access if the product is discontinued.\n7.2. Daily/Temporary Licenses: Do not have guarantee of automatic renewal or continuity after the contracted period.\n7.3. All licenses are subject to the terms of use and may be revoked in case of violation."
        },
        {
            title: "8. Resale Program",
            icon: Bookmark,
            content: "8.1. Authorized resellers must pass on 20% of the value of each sale to the developer (DN) as per established agreement.\n8.2. Violation of this agreement results in immediate cancellation of resale authorization.\n8.3. Only officially authorized resellers may market our products."
        },
        {
            title: "9. Limitation of Liability",
            icon: Bookmark,
            content: "9.1. Use of the software is at the user's own risk.\n9.2. We are not responsible for:\n* Direct or indirect damages caused by the use of the product\n* Loss of data, accounts or progress in games\n* Incompatibility with game or system updates\n* Temporary unavailability of the service\n9.3. Our maximum limit of liability corresponds to the amount paid for the product."
        },
        {
            title: "10. Security",
            icon: Bookmark,
            content: "10.1. Keep your access credentials secure.\n10.2. Do not share passwords, files or login information.\n10.3. Use updated antivirus and download files exclusively from our official channels.\n10.4. We are not responsible for files downloaded from unofficial sources."
        },
        {
            title: "11. Updates and Maintenance",
            icon: Bookmark,
            content: "11.1. We provide regular updates to maintain product functionality, when technically feasible.\n11.2. We do not guarantee that the product will remain functional indefinitely due to changes in games or operating systems.\n11.3. Technical support is provided according to availability and type of license acquired."
        },
        {
            title: "12. Suspension and Cancellation",
            icon: Bookmark,
            content: "12.1. We reserve the right to suspend or cancel licenses in case of:\n* Violation of these terms\n* Improper or abusive use\n* Attempted fraud or chargeback\n* Unauthorized sharing\n12.2. Cancellation does not generate right to refund."
        },
        {
            title: "13. General Provisions",
            icon: Bookmark,
            content: "13.1. These terms are governed by Brazilian laws.\n13.2. Doubts or problems should be directed to our official support.\n13.3. The invalidity of any clause does not affect the validity of the others.\n13.4. The non-exercise of any right provided in these terms does not constitute waiver"
        },
    ];
    return (
        <section id="termos" ref={ref} className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-white">
                        Terms of Purchase and Use
                    </h2>
                    <p className="text-xl text-gray-400 mb-4">
                        Last update: December 31, 2025
                    </p>
                </motion.div>
                <div className="space-y-4">
                    {termsSections.map((section, index) => (
                        <motion.details
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border border-purple-800/20 cursor-pointer hover:border-purple-800/50 transition-all shadow-md"
                        >
                            <summary className="flex items-center gap-3 text-lg font-bold text-white">
                                <section.icon className="w-6 h-6 text-purple-300 flex-shrink-0" /> {/* Purple icon */}
                                {section.title}
                                <span className="ml-auto text-purple-300 group-open:rotate-180 transition-transform">▼</span> {/* Purple arrow */}
                            </summary>
                            <p className="mt-4 text-gray-300 whitespace-pre-line">{section.content}</p>
                        </motion.details>
                    ))}
                </div>
                <p className="mt-12 text-center text-gray-400">
                    For questions, technical problems or support, use our official channels available on the site.<br />
                    By proceeding with the purchase, you declare that you are aware and agree with all the terms above.
                </p>
            </div>
        </section>
    );
}
function Footer() {
    return (
        <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-purple-800/20">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    <div>
                        <div className="flex items-center space-x-3 mb-4">
                            <Logo className="w-24 h-24 md:w-24 h-24 lg:w-40 h-40 drop-shadow-xl" /> {/* Softer shadow */}
                            <span className="font-bold text-xl bg-gradient-to-r from-purple-300 to-purple-200 bg-clip-text text-transparent">
                                DN Menu
                            </span>
                        </div>
                        <p className="text-gray-400 text-sm">
                            The most advanced menu for Roleplay in Roblox.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-bold text-white mb-4">Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a href="#features" className="text-gray-400 hover:text-purple-200 transition-colors">
                                    Features
                                </a>
                            </li>
                            <li>
                                <a href="#pricing" className="text-gray-400 hover:text-purple-200 transition-colors">
                                    Pricing
                                </a>
                            </li>
                            <li>
                                <a href="#revendedores" className="text-gray-400 hover:text-purple-200 transition-colors">
                                    Resellers
                                </a>
                            </li>
                            <li>
                                <a href="#termos" className="text-gray-400 hover:text-purple-200 transition-colors">
                                    Terms
                                </a>
                            </li>
                            <li>
                                <Link to="/login" className="text-gray-400 hover:text-purple-200 transition-colors">
                                    Dashboard
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-white mb-4">Community</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a href="https://discord.gg/k3CUqNs3UW" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-purple-200 transition-colors">
                                    Discord
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="pt-8 border-t border-purple-800/20 text-center text-gray-400 text-sm">
                    <p>© 2025 DN Menu. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
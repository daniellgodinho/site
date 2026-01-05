// src/components/Navbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import monkeyLogo from '../assets/monkeyLogo.png';
import { Menu, X, ChevronDown } from 'lucide-react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isHidden, setIsHidden] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(!!sessionStorage.getItem('reseller'));
    const navigate = useNavigate();
    const lastScrollY = useRef(0);

    useEffect(() => {
        const handleScroll = () => {
            const current = window.pageYOffset;
            const scrollingDown = current > lastScrollY.current;

            if (scrollingDown && current > 50) {
                setIsHidden(true);
            } else if (!scrollingDown) {
                setIsHidden(false);
            }

            setScrolled(current > 50);
            lastScrollY.current = current;
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        sessionStorage.clear();
        setIsLoggedIn(false);
        navigate('/');
        setIsOpen(false);
    };

    return (
        <>
            {/* Navbar Principal */}
            <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] md:w-[90%] max-w-7xl 
                rounded-full md:rounded-3xl  // ← mais arredondado
                bg-black/30 backdrop-blur-md border border-purple-600/30 
                transition-all duration-300 
                ${scrolled ? 'py-3 md:py-4' : 'py-4 md:py-5'}  // ← mais "gordinha" e diferença suave no scroll
                ${isHidden ? '-translate-y-full' : 'translate-y-0'} transition-transform duration-300
            `}>
                <nav className="px-6 md:px-8 flex justify-between items-center h-full">
                    {/* Logo + Nome */}
                    <Link to="/" className="flex items-center gap-3 md:gap-4">  {/* ← gap reduzido */}
                        <img
                            src={monkeyLogo}
                            alt="DN Menu Logo"
                            className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-2xl drop-shadow-purple-600/50"
                        />
                        <span className="text-lg md:text-xl font-bold bg-gradient-to-br from-[#BF7AFF] to-[#8A2BE2] bg-clip-text text-transparent">
                            DN Menu
                        </span>
                    </Link>

                    {/* Menu Desktop */}
                    <div className="hidden md:flex items-center gap-6 lg:gap-8">  {/* ← gap um pouco maior entre itens, mas menos espaço total à esquerda */}
                        <a href="#features" className="text-sm lg:text-base text-gray-300 hover:text-purple-400 transition-colors">Funções</a>
                        <a href="#pricing" className="text-sm lg:text-base text-gray-300 hover:text-purple-400 transition-colors">Preços</a>
                        <a href="https://discord.gg/k3CUqNs3UW" target="_blank" rel="noopener noreferrer" className="text-sm lg:text-base text-gray-300 hover:text-purple-400 transition-colors">Discord</a>
                        <a href="#revendedores" className="text-sm lg:text-base text-gray-300 hover:text-purple-400 transition-colors">Revendedores</a>
                        <a href="#termos" className="text-sm lg:text-base text-gray-300 hover:text-purple-400 transition-colors">Termos</a>

                        {isLoggedIn ? (
                            <>
                                <Link to="/dashboard" className="text-sm lg:text-base text-gray-300 hover:text-purple-400 transition-colors">
                                    Dashboard
                                </Link>
                                <button onClick={handleLogout} className="text-sm lg:text-base text-red-400 hover:text-red-300 transition-colors">
                                    Sair
                                </button>
                            </>
                        ) : (
                            <Link to="/login" className="bg-purple-600 hover:bg-purple-500 px-5 py-2.5 rounded-full text-white text-sm lg:text-base font-medium transition-colors">
                                Login
                            </Link>
                        )}
                    </div>

                    {/* Mobile Toggle */}
                    <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-purple-400 p-2">
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </nav>
            </div>

            {isHidden && (
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => setIsHidden(false)}
                    className="fixed top-4 right-4 z-50 p-2 bg-purple-600 rounded-full text-white"
                >
                    <ChevronDown size={24} />
                </motion.button>
            )}

            {/* Mobile Menu */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, x: '100%' }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: '100%' }}
                    transition={{ type: 'spring', stiffness: 120 }}
                    className="fixed right-0 top-0 h-full w-72 bg-black/90 backdrop-blur-xl border-l border-purple-600/30 z-50 p-8 md:hidden"
                >
                    <button onClick={() => setIsOpen(false)} className="absolute top-6 right-6 text-purple-400">
                        <X size={28} />
                    </button>
                    <div className="flex flex-col gap-8 mt-20 text-lg">
                        <a href="#features" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-purple-400">Funções</a>
                        <a href="#pricing" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-purple-400">Preços</a>
                        <a href="https://discord.gg/k3CUqNs3UW" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-purple-400">Discord</a>
                        <a href="#revendedores" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-purple-400">Revendedores</a>
                        <a href="#termos" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-purple-400">Termos</a>

                        {isLoggedIn ? (
                            <>
                                <Link to="/dashboard" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-purple-400">
                                    Dashboard
                                </Link>
                                <button onClick={handleLogout} className="text-red-400 hover:text-red-300 text-left">
                                    Sair
                                </button>
                            </>
                        ) : (
                            <Link to="/login" onClick={() => setIsOpen(false)} className="bg-purple-600 hover:bg-purple-500 px-6 py-3 rounded-full text-white font-medium text-center">
                                Login
                            </Link>
                        )}
                    </div>
                </motion.div>
            )}
        </>
    );
};

export default Navbar;
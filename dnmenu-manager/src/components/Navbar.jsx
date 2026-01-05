// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import monkeyLogo from '../assets/monkeyLogo.png';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(!!sessionStorage.getItem('reseller'));
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
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
            <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-7xl rounded-2xl bg-black/30 backdrop-blur-md border border-purple-600/30 transition-all duration-300 ${scrolled ? 'py-2' : 'py-3'}`}>
                <nav className="px-4 flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-3">
                        <img
                            src={monkeyLogo}
                            alt="DN Menu Logo"
                            className="w-16 h-16 object-contain drop-shadow-2xl drop-shadow-purple-600/50"
                        />
                        <span className="text-xl font-bold text-purple-400 hidden md:block">DN Menu</span>
                    </Link>

                    {/* Menu Desktop */}
                    <div className="hidden md:flex items-center gap-6">
                        <a href="#features" className="text-gray-300 hover:text-purple-400 transition-colors">Funções</a>
                        <a href="#pricing" className="text-gray-300 hover:text-purple-400 transition-colors">Preços</a>
                        <a href="https://discord.gg/k3CUqNs3UW" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-purple-400 transition-colors">Discord</a>
                        <a href="#revendedores" className="text-gray-300 hover:text-purple-400 transition-colors">Revendedores</a>
                        <a href="#termos" className="text-gray-300 hover:text-purple-400 transition-colors">Termos</a>
                        {isLoggedIn ? (
                            <button onClick={handleLogout} className="text-red-400 hover:text-red-300 transition-colors">
                                Sair
                            </button>
                        ) : (
                            <Link to="/login" className="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-full text-white font-medium transition-colors">
                                Login
                            </Link>
                        )}
                        {isLoggedIn && (
                            <Link to="/dashboard" className="text-gray-300 hover:text-purple-400 transition-colors">
                                Dashboard
                            </Link>
                        )}
                    </div>

                    {/* Mobile Toggle */}
                    <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-purple-400">
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </nav>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, x: '100%' }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: '100%' }}
                    transition={{ type: 'spring', stiffness: 120 }}
                    className="fixed right-0 top-0 h-full w-64 bg-black/90 backdrop-blur-xl border-l border-purple-600/30 z-50 p-6 md:hidden"
                >
                    <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-purple-400">
                        <X size={24} />
                    </button>
                    <div className="flex flex-col gap-6 mt-12 text-lg">
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
                            <Link to="/login" onClick={() => setIsOpen(false)} className="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-full text-white font-medium text-center">
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
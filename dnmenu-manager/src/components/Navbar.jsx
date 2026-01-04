// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import monkeyLogo from '../assets/monkeyLogo.png'; // Import direto da logo
import { Menu, X } from 'lucide-react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // Detecta scroll para efeito
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Verifica sessão do Supabase
    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
        };
        checkSession();

        // Escuta mudanças de auth (login/logout)
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => listener.subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };

    return (
        <>
            {/* Navbar Principal */}
            <div className={`fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-300 ${scrolled ? 'mt-4' : 'mt-12'}`}>
                <nav className="navbar w-11/12 max-w-6xl backdrop-blur-3xl bg-black/40 border border-purple-600/30 rounded-2xl shadow-2xl shadow-purple-900/20 px-8 py-4">
                    <div className="flex items-center justify-between w-full">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-3">
                            <img
                                src={monkeyLogo}
                                alt="DN Menu Logo"
                                className="w-20 h-20 object-contain drop-shadow-2xl drop-shadow-purple-600/50"
                            />
                            <span className="text-2xl font-bold text-purple-400">DN Menu</span>
                        </Link>

                        {/* Menu Desktop */}
                        <div className="hidden md:flex items-center gap-8">
                            <a href="#features" className="text-gray-300 hover:text-purple-400 transition-colors">Funções</a>
                            <a href="#pricing" className="text-gray-300 hover:text-purple-400 transition-colors">Preços</a>
                            <a href="https://discord.gg/vBPFAg8kHW" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-purple-400 transition-colors">Discord</a>
                            <a href="#resellers" className="text-gray-300 hover:text-purple-400 transition-colors">Revendedores</a>
                            <a href="#terms" className="text-gray-300 hover:text-purple-400 transition-colors">Termos</a>

                            {/* Se logado: perfil + logout | Senão: login */}
                            {user ? (
                                <div className="dropdown">
                                    <div className="profile dropdown-toggle flex items-center gap-3 cursor-pointer" data-bs-toggle="dropdown">
                                        <img
                                            src={user.user_metadata?.avatar_url || 'https://via.placeholder.com/50'}
                                            alt="profile"
                                            className="w-10 h-10 rounded-full border-2 border-purple-600"
                                        />
                                        <span className="text-gray-300">{user.email || 'Usuário'}</span>
                                    </div>
                                    <ul className="dropdown-menu bg-black/90 border border-purple-600/30 rounded-xl mt-2">
                                        <li>
                                            <Link to="/dashboard" className="dropdown-item px-4 py-2 text-gray-300 hover:bg-purple-900/30">
                                                Painel do Cliente
                                            </Link>
                                        </li>
                                        <li>
                                            <button onClick={handleLogout} className="dropdown-item px-4 py-2 text-gray-300 hover:bg-red-900/30 w-full text-left">
                                                Desconectar
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            ) : (
                                <Link to="/login">
                                    <button className="bg-purple-600 hover:bg-purple-500 px-6 py-3 rounded-full text-white font-medium transition-colors">
                                        Fazer login
                                    </button>
                                </Link>
                            )}
                        </div>

                        {/* Mobile Toggle */}
                        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-purple-400">
                            {isOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </nav>
            </div>

            {/* Sidebar Mobile */}
            {isOpen && (
                <>
                    <div className="fixed inset-0 bg-black/70 z-40" onClick={() => setIsOpen(false)} />
                    <div className="fixed right-0 top-0 h-full w-80 bg-black/90 backdrop-blur-3xl border-l border-purple-600/30 z-50 p-6">
                        <div className="flex justify-between items-center mb-10">
                            {/* Logo no sidebar mobile - agora com img direto */}
                            <img
                                src={monkeyLogo}
                                alt="DN Menu Logo"
                                className="w-24 h-24 object-contain drop-shadow-2xl drop-shadow-purple-600/50"
                            />
                            <button onClick={() => setIsOpen(false)}>
                                <X size={28} className="text-purple-400" />
                            </button>
                        </div>
                        <div className="flex flex-col gap-6 text-lg">
                            <a href="#features" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-purple-400">Funções</a>
                            <a href="#pricing" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-purple-400">Preços</a>
                            <a href="https://discord.gg/vBPFAg8kHW" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-purple-400">Discord</a>
                            <a href="#resellers" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-purple-400">Revendedores</a>
                            <a href="#terms" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-purple-400">Termos</a>

                            {user ? (
                                <>
                                    <Link to="/dashboard" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-purple-400">
                                        Painel do Cliente
                                    </Link>
                                    <button onClick={() => { handleLogout(); setIsOpen(false); }} className="text-left text-red-400 hover:text-red-300">
                                        Desconectar
                                    </button>
                                </>
                            ) : (
                                <Link to="/login" onClick={() => setIsOpen(false)}>
                                    <button className="bg-purple-600 hover:bg-purple-500 px-6 py-4 rounded-full w-full text-white font-medium">
                                        Fazer login
                                    </button>
                                </Link>
                            )}
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default Navbar;
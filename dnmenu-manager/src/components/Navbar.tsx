"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

interface NavbarProps {
    estaAutenticado?: boolean;
    usuarioNome?: string;
}

export function Navbar({ estaAutenticado = false, usuarioNome }: NavbarProps) {
    const [menuAberto, setMenuAberto] = useState(false);
    const [rolagem, setRolagem] = useState(false);
    const [ocultada, setOcultada] = useState(false);
    const ultimaRolagem = useRef(0);
    const roteador = useRouter();

    useEffect(() => {
        const manipuladorRolagem = () => {
            const rolacaoAtual = window.pageYOffset;
            const descendo = rolacaoAtual > ultimaRolagem.current;

            if (descendo && rolacaoAtual > 50) {
                setOcultada(true);
            } else if (!descendo) {
                setOcultada(false);
            }

            setRolagem(rolacaoAtual > 50);
            ultimaRolagem.current = rolacaoAtual;
        };

        window.addEventListener("scroll", manipuladorRolagem);
        return () => window.removeEventListener("scroll", manipuladorRolagem);
    }, []);

    const manipuladorSaida = () => {
        sessionStorage.clear();
        roteador.push("/");
        setMenuAberto(false);
    };

    return (
        <>
            <motion.div
                initial={{ y: 0 }}
                animate={{ y: ocultada ? -100 : 0 }}
                transition={{ duration: 0.3 }}
                className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] md:w-[90%] max-w-7xl 
          rounded-2xl transition-all duration-300
          bg-black/40 backdrop-blur-lg border border-purple-500/30 
          ${rolagem ? "py-3 md:py-4" : "py-4 md:py-5"}`}
            >
                <div className="px-4 md:px-8 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="text-2xl font-bold text-purple-400 hover:text-purple-300 transition">
                        DN Menu
                    </Link>

                    {/* Desktop Links */}
                    <nav className="hidden md:flex items-center gap-8">
                        <Link href="#features" className="text-gray-300 hover:text-white transition">
                            Funcionalidades
                        </Link>
                        <Link href="#precos" className="text-gray-300 hover:text-white transition">
                            Preços
                        </Link>
                        {estaAutenticado && (
                            <Link href="/painel" className="text-gray-300 hover:text-white transition">
                                Painel
                            </Link>
                        )}
                    </nav>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        {estaAutenticado ? (
                            <>
                                <span className="text-gray-300">{usuarioNome}</span>
                                <button
                                    onClick={manipuladorSaida}
                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition text-white font-semibold"
                                >
                                    Sair
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/entrar"
                                    className="px-4 py-2 text-purple-400 hover:text-purple-300 transition font-semibold"
                                >
                                    Entrar
                                </Link>
                                <Link
                                    href="#contato"
                                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition text-white font-semibold"
                                >
                                    Adquirir Acesso
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMenuAberto(!menuAberto)}
                        className="md:hidden text-white hover:text-purple-400 transition"
                    >
                        {menuAberto ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{
                        opacity: menuAberto ? 1 : 0,
                        height: menuAberto ? "auto" : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="md:hidden overflow-hidden"
                >
                    <div className="px-4 py-4 border-t border-purple-500/30 space-y-3">
                        <Link
                            href="#features"
                            className="block text-gray-300 hover:text-white transition py-2"
                            onClick={() => setMenuAberto(false)}
                        >
                            Funcionalidades
                        </Link>
                        <Link
                            href="#precos"
                            className="block text-gray-300 hover:text-white transition py-2"
                            onClick={() => setMenuAberto(false)}
                        >
                            Preços
                        </Link>
                        {estaAutenticado && (
                            <Link
                                href="/painel"
                                className="block text-gray-300 hover:text-white transition py-2"
                                onClick={() => setMenuAberto(false)}
                            >
                                Painel
                            </Link>
                        )}
                        {estaAutenticado ? (
                            <button
                                onClick={manipuladorSaida}
                                className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition text-white font-semibold"
                            >
                                Sair
                            </button>
                        ) : (
                            <>
                                <Link
                                    href="/entrar"
                                    className="block px-4 py-2 text-center text-purple-400 hover:text-purple-300 transition font-semibold border border-purple-500/30 rounded-lg"
                                    onClick={() => setMenuAberto(false)}
                                >
                                    Entrar
                                </Link>
                                <Link
                                    href="#contato"
                                    className="block px-4 py-2 text-center bg-purple-600 hover:bg-purple-700 rounded-lg transition text-white font-semibold"
                                    onClick={() => setMenuAberto(false)}
                                >
                                    Adquirir Acesso
                                </Link>
                            </>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </>
    );
}

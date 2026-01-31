'use client';

import { useRouter } from 'next/navigation';
import { LogOut, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface NavbarProps {
    estaAutenticado?: boolean;
    usuarioNome?: string;
}

export function Navbar({ estaAutenticado = false, usuarioNome = 'Usuário' }: NavbarProps) {
    const router = useRouter();
    const [menuAberto, setMenuAberto] = useState(false);

    const manipularSaida = () => {
        sessionStorage.clear();
        router.push('/');
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-purple-500/20">
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold">⚡</span>
                    </div>
                    <span className="text-xl font-bold text-white hidden sm:inline">DNMENU</span>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-4">
                    {estaAutenticado && (
                        <>
                            <span className="text-gray-400 text-sm">Bem-vindo, {usuarioNome}</span>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={manipularSaida}
                                className="flex items-center gap-2"
                            >
                                <LogOut size={16} />
                                Sair
                            </Button>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 hover:bg-gray-800 rounded-lg transition"
                    onClick={() => setMenuAberto(!menuAberto)}
                >
                    {menuAberto ? (
                        <X className="w-5 h-5 text-white" />
                    ) : (
                        <Menu className="w-5 h-5 text-white" />
                    )}
                </button>
            </div>

            {/* Mobile Menu */}
            {menuAberto && (
                <div className="md:hidden border-t border-purple-500/20 bg-black/90 p-4 space-y-3">
                    {estaAutenticado && (
                        <>
                            <p className="text-gray-400 text-sm px-2">Bem-vindo, {usuarioNome}</p>
                            <Button
                                variant="destructive"
                                className="w-full flex items-center justify-center gap-2"
                                onClick={manipularSaida}
                            >
                                <LogOut size={16} />
                                Sair
                            </Button>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
}

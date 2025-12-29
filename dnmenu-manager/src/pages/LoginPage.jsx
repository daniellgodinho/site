import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { Logo } from '../components/Logo';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const { error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            setError(error.message);
        } else {
            navigate('/dashboard');
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-black to-black"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 w-full max-w-md"
            >
                {/* Fundo do card mais escuro com gradiente preto */}
                <div className="bg-gradient-to-br from-zinc-950/95 to-black/95 rounded-3xl p-10 border border-purple-600/20 shadow-2xl backdrop-blur-xl">
                    <div className="text-center mb-10">
                        <Logo className="w-28 h-28 mx-auto mb-8 drop-shadow-2xl" />  {/* Macacão dominante no login */}
                        <h2 className="text-2xl font-bold text-white">Dashboard</h2>
                        <p className="text-gray-400 mt-2">Acesse o painel administrativo</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-zinc-900/70 border border-purple-600/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
                                placeholder="seu@email.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Senha</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-zinc-900/70 border border-purple-600/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        {error && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 bg-red-900/30 border border-red-600/50 rounded-xl text-red-400 text-sm">
                                {error}
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-purple-600/50 disabled:opacity-70"
                        >
                            {isLoading ? 'Entrando...' : 'Entrar'}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <Link to="/" className="text-purple-400 hover:text-purple-300 text-sm transition">
                            ← Voltar para Home
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
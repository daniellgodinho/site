import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
export default function ResellerAuth() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const { data, error } = await supabase
            .from('resellers')
            .select('*')
            .eq('password', password)
            .maybeSingle(); // <-- MUDANÇA AQUI: evita erro 406

        if (error || !data) {
            setError('Senha inválida. Tente novamente.');
            setLoading(false);
            return;
        }

        sessionStorage.setItem('reseller', data.name);
        sessionStorage.setItem('discord_link', data.discord_link || '');
        sessionStorage.setItem('isMaster', data.name === 'Indefinido' ? 'true' : 'false');

        setLoading(false);
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-black to-black"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 w-full max-w-md"
            >
                <div className="bg-gradient-to-br from-zinc-950/95 to-black/95 rounded-3xl p-12 border border-purple-600/30 shadow-2xl backdrop-blur-xl">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold mb-4">Acesso Revendedor</h2>
                        <p className="text-gray-400 text-lg">Digite a senha da sua dashboard</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Digite a senha..."
                            className="w-full px-6 py-5 bg-zinc-900/70 border border-purple-600/40 rounded-2xl text-white text-lg focus:outline-none focus:border-purple-500 transition-all duration-300 placeholder-gray-500"
                            required
                            autoFocus
                            disabled={loading}
                        />

                        {error && (
                            <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-red-400 text-center font-medium"
                            >
                                {error}
                            </motion.p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 rounded-2xl font-bold text-xl transition-all duration-300 shadow-xl shadow-purple-600/50 disabled:opacity-70"
                        >
                            {loading ? 'Verificando...' : 'Entrar no Dashboard'}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <button
                            onClick={() => navigate('/')}
                            className="text-purple-400 hover:text-purple-300 text-sm transition"
                        >
                            ← Voltar para Home
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
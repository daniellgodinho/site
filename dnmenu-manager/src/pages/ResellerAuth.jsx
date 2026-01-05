// src/pages/ResellerAuth.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import monkeyLogo from '../assets/monkeyLogo.png'; // ← Import direto da logo

export default function ResellerAuth() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        console.log('Tentando login com senha:', password); // DEBUG

        const { data, error: supabaseError } = await supabase
            .from('resellers')
            .select('*')
            .eq('password', password)
            .limit(1)
            .maybeSingle();

        console.log('Resposta do Supabase:', { data, error: supabaseError }); // DEBUG

        if (supabaseError || !data) {
            console.log('Falha: senha não encontrada ou erro:', supabaseError);
            setError('Senha inválida. Tente novamente. ');
            setLoading(false);
            return;
        }

        console.log('Login sucesso! Revendedor:', data.name);

        sessionStorage.setItem('reseller', data.name);
        sessionStorage.setItem('discord_link', data.discord_link || '');
        sessionStorage.setItem('isMaster', data.name === 'DN Softwares (Oficial)' ? 'true' : 'false');

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
                        {/* Logo importada diretamente */}
                        <img
                            src={monkeyLogo}
                            alt="DN Menu Logo"
                            className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 mx-auto mb-8 drop-shadow-2xl drop-shadow-purple-600/50 object-contain"
                        />
                        <h2 className="text-3xl font-bold mb-4">Acesso Revendedor</h2>
                        <p className="text-gray-400 text-lg">Digite a senha do seu reseller</p>
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
                            className="w-full py-5 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 rounded-2xl font-bold text-xl transition-all duration-300 shadow-xl shadow-purple-600/50 disabled:opacity-70 disabled:cursor-not-allowed"
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
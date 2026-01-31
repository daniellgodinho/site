"use client";

export const dynamic = 'force-dynamic';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, Chrome, Github } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/Botao";
import { useAutenticacao } from "@/hooks/useAutenticacao";

const PaginaEntrar = () => {
    const router = useRouter();
    const { fazerLogin, carregando } = useAutenticacao();
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");
    const [lembrarme, setLembrarme] = useState(false);

    const manipularEnvio = async (e: React.FormEvent) => {
        e.preventDefault();
        setErro("");

        if (!email || !senha) {
            setErro("Por favor, preencha todos os campos.");
            return;
        }

        try {
            await fazerLogin({ nomeUsuario: email, senha });
            router.push("/dashboard");
        } catch (err) {
            setErro("Email ou senha inválidos.");
        }
    };

    const variántesAcontainer = {
        escondido: { opacity: 0 },
        visivel: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const varianteItem = {
        escondido: { opacity: 0, y: 20 },
        visivel: {
            opacity: 1,
            y: 0,
        },
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-600 to-purple-900 flex items-center justify-center p-4">
            {/* Animação de Fundo */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, 0],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full opacity-20 blur-3xl"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.15, 1],
                        rotate: [0, -5, 0],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute bottom-0 left-0 w-80 h-80 bg-purple-400 rounded-full opacity-20 blur-3xl"
                />
            </div>

            {/* Conteúdo */}
            <motion.div
                initial="escondido"
                animate="visivel"
                variants={variántesAcontainer}
                className="relative z-10 w-full max-w-md"
            >
                {/* Seção de Logo */}
                <motion.div
                    variants={varianteItem}
                    className="text-center mb-8"
                >
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-xl">⚡</span>
                        </div>
                        <span className="text-white text-2xl font-bold tracking-tight">
                            DNMENU
                        </span>
                    </div>
                    <p className="text-white/70 text-sm">
                        Gerenciador de Menus Inteligente
                    </p>
                </motion.div>

                {/* Card */}
                <motion.div
                    variants={varianteItem}
                    className="bg-white/95 backdrop-blur rounded-2xl p-8 shadow-2xl"
                >
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">Bem-vindo</h1>
                        <p className="text-gray-600 text-sm mt-2">
                            Entre com sua conta para continuar
                        </p>
                    </div>

                    {/* Error Message */}
                    {erro && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg"
                        >
                            <p className="text-red-700 text-sm font-medium">{erro}</p>
                        </motion.div>
                    )}

                    {/* Form */}
                    <form onSubmit={manipularEnvio} className="space-y-4 mb-6">
                        <motion.div variants={varianteItem}>
                            <label className="block text-xs font-bold text-gray-700 mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    type="email"
                                    placeholder="seu@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-purple-600/20 rounded-lg py-2.5 pl-10 pr-4 text-sm"
                                />
                            </div>
                        </motion.div>

                        <motion.div variants={varianteItem}>
                            <label className="block text-xs font-bold text-gray-700 mb-2">
                                Senha
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
                                    className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-purple-600/20 rounded-lg py-2.5 pl-10 pr-4 text-sm"
                                />
                            </div>
                        </motion.div>

                        {/* Remember Me & Forgot Password */}
                        <motion.div
                            variants={varianteItem}
                            className="flex items-center justify-between text-sm"
                        >
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={lembrarme}
                                    onChange={(e) => setLembrarme(e.target.checked)}
                                    className="w-4 h-4 rounded border-gray-300 text-purple-600 accent-purple-600"
                                />
                                <span className="text-gray-700 font-medium">Lembre-me</span>
                            </label>
                            <Link
                                href="/esqueci-senha"
                                className="text-purple-600 hover:text-purple-700 font-semibold"
                            >
                                Esqueceu a senha?
                            </Link>
                        </motion.div>

                        {/* Submit Button */}
                        <motion.div
                            variants={varianteItem}
                            className="pt-2"
                        >
                            <Button
                                variante="primario"
                                classe="w-full py-2.5 rounded-lg font-bold text-sm"
                                desabilitado={carregando}
                            >
                                {carregando ? "Entrando..." : "Entrar"}
                            </Button>
                        </motion.div>
                    </form>

                    {/* Divider */}
                    <motion.div
                        variants={varianteItem}
                        className="relative mb-6"
                    >
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="px-2 bg-white text-gray-600 font-medium">
                                ou continue com
                            </span>
                        </div>
                    </motion.div>

                    {/* Social Login */}
                    <motion.div
                        variants={varianteItem}
                        className="grid grid-cols-2 gap-3 mb-6"
                    >
                        <button
                            type="button"
                            className="flex items-center justify-center gap-2 py-2.5 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors font-semibold text-sm text-gray-700"
                        >
                            <Chrome className="w-4 h-4" /> Google
                        </button>
                        <button
                            type="button"
                            className="flex items-center justify-center gap-2 py-2.5 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors font-semibold text-sm text-gray-700"
                        >
                            <Github className="w-4 h-4" /> GitHub
                        </button>
                    </motion.div>

                    {/* Footer */}
                    <motion.div
                        variants={varianteItem}
                        className="text-center text-sm text-gray-600"
                    >
                        Não tem uma conta?{" "}
                        <Link
                            href="/registrar"
                            className="text-purple-600 font-bold hover:text-purple-700"
                        >
                            Registre-se aqui
                        </Link>
                    </motion.div>
                </motion.div>

                {/* Security Badge */}
                <motion.div
                    variants={varianteItem}
                    className="text-center mt-6 text-white/60 text-xs"
                >
                    <p>🔒 Sua segurança é nossa prioridade</p>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default PaginaEntrar;

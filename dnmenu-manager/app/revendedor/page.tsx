"use client";

export const dynamic = 'force-dynamic';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    Shield,
    Lock,
    Eye,
    EyeOff,
    CheckCircle,
    AlertCircle,
    Zap,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ValidacaoAutenticacao {
    estaValido: boolean;
    mensagem: string;
    tipo: "sucesso" | "erro" | "aviso";
}

const PaginaAutenticacaoRevendedor = () => {
    const router = useRouter();
    const [nomeUsuario, setNomeUsuario] = useState("");
    const [chaveAcesso, setChaveAcesso] = useState("");
    const [mostraSenha, setMostraSenha] = useState(false);
    const [carregando, setCarregando] = useState(false);
    const [validacao, setValidacao] = useState<ValidacaoAutenticacao | null>(
        null
    );

    const validarCredenciais = (): ValidacaoAutenticacao => {
        if (!nomeUsuario.trim()) {
            return {
                estaValido: false,
                mensagem: "Nome de usuário é obrigatório",
                tipo: "erro",
            };
        }
        if (!chaveAcesso.trim()) {
            return {
                estaValido: false,
                mensagem: "Chave de acesso é obrigatória",
                tipo: "erro",
            };
        }
        if (nomeUsuario.length < 3) {
            return {
                estaValido: false,
                mensagem: "Nome de usuário deve ter pelo menos 3 caracteres",
                tipo: "aviso",
            };
        }
        if (chaveAcesso.length < 8) {
            return {
                estaValido: false,
                mensagem: "Chave de acesso deve ter pelo menos 8 caracteres",
                tipo: "aviso",
            };
        }
        return {
            estaValido: true,
            mensagem: "Credenciais válidas",
            tipo: "sucesso",
        };
    };

    const manipularAutenticacao = async (e: React.FormEvent) => {
        e.preventDefault();
        const validacaoResult = validarCredenciais();
        setValidacao(validacaoResult);

        if (!validacaoResult.estaValido) {
            return;
        }

        setCarregando(true);

        try {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            setValidacao({
                estaValido: true,
                mensagem: "✅ Autenticação realizada com sucesso!",
                tipo: "sucesso",
            });
            setTimeout(() => {
                router.push("/dashboard");
            }, 1000);
        } catch (err) {
            setValidacao({
                estaValido: false,
                mensagem: "❌ Falha na autenticação. Tente novamente.",
                tipo: "erro",
            });
        } finally {
            setCarregando(false);
        }
    };

    const variantesContainer = {
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
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated Background */}
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
                    className="absolute top-0 right-0 w-96 h-96 bg-purple-600 rounded-full opacity-10 blur-3xl"
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
                    className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600 rounded-full opacity-10 blur-3xl"
                />
            </div>
            {/* Main Content */}
            <motion.div
                initial="escondido"
                animate="visivel"
                variants={variantesContainer}
                className="relative z-10 w-full max-w-md"
            >
                {/* Header Section */}
                <motion.div
                    variants={varianteItem}
                    className="text-center mb-8"
                >
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-purple-400 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-600/30">
                            <Shield className="text-white w-7 h-7" />
                        </div>
                        <div className="text-left">
                            <h1 className="text-2xl font-black bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                                DNMENU
                            </h1>
                            <p className="text-xs text-gray-400">Revendedor</p>
                        </div>
                    </div>
                    <p className="text-gray-400 text-sm">
                        Portal de Autenticação Seguro para Revendedores
                    </p>
                </motion.div>
                {/* Main Card */}
                <motion.div
                    variants={varianteItem}
                    className="bg-gray-800/90 backdrop-blur-2xl rounded-2xl p-8 border border-gray-700 shadow-2xl"
                >
                    {/* Title */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-black text-white mb-2">
                            Acesso Revendedor
                        </h2>
                        <p className="text-gray-400 text-sm">
                            Faça login com suas credenciais de revendedor
                        </p>
                    </div>
                    {/* Validation Message */}
                    {validacao && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`p-4 rounded-xl mb-6 flex items-start gap-3 ${validacao.tipo === "sucesso"
                                ? "bg-green-900/50 border border-green-600/30"
                                : validacao.tipo === "erro"
                                    ? "bg-red-900/50 border border-red-600/30"
                                    : "bg-yellow-900/50 border border-yellow-600/30"
                                }`}
                        >
                            {validacao.tipo === "sucesso" ? (
                                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                            ) : (
                                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                            )}
                            <p
                                className={`text-sm font-semibold ${validacao.tipo === "sucesso"
                                    ? "text-green-400"
                                    : validacao.tipo === "erro"
                                        ? "text-red-400"
                                        : "text-yellow-400"
                                    }`}
                            >
                                {validacao.mensagem}
                            </p>
                        </motion.div>
                    )}
                    {/* Form */}
                    <form onSubmit={manipularAutenticacao} className="space-y-5 mb-6">
                        {/* Username Field */}
                        <motion.div variants={varianteItem}>
                            <label className="block text-xs font-bold text-gray-300 mb-2">
                                Nome de Usuário
                            </label>
                            <Input
                                type="text"
                                placeholder="seu_usuario"
                                value={nomeUsuario}
                                onChange={(e) => setNomeUsuario(e.target.value)}
                                className="w-full bg-gray-900 border-gray-700 text-white placeholder-gray-500 focus:bg-gray-800 focus:border-purple-500/50 rounded-lg py-2.5 px-4 text-sm"
                            />
                        </motion.div>
                        {/* Password Field */}
                        <motion.div variants={varianteItem}>
                            <label className="block text-xs font-bold text-gray-300 mb-2">
                                Chave de Acesso
                            </label>
                            <div className="relative">
                                <Input
                                    type={mostraSenha ? "text" : "password"}
                                    placeholder="••••••••••••"
                                    value={chaveAcesso}
                                    onChange={(e) => setChaveAcesso(e.target.value)}
                                    className="w-full bg-gray-900 border-gray-700 text-white placeholder-gray-500 focus:bg-gray-800 focus:border-purple-500/50 rounded-lg py-2.5 px-4 pr-12 text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setMostraSenha(!mostraSenha)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-400 transition"
                                >
                                    {mostraSenha ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                        </motion.div>
                        {/* Submit Button */}
                        <motion.div
                            variants={varianteItem}
                            className="pt-2"
                        >
                            <Button
                                variant="default"
                                className="w-full py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700"
                                disabled={carregando}
                            >
                                {carregando ? (
                                    <>
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{
                                                duration: 1,
                                                repeat: Infinity,
                                                ease: "linear",
                                            }}
                                            className="w-4 h-4 border-2 border-transparent border-t-white rounded-full"
                                        />
                                        Autenticando...
                                    </>
                                ) : (
                                    <>
                                        <Lock className="w-4 h-4" />
                                        Autenticar
                                    </>
                                )}
                            </Button>
                        </motion.div>
                    </form>
                    {/* Security Info */}
                    <motion.div
                        variants={varianteItem}
                        className="space-y-3 pt-4 border-t border-gray-700"
                    >
                        <h3 className="text-xs font-bold text-gray-300 flex items-center gap-2">
                            <Shield className="w-3.5 h-3.5 text-purple-400" />
                            Informações de Segurança
                        </h3>
                        <div className="space-y-2 text-xs text-gray-400">
                            <p className="flex items-center gap-2">
                                <CheckCircle className="w-3 h-3 text-green-500" />
                                Conexão criptografada
                            </p>
                            <p className="flex items-center gap-2">
                                <CheckCircle className="w-3 h-3 text-green-500" />
                                Autenticação de dois fatores disponível
                            </p>
                            <p className="flex items-center gap-2">
                                <CheckCircle className="w-3 h-3 text-green-500" />
                                Logs de acesso monitorados
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
                {/* Support Link */}
                <motion.div
                    variants={varianteItem}
                    className="text-center mt-6"
                >
                    <p className="text-gray-400 text-xs">
                        Problemas ao acessar?{" "}
                        <a href="#suporte" className="text-purple-400 hover:text-purple-300 font-semibold">
                            Contate o suporte
                        </a>
                    </p>
                </motion.div>
                {/* Status Badge */}
                <motion.div
                    variants={varianteItem}
                    className="flex justify-center gap-3 mt-6"
                >
                    <Badge variant="default" className="bg-green-900/50 text-green-400 border-green-600/30">
                        <Zap className="w-3 h-3 mr-1" />
                        Sistema Online
                    </Badge>
                    <Badge variant="secondary" className="bg-blue-900/50 text-blue-400 border-blue-600/30">
                        Seguro TLS 1.3
                    </Badge>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default PaginaAutenticacaoRevendedor;
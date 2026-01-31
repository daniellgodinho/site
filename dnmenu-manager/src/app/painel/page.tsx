"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, LogOut } from "lucide-react";

interface Usuario {
    nomeUsuario: string;
    duracao: string;
    expiracao?: string;
    criadoEm: string;
}

export default function PaginaPainel() {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [usuariosFarm, setUsuariosFarm] = useState<Usuario[]>([]);
    const [novoUsuario, setNovoUsuario] = useState("");
    const [novaDataExpi, setNovaDataExpi] = useState("");
    const [abaDirecao, setAbaDirecao] = useState("usuarios");
    const [carregando, setCarregando] = useState(true);
    const [nomeRevendedor, setNomeRevendedor] = useState("");
    const roteador = useRouter();

    useEffect(() => {
        const nome = sessionStorage.getItem("reseller") || "Sem nome";
        setNomeRevendedor(nome);
    }, []);

    const buscarUsuarios = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from("user_lists")
                .select("*")
                .eq("reseller", nomeRevendedor)
                .single();

            if (error && error.code !== "PGRST116") throw error;

            if (data) {
                const parseadoUsuarios = data.users
                    ?.split(",")
                    .filter(Boolean)
                    .map((s: string) => {
                        const [nomeUsuario, duracao = "vitalicio", expiracao = "", criadoEm = new Date().toISOString()] = s.split("|");
                        return { nomeUsuario, duracao, expiracao, criadoEm };
                    }) || [];

                const parseadoFarm = data.users_farm
                    ?.split(",")
                    .filter(Boolean)
                    .map((s: string) => {
                        const [nomeUsuario, duracao = "vitalicio", expiracao = "", criadoEm = new Date().toISOString()] = s.split("|");
                        return { nomeUsuario, duracao, expiracao, criadoEm };
                    }) || [];

                setUsuarios(parseadoUsuarios);
                setUsuariosFarm(parseadoFarm);
            }
        } catch (erro) {
            console.error("Erro ao buscar usuários:", erro);
        } finally {
            setCarregando(false);
        }
    }, [nomeRevendedor]);

    useEffect(() => {
        if (!sessionStorage.getItem("reseller")) {
            roteador.push("/entrar");
            return;
        }
        buscarUsuarios();
    }, [buscarUsuarios, roteador]);

    const manipuladorSaida = () => {
        sessionStorage.clear();
        roteador.push("/");
    };

    if (carregando) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-black flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-12 h-12 border-4 border-purple-600/30 border-t-purple-600 rounded-full"
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-black text-white">
            <Navbar estaAutenticado={true} usuarioNome={nomeRevendedor} />
            <div className="pt-24 px-4 max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-4xl font-bold text-purple-400 mb-2">Painel de Controle</h1>
                            <p className="text-gray-400">Gerenciar licenças e usuários</p>
                        </div>
                        <Button
                            variant="destructive"
                            onClick={manipuladorSaida}
                            className="flex items-center gap-2"
                        >
                            <LogOut size={18} />
                            Sair
                        </Button>
                    </div>
                </motion.div>
                {/* Abas */}
                <div className="flex gap-4 mb-8">
                    <button
                        onClick={() => setAbaDirecao("usuarios")}
                        className={`px-6 py-2 rounded-lg font-semibold transition ${abaDirecao === "usuarios"
                            ? "bg-purple-600 text-white"
                            : "bg-black/50 text-gray-400 hover:text-white"
                            }`}
                    >
                        Usuários
                    </button>
                    <button
                        onClick={() => setAbaDirecao("farm")}
                        className={`px-6 py-2 rounded-lg font-semibold transition ${abaDirecao === "farm"
                            ? "bg-purple-600 text-white"
                            : "bg-black/50 text-gray-400 hover:text-white"
                            }`}
                    >
                        Farm
                    </button>
                </div>
                {/* Conteúdo da Aba */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8"
                >
                    {/* Adicionar Novo */}
                    <div className="bg-black/50 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6">
                        <h2 className="text-xl font-bold text-purple-400 mb-4 flex items-center gap-2">
                            <Plus size={20} />
                            Adicionar Novo Usuário
                        </h2>
                        <form className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <input
                                    type="text"
                                    value={novoUsuario}
                                    onChange={(e) => setNovoUsuario(e.target.value)}
                                    placeholder="Nome do usuário"
                                    className="px-4 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-400"
                                />
                                <input
                                    type="date"
                                    value={novaDataExpi}
                                    onChange={(e) => setNovaDataExpi(e.target.value)}
                                    className="px-4 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-400"
                                />
                                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                                    <Plus size={18} className="inline mr-2" />
                                    Adicionar
                                </Button>
                            </div>
                        </form>
                    </div>
                    {/* Lista de Usuários */}
                    <div className="bg-black/50 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6">
                        <h2 className="text-xl font-bold text-purple-400 mb-6">
                            {abaDirecao === "usuarios" ? "Usuários DN Menu" : "Usuários DN Farm"}
                        </h2>
                        <div className="space-y-3">
                            {(abaDirecao === "usuarios" ? usuarios : usuariosFarm).length === 0 ? (
                                <p className="text-gray-500 text-center py-8">Nenhum usuário adicionado</p>
                            ) : (
                                (abaDirecao === "usuarios" ? usuarios : usuariosFarm).map((usuario, indice) => (
                                    <motion.div
                                        key={indice}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="flex items-center justify-between p-4 bg-purple-600/10 border border-purple-500/20 rounded-lg hover:border-purple-500/50 transition"
                                    >
                                        <div>
                                            <p className="font-semibold text-white">{usuario.nomeUsuario}</p>
                                            <p className="text-sm text-gray-400">
                                                Duração: {usuario.duracao}
                                                {usuario.expiracao && ` • Expira: ${new Date(usuario.expiracao).toLocaleDateString("pt-BR")}`}
                                            </p>
                                        </div>
                                        <button className="p-2 hover:bg-red-600/20 rounded-lg transition">
                                            <Trash2 size={18} className="text-red-400" />
                                        </button>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
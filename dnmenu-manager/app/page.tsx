"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/Botao";
import {
    CheckCircle,
    Shield,
    Zap,
    Users,
    Cpu,
    Lock,
    ArrowRight,
    Star,
} from "lucide-react";

const variantesAnimacao = {
    oculto: { opacity: 0, y: 20 },
    visivel: { opacity: 1, y: 0 },
};

function SecaoHero() {
    return (
        <section className="relative min-h-screen pt-24 px-4 flex items-center overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
                    transition={{ duration: 20, repeat: Infinity }}
                    className="absolute top-0 right-0 w-96 h-96 bg-purple-600 rounded-full opacity-20 blur-3xl"
                />
                <motion.div
                    animate={{ scale: [1, 1.15, 1], rotate: [0, -5, 0] }}
                    transition={{ duration: 25, repeat: Infinity }}
                    className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600 rounded-full opacity-20 blur-3xl"
                />
            </div>

            {/* Content */}
            <div className="max-w-6xl mx-auto relative z-10 w-full">
                <motion.div
                    initial="oculto"
                    animate="visivel"
                    variants={variantesAnimacao}
                    transition={{ duration: 0.8 }}
                    className="text-center"
                >
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 bg-purple-100 text-purple-600 px-4 py-2 rounded-full mb-6"
                    >
                        <Zap className="w-4 h-4" />
                        <span className="text-sm font-bold">
                            Revolucionando os Menus de Roleplay
                        </span>
                    </motion.div>

                    {/* Main Heading */}
                    <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-purple-600 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                        DNMENU
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed max-w-3xl mx-auto">
                        O menu mais avançado para Roleplay no Roblox. Refinado, elegante,
                        seguro e único.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                        <Link href="/entrar">
                            <Button
                                variante="primario"
                                classe="px-8 py-3 rounded-xl font-bold flex items-center gap-2"
                            >
                                Acessar Agora
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </Link>
                        <button className="px-8 py-3 bg-white/10 hover:bg-white/20 border-2 border-purple-400/50 text-gray-900 rounded-xl font-bold transition-all">
                            Documentação
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
                        {[
                            { numero: "5K+", rotulo: "Usuários Ativos" },
                            { numero: "99.9%", rotulo: "Uptime" },
                            { numero: "24/7", rotulo: "Suporte" },
                            { numero: "100%", rotulo: "Segurança" },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className="text-center"
                            >
                                <p className="text-3xl md:text-4xl font-black text-purple-600">
                                    {item.numero}
                                </p>
                                <p className="text-gray-600 text-sm mt-1">{item.rotulo}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

function SecaoFuncionalidades() {
    const funcionalidades = [
        {
            icone: Shield,
            titulo: "Segurança de Ponta",
            descricao: "Proteção avançada contra ataques e fraudes",
        },
        {
            icone: Zap,
            titulo: "Ultra Rápido",
            descricao: "Performance otimizada para melhor experiência",
        },
        {
            icone: Users,
            titulo: "Suporte Premium",
            descricao: "Equipe dedicada disponível 24/7",
        },
        {
            icone: Cpu,
            titulo: "Tecnologia IA",
            descricao: "Inteligência artificial integrada",
        },
        {
            icone: Lock,
            titulo: "Criptografia Total",
            descricao: "Dados protegidos com encriptação",
        },
        {
            icone: CheckCircle,
            titulo: "Fácil de Usar",
            descricao: "Interface intuitiva e amigável",
        },
    ];

    return (
        <section className="py-20 px-4 bg-gradient-to-b from-white to-gray-50">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial="oculto"
                    whileInView="visivel"
                    variants={variantesAnimacao}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                        Funcionalidades Incríveis
                    </h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Tudo que você precisa para gerenciar seus menus de forma eficiente
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {funcionalidades.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-white p-8 rounded-2xl border border-gray-200 hover:border-purple-300 shadow-sm hover:shadow-xl transition-all"
                        >
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                                <item.icone className="w-6 h-6 text-purple-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                {item.titulo}
                            </h3>
                            <p className="text-gray-600 text-sm">{item.descricao}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function SecaoPrecos() {
    const planos = [
        {
            nome: "Básico",
            preco: "R$ 9,99",
            descricao: "Para começar",
            itens: ["5 Menus", "Suporte por Email", "Atualizações"],
        },
        {
            nome: "Profissional",
            preco: "R$ 29,99",
            descricao: "Mais popular",
            destaque: true,
            itens: [
                "50 Menus",
                "Suporte Prioritário",
                "Atualizações Premium",
                "Analytics Avançado",
            ],
        },
        {
            nome: "Empresarial",
            preco: "Contato",
            descricao: "Para grandes equipes",
            itens: [
                "Menus Ilimitados",
                "Suporte 24/7",
                "Customização Total",
                "API Acesso",
            ],
        },
    ];

    return (
        <section className="py-20 px-4 bg-white">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial="oculto"
                    whileInView="visivel"
                    variants={variantesAnimacao}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                        Preços Simples e Transparentes
                    </h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Escolha o plano perfeito para suas necessidades
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {planos.map((plano, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className={`relative rounded-2xl p-8 border transition-all ${plano.destaque
                                    ? "border-purple-600 bg-gradient-to-br from-purple-50 to-white ring-2 ring-purple-200"
                                    : "border-gray-200 bg-white hover:border-purple-300"
                                }`}
                        >
                            {plano.destaque && (
                                <div className="absolute top-4 right-4 flex items-center gap-1 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                                    <Star className="w-3 h-3" />
                                    Mais Popular
                                </div>
                            )}

                            <h3 className="text-2xl font-black text-gray-900 mb-2">
                                {plano.nome}
                            </h3>
                            <p className="text-gray-600 text-sm mb-6">{plano.descricao}</p>
                            <p className="text-4xl font-black text-purple-600 mb-6">
                                {plano.preco}
                                {!plano.preco.includes("Contato") && (
                                    <span className="text-lg text-gray-600">/mês</span>
                                )}
                            </p>

                            <Button
                                variante={plano.destaque ? "primario" : "primario"}
                                classe={`w-full py-2.5 rounded-lg font-bold mb-8 ${plano.destaque ? "" : "bg-gray-100 text-gray-900"
                                    }`}
                            >
                                Começar Agora
                            </Button>

                            <div className="space-y-3">
                                {plano.itens.map((item, j) => (
                                    <div key={j} className="flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                        <span className="text-gray-700 text-sm">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function SecaoCTA() {
    return (
        <section className="py-20 px-4 bg-gradient-to-r from-purple-600 to-purple-900">
            <div className="max-w-4xl mx-auto text-center">
                <motion.div
                    initial="oculto"
                    whileInView="visivel"
                    variants={variantesAnimacao}
                    viewport={{ once: true }}
                >
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                        Pronto para Começar?
                    </h2>
                    <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
                        Junte-se a milhares de usuários que já estão transformando seus menus
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/entrar">
                            <button className="px-8 py-3 bg-white text-purple-600 rounded-xl font-bold hover:bg-gray-100 transition-all">
                                Entrar Agora
                            </button>
                        </Link>
                        <button className="px-8 py-3 border-2 border-white text-white rounded-xl font-bold hover:bg-white/10 transition-all">
                            Falar com Suporte
                        </button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

function RodaPe() {
    return (
        <footer className="bg-gray-900 text-white py-16 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <h3 className="font-black text-lg mb-4">DNMENU</h3>
                        <p className="text-gray-400 text-sm">
                            Revolucionando menus para Roblox
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">Produto</h4>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li>
                                <a href="#" className="hover:text-white transition">
                                    Características
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white transition">
                                    Preços
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white transition">
                                    Segurança
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">Suporte</h4>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li>
                                <a href="#" className="hover:text-white transition">
                                    Documentação
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white transition">
                                    API
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white transition">
                                    Status
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">Legal</h4>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li>
                                <a href="#" className="hover:text-white transition">
                                    Privacidade
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white transition">
                                    Termos
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white transition">
                                    Contato
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
                    <p>&copy; 2024 DNMENU. Todos os direitos reservados.</p>
                </div>
            </div>
        </footer>
    );
}

export default function PaginaPrincipal() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-white to-gray-50">
            <Navbar />
            <SecaoHero />
            <SecaoFuncionalidades />
            <SecaoPrecos />
            <SecaoCTA />
            <RodaPe />
        </div>
    );
}

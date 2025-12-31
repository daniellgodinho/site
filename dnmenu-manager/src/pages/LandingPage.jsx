// src/pages /LandingPage.jsx - Complete with all logic, monkey logo, darker gradients, improved cards, smooth transitions

import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
    Menu, X, Package, Crosshair, Shield, Eye, MousePointer, Bookmark, Car, Users as UsersIcon,
    Lock, Bomb, User, Toolbox, Building2, CheckCircle, HandFist
} from 'lucide-react';
import { FaDiscord } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { supabase } from '../supabase';

export default function LandingPage() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [resellers, setResellers] = useState([]);

    useEffect(() => {
        const fetchResellers = async () => {
            const { data } = await supabase.from('resellers').select('*');
            setResellers(data || []);
        };
        fetchResellers();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-black to-zinc-950 text-white overflow-x-hidden">
            <Header mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
            <Hero />
            <Problem />
            <Solution />
            <KeyFeatures />
            <AllFeatures />
            <Pricing />
            <Compatibility />
            <Revendedores resellers={resellers} />
            <Termos />
            <Footer />
        </div>
    );
}

function Header({ mobileMenuOpen, setMobileMenuOpen }) {
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <motion.header
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black/90 backdrop-blur-xl border-b border-purple-600/20' : 'bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <Link to="/" className="flex items-center space-x-3">
                        <Logo className="w-20 h-20 md:w-20 h-20 lg:w-40 h-40 drop-shadow-2xl" />
                        <span className="font-bold text-2xl bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent">
                            Home
                        </span>
                    </Link>
                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <a href="#features" className="text-gray-300 hover:text-white transition-colors">
                            Funções
                        </a>
                        <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">
                            Preços
                        </a>
                        <a href="https://discord.gg/k3CUqNs3UW" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                            Discord
                        </a>
                        <a href="#revendedores" className="text-gray-300 hover:text-white transition-colors">
                            Revendedores
                        </a>
                        <a href="#termos" className="text-gray-300 hover:text-white transition-colors">
                            Termos
                        </a>
                        <Link
                            to="/login"
                            className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 rounded-lg transition-all duration-300 shadow-lg shadow-purple-600/30"
                        >
                            Dashboard
                        </Link>
                    </nav>
                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden text-white p-2"
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="md:hidden py-4 space-y-4"
                    >
                        <a href="#features" className="block text-gray-300 hover:text-white transition-colors py-2">
                            Funções
                        </a>
                        <a href="#pricing" className="block text-gray-300 hover:text-white transition-colors py-2">
                            Preços
                        </a>
                        <a href="https://discord.gg/k3CUqNs3UW" target="_blank" rel="noopener noreferrer" className="block text-gray-300 hover:text-white transition-colors py-2">
                            Discord
                        </a>
                        <a href="#revendedores" className="block text-gray-300 hover:text-white transition-colors py-2">
                            Revendedores
                        </a>
                        <a href="#termos" className="block text-gray-300 hover:text-white transition-colors py-2">
                            Termos
                        </a>
                        <Link
                            to="/login"
                            className="block px-6 py-2.5 bg-purple-600 hover:bg-purple-700 rounded-lg transition-all duration-300 text-center"
                        >
                            Dashboard
                        </Link>
                    </motion.div>
                )}
            </div>
        </motion.header>
    );
}

function Hero() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section ref={ref} className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-purple-900/10"></div>
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
            <div className="max-w-7xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="text-center max-w-4xl mx-auto"
                >
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent"
                    >
                        DN Menu
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : {}}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-xl sm:text-2xl text-gray-300 mb-8 leading-relaxed"
                    >
                        O menu mais avançado para Roleplay no Roblox. <br />
                        Refinado, elegante e único.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <a
                            href="https://discord.gg/k3CUqNs3UW"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative px-8 py-4 bg-purple-600 rounded-xl font-semibold text-lg overflow-hidden transition-all duration-300 hover:scale-105 shadow-2xl shadow-purple-600/50"
                        >
                            <span className="relative z-10">Adquirir Acesso</span>
                            <div className="absolute inset-0 bg-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </a>
                        <a
                            href="#features"
                            className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-purple-500/50 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all duration-300"
                        >
                            Ver Funções
                        </a>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}

function Problem() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section ref={ref} className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent">
            <div className="max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-white">
                        O Desafio
                    </h2>
                    <p className="text-xl text-gray-400 leading-relaxed">
                        Servidores de Roleplay no Roblox são competitivos por natureza. Jogadores limitados por mecânicas padrão frequentemente encontram dificuldades em situações críticas, seja em combate, mobilidade ou gestão de recursos. A diferença entre sobreviver e perder tudo pode ser questão de milissegundos.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}

function Solution() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section ref={ref} className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-white">
                        A Solução
                    </h2>
                    <p className="text-xl text-gray-400 leading-relaxed mb-8">
                        DN Menu oferece controle total sobre o ambiente de jogo. Com 51 funções cuidadosamente desenvolvidas, você obtém vantagens táticas que transformam cada sessão. Não é sobre força bruta, mas sim sobre ter as ferramentas certas no momento certo.
                    </p>
                </motion.div>
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-purple-600/20 blur-3xl"></div>
                    <div className="relative bg-gradient-to-br from-[#2e2e2e] to-[#1a1a1a] rounded-3xl p-8 border border-purple-600/30 shadow-2xl">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span className="ml-4 text-gray-400 text-sm">DN Menu v4.5.3</span>
                        </div>
                        <div className="bg-black/50 rounded-xl p-6 font-mono text-sm">
                            <div className="text-purple-400 mb-2">[Sistema] Inicializando DN Menu...</div>
                            <div className="text-gray-400 mb-2">Carregando módulos de combate...</div>
                            <div className="text-green-400 mb-2">[OK] Aimbot ativo</div>
                            <div className="text-green-400 mb-2">[OK] ESP completo carregado</div>
                            <div className="text-green-400 mb-2">[OK] Invisible solo session inicializado</div>
                            <div className="text-green-400 mb-2">[OK] Deletar veículos pronto</div>
                            <div className="text-green-400 mb-2">[OK] Puxar armas habilitado</div>
                            <div className="text-purple-400 mt-4">51 funções disponíveis. Sistema operacional.</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function KeyFeatures() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const keyFeatures = [
        {
            icon: Package,
            title: "Manipulação de Porta-Malas",
            description: "Visualize e roube itens de qualquer porta-malas. Transferência instantânea de inventário sem interação direta."
        },
        {
            icon: Crosshair,
            title: "Puxar Armas Ghost",
            description: "Puxe armas sem gerar logs de eliminação. Sistema completamente bypassado para ações silenciosas."
        },
        {
            icon: Shield,
            title: "God Mode (Em desenvolvimento)",
            description: "Invulnerabilidade completa contra dano. Ignore todas as mecânicas de combate da cidade."
        },
        {
            icon: Eye,
            title: "ESP Completo",
            description: "Visualização através de paredes com Skeleton, RGB e detecção de administradores. Chams personalizáveis."
        },
        {
            icon: MousePointer,
            title: "Aimbot e Silent Configurável",
            description: "FOV ajustável, smoothness personalizável e wall check. Configurações suficientes para aparência legit."
        },
        {
            icon: Car,
            title: "Controle de Veículos",
            description: "Destranque, delete ou lance veículos de outras pessoas. Vehicle fly e noclip para se mover sem ser detectado."
        },
        {
            icon: UsersIcon,
            title: "Manipulação de Jogadores",
            description: "Comer jogadores (+18), elimine todos do servidor ou execute ações individuais específicas."
        },
        {
            icon: Lock,
            title: "Sistema de Bypass",
            description: "Proteção contra telagem e screenshare. Limpeza automática ao fechar o menu."
        }
    ];

    return (
        <section id="features" ref={ref} className="py-20 px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-white">
                        Funções Principais
                    </h2>
                    <p className="text-xl text-gray-400">
                        Recursos mais solicitados pelos usuários avançados
                    </p>
                </motion.div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {keyFeatures.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="group relative p-6 bg-gradient-to-br from-[#2e2e2e] to-[#1a1a1a] rounded-2xl border border-purple-600/20 hover:border-purple-600/50 transition-all duration-300"
                        >
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                <feature.icon className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-lg font-bold mb-2 text-white">{feature.title}</h3>
                            <p className="text-gray-400 text-sm">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function AllFeatures() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const allFeatures = {
        "Jogador": {
            icon: User,
            features: [
                "Speed Hack",
                "Velocidade ajustável",
                "Invulnerabilidade",
                "Noclip",
                "Invisible Solo Session"
            ]
        },
        "Visuais": {
            icon: Eye,
            features: [
                "ESP Jogadores",
                "ESP Skeleton",
                "ESP RGB",
                "ESP Admins",
                "Chams",
                "Fullbright",
                "Personalização de cores ESP",
                "Personalização Admin ESP",
                "Cores Chams personalizáveis"
            ]
        },
        "Combate": {
            icon: HandFist,
            features: [
                "Aimbot",
                "Silent Aim",
                "FOV Aimbot",
                "FOV Silent Aim",
                "Wall Check",
                "Smoothness",
                "Hitbox Expander",
                "Tamanho da Hitbox",
                "Transparência da Hitbox",
                "Lista de Amigos (Anti TK)"
            ]
        },
        "Exploits": {
            icon: Bomb,
            features: [
                "Puxar armas sem logs/verificação de time",
                "Comer jogadores (+18)",
                "Exorcismo",
                "Matar todos os jogadores (Kill All)",
                "Otimização de Performance"
            ]
        },
        "Veículos": {
            icon: Car,
            features: [
                "Destrancar Todos",
                "Auto Unlock",
                "Vehicle Fly",
                "Vehicle Noclip",
                "Vehicle Delete",
                "Teleporte para Veículo mais próximo",
                "Nem meu nem seu (Arremesar Veículo)"
            ]
        },
        "Porta-Malas": {
            icon: Package,
            features: [
                "Visualizar Porta-Malas de outras pessoas",
                "Clonar Inventário",
                "Roubar itens do Porta-Malas de outras pessoas",
                "Limpar UI do Porta-Malas, caso bugue"
            ]
        },
        "Lista de Jogadores": {
            icon: UsersIcon,
            features: [
                "Selecionar Jogador",
                "Limbar jogador com carro (Inspirado no Shark Menu Fivem)",
                "Teleportar para Jogador",
                "Adicionar Amigo (Anti TK)",
                "Remover Amigo"
            ]
        },
        "Segurança": {
            icon: Lock,
            features: [
                "Bypass Anti Cheat",
                "Bypass Screenshare/Telagem",
                "Menu único",
                "Desativar Funções",
                "Bypass Automático"
            ]
        }
    };

    return (
        <section ref={ref} className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-white">
                        51 Funções Disponíveis
                    </h2>
                    <p className="text-xl text-gray-400">
                        Arsenal completo organizado por categoria
                    </p>
                </motion.div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Object.entries(allFeatures).map(([category, data], catIndex) => {
                        const Icon = data.icon;
                        return (
                            <motion.div
                                key={category}
                                initial={{ opacity: 0, y: 30 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.5, delay: catIndex * 0.1 }}
                                className="bg-gradient-to-br from-[#2e2e2e] to-[#1a1a1a] rounded-2xl p-6 border border-purple-600/20"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-purple-600/20 border border-purple-600/40 rounded-lg flex items-center justify-center">
                                        <Icon className="w-5 h-5 text-purple-400" />
                                    </div>
                                    <h3 className="text-lg font-bold text-white">{category}</h3>
                                </div>
                                <ul className="space-y-2">
                                    {data.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-gray-300">
                                            <span className="text-purple-400 mt-1 text-xs">▸</span>
                                            <span className="text-sm">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

function Pricing() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const plans = [
        {
            name: "Diário",
            price: "R$ 20",
            duration: "24 horas",
            features: [
                "Acesso completo por 24h",
                "Todas as 51 funções",
                "Suporte via Discord"
            ],
            highlighted: false
        },
        {
            name: "Semanal",
            price: "R$ 35",
            duration: "7 dias",
            features: [
                "Acesso completo por 7 dias",
                "Todas as 51 funções",
                "Atualizações incluídas",
                "Suporte prioritário"
            ],
            highlighted: false
        },
        {
            name: "Mensal",
            price: "R$ 50",
            duration: "30 dias",
            features: [
                "Acesso completo por 30 dias",
                "Todas as 51 funções",
                "Atualizações constantes",
                "Suporte prioritário VIP"
            ],
            highlighted: false
        },
        {
            name: "Lifetime",
            price: "R$ 97,99",
            duration: "Vitalício",
            features: [
                "Acesso permanente",
                "Todas as 51 funções",
                "Atualizações constantes",
                "Suporte VIP vitalício",
                "Acesso prioritário a novos recursos",
                "Nunca expira"
            ],
            highlighted: true,
            badge: "Mais Vendido"
        },
        {
            name: "Revenda",
            price: "R$ 120",
            duration: "Painel completo",
            features: [
                "Painel de revenda completo",
                "Clientes ilimitados",
                "Criação automática de keys",
                "Todas as 51 funções",
                "Suporte técnico dedicado",
                "Ganhe dinheiro vendendo o menu mais procurado do cenário"
            ],
            highlighted: true,
            badge: "Ganhe Dinheiro"
        }
    ];

    return (
        <section id="pricing" ref={ref} className="py-32 px-4 sm:px-6 lg:px-8 relative bg-gradient-to-b from-black via-purple-900/10 to-black">
            <div className="max-w-7xl mx-auto">
                {/* Título */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 1 }}
                    className="text-center mb-24"
                >
                    <h2 className="text-5xl sm:text-6xl font-extrabold mb-6 bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent">
                        Escolha seu Plano
                    </h2>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                        Acesso imediato • Atualizações constantes • Suporte exclusivo no Discord
                    </p>
                </motion.div>

                {/* Cards gordinhos e responsivos */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 60, scale: 0.95 }}
                            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                            transition={{ duration: 0.8, delay: index * 0.15 }}
                            whileHover={{
                                y: -20,
                                scale: 1.05,
                                boxShadow: "0 40px 80px rgba(147, 51, 234, 0.3)"
                            }}
                            className={`relative p-12 rounded-3xl border-2 transition-all duration-700 shadow-2xl ${plan.highlighted
                                ? 'bg-gradient-to-br from-purple-900/40 to-purple-900/20 border-purple-500 shadow-purple-600/50'
                                : 'bg-gradient-to-br from-zinc-950/95 to-black/95 border-purple-600/40 hover:border-purple-500'
                                }`}
                        >
                            {/* Badge animado */}
                            {plan.badge && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.6, delay: 0.4 }}
                                    className={`absolute -top-6 left-1/2 -translate-x-1/2 px-8 py-3 rounded-full font-extrabold text-sm shadow-2xl whitespace-nowrap ${plan.name === "Revenda"
                                        ? 'bg-gradient-to-r from-purple-400 to-purple-300 text-black'
                                        : 'bg-gradient-to-r from-purple-600 to-purple-500 text-white'
                                        }`}
                                >
                                    {plan.badge}
                                </motion.div>
                            )}

                            <motion.h3
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-3xl font-bold text-center mb-10 text-white"
                            >
                                {plan.name}
                            </motion.h3>

                            <motion.div
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                                className="text-center mb-12"
                            >
                                <div className="text-7xl font-extrabold bg-gradient-to-r from-purple-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
                                    {plan.price}
                                </div>
                                <p className="text-gray-300 mt-4 text-xl">{plan.duration}</p>
                            </motion.div>

                            <ul className="space-y-6 mb-14">
                                {plan.features.map((feature, i) => (
                                    <motion.li
                                        key={i}
                                        initial={{ opacity: 0, x: -40 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.5 + i * 0.1 }}
                                        className="flex items-start text-gray-200"
                                    >
                                        <CheckCircle className="w-7 h-7 text-purple-400 mr-4 flex-shrink-0 mt-0.5" />
                                        <span className="text-lg leading-relaxed">{feature}</span>
                                    </motion.li>
                                ))}
                            </ul>

                            <motion.a
                                href="https://discord.gg/k3CUqNs3UW"
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.08 }}
                                whileTap={{ scale: 0.95 }}
                                className={`block w-full py-6 rounded-2xl text-center font-extrabold text-xl transition-all duration-300 shadow-xl ${plan.highlighted
                                    ? 'bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white'
                                    : 'bg-white/10 hover:bg-white/20 text-white border-2 border-purple-600/40'
                                    }`}
                            >
                                Adquirir Agora
                            </motion.a>
                        </motion.div>
                    ))}
                </div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 1, delay: 1 }}
                    className="text-center mt-24 text-gray-300 text-lg"
                >
                    Todos os planos incluem as 51 funções • Pagamento seguro • Ativação instantânea
                </motion.p>
            </div>
        </section>
    );
}

function Compatibility() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section ref={ref} className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="bg-gradient-to-br from-[#2e2e2e] to-[#1a1a1a] rounded-2xl p-8 border border-purple-600/30"
                >
                    <h2 className="text-3xl font-bold mb-6 text-center text-white">
                        Compatibilidade
                    </h2>
                    <div className="space-y-4 text-gray-300">
                        <div className="flex items-start gap-3">
                            <Toolbox className="w-6 h-6 text-purple-400 flex-shrink-0 mt-0.5" />
                            <p>
                                <strong className="text-white">A-Chassis:</strong> Compatível com todos os servidores que utilizam o sistema A-Chassis para veículos.
                            </p>
                        </div>
                        <div className="flex items-start gap-3">
                            <Crosshair className="w-6 h-6 text-purple-400 flex-shrink-0 mt-0.5" />
                            <p>
                                <strong className="text-white">ACS (Advanced Combat System):</strong> Suporte completo para servidores com sistema ACS de combate.
                            </p>
                        </div>
                        <div className="flex items-start gap-3">
                            <Shield className="w-6 h-6 text-purple-400 flex-shrink-0 mt-0.5" />
                            <p>
                                <strong className="text-white">Sistema de Proteção:</strong> Bypass integrado contra telagem e screenshare. Limpeza automática de rastros.
                            </p>
                        </div>
                        <div className="flex items-start gap-3">
                            <Building2 className="w-6 h-6 text-purple-400 flex-shrink-0 mt-0.5" />
                            <p>
                                <strong className="text-white">Servidores de Roleplay:</strong> Funciona em todas as principais cidades de RP que utilizam os sistemas mencionados.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

function Revendedores({ resellers }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section id="revendedores" ref={ref} className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-white">
                        Revendedores Autorizados
                    </h2>
                    <p className="text-xl text-gray-400">
                        Adquira com nossos parceiros oficiais
                    </p>
                </motion.div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {resellers.map((res, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-gradient-to-br from-[#2e2e2e] to-[#1a1a1a] rounded-2xl p-6 border border-purple-600/20 hover:border-purple-600/50 transition-all duration-300"
                        >
                            <h3 className="text-lg font-bold mb-4 text-white">{res.name}</h3>
                            <a
                                href={res.discord_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 rounded-lg font-semibold hover:bg-purple-500 transition-colors"
                            >
                                <FaDiscord className="w-5 h-5" />
                                Discord
                            </a>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function Termos() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const termsSections = [
        {
            title: "1. Aceitação dos Termos",
            icon: Bookmark,
            content: "1.1. Ao efetuar qualquer compra em nossa plataforma, você confirma que leu, compreendeu e concorda integralmente com os presentes Termos de Compra e Serviço.\n1.2. O uso contínuo de nossos produtos e serviços implica aceitação automática de quaisquer atualizações destes termos.\n1.3. Estes termos podem ser alterados a qualquer momento, sendo responsabilidade do usuário verificar periodicamente possíveis atualizações."
        },
        {
            title: "2. Natureza do Produto",
            icon: Bookmark,
            content: "2.1. Os produtos comercializados são licenças digitais de software com finalidade educacional e de entretenimento.\n2.2. AVISO IMPORTANTE: Por se tratar de software de modificação (cheats/hacks), existe risco inerente de banimento ou suspensão em plataformas de jogos. O usuário assume total responsabilidade pelo uso.\n2.3. Não nos responsabilizamos por banimentos, suspensões de contas, perda de dados ou quaisquer consequências resultantes do uso de nossos produtos.\n2.4. Trabalhamos continuamente para minimizar a detecção, mas não garantimos invisibilidade absoluta aos sistemas anti-cheat."
        },
        {
            title: "3. Processo de Compra e Entrega",
            icon: Bookmark,
            content: "3.1. Os produtos serão entregues exclusivamente após confirmação do pagamento pelo sistema.\n3.2. A entrega é realizada unicamente através de nossos canais oficiais. Não baixe ou aceite arquivos de fontes não verificadas ou terceiros.\n3.3. Após a compra, aguarde as instruções de entrega. É sua responsabilidade armazenar com segurança as credenciais e arquivos recebidos.\n3.4. O tempo de entrega pode variar conforme o método de pagamento utilizado (instantâneo para PIX, até 72h para boleto bancário)."
        },
        {
            title: "4. Confidencialidade",
            icon: Bookmark,
            content: "4.1. Você se compromete a não divulgar, compartilhar, revender ou distribuir os produtos adquiridos, informações técnicas, arquivos ou credenciais de acesso.\n4.2. O compartilhamento não autorizado resultará em banimento permanente de nosso banco de dados e cancelamento imediato da licença, sem direito a reembolso.\n4.3. Cada licença é pessoal e intransferível, vinculada ao comprador original."
        },
        {
            title: "5. Política de Reembolso",
            icon: Bookmark,
            content: "5.1. Devido à natureza digital e não revogável dos produtos (licenças de software), não oferecemos reembolso após a entrega.\n5.2. Todas as vendas são consideradas finais e irreversíveis, exceto em casos previstos por lei ou erro comprovado de cobrança.\n5.3. É responsabilidade do usuário verificar:\n* Compatibilidade do sistema operacional\n* Requisitos técnicos mínimos\n* Especificações do produto antes da compra\n5.4. Não há reembolso por incompatibilidade técnica, mudança de ideia, mau uso ou desconhecimento dos termos.\n5.5. Não oferecemos períodos de teste gratuito, dias grátis ou demonstrações para avaliação prévia."
        },
        {
            title: "6. Estornos e Disputas",
            icon: Bookmark,
            content: "6.1. Tentativas de abrir estorno (chargeback) no cartão de crédito, PayPal ou outros métodos de pagamento sem contato prévio resultará em:\n* Banimento permanente de nosso banco de dados\n* Bloqueio de futuras compras\n* Cancelamento imediato de todas as licenças ativas\n6.2. Em caso de problemas, contate nosso suporte antes de acionar sua operadora de pagamento."
        },
        {
            title: "7. Tipos de Licença",
            icon: Bookmark,
            content: "7.1. Licença Lifetime (Vitalícia): Válida enquanto o produto existir e estiver sendo mantido. Não garante acesso perpétuo caso o produto seja descontinuado.\n7.2. Licenças Diárias/Temporárias: Não possuem garantia de renovação automática ou continuidade após o período contratado.\n7.3. Todas as licenças estão sujeitas aos termos de uso e podem ser revogadas em caso de violação."
        },
        {
            title: "8. Programa de Revenda",
            icon: Bookmark,
            content: "8.1. Revendedores autorizados devem repassar 20% do valor de cada venda ao desenvolvedor (DN) conforme acordo estabelecido.\n8.2. A violação deste acordo resulta em cancelamento imediato da autorização de revenda.\n8.3. Apenas revendedores oficialmente autorizados podem comercializar nossos produtos."
        },
        {
            title: "9. Limitação de Responsabilidade",
            icon: Bookmark,
            content: "9.1. O uso do software é por conta e risco do usuário.\n9.2. Não nos responsabilizamos por:\n* Danos diretos ou indiretos causados pelo uso do produto\n* Perda de dados, contas ou progressos em jogos\n* Incompatibilidade com atualizações de jogos ou sistemas\n* Indisponibilidade temporária do serviço\n9.3. Nosso limite máximo de responsabilidade corresponde ao valor pago pelo produto."
        },
        {
            title: "10. Segurança",
            icon: Bookmark,
            content: "10.1. Mantenha suas credenciais de acesso em segurança.\n10.2. Não compartilhe senhas, arquivos ou informações de login.\n10.3. Utilize antivírus atualizado e baixe arquivos exclusivamente de nossos canais oficiais.\n10.4. Não nos responsabilizamos por arquivos baixados de fontes não oficiais."
        },
        {
            title: "11. Atualizações e Manutenção",
            icon: Bookmark,
            content: "11.1. Fornecemos atualizações regulares para manter a funcionalidade dos produtos, quando tecnicamente viável.\n11.2. Não garantimos que o produto permanecerá funcional indefinidamente devido a mudanças em jogos ou sistemas operacionais.\n11.3. O suporte técnico é fornecido conforme disponibilidade e tipo de licença adquirida."
        },
        {
            title: "12. Suspensão e Cancelamento",
            icon: Bookmark,
            content: "12.1. Reservamo-nos o direito de suspender ou cancelar licenças em caso de:\n* Violação destes termos\n* Uso inadequado ou abusivo\n* Tentativa de fraude ou chargeback\n* Compartilhamento não autorizado\n12.2. O cancelamento não gera direito a reembolso."
        },
        {
            title: "13. Disposições Gerais",
            icon: Bookmark,
            content: "13.1. Estes termos são regidos pelas leis brasileiras.\n13.2. Dúvidas ou problemas devem ser direcionados ao nosso suporte oficial.\n13.3. A invalidade de qualquer cláusula não afeta a validade das demais.\n13.4. O não exercício de qualquer direito previsto nestes termos não constitui renúncia"
        },
    ];

    return (
        <section id="termos" ref={ref} className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-white">
                        Termos de Compra e Uso
                    </h2>
                    <p className="text-xl text-gray-400 mb-4">
                        Última atualização: 31 de dezembro de 2025
                    </p>
                </motion.div>
                <div className="space-y-4">
                    {termsSections.map((section, index) => (
                        <motion.details
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group bg-gradient-to-br from-[#2e2e2e] to-[#1a1a1a] rounded-2xl p-6 border border-purple-600/20 cursor-pointer hover:border-purple-600/50 transition-all"
                        >
                            <summary className="flex items-center gap-3 text-lg font-bold text-white">
                                <section.icon className="w-6 h-6 text-purple-400 flex-shrink-0" />
                                {section.title}
                                <span className="ml-auto text-purple-400 group-open:rotate-180 transition-transform">▼</span>
                            </summary>
                            <p className="mt-4 text-gray-300 whitespace-pre-line">{section.content}</p>
                        </motion.details>
                    ))}
                </div>
                <p className="mt-12 text-center text-gray-400">
                    Para dúvidas, problemas técnicos ou suporte, utilize nossos canais oficiais disponíveis no site.<br />
                    Ao prosseguir com a compra, você declara estar ciente e de acordo com todos os termos acima.
                </p>
            </div>
        </section>
    );
}

function Footer() {
    return (
        <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-purple-600/20">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    <div>
                        <div className="flex items-center space-x-3 mb-4">
                            <Logo className="w-24 h-24 md:w-24 h-24 lg:w-40 h-40 drop-shadow-2xl" />
                            <span className="font-bold text-xl bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent">
                                DN Menu
                            </span>
                        </div>
                        <p className="text-gray-400 text-sm">
                            O menu mais avançado para Roleplay no Roblox.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-bold text-white mb-4">Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a href="#features" className="text-gray-400 hover:text-white transition-colors">
                                    Funções
                                </a>
                            </li>
                            <li>
                                <a href="#pricing" className="text-gray-400 hover:text-white transition-colors">
                                    Preços
                                </a>
                            </li>
                            <li>
                                <a href="#revendedores" className="text-gray-400 hover:text-white transition-colors">
                                    Revendedores
                                </a>
                            </li>
                            <li>
                                <a href="#termos" className="text-gray-400 hover:text-white transition-colors">
                                    Termos
                                </a>
                            </li>
                            <li>
                                <Link to="/login" className="text-gray-400 hover:text-white transition-colors">
                                    Dashboard
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-white mb-4">Comunidade</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a href="https://discord.gg/k3CUqNs3UW" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                                    Discord
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="pt-8 border-t border-purple-600/20 text-center text-gray-400 text-sm">
                    <p>© 2025 DN Menu. Todos os direitos reservados.</p>
                </div>
            </div>
        </footer>
    );
}
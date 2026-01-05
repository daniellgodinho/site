// src/pages/LandingPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
    Bookmark, CheckCircle, Toolbox, Crosshair, Shield, Building2, Eye, CarFront
} from 'lucide-react';
import { FaDiscord } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { supabase } from '../supabase';
import monkeyLogo from '../assets/monkeyLogo.png';
import Background from '../assets/Background.png';

export default function LandingPage() {
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
            <Navbar />
            <Hero />
            <Problem />
            <Solution />
            <VideoShowcase />
            <Pricing />
            <Compatibility />
            <Revendedores resellers={resellers} />
            <Termos />
            <Footer />
        </div>
    );
}

function Hero() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    return (
        <section ref={ref} className="relative min-h-screen flex items-center px-4 sm:px-6 lg:px-8 overflow-hidden" style={{ backgroundImage: `url(${Background})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-black/50 to-[#110d15]"></div>
            </div>
            <div className="max-w-7xl mx-auto relative z-10 py-32">
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
                        className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-br from-[#BF7AFF] to-[#8A2BE2] bg-clip-text text-transparent"
                    >
                        DN Menu
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : {}}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-xl sm:text-2xl text-gray-300 mb-8 leading-relaxed"
                    >
                        <span className="block">O menu mais avançado para Roleplay no Roblox.</span>
                        <span className="block">Refinado, elegante e único.</span>
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
        <section ref={ref} className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#110d15] to-[#111011]">
            <div className="max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="text-center"
                >
                    <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-white">
                        O Problema
                    </h2>
                    <p className="text-xl text-gray-400 leading-relaxed">
                        Nos servidores de roleplay, a concorrência é intensa. Sem as ferramentas adequadas,
                        você fica em desvantagem constante. Perder confrontos, ficar para trás em recursos,
                        e não ter controle sobre situações críticas são problemas reais que afetam sua experiência.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}

function Solution() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const features = [
        { icon: CarFront, title: "Manipulação Avançada", description: "Controle total sobre qualquer resource do jogo." },
        { icon: Crosshair, title: "Exclusividade", description: "Funções únicas, nunca vistam antes no cenário." },
        { icon: Shield, title: "Proteção Máxima", description: "Menu seguro e bypass anti-cheat na maioria das cidades." },
        { icon: Eye, title: "Seja um vencedor", description: "Adquira DN Menu e vença conosco." },
    ];

    return (
        <section ref={ref} className="py-20 px-4 sm:px-6 lg:px-8 bg-[#111011]">
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
                        DN Menu oferece controle total sobre o ambiente de jogo. Com 70 funções cuidadosamente desenvolvidas, você obtém vantagens táticas que transformam cada sessão. Não é sobre força bruta, mas sim sobre ter as ferramentas certas no momento certo.
                    </p>
                </motion.div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.05, rotate: 2 }}
                            className="p-6 bg-gradient-to-br from-[#2e2e2e] to-[#1a1a1a] rounded-2xl border border-purple-600/20 hover:border-purple-600 shadow-lg hover:shadow-purple-600/30 transition-all"
                        >
                            <feat.icon className="w-12 h-12 text-purple-400 mb-4" />
                            <h3 className="text-xl font-bold mb-2 text-white">{feat.title}</h3>
                            <p className="text-gray-400">{feat.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function VideoShowcase() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section id="features" ref={ref} className="py-20 px-4 sm:px-6 lg:px-8 bg-[#111011] relative">
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
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.8 }}
                    className="relative mx-auto max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-2xl"
                >
                    <iframe
                        width="100%"
                        height="100%"
                        src="https://www.youtube.com/embed/YOUR_VIDEO_ID_HERE" // Hardcoded YouTube link here
                        title="DN Menu Showcase"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </motion.div>
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
            price: "R$ 10",
            duration: "24 horas",
            features: [
                "Acesso completo por 24h",
                "Todas as 70 funções",
                "Suporte via Discord"
            ],
            highlighted: false
        },
        {
            name: "Semanal",
            price: "R$ 25",
            duration: "7 dias",
            features: [
                "Acesso completo por 7 dias",
                "Todas as 70 funções",
                "Atualizações incluídas",
                "Suporte prioritário"
            ],
            highlighted: false
        },
        {
            name: "Mensal",
            price: "R$ 35",
            duration: "30 dias",
            features: [
                "Acesso completo por 30 dias",
                "Todas as 70 funções",
                "Atualizações constantes",
                "Suporte prioritário VIP"
            ],
            highlighted: false
        },
        {
            name: "Lifetime",
            price: "R$ 70",
            duration: "Vitalício",
            features: [
                "Acesso permanente",
                "Todas as 70 funções",
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
                "Todas as 70 funções",
                "Suporte técnico dedicado",
                "Ganhe dinheiro vendendo o menu mais procurado do cenário"
            ],
            highlighted: true,
            badge: "Ganhe Dinheiro"
        }
    ];

    return (
        <section id="pricing" ref={ref} className="py-32 px-4 sm:px-6 lg:px-8 relative bg-[#111011]">
            <div className="max-w-7xl mx-auto">
                {/* Título */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 1 }}
                    className="text-center mb-24"
                >
                    <h2 className="text-5xl sm:text-6xl font-extrabold mb-6 bg-gradient-to-br from-[#BF7AFF] to-[#8A2BE2] bg-clip-text text-transparent">
                        Escolha seu Plano
                    </h2>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                        Acesso imediato • Atualizações constantes • Suporte exclusivo no Discord
                    </p>
                </motion.div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 60, rotateX: -10, rotateY: -10 }}
                            animate={isInView ? { opacity: 1, y: 0, rotateX: 0, rotateY: 0 } : {}}
                            transition={{ duration: 0.8, delay: index * 0.15 }}
                            whileHover={{
                                rotateX: 5,
                                rotateY: 5,
                                scale: 1.05,
                                boxShadow: "0 20px 40px rgba(147, 51, 234, 0.4)",
                                borderColor: "#8A2BE2"
                            }}
                            className={`relative p-8 rounded-3xl border-2 transition-all duration-500 shadow-xl backdrop-blur-sm ${plan.highlighted
                                ? 'bg-gradient-to-br from-purple-900/30 to-purple-900/10 border-purple-500/50'
                                : 'bg-gradient-to-br from-zinc-950/80 to-black/80 border-purple-600/30'
                                } hover:border-purple-600`}
                        >
                            {plan.badge && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.6, delay: 0.4 }}
                                    className={`absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full font-bold text-sm shadow-lg ${plan.name === "Revenda"
                                        ? 'bg-gradient-to-r from-[#BF7AFF] to-[#8A2BE2] text-white'
                                        : 'bg-gradient-to-r from-[#BF7AFF] to-[#8A2BE2] text-white'
                                        }`}
                                >
                                    {plan.badge}
                                </motion.div>
                            )}

                            <motion.h3
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-2xl font-bold text-center mb-8 text-white"
                            >
                                {plan.name}
                            </motion.h3>

                            <motion.div
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                                className="text-center mb-10"
                            >
                                <div className="text-6xl font-extrabold bg-gradient-to-br from-[#BF7AFF] to-[#8A2BE2] bg-clip-text text-transparent">
                                    {plan.price}
                                </div>
                                <p className="text-gray-400 mt-2">{plan.duration}</p>
                            </motion.div>

                            <ul className="space-y-4 mb-12">
                                {plan.features.map((feature, i) => (
                                    <motion.li
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.5 + i * 0.1 }}
                                        className="flex items-center text-gray-300 gap-3"
                                    >
                                        <CheckCircle className="w-5 h-5 text-purple-400 flex-shrink-0" />
                                        <span className="text-base">{feature}</span>
                                    </motion.li>
                                ))}
                            </ul>

                            <motion.a
                                href="https://discord.gg/k3CUqNs3UW"
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`block w-full py-4 rounded-xl text-center font-bold text-lg transition-all duration-300 shadow-md ${plan.highlighted
                                    ? 'bg-gradient-to-br from-[#BF7AFF] to-[#8A2BE2] hover:opacity-90 text-white'
                                    : 'bg-white/5 hover:bg-white/10 text-white border border-purple-600/40 hover:border-purple-600'
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
                    className="text-center mt-24 text-gray-400 text-base"
                >
                    Todos os planos incluem as 70 funções • Pagamento seguro • Ativação instantânea
                </motion.p>
            </div>
        </section>
    );
}

function Compatibility() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section ref={ref} className="py-20 px-4 sm:px-6 lg:px-8 bg-[#111011] bg-gradient-to-b from-transparent via-purple-900/5 to-transparent">
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
        <section id="revendedores" ref={ref} className="py-20 px-4 sm:px-6 lg:px-8 bg-[#111011] bg-gradient-to-b from-transparent via-purple-900/5 to-transparent">
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
        <section id="termos" ref={ref} className="py-20 px-4 sm:px-6 lg:px-8 bg-[#111011] bg-gradient-to-b from-transparent via-purple-900/5 to-transparent">
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
        <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-purple-600/20 bg-[#111011]">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    <div>
                        <div className="flex items-center space-x-3 mb-4">
                            <img
                                src={monkeyLogo}
                                alt="DN Menu Logo"
                                className="w-24 h-24 object-contain drop-shadow-2xl drop-shadow-purple-600/50"
                            />
                            <span className="font-bold text-xl bg-gradient-to-r from-[#BF7AFF] to-[#8A2BE2] bg-clip-text text-transparent">
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
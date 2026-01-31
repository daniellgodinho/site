'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Zap, Shield, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PixelBlast } from '@/components/backgrounds/PixelBlast';
import { ElectricBorder } from '@/components/effects/ElectricBorder';
import { THEME_CONFIG } from '@/config/theme';

const PaginaInicial = () => {
    const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);

    const planos = [
        {
            id: 'basico',
            nome: 'Básico',
            preco: 'R$ 29',
            periodo: '/mês',
            descricao: 'Perfeito para começar',
            features: [
                'Até 5 menus',
                'Suporte por email',
                'Atualizações automáticas',
                'Backup diário',
            ],
            cta: 'Começar Agora',
            destaque: false,
        },
        {
            id: 'revenda',
            nome: 'Revenda',
            preco: 'R$ 199',
            periodo: '/mês',
            descricao: 'Para revendedores profissionais',
            features: [
                'Menus ilimitados',
                'Suporte prioritário 24/7',
                'Painel de controle avançado',
                'API de integração',
                'Relatórios detalhados',
                'Customização completa',
            ],
            cta: 'Ativar Revenda',
            destaque: true,
        },
        {
            id: 'lifetime',
            nome: 'Lifetime',
            preco: 'R$ 999',
            periodo: 'único',
            descricao: 'Acesso vitalício completo',
            features: [
                'Tudo do plano Revenda',
                'Acesso vitalício',
                'Sem renovação mensal',
                'Suporte prioritário ilimitado',
                'Atualizações futuras grátis',
                'Transferência de licença',
            ],
            cta: 'Comprar Lifetime',
            destaque: true,
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
        },
    };

    return (
        <div className="min-h-screen bg-black text-white overflow-hidden">
            {/* Background com Pixel Blast */}
            <PixelBlast color={THEME_CONFIG.pixelBlastColor} variant="triangle" />

            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-purple-500/20">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                            <Zap className="text-white w-5 h-5" />
                        </div>
                        <span className="text-xl font-bold">DNMENU</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/entrar">
                            <Button variant="ghost" className="text-white hover:bg-purple-600/20">
                                Entrar
                            </Button>
                        </Link>
                        <Link href="/revendedor">
                            <Button className="bg-purple-600 hover:bg-purple-700">
                                Revendedor
                            </Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-4">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="max-w-4xl mx-auto text-center space-y-8"
                >
                    {/* Badge */}
                    <motion.div variants={itemVariants}>
                        <Badge className="bg-purple-900/50 text-purple-400 border-purple-600/30">
                            <Rocket className="w-3 h-3 mr-2" />
                            Novo: Suporte a Lifetime
                        </Badge>
                    </motion.div>

                    {/* Título */}
                    <motion.h1
                        variants={itemVariants}
                        className="text-5xl md:text-7xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent"
                    >
                        Gerenciador de Menus Inteligente
                    </motion.h1>

                    {/* Descrição */}
                    <motion.p
                        variants={itemVariants}
                        className="text-xl text-gray-400 max-w-2xl mx-auto"
                    >
                        Crie, gerencie e distribua menus profissionais com facilidade. Perfeito para revendedores e empresas.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        variants={itemVariants}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <Link href="/resgate">
                            <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-lg">
                                Resgatar Licença
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                        <Link href="/revendedor">
                            <Button size="lg" variant="outline" className="border-purple-600 text-purple-400 hover:bg-purple-600/10 text-lg">
                                Ser Revendedor
                            </Button>
                        </Link>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        variants={itemVariants}
                        className="grid grid-cols-3 gap-4 pt-8 max-w-md mx-auto"
                    >
                        {[
                            { label: 'Usuários', valor: '10K+' },
                            { label: 'Menus', valor: '50K+' },
                            { label: 'Uptime', valor: '99.9%' },
                        ].map((stat, i) => (
                            <div key={i} className="text-center">
                                <p className="text-2xl font-bold text-purple-400">{stat.valor}</p>
                                <p className="text-xs text-gray-500">{stat.label}</p>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>
            </section>

            {/* Pricing Section */}
            <section className="relative py-20 px-4">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={containerVariants}
                    className="max-w-7xl mx-auto"
                >
                    {/* Header */}
                    <motion.div variants={itemVariants} className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black mb-4">Planos e Preços</h2>
                        <p className="text-gray-400 text-lg">Escolha o plano perfeito para suas necessidades</p>
                    </motion.div>

                    {/* Pricing Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {planos.map((plano) => (
                            <motion.div
                                key={plano.id}
                                variants={itemVariants}
                                onMouseEnter={() => setHoveredPlan(plano.id)}
                                onMouseLeave={() => setHoveredPlan(null)}
                            >
                                {plano.destaque ? (
                                    <ElectricBorder
                                        color={THEME_CONFIG.electricBorderColor}
                                        intensity={hoveredPlan === plano.id ? 1.5 : 1}
                                        className="h-full rounded-2xl"
                                    >
                                        <Card className="bg-gradient-to-br from-purple-900/30 to-black border-0 h-full flex flex-col">
                                            <CardHeader>
                                                <div className="flex items-start justify-between mb-4">
                                                    <div>
                                                        <CardTitle className="text-2xl text-white">{plano.nome}</CardTitle>
                                                        <CardDescription className="text-gray-400">
                                                            {plano.descricao}
                                                        </CardDescription>
                                                    </div>
                                                    {plano.destaque && (
                                                        <Badge className="bg-purple-600 text-white">Popular</Badge>
                                                    )}
                                                </div>
                                            </CardHeader>
                                            <CardContent className="flex-1 flex flex-col">
                                                <div className="mb-6">
                                                    <span className="text-4xl font-black text-purple-400">
                                                        {plano.preco}
                                                    </span>
                                                    <span className="text-gray-500 ml-2">{plano.periodo}</span>
                                                </div>

                                                <ul className="space-y-3 mb-8 flex-1">
                                                    {plano.features.map((feature, i) => (
                                                        <li key={i} className="flex items-center gap-3 text-gray-300">
                                                            <Check className="w-5 h-5 text-purple-400 flex-shrink-0" />
                                                            {feature}
                                                        </li>
                                                    ))}
                                                </ul>

                                                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                                                    {plano.cta}
                                                    <ArrowRight className="ml-2 w-4 h-4" />
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    </ElectricBorder>
                                ) : (
                                    <Card className="bg-gray-900/50 border-gray-800 h-full flex flex-col hover:border-purple-600/50 transition-colors">
                                        <CardHeader>
                                            <CardTitle className="text-2xl text-white">{plano.nome}</CardTitle>
                                            <CardDescription className="text-gray-400">
                                                {plano.descricao}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="flex-1 flex flex-col">
                                            <div className="mb-6">
                                                <span className="text-4xl font-black text-white">
                                                    {plano.preco}
                                                </span>
                                                <span className="text-gray-500 ml-2">{plano.periodo}</span>
                                            </div>

                                            <ul className="space-y-3 mb-8 flex-1">
                                                {plano.features.map((feature, i) => (
                                                    <li key={i} className="flex items-center gap-3 text-gray-300">
                                                        <Check className="w-5 h-5 text-purple-400 flex-shrink-0" />
                                                        {feature}
                                                    </li>
                                                ))}
                                            </ul>

                                            <Button variant="outline" className="w-full border-purple-600 text-purple-400 hover:bg-purple-600/10">
                                                {plano.cta}
                                                <ArrowRight className="ml-2 w-4 h-4" />
                                            </Button>
                                        </CardContent>
                                    </Card>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* Features Section */}
            <section className="relative py-20 px-4 border-t border-purple-500/20">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={containerVariants}
                    className="max-w-7xl mx-auto"
                >
                    <motion.h2
                        variants={itemVariants}
                        className="text-4xl md:text-5xl font-black text-center mb-16"
                    >
                        Por que escolher DNMENU?
                    </motion.h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icone: Shield,
                                titulo: 'Seguro',
                                descricao: 'Seus dados estão protegidos com criptografia de ponta',
                            },
                            {
                                icone: Zap,
                                titulo: 'Rápido',
                                descricao: 'Performance otimizada para máxima velocidade',
                            },
                            {
                                icone: Rocket,
                                titulo: 'Escalável',
                                descricao: 'Cresce com seu negócio sem limitações',
                            },
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                variants={itemVariants}
                                className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 hover:border-purple-600/50 transition-colors"
                            >
                                <feature.icone className="w-12 h-12 text-purple-400 mb-4" />
                                <h3 className="text-xl font-bold mb-2">{feature.titulo}</h3>
                                <p className="text-gray-400">{feature.descricao}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* Footer */}
            <footer className="border-t border-purple-500/20 py-12 px-4">
                <div className="max-w-7xl mx-auto text-center text-gray-500">
                    <p>&copy; 2024 DNMENU. Todos os direitos reservados.</p>
                </div>
            </footer>
        </div>
    );
};

export default PaginaInicial;

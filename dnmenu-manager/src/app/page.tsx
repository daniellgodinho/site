'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ChevronRight, Shield, Zap, BarChart3, LayoutDashboard, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const LandingPage = () => {
    const features = [
        {
            title: "Gestão Simplificada",
            description: "Controle total sobre seus menus e usuários em uma interface intuitiva.",
            icon: <LayoutDashboard className="w-6 h-6 text-primary" />,
        },
        {
            title: "Performance Extrema",
            description: "Infraestrutura otimizada para garantir a melhor experiência aos seus clientes.",
            icon: <Zap className="w-6 h-6 text-primary" />,
        },
        {
            title: "Segurança Avançada",
            description: "Proteção de dados e sistemas com as tecnologias mais recentes do mercado.",
            icon: <Shield className="w-6 h-6 text-primary" />,
        },
        {
            title: "Análise em Tempo Real",
            description: "Acompanhe suas vendas e métricas de uso instantaneamente.",
            icon: <BarChart3 className="w-6 h-6 text-primary" />,
        }
    ];

    return (
        <div className="min-h-screen bg-background selection:bg-primary/30">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 border-b bg-background/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                <Zap className="text-white w-5 h-5" />
                            </div>
                            <span className="text-xl font-bold tracking-tight">DNMENU</span>
                        </div>
                        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
                            <a href="#features" className="hover:text-foreground transition-colors">Recursos</a>
                            <a href="#pricing" className="hover:text-foreground transition-colors">Preços</a>
                            <a href="#about" className="hover:text-foreground transition-colors">Sobre</a>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link href="/entrar" className="text-sm font-medium hover:text-primary transition-colors">
                                Entrar
                            </Link>
                            <Link href="/entrar">
                                <Button size="sm" className="flex items-center gap-2">
                                    Começar agora <ChevronRight className="w-4 h-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Badge className="inline-flex items-center gap-2 mb-6">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                </span>
                                Nova Versão 2.0 Disponível
                            </Badge>
                            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
                                Teste seu negócio <br /> com elegância e precisão.
                            </h1>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
                                A plataforma definitiva para gerenciamento de menus e revendedores.
                                Minimalista por fora, poderosa por dentro.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link href="/entrar">
                                    <Button size="lg" className="flex items-center justify-center gap-2">
                                        Começar Gratuitamente <ArrowRight className="w-5 h-5" />
                                    </Button>
                                </Link>
                                <Button size="lg" variant="outline">
                                    Ver Demonstração
                                </Button>
                            </div>
                        </motion.div>

                        {/* Mockup Preview */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                            className="mt-20 relative"
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 h-full w-full" />
                            <Card className="rounded-2xl overflow-hidden shadow-2xl">
                                <div className="rounded-xl bg-muted/50 aspect-video flex items-center justify-center">
                                    <LayoutDashboard className="w-20 h-20 text-muted" />
                                </div>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-muted/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Tudo o que você precisa</h2>
                        <p className="text-muted-foreground">Funcionalidades pensadas para escalar sua operação.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <Card key={index} className="hover:border-primary/50 transition-colors group">
                                <CardHeader>
                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        {feature.icon}
                                    </div>
                                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        {feature.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Social Proof / Stats */}
            <section className="py-24 border-y">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-4xl font-bold mb-2">10k+</div>
                            <div className="text-sm text-muted-foreground uppercase tracking-wider">Usuários Ativos</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2">99.9%</div>
                            <div className="text-sm text-muted-foreground uppercase tracking-wider">Uptime</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2">24/7</div>
                            <div className="text-sm text-muted-foreground uppercase tracking-wider">Suporte</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2">500+</div>
                            <div className="text-sm text-muted-foreground uppercase tracking-wider">Revendedores</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Card className="bg-primary text-primary-foreground relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-black/10 rounded-full blur-3xl" />
                        <CardHeader className="text-center relative z-10">
                            <CardTitle className="text-3xl md:text-5xl mb-8">
                                Pronto para transformar <br /> sua gestão?
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
                            <Link href="/entrar">
                                <Button size="lg" variant="secondary">
                                    Criar Conta Agora
                                </Button>
                            </Link>
                            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                                Falar com Consultor
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                                <Zap className="text-white w-4 h-4" />
                            </div>
                            <span className="font-bold">DNMENU</span>
                        </div>
                        <div className="flex gap-8 text-sm text-muted-foreground">
                            <a href="#" className="hover:text-foreground transition-colors">Privacidade</a>
                            <a href="#" className="hover:text-foreground transition-colors">Termos</a>
                            <a href="#" className="hover:text-foreground transition-colors">Contato</a>
                        </div>
                        <div className="text-sm text-muted-foreground">
                            © 2026 DNMENU. Todos os direitos reservados.
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;

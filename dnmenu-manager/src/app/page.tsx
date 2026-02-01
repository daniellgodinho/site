'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ChevronRight, Shield, Zap, LayoutDashboard, ArrowRight, CheckCircle, Crosshair, Trophy, Building2, Star, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const LandingPage = () => {
    const features = [
        {
            title: "Manipulação Avançada",
            description: "Controle total sobre qualquer resource do jogo.",
            icon: <Shield className="w-6 h-6 text-primary" />,
        },
        {
            title: "Exclusividade",
            description: "Funções únicas, nunca vistas antes no cenário.",
            icon: <Star className="w-6 h-6 text-primary" />,
        },
        {
            title: "Proteção Máxima",
            description: "Menu seguro e bypass anti-cheat na maioria das cidades.",
            icon: <Shield className="w-6 h-6 text-primary" />,
        },
        {
            title: "Seja um vencedor",
            description: "Adquira DN Menu e vença conosco.",
            icon: <Trophy className="w-6 h-6 text-primary" />,
        }
    ];

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

    const compatibility = [
        {
            icon: Wrench,
            title: "A-Chassis",
            description: "Compatível com todos os servidores que utilizam o sistema A-Chassis para veículos."
        },
        {
            icon: Crosshair,
            title: "ACS (Advanced Combat System)",
            description: "Suporte completo para servidores com sistema ACS de combate."
        },
        {
            icon: Shield,
            title: "Sistema de Proteção",
            description: "Bypass integrado contra telagem e screenshare. Limpeza automática de rastros."
        },
        {
            icon: Building2,
            title: "Servidores de Roleplay",
            description: "Funciona em todas as principais cidades de RP que utilizam os sistemas mencionados."
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
                            <span className="text-xl font-bold tracking-tight">DN MENU</span>
                        </div>
                        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
                            <a href="#features" className="hover:text-foreground transition-colors">Funções</a>
                            <a href="#pricing" className="hover:text-foreground transition-colors">Preços</a>
                            <a href="#compatibility" className="hover:text-foreground transition-colors">Compatibilidade</a>
                            <a href="#revendedores" className="hover:text-foreground transition-colors">Revendedores</a>
                            <a href="#termos" className="hover:text-foreground transition-colors">Termos</a>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link href="/entrar" className="text-sm font-medium hover:text-primary transition-colors">
                                Entrar
                            </Link>
                            <Link href="https://discord.gg/dnmenu" target="_blank" rel="noopener noreferrer">
                                <Button size="sm" className="flex items-center gap-2">
                                    Adquirir Acesso <ChevronRight className="w-4 h-4" />
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
                                Menu Mais Avançado do Mercado
                            </Badge>
                            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
                                DN Menu
                            </h1>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
                                O menu mais avançado para Roleplay no Roblox.
                                Refinado, elegante e único.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link href="https://discord.gg/dnmenu" target="_blank" rel="noopener noreferrer">
                                    <Button size="lg" className="flex items-center justify-center gap-2">
                                        Adquirir Acesso <ArrowRight className="w-5 h-5" />
                                    </Button>
                                </Link>
                                <a href="#features">
                                    <Button size="lg" variant="outline">
                                        Ver Funções
                                    </Button>
                                </a>
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

            {/* Problem Section */}
            <section className="py-24 bg-muted/30">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center"
                    >
                        <h2 className="text-4xl font-bold mb-6">O Problema</h2>
                        <p className="text-xl text-muted-foreground leading-relaxed">
                            Nos servidores de roleplay, a concorrência é intensa.
                            Sem as ferramentas adequadas, você fica em desvantagem constante.
                            Perder confrontos, ficar para trás em recursos, e não ter controle sobre situações críticas são problemas reais que afetam sua experiência.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Solution Section */}
            <section id="features" className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl font-bold mb-6">A Solução</h2>
                        <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                            DN Menu oferece controle total sobre o ambiente de jogo. Com 70 funções cuidadosamente desenvolvidas, você obtém vantagens táticas que transformam cada sessão. Não é sobre força bruta, mas sim sobre ter as ferramentas certas no momento certo.
                        </p>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.05, rotate: 2 }}
                            >
                                <Card className="hover:border-primary/50 transition-colors group h-full">
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
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Video Showcase */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold mb-4 text-white">Funções Principais</h2>
                        <p className="text-xl text-muted-foreground">
                            Recursos mais solicitados pelos usuários do nosso Discord
                        </p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="relative mx-auto max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-2xl"
                    >
                        <iframe
                            width="100%"
                            height="100%"
                            src="https://www.youtube.com/embed/YOUR_VIDEO_ID_HERE"
                            title="DN Menu Showcase"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </motion.div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-32 px-4 sm:px-6 lg:px-8 relative">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                        className="text-center mb-24"
                    >
                        <h2 className="text-5xl font-extrabold mb-6 bg-gradient-to-br from-primary to-primary/70 bg-clip-text text-transparent">
                            Escolha seu Plano
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                            Acesso imediato • Atualizações constantes • Suporte exclusivo no Discord
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
                        {plans.map((plan, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 60, rotateX: -10, rotateY: -10 }}
                                whileInView={{ opacity: 1, y: 0, rotateX: 0, rotateY: 0 }}
                                transition={{ duration: 0.8, delay: index * 0.15 }}
                                whileHover={{
                                    rotateX: 5,
                                    rotateY: 5,
                                    scale: 1.05,
                                    boxShadow: "0 20px 40px rgba(147, 51, 234, 0.4)",
                                }}
                            >
                                <Card className={`relative p-8 rounded-3xl border-2 transition-all duration-500 shadow-xl backdrop-blur-sm h-full ${plan.highlighted
                                    ? 'bg-gradient-to-br from-primary/10 to-primary/5 border-primary/50'
                                    : 'bg-card border-border hover:border-primary/50'
                                    }`}>
                                    {plan.badge && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            whileInView={{ scale: 1 }}
                                            transition={{ duration: 0.6, delay: 0.4 }}
                                            className={`absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full font-bold text-sm shadow-lg ${plan.name === "Revenda"
                                                ? 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground'
                                                : 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground'
                                                }`}
                                        >
                                            {plan.badge}
                                        </motion.div>
                                    )}

                                    <motion.h3
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                        className="text-2xl font-bold text-center mb-8 text-card-foreground"
                                    >
                                        {plan.name}
                                    </motion.h3>

                                    <motion.div
                                        initial={{ scale: 0.8 }}
                                        whileInView={{ scale: 1 }}
                                        transition={{ duration: 0.8, delay: 0.4 }}
                                        className="text-center mb-10"
                                    >
                                        <div className="text-6xl font-extrabold bg-gradient-to-br from-primary to-primary/70 bg-clip-text text-transparent">
                                            {plan.price}
                                        </div>
                                        <p className="text-muted-foreground mt-2">{plan.duration}</p>
                                    </motion.div>

                                    <ul className="space-y-4 mb-12">
                                        {plan.features.map((feature, i) => (
                                            <motion.li
                                                key={i}
                                                initial={{ opacity: 0, x: -20 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.5 + i * 0.1 }}
                                                className="flex items-center text-card-foreground gap-3"
                                            >
                                                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                                                <span className="text-base">{feature}</span>
                                            </motion.li>
                                        ))}
                                    </ul>

                                    <Link href="https://discord.gg/dnmenu" target="_blank" rel="noopener noreferrer">
                                        <Button
                                            className={`w-full py-4 rounded-xl text-center font-bold text-lg transition-all duration-300 ${plan.highlighted
                                                ? 'bg-gradient-to-br from-primary to-primary/80 hover:opacity-90 text-primary-foreground'
                                                : 'bg-primary/10 hover:bg-primary/20 text-primary border border-primary/40 hover:border-primary'
                                                }`}
                                        >
                                            Adquirir Agora
                                        </Button>
                                    </Link>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 1 }}
                        className="text-center mt-24 text-muted-foreground text-base"
                    >
                        Todos os planos incluem as 70 funções • Pagamento seguro • Ativação instantânea
                    </motion.p>
                </div>
            </section>

            {/* Compatibility Section */}
            <section id="compatibility" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="bg-card rounded-2xl p-8 border border-border"
                    >
                        <h2 className="text-3xl font-bold mb-6 text-center text-card-foreground">
                            Compatibilidade
                        </h2>
                        <div className="space-y-4 text-card-foreground">
                            {compatibility.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-start gap-3"
                                >
                                    <item.icon className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                                    <div>
                                        <strong className="text-card-foreground">{item.title}:</strong> {item.description}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Revendedores Section */}
            <section id="revendedores" className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold mb-4 text-card-foreground">
                            Revendedores Autorizados
                        </h2>
                        <p className="text-xl text-muted-foreground">
                            Adquira com nossos parceiros oficiais
                        </p>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Placeholder for resellers - would be populated from API */}
                        <Card className="bg-card border-border hover:border-primary/50 transition-colors">
                            <CardContent className="p-6">
                                <h3 className="text-lg font-bold mb-4 text-card-foreground">Revendedor Exemplo</h3>
                                <Button className="w-full flex items-center justify-center gap-2">
                                    <span>Discord</span>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Terms Section */}
            <section id="termos" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold mb-4 text-card-foreground">
                            Termos de Compra e Uso
                        </h2>
                        <p className="text-xl text-muted-foreground mb-4">
                            Última atualização: 31 de dezembro de 2025
                        </p>
                    </motion.div>

                    <Card className="bg-card border-border">
                        <CardContent className="p-6">
                            <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="item-1">
                                    <AccordionTrigger>1. Aceitação dos Termos</AccordionTrigger>
                                    <AccordionContent>
                                        1.1. Ao efetuar qualquer compra em nossa plataforma, você confirma que leu, compreendeu e concorda integralmente com os presentes Termos de Compra e Serviço.
                                        <br />1.2. O uso contínuo de nossos produtos e serviços implica aceitação automática de quaisquer atualizações destes termos.
                                        <br />1.3. Estes termos podem ser alterados a qualquer momento, sendo responsabilidade do usuário verificar periodicamente possíveis atualizações.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-2">
                                    <AccordionTrigger>2. Natureza do Produto</AccordionTrigger>
                                    <AccordionContent>
                                        2.1. Os produtos comercializados são licenças digitais de software com finalidade educacional e de entretenimento.
                                        <br />2.2. AVISO IMPORTANTE: Por se tratar de software de modificação (cheats/hacks), existe risco inerente de banimento ou suspensão em plataformas de jogos. O usuário assume total responsabilidade pelo uso.
                                        <br />2.3. Não nos responsabilizamos por banimentos, suspensões de contas, perda de dados ou quaisquer consequências resultantes do uso de nossos produtos.
                                        <br />2.4. Trabalhamos continuamente para minimizar a detecção, mas não garantimos invisibilidade absoluta aos sistemas anti-cheat.
                                    </AccordionContent>
                                </AccordionItem>
                                {/* Add more accordion items as needed */}
                            </Accordion>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                        <div>
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                                    <Zap className="text-primary-foreground w-4 h-4" />
                                </div>
                                <span className="font-bold text-card-foreground">DN Softwares</span>
                            </div>
                            <p className="text-muted-foreground text-sm">
                                Possuímos o menu mais avançado para Roleplay no Roblox.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-bold text-card-foreground mb-4">Links</h3>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#features" className="text-muted-foreground hover:text-card-foreground transition-colors">Funções</a></li>
                                <li><a href="#pricing" className="text-muted-foreground hover:text-card-foreground transition-colors">Preços</a></li>
                                <li><a href="#revendedores" className="text-muted-foreground hover:text-card-foreground transition-colors">Revendedores</a></li>
                                <li><a href="#termos" className="text-muted-foreground hover:text-card-foreground transition-colors">Termos</a></li>
                                <li><Link href="/entrar" className="text-muted-foreground hover:text-card-foreground transition-colors">Dashboard</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-bold text-card-foreground mb-4">Comunidade</h3>
                            <ul className="space-y-2 text-sm">
                                <li><a href="https://discord.gg/dnmenu" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-card-foreground transition-colors">Discord</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-border text-center text-muted-foreground text-sm">
                        <p>© 2025 DN Menu. Todos os direitos reservados.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;

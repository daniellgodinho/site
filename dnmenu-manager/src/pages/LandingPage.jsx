// src/pages/LandingPage.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { Shield, Crosshair, Car, Zap, Menu, X } from 'lucide-react';
import monkeyLogo from '../assets/monkeyLogo.png';

const LandingPage = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [user, setUser] = useState(null);
    const [resellers, setResellers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
        };
        checkSession();

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => listener.subscription.unsubscribe();
    }, []);

    useEffect(() => {
        const fetchResellers = async () => {
            const { data } = await supabase.from('resellers').select('*');
            setResellers(data || []);
        };
        fetchResellers();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };

    const features = {
        Jogador: [
            'Speed Hack - Aumenta a velocidade de movimento',
            'Jump Power - Aumenta a força do pulo',
            'Camera FOV - Ajuste o campo de visão da câmera',
            'Invulnerabilidade - Seu personagem não perde vida (locked)',
            'Atravessar Paredes (Noclip) - Permite atravessar paredes',
            'Invisible Solo Session - Fica invisível e deslocado (locked)',
        ],
        Visuais: [
            'ESP Jogadores - Mostra nome e distância através de paredes',
            'ESP Skeleton - Mostra esqueleto dos jogadores (locked)',
            'ESP RGB - Cor do ESP muda em RGB (locked)',
            'ESP Admins - Cor especial para admins (voando/invisível) (locked)',
            'Chams - Destaca jogadores com contorno colorido',
            'Fullbright - Iluminação máxima no mapa',
        ],
        Exploits: [
            'Puxar Armas - Puxa armas de outros jogadores',
            'Exorcismo - Ativa animações customizadas',
            'Grudar no Jogador - Gruda atrás do jogador selecionado',
            'Teleportar para Jogador - Teleporta até o jogador selecionado',
            'Spectate Jogador - Observa o jogador selecionado',
            'Limpar Players com Veículo - Remove o jogador selecionado do veículo',
        ],
        Destruição: [
            'Lançar Veículos - Clique: Segurar | Y: Lançar',
            'Matar Todos do Servidor - Coloca cabeças na frente para matar',
            'Ativar Telecinese - Carrega script de telecinese',
        ],
        Combate: [
            'Aimbot completo com FOV ajustável',
            'Silent Aim',
            'Hitbox Expander - Expande hitbox',
            'Mirar através de paredes',
            'Carregar Aimbot',
            'Mostrar FOV',
            'Distância Máxima',
            'Suavidade',
        ],
        Veículos: [
            'Destrancar Todos (Auto)',
            'Destrancar Todos Agora',
            'Alcance de destravamento',
            'Deletar Veículo Próximo',
            'Teleport Veículo Próximo',
            'Voar com Carro',
            'Noclip com Veículo (locked)',
            'Sistema de Porta-Malas - Clonar itens',
            'Monitoramento automático',
        ],
        Weapon: [
            'Edição completa de armas ACS',
            'No Recoil',
            'Balas Explosivas',
            'Balas Arco-Íris',
            'Modo Semi/Auto',
            'Proteção infinita (capacete/colete)',
            'No Camera Shake',
            'Force Fix Arma',
        ],
        Hubs: [
            'Infinite Yield Remodel',
            'Pedroxz Menu',
        ],
    };

    return (
        <div className="min-h-screen bg-black text-white overflow-x-hidden">
            {/* Navbar */}
            <div className={`fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-300 ${scrolled ? 'mt-4' : 'mt-12'}`}>
                <nav className="w-11/12 max-w-6xl bg-black/40 backdrop-blur-3xl border border-purple-600/30 rounded-2xl shadow-2xl px-8 py-4">
                    <div className="flex items-center justify-between">
                        <Link to="/" className="flex items-center gap-3">
                            <img src={monkeyLogo} alt="DN Menu" className="w-20 h-20 object-contain drop-shadow-2xl drop-shadow-purple-600/50" />
                            <span className="text-2xl font-bold text-purple-400">DN Menu</span>
                        </Link>

                        <div className="hidden md:flex items-center gap-8">
                            <a href="#features" className="text-gray-300 hover:text-purple-400">Funções</a>
                            <a href="#pricing" className="text-gray-300 hover:text-purple-400">Preços</a>
                            <a href="https://discord.gg/vBPFAg8kHW" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-purple-400">Discord</a>
                            <a href="#resellers" className="text-gray-300 hover:text-purple-400">Revendedores</a>
                            <a href="#terms" className="text-gray-300 hover:text-purple-400">Termos</a>

                            {user ? (
                                <div className="relative group">
                                    <div className="flex items-center gap-3 cursor-pointer">
                                        <img src={user.user_metadata?.avatar_url || 'https://via.placeholder.com/50'} alt="profile" className="w-10 h-10 rounded-full border-2 border-purple-600" />
                                        <span className="text-gray-300">{user.email?.split('@')[0]}</span>
                                    </div>
                                    <div className="absolute right-0 mt-2 w-48 bg-black/90 border border-purple-600/30 rounded-xl shadow-xl hidden group-hover:block">
                                        <Link to="/dashboard" className="block px-4 py-3 text-gray-300 hover:bg-purple-900/30">Painel do Cliente</Link>
                                        <button onClick={handleLogout} className="block w-full text-left px-4 py-3 text-red-400 hover:bg-red-900/30">Desconectar</button>
                                    </div>
                                </div>
                            ) : (
                                <Link to="/login">
                                    <button className="bg-purple-600 hover:bg-purple-500 px-6 py-3 rounded-full font-medium">Fazer login</button>
                                </Link>
                            )}
                        </div>

                        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-purple-400">
                            {isOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </nav>
            </div>

            {isOpen && (
                <>
                    <div className="fixed inset-0 bg-black/70 z-40" onClick={() => setIsOpen(false)} />
                    <div className="fixed right-0 top-0 h-full w-80 bg-black/90 backdrop-blur-3xl border-l border-purple-600/30 z-50 p-6">
                        <div className="flex justify-between items-center mb-10">
                            <img src={monkeyLogo} alt="DN Menu" className="w-24 h-24 object-contain drop-shadow-2xl drop-shadow-purple-600/50" />
                            <button onClick={() => setIsOpen(false)}>
                                <X size={28} className="text-purple-400" />
                            </button>
                        </div>
                        <div className="flex flex-col gap-6 text-lg">
                            <a href="#features" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-purple-400">Funções</a>
                            <a href="#pricing" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-purple-400">Preços</a>
                            <a href="https://discord.gg/vBPFAg8kHW" onClick={() => setIsOpen(false)} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-purple-400">Discord</a>
                            <a href="#resellers" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-purple-400">Revendedores</a>
                            <a href="#terms" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-purple-400">Termos</a>

                            {user ? (
                                <>
                                    <Link to="/dashboard" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-purple-400">Painel do Cliente</Link>
                                    <button onClick={() => { handleLogout(); setIsOpen(false); }} className="text-left text-red-400 hover:text-red-300">Desconectar</button>
                                </>
                            ) : (
                                <Link to="/login" onClick={() => setIsOpen(false)}>
                                    <button className="bg-purple-600 hover:bg-purple-500 px-6 py-4 rounded-full w-full font-medium">Fazer login</button>
                                </Link>
                            )}
                        </div>
                    </div>
                </>
            )}

            {/* Hero */}
            <section className="pt-40 pb-20 px-6 text-center bg-gradient-to-b from-purple-900/20 to-black">
                <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
                    <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600 mb-6">
                        DN Menu
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-4xl mx-auto">
                        O menu mais avançado e refinado para Roleplay no Roblox. Controle total, design elegante e performance impecável.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <a href="https://discord.gg/vBPFAg8kHW" target="_blank" rel="noopener noreferrer">
                            <button className="bg-purple-600 hover:bg-purple-700 px-10 py-6 rounded-full text-lg font-medium shadow-lg">
                                Adquirir Acesso
                            </button>
                        </a>
                        <a href="#features">
                            <button className="border border-purple-600 text-purple-400 hover:bg-purple-900/30 px-10 py-6 rounded-full text-lg font-medium">
                                Ver Funções
                            </button>
                        </a>
                    </div>
                </motion.div>
            </section>

            {/* O Desafio */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-bold mb-8">O Desafio</h2>
                    <p className="text-lg text-gray-300 leading-relaxed">
                        Servidores de Roleplay no Roblox são competitivos por natureza. Jogadores limitados por mecânicas padrão frequentemente encontram dificuldades em situações críticas...
                    </p>
                </div>
            </section>

            {/* A Solução */}
            <section className="py-20 px-6 bg-gradient-to-b from-black to-purple-900/20">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-bold mb-8">A Solução</h2>
                    <p className="text-lg text-gray-300 leading-relaxed">
                        DN Menu oferece controle total sobre o ambiente de jogo. Com mais de 50 funções cuidadosamente desenvolvidas...
                    </p>
                </div>
            </section>

            {/* Principais Funções */}
            <section className="py-20 px-6">
                <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">Principais Funções</h2>
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <div className="bg-gradient-to-br from-purple-900/30 to-black border border-purple-600/30 rounded-2xl p-8 text-center">
                        <Shield className="w-16 h-16 mx-auto text-purple-400 mb-4" />
                        <h3 className="text-2xl font-bold mb-4">ESP Avançado</h3>
                        <p className="text-gray-300">Veja jogadores através de paredes com nomes, distâncias e skeleton.</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-900/30 to-black border border-purple-600/30 rounded-2xl p-8 text-center">
                        <Crosshair className="w-16 h-16 mx-auto text-purple-400 mb-4" />
                        <h3 className="text-2xl font-bold mb-4">Aimbot</h3>
                        <p className="text-gray-300">Mira automática com silent aim e hitbox expander.</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-900/30 to-black border border-purple-600/30 rounded-2xl p-8 text-center">
                        <Car className="w-16 h-16 mx-auto text-purple-400 mb-4" />
                        <h3 className="text-2xl font-bold mb-4">Veículos</h3>
                        <p className="text-gray-300">Voar, noclip, lançar e clonar itens do porta-malas.</p>
                    </div>
                </div>
            </section>

            {/* Todas as Funções */}
            <section id="features" className="py-20 px-6 bg-gradient-to-b from-black to-purple-900/20">
                <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">Todas as Funções (v5)</h2>
                <div className="max-w-4xl mx-auto space-y-4">
                    {Object.entries(features).map(([category, items]) => (
                        <details key={category} className="bg-purple-900/20 border border-purple-600/40 rounded-xl">
                            <summary className="text-xl px-6 py-4 cursor-pointer text-purple-300 hover:text-purple-100 font-medium">
                                {category}
                            </summary>
                            <div className="px-6 pb-6">
                                <ul className="space-y-3 text-gray-300">
                                    {items.map((item) => (
                                        <li key={item} className="flex items-start gap-3">
                                            <Zap className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </details>
                    ))}
                </div>
            </section>

            {/* Preços */}
            <section id="pricing" className="py-20 px-6">
                <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">Preços</h2>
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <div className="bg-gradient-to-br from-purple-900/30 to-black border border-purple-600/30 rounded-2xl p-8 text-center">
                        <h3 className="text-3xl font-bold">Mensal</h3>
                        <p className="text-5xl font-bold text-purple-400 mt-4">R$ 29,99</p>
                        <button className="mt-8 w-full bg-purple-600 hover:bg-purple-700 py-4 rounded-xl font-medium">Comprar</button>
                    </div>
                    <div className="bg-gradient-to-br from-purple-600/40 to-purple-900/40 border border-purple-500 rounded-2xl p-8 text-center shadow-2xl shadow-purple-600/30 scale-105">
                        <h3 className="text-3xl font-bold">Trimestral</h3>
                        <p className="text-5xl font-bold text-purple-300 mt-4">R$ 79,99</p>
                        <p className="text-green-400 font-semibold">Economize 10%</p>
                        <button className="mt-8 w-full bg-purple-500 hover:bg-purple-400 py-4 rounded-xl font-medium">Comprar</button>
                    </div>
                    <div className="bg-gradient-to-br from-purple-900/30 to-black border border-purple-600/30 rounded-2xl p-8 text-center">
                        <h3 className="text-3xl font-bold">Vitalício</h3>
                        <p className="text-5xl font-bold text-purple-400 mt-4">R$ 149,99</p>
                        <button className="mt-8 w-full bg-purple-600 hover:bg-purple-700 py-4 rounded-xl font-medium">Comprar</button>
                    </div>
                </div>
            </section>

            {/* Compatibilidade */}
            <section className="py-20 px-6 bg-gradient-to-b from-black to-purple-900/20">
                <h2 className="text-4xl md:text-5xl font-bold text-center mb-8">Compatibilidade</h2>
                <p className="text-xl text-center text-gray-300 max-w-3xl mx-auto">
                    Compatível com todos os executores que suportam Luau completo. Testado e otimizado para máxima estabilidade.
                </p>
            </section>

            {/* Revendedores */}
            <section id="resellers" className="py-20 px-6">
                <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">Revendedores Oficiais</h2>
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {resellers.map(r => (
                        <div key={r.id} className="bg-gradient-to-br from-purple-900/30 to-black border border-purple-600/30 rounded-2xl p-6 text-center">
                            <h3 className="text-xl font-bold mb-4">{r.name}</h3>
                            <a href={r.discord_link} target="_blank" rel="noopener noreferrer">
                                <button className="bg-purple-600 hover:bg-purple-500 px-6 py-3 rounded-full font-medium transition-colors">
                                    Discord
                                </button>
                            </a>
                        </div>
                    ))}
                </div>
            </section>

            {/* Termos */}
            <section id="terms" className="py-20 px-6 bg-gradient-to-b from-black to-purple-900/20">
                <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">Termos de Uso</h2>
                <div className="max-w-4xl mx-auto space-y-4">
                    <details className="bg-purple-900/20 border border-purple-600/40 rounded-xl">
                        <summary className="text-xl px-6 py-4 cursor-pointer text-purple-300 hover:text-purple-100">Uso Responsável</summary>
                        <div className="px-6 pb-6 text-gray-300">
                            O DN Menu deve ser usado apenas em servidores que permitam scripts. Não nos responsabilizamos por bans.
                        </div>
                    </details>
                    <details className="bg-purple-900/20 border border-purple-600/40 rounded-xl">
                        <summary className="text-xl px-6 py-4 cursor-pointer text-purple-300 hover:text-purple-100">Sem Reembolso</summary>
                        <div className="px-6 pb-6 text-gray-300">
                            Todas as vendas são finais. Não há reembolso após entrega da licença.
                        </div>
                    </details>
                    <details className="bg-purple-900/20 border border-purple-600/40 rounded-xl">
                        <summary className="text-xl px-6 py-4 cursor-pointer text-purple-300 hover:text-purple-100">Atualizações</summary>
                        <div className="px-6 pb-6 text-gray-300">
                            Atualizações gratuitas para usuários ativos e vitalícios.
                        </div>
                    </details>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-10 border-t border-purple-600/20 text-center text-gray-400">
                © 2026 DN Softwares. Todos os direitos reservados.
            </footer>
        </div>
    );
};

export default LandingPage;
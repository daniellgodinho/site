"use client";

export const dynamic = 'force-dynamic';

import { useState } from "react";
import { motion } from "framer-motion";
import {
    LayoutDashboard,
    Users,
    Settings,
    LogOut,
    Search,
    Plus,
    MoreVertical,
    TrendingUp,
    CreditCard,
    Zap,
    Bell,
    ChevronDown,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/Botao";
import { Input } from "@/components/ui/Input";

interface Estatistica {
    rotulo: string;
    valor: string;
    mudanca: string;
    icone: React.ReactNode;
}

interface UsuarioRecente {
    nome: string;
    email: string;
    status: "Ativo" | "Pendente" | "Inativo";
    data: string;
}

const PaginaDashboard = () => {
    const [abaDirecao, setAbaDirecao] = useState("overview");
    const [termoBusca, setTermoBusca] = useState("");

    const estatisticas: Estatistica[] = [
        {
            rotulo: "Receita Total",
            valor: "R$ 12.420",
            mudanca: "+12.5%",
            icone: <CreditCard className="w-5 h-5" />,
        },
        {
            rotulo: "Usuários Ativos",
            valor: "1,284",
            mudanca: "+3.2%",
            icone: <Users className="w-5 h-5" />,
        },
        {
            rotulo: "Menus Criados",
            valor: "42",
            mudanca: "+8.1%",
            icone: <LayoutDashboard className="w-5 h-5" />,
        },
        {
            rotulo: "Performance",
            valor: "99.9%",
            mudanca: "Estável",
            icone: <Zap className="w-5 h-5" />,
        },
    ];

    const usuariosRecentes: UsuarioRecente[] = [
        {
            nome: "João Silva",
            email: "joao@exemplo.com",
            status: "Ativo",
            data: "Há 2 min",
        },
        {
            nome: "Maria Santos",
            email: "maria@exemplo.com",
            status: "Pendente",
            data: "Há 15 min",
        },
        {
            nome: "Pedro Oliveira",
            email: "pedro@exemplo.com",
            status: "Ativo",
            data: "Há 1 hora",
        },
        {
            nome: "Ana Costa",
            email: "ana@exemplo.com",
            status: "Inativo",
            data: "Há 3 horas",
        },
    ];

    const obterCorStatusBadge = (
        status: UsuarioRecente["status"]
    ): "default" | "secondary" | "destructive" => {
        switch (status) {
            case "Ativo":
                return "default";
            case "Pendente":
                return "secondary";
            case "Inativo":
                return "destructive";
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F9FC] flex">
            {/* Sidebar */}
            <aside className="w-72 bg-white border-r hidden lg:flex flex-col p-6">
                <div className="flex items-center gap-3 mb-12 px-2">
                    <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                        <Zap className="text-white w-5 h-5" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">DNMENU</span>
                </div>

                <nav className="space-y-1 flex-1">
                    {[
                        {
                            id: "overview",
                            rotulo: "Visão Geral",
                            icone: <LayoutDashboard className="w-5 h-5" />,
                        },
                        {
                            id: "users",
                            rotulo: "Usuários",
                            icone: <Users className="w-5 h-5" />,
                        },
                        {
                            id: "billing",
                            rotulo: "Faturamento",
                            icone: <CreditCard className="w-5 h-5" />,
                        },
                        {
                            id: "settings",
                            rotulo: "Configurações",
                            icone: <Settings className="w-5 h-5" />,
                        },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setAbaDirecao(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${abaDirecao === item.id
                                ? "bg-purple-100 text-purple-600"
                                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                }`}
                        >
                            {item.icone}
                            {item.rotulo}
                        </button>
                    ))}
                </nav>

                <div className="pt-6 border-t">
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-all">
                        <LogOut className="w-5 h-5" />
                        Sair da Conta
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col">
                {/* Header */}
                <header className="h-20 bg-white border-b px-8 flex items-center justify-between sticky top-0 z-10">
                    <div className="relative w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Pesquisar..."
                            value={termoBusca}
                            onChange={(e) => setTermoBusca(e.target.value)}
                            className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-purple-600/20 rounded-xl py-2.5 pl-10 pr-4 text-sm"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-2.5 rounded-xl hover:bg-gray-100 relative transition-colors">
                            <Bell className="w-5 h-5 text-gray-600" />
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-600 rounded-full border-2 border-white" />
                        </button>
                        <div className="h-8 w-px bg-gray-200 mx-2" />
                        <button className="flex items-center gap-3 p-1.5 pr-3 rounded-xl hover:bg-gray-100 transition-colors">
                            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xs">
                                JD
                            </div>
                            <div className="text-left hidden sm:block">
                                <p className="text-xs font-bold leading-none">John Doe</p>
                                <p className="text-[10px] text-gray-500 mt-1">Administrador</p>
                            </div>
                            <ChevronDown className="w-4 h-4 text-gray-600" />
                        </button>
                    </div>
                </header>

                {/* Dashboard Content */}
                <div className="p-8 space-y-8">
                    <div className="flex justify-between items-end">
                        <div>
                            <h1 className="text-2xl font-bold">Olá, John! 👋</h1>
                            <p className="text-gray-600 mt-1">
                                Aqui está o que está acontecendo hoje.
                            </p>
                        </div>
                        <Button variante="primario" classe="flex items-center gap-2">
                            <Plus className="w-4 h-4" /> Novo Menu
                        </Button>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {estatisticas.map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-purple-300 transition-colors shadow-sm"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2.5 bg-purple-100 text-purple-600 rounded-xl">
                                        {stat.icone}
                                    </div>
                                    <Badge
                                        variant={
                                            stat.mudanca.startsWith("+") ? "default" : "secondary"
                                        }
                                        className={
                                            stat.mudanca.startsWith("+")
                                                ? "bg-green-100 text-green-700"
                                                : "bg-blue-100 text-blue-700"
                                        }
                                    >
                                        {stat.mudanca}
                                    </Badge>
                                </div>
                                <p className="text-sm text-gray-600 font-medium">{stat.rotulo}</p>
                                <p className="text-2xl font-bold mt-1">{stat.valor}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Tabs for different sections */}
                    <Tabs
                        value={abaDirecao}
                        onValueChange={setAbaDirecao}
                        className="space-y-6"
                    >
                        <TabsList className="grid w-full grid-cols-2 lg:w-fit">
                            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                            <TabsTrigger value="users">Usuários</TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="space-y-8">
                            {/* Recent Activity & Chart Placeholder */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="font-bold text-lg">
                                            Desempenho de Vendas
                                        </h3>
                                        <select className="bg-gray-100 border-none rounded-lg text-xs font-bold py-1.5 px-3 outline-none">
                                            <option>Últimos 7 dias</option>
                                            <option>Últimos 30 dias</option>
                                        </select>
                                    </div>
                                    <div className="h-64 bg-gray-100 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">
                                        <TrendingUp className="w-12 h-12 text-gray-400" />
                                    </div>
                                </div>

                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
                                >
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="font-bold text-lg">Usuários Recentes</h3>
                                        <button className="text-purple-600 text-xs font-bold hover:underline">
                                            Ver todos
                                        </button>
                                    </div>
                                    <div className="space-y-6">
                                        {usuariosRecentes.map((usuario, i) => (
                                            <div
                                                key={i}
                                                className="flex items-center justify-between"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-xs text-gray-600">
                                                        {usuario.nome.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold">{usuario.nome}</p>
                                                        <p className="text-[11px] text-gray-500">
                                                            {usuario.email}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <Badge
                                                        variant={obterCorStatusBadge(usuario.status)}
                                                        className="text-[10px]"
                                                    >
                                                        {usuario.status}
                                                    </Badge>
                                                    <p className="text-[10px] text-gray-500 mt-1">
                                                        {usuario.data}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            </div>
                        </TabsContent>

                        <TabsContent value="users" className="space-y-6">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
                            >
                                <h3 className="font-bold text-lg mb-6">Gerenciar Usuários</h3>
                                <div className="space-y-4">
                                    {usuariosRecentes.map((usuario, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-purple-300 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center font-bold text-purple-600 text-sm">
                                                    {usuario.nome.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-sm">{usuario.nome}</p>
                                                    <p className="text-xs text-gray-500">{usuario.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Badge variant={obterCorStatusBadge(usuario.status)}>
                                                    {usuario.status}
                                                </Badge>
                                                <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                                                    <MoreVertical className="w-4 h-4 text-gray-600" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
        </div>
    );
};

export default PaginaDashboard;

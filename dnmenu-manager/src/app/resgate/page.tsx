"use client";

export const dynamic = 'force-dynamic';

import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, AlertCircle, Zap, Lock, Clock, Gift } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface ResgateLicenca {
    id: string;
    chave: string;
    status: "Ativa" | "Pendente" | "Expirada";
    dataExpiracao: string;
    menus: number;
}

const PaginaResgate = () => {
    const [licencas] = useState<ResgateLicenca[]>([
        {
            id: "1",
            chave: "DNMN-1234-5678-ABCD",
            status: "Ativa",
            dataExpiracao: "2025-12-31",
            menus: 10,
        },
        {
            id: "2",
            chave: "DNMN-9876-5432-WXYZ",
            status: "Pendente",
            dataExpiracao: "2025-06-30",
            menus: 5,
        },
    ]);

    const [chaveEntrada, setChaveEntrada] = useState("");
    const [copiada, setCopiada] = useState(false);
    const [carregando, setCarregando] = useState(false);
    const [mensagem, setMensagem] = useState("");

    const manipularCopia = (chave: string) => {
        navigator.clipboard.writeText(chave);
        setCopiada(true);
        setTimeout(() => setCopiada(false), 2000);
    };

    const manipularResgate = async (e: React.FormEvent) => {
        e.preventDefault();
        setCarregando(true);
        setMensagem("");
        setTimeout(() => {
            if (chaveEntrada) {
                setMensagem("✅ Licença resgatada com sucesso!");
                setChaveEntrada("");
            } else {
                setMensagem("❌ Chave inválida");
            }
            setCarregando(false);
        }, 1500);
    };

    const obterCorStatusBadge = (
        status: ResgateLicenca["status"]
    ): "default" | "secondary" | "destructive" => {
        switch (status) {
            case "Ativa":
                return "default";
            case "Pendente":
                return "secondary";
            case "Expirada":
                return "destructive";
        }
    };

    return (
        <div className="min-h-screen bg-background pt-8 text-foreground">
            <div className="max-w-6xl mx-auto px-4 space-y-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                >
                    <div className="inline-flex items-center gap-2 bg-card/50 text-primary px-4 py-2 rounded-full mb-4">
                        <Zap className="w-4 h-4" />
                        <span className="text-sm font-bold">Centro de Resgate</span>
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-2">Resgate sua Licença</h1>
                    <p className="text-gray-400 text-lg">
                        Insira sua chave de ativação para acessar seus menus
                    </p>
                </motion.div>
                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Resgate Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-2 space-y-6"
                    >
                        {/* Resgate Card */}
                        <Card className="border-2 border-primary/30 bg-card">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-white">
                                    <Gift className="w-5 h-5 text-purple-400" />
                                    Resgate sua Chave
                                </CardTitle>
                                <CardDescription className="text-gray-400">
                                    Cole a chave fornecida para ativar sua licença
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={manipularResgate} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-300 mb-2">
                                            Chave de Licença
                                        </label>
                                        <Input
                                            type="text"
                                            placeholder="DNMN-XXXX-XXXX-XXXX"
                                            value={chaveEntrada}
                                            onChange={(e) => setChaveEntrada(e.target.value.toUpperCase())}
                                            className="w-full font-mono text-center tracking-wider bg-card text-muted-foreground border-border"
                                        />
                                        <p className="text-xs text-gray-500 mt-2">
                                            Formato: DNMN-XXXX-XXXX-XXXX
                                        </p>
                                    </div>
                                    {mensagem && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`p-3 rounded-lg text-sm font-medium ${mensagem.includes("✅")
                                                ? "bg-green-900/50 text-green-400"
                                                : "bg-red-900/50 text-red-400"
                                                }`}
                                        >
                                            {mensagem}
                                        </motion.div>
                                    )}
                                    <Button
                                        variant="default"
                                        className="w-full py-2.5 rounded-lg font-bold bg-purple-600 hover:bg-purple-700"
                                        disabled={carregando || !chaveEntrada}
                                    >
                                        {carregando ? "Processando..." : "Resgatar Licença"}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                        {/* Info Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {[
                                {
                                    icone: Lock,
                                    titulo: "Seguro",
                                    descricao: "Sua chave é criptografada",
                                },
                                {
                                    icone: Clock,
                                    titulo: "Instantâneo",
                                    descricao: "Ativação em tempo real",
                                },
                                {
                                    icone: Zap,
                                    titulo: "Suportado",
                                    descricao: "Atendimento 24/7",
                                },
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 + i * 0.1 }}
                                    className="bg-card rounded-lg p-4 border border-border text-center"
                                >
                                    <item.icone className="w-6 h-6 text-primary mx-auto mb-2" />
                                    <p className="font-bold text-sm text-foreground">{item.titulo}</p>
                                    <p className="text-xs text-muted-foreground">{item.descricao}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                    {/* Right Column - Active Licenses */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <Card className="sticky top-8 border-2 border-green-600/30 bg-gradient-to-br from-green-900/30 to-gray-800">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2 text-white">
                                    <Check className="w-5 h-5 text-green-400" />
                                    Licenças Ativas
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {licencas.length > 0 ? (
                                    licencas.map((licenca) => (
                                        <motion.div
                                            key={licenca.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="p-4 bg-gray-800 rounded-lg border border-green-600/30"
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <span className="font-mono text-xs text-gray-400">
                                                    {licenca.chave}
                                                </span>
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <button className="p-1 hover:bg-gray-700 rounded transition">
                                                            {copiada ? (
                                                                <Check className="w-4 h-4 text-green-400" />
                                                            ) : (
                                                                <Copy
                                                                    className="w-4 h-4 text-gray-500 cursor-pointer"
                                                                    onClick={() => manipularCopia(licenca.chave)}
                                                                />
                                                            )}
                                                        </button>
                                                    </DialogTrigger>
                                                    <DialogContent className="bg-gray-800 border-gray-700">
                                                        <DialogHeader>
                                                            <DialogTitle className="text-white">Chave Copiada</DialogTitle>
                                                            <DialogDescription className="text-gray-400">
                                                                Sua chave foi copiada para a área de transferência
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                            <Badge
                                                variant={obterCorStatusBadge(licenca.status)}
                                                className="mb-2"
                                            >
                                                {licenca.status}
                                            </Badge>
                                            <div className="space-y-1 text-xs text-gray-400">
                                                <p>
                                                    <span className="font-bold">Expira:</span>{" "}
                                                    {licenca.dataExpiracao}
                                                </p>
                                                <p>
                                                    <span className="font-bold">Menus:</span> {licenca.menus}
                                                </p>
                                            </div>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="text-center py-6 text-gray-400">
                                        <AlertCircle className="w-8 h-8 mx-auto mb-2 text-gray-500" />
                                        <p className="text-sm">Nenhuma licença ativa</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
                {/* FAQ Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gray-800 rounded-2xl border border-gray-700 p-8"
                >
                    <h2 className="text-2xl font-bold text-white mb-6">
                        Dúvidas Frequentes
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            {
                                pergunta: "Como obtenho uma chave?",
                                resposta:
                                    "Entre em contato com nosso suporte ou compre uma licença em nossa plataforma.",
                            },
                            {
                                pergunta: "Qual é o tempo de ativação?",
                                resposta: "A ativação é instantânea após inserir a chave válida.",
                            },
                            {
                                pergunta: "Posso transferir minha licença?",
                                resposta:
                                    "Sim, entre em contato com o suporte para transferências de licença.",
                            },
                            {
                                pergunta: "Qual é a duração da licença?",
                                resposta: "As licenças têm duração variável conforme seu plano.",
                            },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 + i * 0.05 }}
                            >
                                <h3 className="font-bold text-white mb-2">{item.pergunta}</h3>
                                <p className="text-gray-400 text-sm">{item.resposta}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default PaginaResgate;
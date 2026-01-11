// src/pages/RedeemPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function RedeemPage() {
    const { reseller, tempo, random } = useParams();

    const [isBlacklisted, setIsBlacklisted] = useState(false);
    const [blacklistEnd, setBlacklistEnd] = useState(null);
    const [isValidated, setIsValidated] = useState(false);
    const [nick, setNick] = useState('');
    const [robloxData, setRobloxData] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Blacklist check (localStorage)
    useEffect(() => {
        const savedEnd = localStorage.getItem('blacklist_end');
        if (savedEnd) {
            const endDate = new Date(savedEnd);
            if (endDate > new Date()) {
                setIsBlacklisted(true);
                setBlacklistEnd(endDate);
            } else {
                localStorage.removeItem('blacklist_end');
            }
        }
    }, []);

    // Validação do link (chama a API serverless)
    useEffect(() => {
        if (!reseller || !tempo || !random) {
            setError('Parâmetros de URL inválidos');
            setLoading(false);
            return;
        }

        const validateLink = async () => {
            try {
                const response = await fetch(
                    `/api/redeem/validate?` +
                    new URLSearchParams({ reseller, tempo, random })
                );

                const data = await response.json();

                if (!response.ok) {
                    if (data.blacklist) {
                        const end = new Date();
                        end.setMinutes(end.getMinutes() + 2);
                        localStorage.setItem('blacklist_end', end.toISOString());
                        setIsBlacklisted(true);
                        setBlacklistEnd(end);
                    }
                    throw new Error(data.error || 'Link inválido ou modificado');
                }

                if (data.uses_atual >= data.max_uses) {
                    throw new Error('Link expirado (usos máximos atingidos)');
                }

                setIsValidated(true);
            } catch (err) {
                setError(err.message || 'Erro ao validar link');
            } finally {
                setLoading(false);
            }
        };

        validateLink();
    }, [reseller, tempo, random]);

    const handleDiscordAuth = () => {
        const redirectUri = encodeURIComponent(window.location.origin + window.location.pathname);
        const clientId = process.env.REACT_APP_DISCORD_CLIENT_ID;

        if (!clientId) {
            alert('Configuração do Discord não encontrada. Contate o suporte.');
            return;
        }

        window.location.href = `https://discord.com/api/oauth2/authorize?` +
            `client_id=${clientId}&` +
            `redirect_uri=${redirectUri}&` +
            `response_type=code&` +
            `scope=identify%20guilds`;
    };

    // ... (resto do código: handleConfirmNick, handleFinalConfirm, blacklist HTML, render da página)

    if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Validando link...</div>;
    if (error) return <div className="min-h-screen bg-black flex items-center justify-center text-red-400">{error}</div>;

    if (isBlacklisted && blacklistEnd) {
        return (
            <html lang="pt-BR">
                <head><title>Blacklist</title></head>
                <body style={{ margin: 0, height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#000', color: '#ff4444', fontFamily: 'Arial' }}>
                    <h1>Blacklist por 2 minutos</h1>
                    <p>Por tentar modificar a página.</p>
                    <p>Expira em: {blacklistEnd.toLocaleTimeString('pt-BR')}</p>
                </body>
            </html>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-black to-zinc-950 text-white p-6 flex flex-col items-center">
            <div className="w-full max-w-md space-y-8">
                <h1 className="text-3xl font-bold text-center text-purple-400">Resgate de Licença</h1>

                <div className="text-center">
                    <button onClick={handleDiscordAuth} className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-medium text-lg">
                        Autenticar com Discord
                    </button>
                </div>

                {/* ... resto do formulário de nick, preview, etc. */}
            </div>
        </div>
    );
}
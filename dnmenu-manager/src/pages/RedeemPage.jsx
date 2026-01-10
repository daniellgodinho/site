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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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

    useEffect(() => {
        if (!reseller || !tempo || !random) {
            setError('Parâmetros de URL inválidos');
            return;
        }

        const validateLink = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    `/api/redeem?` +
                    new URLSearchParams({
                        action: 'validate',
                        reseller,
                        tempo,
                        random,
                    })
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
                    throw new Error(data.error || 'Link inválido');
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
        const redirectUri = encodeURIComponent(
            window.location.origin + window.location.pathname
        );

        const clientId = process.env.REACT_APP_DISCORD_CLIENT_ID;

        if (!clientId) {
            console.error("REACT_APP_DISCORD_CLIENT_ID não definido no .env");
            alert("Erro de configuração: Client ID do Discord não encontrado");
            return;
        }

        window.location.href =
            `https://discord.com/api/oauth2/authorize?` +
            `client_id=${clientId}&` +
            `redirect_uri=${redirectUri}&` +
            `response_type=code&` +
            `scope=identify%20guilds`;
    };

    const handleConfirmNick = async () => {
        if (!nick.trim()) {
            setError('Digite um nick válido');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/redeem', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'fetch-roblox',
                    nick
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Não foi possível buscar dados do Roblox');
            }

            setRobloxData(data);
            setShowConfirm(true);
        } catch (err) {
            setError(err.message || 'Erro ao buscar dados do Roblox');
        } finally {
            setLoading(false);
        }
    };

    const handleFinalConfirm = async () => {
        if (!robloxData || !random) return;

        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/redeem', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'redeem',
                    random,
                    roblox_nick: nick,
                    roblox_id: robloxData.id,
                    roblox_data: robloxData
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Erro ao resgatar licença');
            }

            alert('Licença resgatada com sucesso!');
        } catch (err) {
            setError(err.message || 'Erro ao resgatar licença');
        } finally {
            setLoading(false);
        }
    };

    if (isBlacklisted && blacklistEnd) {
        return (
            <html lang="pt-BR">
                <head>
                    <meta charSet="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>Blacklist</title>
                    <style>{`
            body {
              margin: 0;
              height: 100vh;
              display: flex;
              justify-content: center;
              align-items: center;
              background: #000;
              color: #ff4444;
              font-family: Arial, Helvetica, sans-serif;
              text-align: center;
            }
            h1 { font-size: 2.5rem; margin-bottom: 1rem; }
            p { font-size: 1.2rem; }
          `}</style>
                </head>
                <body>
                    <div>
                        <h1>Blacklist por 2 minutos</h1>
                        <p>Por tentar modificar a página.</p>
                        <p>Expira em: {blacklistEnd.toLocaleTimeString('pt-BR')}</p>
                    </div>
                </body>
            </html>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
                <div className="bg-red-900/50 p-8 rounded-xl border border-red-600/50 max-w-md text-center">
                    <h2 className="text-2xl font-bold text-red-400 mb-4">Erro</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <p className="text-xl">Carregando...</p>
            </div>
        );
    }

    if (!isValidated) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <p className="text-xl">Validando link...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-black to-zinc-950 text-white p-6 flex flex-col items-center">
            <div className="w-full max-w-md space-y-8">
                <h1 className="text-3xl font-bold text-center text-purple-400">Resgate de Licença</h1>

                <div className="text-center">
                    <button
                        onClick={handleDiscordAuth}
                        className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-medium text-lg transition-colors"
                    >
                        Autenticar com Discord
                    </button>
                </div>

                <div className="space-y-4">
                    <input
                        type="text"
                        value={nick}
                        onChange={(e) => setNick(e.target.value)}
                        placeholder="Seu nick do Roblox"
                        className="w-full px-5 py-4 bg-zinc-900 border border-purple-600/40 rounded-xl text-white focus:outline-none focus:border-purple-500 transition-colors"
                        disabled={loading}
                    />

                    <p className="text-sm text-gray-400 text-center">
                        Certifique-se de que o nick está correto antes de confirmar
                    </p>

                    <button
                        onClick={handleConfirmNick}
                        disabled={loading || !nick.trim()}
                        className="w-full py-4 bg-purple-600 hover:bg-purple-700 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Carregando...' : 'Confirmar Nick'}
                    </button>
                </div>

                {robloxData && (
                    <div className="bg-zinc-900/80 p-6 rounded-xl border border-purple-600/30 text-center">
                        <img
                            src={robloxData.avatarUrl}
                            alt="Avatar Roblox"
                            className="w-32 h-32 mx-auto rounded-full border-4 border-purple-600/40 mb-4 object-cover"
                        />
                        <h3 className="text-xl font-bold">{robloxData.displayName}</h3>
                        <p className="text-sm text-gray-400">ID: {robloxData.id}</p>
                        <p className="text-sm text-gray-500 mt-2">
                            Conta criada em: {new Date(robloxData.created).toLocaleDateString('pt-BR')}
                        </p>

                        {showConfirm && (
                            <button
                                onClick={handleFinalConfirm}
                                disabled={loading}
                                className="mt-6 w-full py-4 bg-green-600 hover:bg-green-700 rounded-xl font-medium transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Processando...' : 'Confirmar Resgate'}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
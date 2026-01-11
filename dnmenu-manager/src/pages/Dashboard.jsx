// src/pages/Dashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
    UserCheck, Trash, LogOut, CalendarDays, Clock4, Infinity as InfinityIcon,
    Check, X, Search as SearchXIcon, Copy, Edit3, Save, Link as LinkIcon
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';
import monkeyLogo from '../assets/monkeyLogo.png';
import { FaDiscord } from 'react-icons/fa';

export default function Dashboard() {
    const selectedReseller = sessionStorage.getItem('reseller') || 'Neverpure Codes';
    const isMaster = sessionStorage.getItem('isMaster') === 'true';

    const [users, setUsers] = useState([]);
    const [usersFarm, setUsersFarm] = useState([]);
    const [newUser, setNewUser] = useState('');
    const [newUserFarm, setNewUserFarm] = useState('');
    const [selectedDuration, setSelectedDuration] = useState('vitalicio');
    const [selectedDurationFarm, setSelectedDurationFarm] = useState('vitalicio');
    const [activeTab, setActiveTab] = useState('users');
    const [searchQuery, setSearchQuery] = useState('');
    const [userListId, setUserListId] = useState(null);

    // Master only
    const [resellers, setResellers] = useState([]);
    const [scripts, setScripts] = useState({ dnmenu: '', dnfarm: '', dnsoftwares: '' });
    const [editingScript, setEditingScript] = useState(null);
    const [newReseller, setNewReseller] = useState({ name: '', password: '', discord_link: '' });

    // Logs (mantido)
    const [logs, setLogs] = useState([]);

    // Sistema de Links de Licenças
    const [redeemLinks, setRedeemLinks] = useState([]);
    const [newLinkTempo, setNewLinkTempo] = useState('mensal');
    const [newLinkMaxUses, setNewLinkMaxUses] = useState(1);

    // Graph data
    const [graphData, setGraphData] = useState([]);

    // Modal de confirmação
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [confirmDeleteReseller, setConfirmDeleteReseller] = useState(null);

    const navigate = useNavigate();

    const updateListsInSupabase = useCallback(async (newUsers, newFarm) => {
        const toStr = (list) => list.map(u => `${u.username}|${u.duration}|${u.expiration || ''}|${u.created_at}`).join(',');
        const { error } = await supabase
            .from('user_lists')
            .update({ users: toStr(newUsers), users_farm: toStr(newFarm) })
            .eq('id', userListId);
        if (error) console.error('Update error:', error);
        return !error;
    }, [userListId]);

    const fetchUserLists = useCallback(async () => {
        const { data, error } = await supabase
            .from('user_lists')
            .select('*')
            .eq('reseller', selectedReseller)
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error(error);
            return;
        }

        if (data) {
            setUserListId(data.id);
            const parseList = (str) => str ? str.split(',').map(s => {
                const [username, duration = 'vitalicio', expiration = '', created_at = new Date().toISOString()] = s.split('|');
                return { username, duration, expiration, created_at };
            }) : [];
            setUsers(parseList(data.users));
            setUsersFarm(parseList(data.users_farm));
        } else {
            const { data: newData, error: insertError } = await supabase
                .from('user_lists')
                .insert({ reseller: selectedReseller, users: '', users_farm: '' })
                .select()
                .single();
            if (insertError) {
                console.error('Insert error:', insertError);
                return;
            }
            setUserListId(newData.id);
            setUsers([]);
            setUsersFarm([]);
        }
    }, [selectedReseller]);

    const cleanExpired = useCallback(async () => {
        const now = new Date();
        const cleanList = (list) => list.filter(u => !u.expiration || new Date(u.expiration) > now);

        const newUsers = cleanList(users);
        const newFarm = cleanList(usersFarm);

        if (newUsers.length < users.length || newFarm.length < usersFarm.length) {
            const success = await updateListsInSupabase(newUsers, newFarm);
            if (success) {
                setUsers(newUsers);
                setUsersFarm(newFarm);
            }
        }
    }, [users, usersFarm, updateListsInSupabase]);

    useEffect(() => {
        fetchUserLists();
        cleanExpired();
        const interval = setInterval(cleanExpired, 60000);
        return () => clearInterval(interval);
    }, [fetchUserLists, cleanExpired]);

    useEffect(() => {
        if (isMaster) {
            const fetchMasterData = async () => {
                const { data: res } = await supabase.from('resellers').select('*');
                setResellers(res?.filter(r => r.name !== 'indefinido') || []);

                const { data: scr, error } = await supabase.from('scripts').select('*');
                if (error) console.error('Scripts fetch error:', error);
                const map = {};
                scr?.forEach(s => map[s.name] = s.code || '');
                setScripts(map);

                const requiredScripts = ['dnmenu', 'dnfarm', 'dnsoftwares'];
                for (const name of requiredScripts) {
                    if (!map[name]) {
                        const { error: insertError } = await supabase.from('scripts').insert({ name, code: '' });
                        if (insertError) console.error(`Insert ${name} error:`, insertError);
                        else map[name] = '';
                    }
                }
                setScripts({ ...map });

                const { data: logsData } = await supabase.from('access_logs').select('*').order('created_at', { ascending: false }).limit(100);
                setLogs(logsData || []);
            };
            fetchMasterData();
        }
    }, [isMaster]);

    useEffect(() => {
        const fetchRedeemLinks = async () => {
            let query = supabase.from('links').select('*').order('created_at', { ascending: false });

            if (!isMaster) {
                query = query.eq('reseller', selectedReseller);
            }

            const { data, error } = await query;
            if (error) {
                console.error('Erro ao carregar links:', error);
                return;
            }
            setRedeemLinks(data || []);
        };

        fetchRedeemLinks();
    }, [isMaster, selectedReseller]);

    useEffect(() => {
        const allUsers = [...users, ...usersFarm];
        const months = ['Jan', 'Feb', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        const userCounts = months.map((_, index) => ({
            name: months[index],
            users: allUsers.filter(u => {
                if (!u.created_at) return false;
                const date = new Date(u.created_at);
                return date.getMonth() === index;
            }).length
        }));
        setGraphData(userCounts);
    }, [users, usersFarm]);

    const handleLogout = () => {
        sessionStorage.clear();
        navigate('/');
    };

    const calculateExpiration = (duration) => {
        if (duration === 'vitalicio') return null;
        const now = new Date();
        if (duration === 'diario') now.setDate(now.getDate() + 1);
        if (duration === 'semanal') now.setDate(now.getDate() + 7);
        if (duration === 'mensal') now.setDate(now.getDate() + 30);
        return now.toISOString();
    };

    const addUser = async () => {
        const isUsers = activeTab === 'users';
        const username = (isUsers ? newUser : newUserFarm).trim();
        if (!username) return alert('Nome de usuário obrigatório');

        const duration = isUsers ? selectedDuration : selectedDurationFarm;
        const expiration = calculateExpiration(duration);
        const created_at = new Date().toISOString();

        const newEntry = { username, duration, expiration, created_at };
        const newList = isUsers ? [...users, newEntry] : [...usersFarm, newEntry];

        const success = await updateListsInSupabase(isUsers ? newList : users, isUsers ? usersFarm : newList);
        if (success) {
            isUsers ? setUsers(newList) : setUsersFarm(newList);
            isUsers ? setNewUser('') : setNewUserFarm('');
            alert(`${username} adicionado com sucesso!`);
        } else {
            alert('Erro ao adicionar usuário.');
        }
    };

    const openDeleteConfirm = (tab, username) => {
        setConfirmDelete({ tab, username });
    };

    const confirmRemove = async () => {
        if (!confirmDelete) return;

        const { tab, username } = confirmDelete;
        const isUsers = tab === 'users';
        const newList = (isUsers ? users : usersFarm).filter(u => u.username !== username);

        const success = await updateListsInSupabase(
            isUsers ? newList : users,
            isUsers ? usersFarm : newList
        );

        if (success) {
            isUsers ? setUsers(newList) : setUsersFarm(newList);
            alert(`${username} removido com sucesso!`);
        } else {
            alert('Erro ao remover.');
        }

        setConfirmDelete(null);
    };

    const cancelRemove = () => setConfirmDelete(null);

    const addReseller = async () => {
        if (!newReseller.name || !newReseller.password) return alert('Nome e senha obrigatórios');
        const { error } = await supabase.from('resellers').insert({ ...newReseller });
        if (!error) {
            setNewReseller({ name: '', password: '', discord_link: '' });
            const { data } = await supabase.from('resellers').select('*');
            setResellers(data?.filter(r => r.name !== 'indefinido') || []);
            alert('Revendedor adicionado!');
        } else {
            alert('Erro ao adicionar revendedor.');
        }
    };

    const removeReseller = async (id, name) => {
        const { error } = await supabase.from('resellers').delete().eq('id', id);
        if (!error) {
            setResellers(resellers.filter(r => r.id !== id));
            alert(`${name} removido com sucesso!`);
        } else {
            alert('Erro ao remover revendedor.');
        }
    };

    const openDeleteResellerConfirm = (id, name) => {
        setConfirmDeleteReseller({ id, name });
    };

    const confirmRemoveReseller = async () => {
        if (!confirmDeleteReseller) return;
        await removeReseller(confirmDeleteReseller.id, confirmDeleteReseller.name);
        setConfirmDeleteReseller(null);
    };

    const cancelRemoveReseller = () => setConfirmDeleteReseller(null);

    const saveScript = async (name) => {
        const { data: existing } = await supabase
            .from('scripts')
            .select('id')
            .eq('name', name)
            .single();

        let error;
        if (existing) {
            ({ error } = await supabase
                .from('scripts')
                .update({ code: scripts[name] })
                .eq('name', name));
        } else {
            ({ error } = await supabase
                .from('scripts')
                .insert({ name, code: scripts[name] }));
        }

        if (!error) {
            setEditingScript(null);
            alert('Script salvo!');
        } else {
            alert('Erro ao salvar.');
        }
    };

    const copyRaw = async (type) => {
        let text = '';
        if (type === 'users' || type === 'usersfarm') {
            const all = type === 'users' ? users : usersFarm;
            text = all.map(u => u.username).join('\n');
        } else if (type === 'dnsoftwares') {
            text = `${scripts.dnmenu}\n// Separator\n${scripts.dnfarm}\n// Separator\n${scripts.dnsoftwares}`;
        } else {
            text = scripts[type] || '';
        }
        navigator.clipboard.writeText(text);
        alert('Copiado para a área de transferência!');
    };

    const generateRedeemLink = async () => {
        if (!newLinkTempo) return alert('Selecione o tempo de expiração');

        const randomBytes = new Uint8Array(10);
        crypto.getRandomValues(randomBytes);
        const random_id = Array.from(randomBytes)
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');

        const linkData = {
            reseller: selectedReseller,
            tempo: newLinkTempo,
            max_uses: Math.max(1, parseInt(newLinkMaxUses) || 1),
            uses_atual: 0,
            random_id,
            created_at: new Date().toISOString()
        };

        const { error } = await supabase.from('links').insert(linkData);

        if (error) {
            alert('Erro ao gerar link:\n' + error.message);
            return;
        }

        alert('Link gerado com sucesso!');
        setRedeemLinks(prev => [...prev, linkData]);
        setNewLinkTempo('mensal');
        setNewLinkMaxUses(1);
    };

    const copyLink = (link) => {
        navigator.clipboard.writeText(link);
        alert('Link copiado para a área de transferência!');
    };

    const filtered = (activeTab === 'users' ? users : usersFarm).filter(u => u.username.toLowerCase().includes(searchQuery.toLowerCase()));
    const total = users.length + usersFarm.length;
    const active = [...users, ...usersFarm].filter(u => !u.expiration || new Date(u.expiration) > new Date()).length;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-gradient-to-b from-black to-zinc-950 text-white">
            {/* Header */}
            <header className="bg-gradient-to-r from-[#1a1a1a]/90 to-purple-900/20 backdrop-blur-xl border-b border-purple-600/20">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <img
                            src={monkeyLogo}
                            alt="DN Menu Logo"
                            className="w-32 h-32 object-contain drop-shadow-2xl drop-shadow-purple-600/50"
                        />
                        <div>
                            <h1 className="text-2xl font-bold">Dashboard</h1>
                            <p className="text-purple-400">{selectedReseller}</p>
                            {isMaster && <p className="text-green-400 font-bold">MESTRE</p>}
                        </div>
                    </div>
                    <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-red-600/80 rounded-lg hover:bg-red-500 transition-colors">
                        <LogOut className="w-5 h-5" /> Sair
                    </button>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 py-8 bg-gradient-to-b from-transparent to-purple-900/5">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="p-6 bg-gradient-to-br from-[#2e2e2e]/80 to-purple-900/10 rounded-2xl border border-purple-600/20 shadow-lg shadow-purple-600/10">
                        <p className="text-gray-400">Total</p>
                        <p className="text-4xl font-bold text-purple-400">{total}</p>
                    </div>
                    <div className="p-6 bg-gradient-to-br from-[#2e2e2e]/80 to-purple-900/10 rounded-2xl border border-purple-600/20 shadow-lg shadow-purple-600/10">
                        <p className="text-gray-400">Ativos</p>
                        <p className="text-4xl font-bold text-green-400">{active}</p>
                    </div>
                    <div className="p-6 bg-gradient-to-br from-[#2e2e2e]/80 to-purple-900/10 rounded-2xl border border-purple-600/20 shadow-lg shadow-purple-600/10">
                        <p className="text-gray-400">Expirados</p>
                        <p className="text-4xl font-bold text-red-400">{total - active}</p>
                    </div>
                </div>

                {/* Gráfico */}
                <div className="mb-12 bg-gradient-to-br from-[#2e2e2e]/80 to-purple-900/10 rounded-2xl p-6 border border-purple-600/20">
                    <h2 className="text-2xl font-bold mb-4 text-purple-400">Crescimento de Usuários</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={graphData}>
                            <defs>
                                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8A2BE2" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#8A2BE2" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                            <XAxis dataKey="name" stroke="#ffffff60" />
                            <YAxis stroke="#ffffff60" />
                            <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #8A2BE2' }} />
                            <Area type="monotone" dataKey="users" stroke="#8A2BE2" fillOpacity={1} fill="url(#colorUsers)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Master: Revendedores */}
                {isMaster && (
                    <div className="mb-12">
                        <h2 className="text-3xl font-bold mb-6 text-purple-400">Revendedores</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            {resellers.map(r => (
                                <div key={r.id} className="bg-gradient-to-br from-[#2e2e2e]/80 to-purple-900/10 rounded-2xl p-6 border border-purple-600/30 shadow-md shadow-purple-600/20">
                                    <h3 className="text-xl font-bold mb-4">{r.name}</h3>
                                    <div className="flex items-center justify-between gap-4">
                                        <button
                                            onClick={() => window.open(r.discord_link, '_blank')}
                                            className="flex items-center gap-2 px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-500 transition-colors"
                                        >
                                            <FaDiscord className="w-5 h-5" />
                                            Discord
                                        </button>
                                        <button
                                            onClick={() => openDeleteResellerConfirm(r.id, r.name)}
                                            className="flex items-center gap-2 px-4 py-2 bg-red-600 rounded-lg hover:bg-red-500 transition-colors"
                                        >
                                            <Trash className="w-5 h-5" />
                                            Remover
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-gradient-to-br from-[#2e2e2e]/80 to-purple-900/10 rounded-2xl p-6 border border-purple-600/30">
                            <h3 className="text-xl font-bold mb-4">Adicionar Revendedor</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <input placeholder="Nome" value={newReseller.name} onChange={e => setNewReseller({ ...newReseller, name: e.target.value })} className="px-4 py-3 bg-black/50 rounded-lg border border-purple-600/40 text-white" />
                                <input placeholder="Senha" type="password" value={newReseller.password} onChange={e => setNewReseller({ ...newReseller, password: e.target.value })} className="px-4 py-3 bg-black/50 rounded-lg border border-purple-600/40 text-white" />
                                <input placeholder="Link Discord" value={newReseller.discord_link} onChange={e => setNewReseller({ ...newReseller, discord_link: e.target.value })} className="px-4 py-3 bg-black/50 rounded-lg border border-purple-600/40 text-white" />
                            </div>
                            <button onClick={addReseller} className="mt-4 px-6 py-3 bg-purple-600 rounded-lg hover:bg-purple-500 transition-colors">
                                Adicionar
                            </button>
                        </div>
                    </div>
                )}

                {/* Tabs */}
                <div className="flex flex-wrap gap-3 mb-6">
                    <button onClick={() => setActiveTab('users')} className={`px-5 py-2.5 rounded-xl transition-colors ${activeTab === 'users' ? 'bg-purple-600' : 'bg-[#2e2e2e]'}`}>Users ({users.length})</button>
                    <button onClick={() => setActiveTab('usersfarm')} className={`px-5 py-2.5 rounded-xl transition-colors ${activeTab === 'usersfarm' ? 'bg-purple-600' : 'bg-[#2e2e2e]'}`}>Users Farm ({usersFarm.length})</button>
                    <button onClick={() => setActiveTab('raw')} className={`px-5 py-2.5 rounded-xl transition-colors ${activeTab === 'raw' ? 'bg-purple-600' : 'bg-[#2e2e2e]'}`}>Raw</button>
                    <button onClick={() => setActiveTab('redeem')} className={`px-5 py-2.5 rounded-xl transition-colors ${activeTab === 'redeem' ? 'bg-purple-600' : 'bg-[#2e2e2e]'}`}>Licenças / Links</button>
                </div>

                {activeTab === 'redeem' ? (
                    <div className="space-y-8">
                        <h2 className="text-2xl font-bold text-purple-400">Gerenciar Links de Resgate</h2>

                        {/* Formulário de geração */}
                        <div className="bg-gradient-to-br from-[#2e2e2e]/80 to-purple-900/10 rounded-2xl p-6 border border-purple-600/30">
                            <h3 className="text-xl font-bold mb-4">Gerar Novo Link</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <select
                                    value={newLinkTempo}
                                    onChange={e => setNewLinkTempo(e.target.value)}
                                    className="px-4 py-3 bg-black/50 rounded-lg border border-purple-600/40 text-white focus:outline-none focus:border-purple-500"
                                >
                                    <option value="diario">Diário</option>
                                    <option value="semanal">Semanal</option>
                                    <option value="mensal">Mensal</option>
                                    <option value="vitalicio">Vitalício</option>
                                </select>

                                <input
                                    type="number"
                                    min="1"
                                    max="100"
                                    placeholder="Máximo de usos"
                                    value={newLinkMaxUses}
                                    onChange={e => setNewLinkMaxUses(e.target.value)}
                                    className="px-4 py-3 bg-black/50 rounded-lg border border-purple-600/40 text-white"
                                />

                                <button
                                    onClick={generateRedeemLink}
                                    className="px-6 py-3 bg-green-600/90 hover:bg-green-600 rounded-xl transition-colors flex items-center justify-center gap-2 font-medium"
                                >
                                    <LinkIcon size={18} /> Gerar Link
                                </button>
                            </div>
                        </div>

                        {/* Espaço entre o form e a tabela */}
                        <div className="my-12" />

                        {/* Lista de links */}
                        <div className="overflow-x-auto rounded-2xl border border-purple-600/20 bg-gradient-to-br from-[#2e2e2e]/50 to-purple-900/5">
                            <table className="w-full min-w-[700px]">
                                <thead className="bg-gradient-to-r from-[#1a1a1a] to-purple-900/20">
                                    <tr>
                                        <th className="px-6 py-4 text-left">Revendedor</th>
                                        <th className="px-6 py-4 text-left">Tempo</th>
                                        <th className="px-6 py-4 text-left">Usos / Máx</th>
                                        <th className="px-6 py-4 text-left">Link</th>
                                        <th className="px-6 py-4 text-right">Ação</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {redeemLinks.map(link => {
                                        const fullLink = `https://dnsoftwares.vercel.app/${encodeURIComponent(link.reseller)}/${encodeURIComponent(link.tempo)}/${link.random_id}`;
                                        return (
                                            <tr key={link.random_id} className="border-t border-gray-800 hover:bg-purple-900/10 transition-colors">
                                                <td className="px-6 py-4">{link.reseller}</td>
                                                <td className="px-6 py-4">{link.tempo}</td>
                                                <td className="px-6 py-4">{link.uses_atual || 0} / {link.max_uses}</td>
                                                <td className="px-6 py-4 break-all text-sm font-mono text-purple-300/90">{fullLink}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => copyLink(fullLink)}
                                                        className="text-purple-400 hover:text-purple-300 transition-colors"
                                                        title="Copiar link"
                                                    >
                                                        <Copy size={20} />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {redeemLinks.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                                                Nenhum link de resgate gerado ainda.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : activeTab === 'raw' ? (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-purple-400">Raw</h2>
                        {!isMaster ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button onClick={() => copyRaw('users')} className="flex items-center justify-center gap-2 py-4 bg-purple-600 rounded-xl hover:bg-purple-500 transition-colors">
                                    <Copy className="w-5 h-5" /> Copiar raw de users
                                </button>
                                <button onClick={() => copyRaw('usersfarm')} className="flex items-center justify-center gap-2 py-4 bg-purple-600 rounded-xl hover:bg-purple-500 transition-colors">
                                    <Copy className="w-5 h-5" /> Copiar raw de users farm
                                </button>
                                <button onClick={() => copyRaw('dnmenu')} className="flex items-center justify-center gap-2 py-4 bg-purple-600 rounded-xl hover:bg-purple-500 transition-colors">
                                    <Copy className="w-5 h-5" /> Copiar raw do dn menu
                                </button>
                                <button onClick={() => copyRaw('dnfarm')} className="flex items-center justify-center gap-2 py-4 bg-purple-600 rounded-xl hover:bg-purple-500 transition-colors">
                                    <Copy className="w-5 h-5" /> Copiar raw do dn farm
                                </button>
                                <button onClick={() => copyRaw('dnsoftwares')} className="flex items-center justify-center gap-2 py-4 bg-purple-600 rounded-xl hover:bg-purple-500 transition-colors col-span-1 md:col-span-2">
                                    <Copy className="w-5 h-5" /> Copiar raw do dn softwares (todos)
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-xl font-bold mb-4 text-purple-400">Editar Scripts (afeta todos os revendedores)</h3>
                                    {['dnmenu', 'dnfarm', 'dnsoftwares'].map(name => (
                                        <div key={name} className="mb-6">
                                            <div className="flex items-center justify-between mb-2">
                                                <label className="text-lg font-medium capitalize">{name.replace('dn', 'DN ')}</label>
                                                {editingScript === name ? (
                                                    <button onClick={() => saveScript(name)} className="flex items-center gap-2 text-green-400 hover:text-green-300">
                                                        <Save className="w-5 h-5" /> Salvar
                                                    </button>
                                                ) : (
                                                    <button onClick={() => setEditingScript(name)} className="flex items-center gap-2 text-blue-400 hover:text-blue-300">
                                                        <Edit3 className="w-5 h-5" /> Editar
                                                    </button>
                                                )}
                                            </div>
                                            <textarea
                                                value={scripts[name] || ''}
                                                onChange={e => setScripts({ ...scripts, [name]: e.target.value })}
                                                readOnly={editingScript !== name}
                                                rows={10}
                                                className="w-full px-4 py-3 bg-black/50 rounded-xl border border-purple-600/40 font-mono text-sm text-white"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="flex flex-col md:flex-row gap-4 mb-6">
                            <input
                                placeholder={activeTab === 'users' ? 'Novo usuário' : 'Novo usuário farm'}
                                value={activeTab === 'users' ? newUser : newUserFarm}
                                onChange={e => activeTab === 'users' ? setNewUser(e.target.value) : setNewUserFarm(e.target.value)}
                                className="flex-1 px-4 py-3 bg-[#2e2e2e]/80 rounded-xl border border-purple-600/30 text-white"
                            />
                            <select
                                value={activeTab === 'users' ? selectedDuration : selectedDurationFarm}
                                onChange={e => activeTab === 'users' ? setSelectedDuration(e.target.value) : setSelectedDurationFarm(e.target.value)}
                                className="px-6 py-3 bg-[#2e2e2e]/80 rounded-xl border border-purple-600/30 text-white"
                            >
                                <option value="diario">Diário</option>
                                <option value="semanal">Semanal</option>
                                <option value="mensal">Mensal</option>
                                <option value="vitalicio">Vitalício</option>
                            </select>
                            <button onClick={addUser} className="flex items-center gap-2 px-6 py-3 bg-purple-600 rounded-xl hover:bg-purple-500 transition-colors">
                                <UserCheck className="w-5 h-5" /> Adicionar
                            </button>
                        </div>

                        <div className="relative mb-6">
                            <SearchXIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input
                                placeholder="Buscar usuário..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-[#2e2e2e]/80 rounded-xl border border-purple-600/30 text-white"
                            />
                        </div>

                        <div className="overflow-x-auto rounded-2xl border border-purple-600/20 bg-gradient-to-br from-[#2e2e2e]/50 to-purple-900/5">
                            <table className="w-full">
                                <thead className="bg-gradient-to-r from-[#1a1a1a] to-purple-900/20">
                                    <tr>
                                        <th className="px-6 py-4 text-left">Usuário</th>
                                        <th className="px-6 py-4 text-left">Duração</th>
                                        <th className="px-6 py-4 text-left">Tempo Restante</th>
                                        <th className="px-6 py-4 text-left">Status</th>
                                        <th className="px-6 py-4 text-right">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((u) => {
                                        const remaining = u.expiration ? Math.max(0, new Date(u.expiration) - new Date()) : null;
                                        const days = remaining ? Math.floor(remaining / (1000 * 60 * 60 * 24)) : null;
                                        const hours = remaining ? Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) : null;
                                        const isActive = !u.expiration || new Date(u.expiration) > new Date();

                                        return (
                                            <tr key={u.username} className="border-t border-gray-800 hover:bg-purple-900/10 transition-colors">
                                                <td className="px-6 py-4">{u.username}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        {u.duration === 'diario' && <Clock4 className="w-4 h-4 text-yellow-400" />}
                                                        {u.duration === 'semanal' && <CalendarDays className="w-4 h-4 text-blue-400" />}
                                                        {u.duration === 'mensal' && <CalendarDays className="w-4 h-4 text-purple-400" />}
                                                        {u.duration === 'vitalicio' && <InfinityIcon className="w-4 h-4 text-green-400" />}
                                                        <span className="capitalize">
                                                            {u.duration === 'vitalicio' ? 'Vitalício' : u.duration === 'diario' ? 'Diário' : u.duration === 'semanal' ? 'Semanal' : 'Mensal'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {u.expiration ? (days > 0 ? `${days}d ${hours}h` : `${hours}h`) : 'Vitalício'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {isActive ? <div className="flex items-center gap-2 text-green-400"><Check className="w-4 h-4" /> Ativo</div>
                                                        : <div className="flex items-center gap-2 text-red-400"><X className="w-4 h-4" /> Expirado</div>}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button onClick={() => openDeleteConfirm(activeTab, u.username)}>
                                                        <Trash className="w-5 h-5 text-red-400 hover:text-red-300 transition-colors" />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {/* Master: Seção de Logs */}
                {isMaster && (
                    <div className="mb-12">
                        <h2 className="text-3xl font-bold mb-6 text-purple-400">Logs de Acesso</h2>
                        <div className="overflow-x-auto rounded-2xl border border-purple-600/20 bg-gradient-to-br from-[#2e2e2e]/50 to-purple-900/5">
                            <table className="w-full">
                                <thead className="bg-gradient-to-r from-[#1a1a1a] to-purple-900/20">
                                    <tr>
                                        <th className="px-6 py-4 text-left">Data</th>
                                        <th className="px-6 py-4 text-left">Roblox Nick</th>
                                        <th className="px-6 py-4 text-left">HWID</th>
                                        <th className="px-6 py-4 text-left">Script</th>
                                        <th className="px-6 py-4 text-left">IP</th>
                                        <th className="px-6 py-4 text-left">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.map(log => (
                                        <tr key={log.id} className="border-t border-gray-800 hover:bg-purple-900/10 transition-colors">
                                            <td className="px-6 py-4">{new Date(log.created_at).toLocaleString()}</td>
                                            <td className="px-6 py-4">{log.roblox_nick || '-'}</td>
                                            <td className="px-6 py-4">{log.hwid || '-'}</td>
                                            <td className="px-6 py-4">{log.script_type}</td>
                                            <td className="px-6 py-4">{log.ip}</td>
                                            <td className="px-6 py-4">{log.status}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Modal de Confirmação de Remoção Usuário */}
                {confirmDelete && (
                    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-zinc-900 border border-purple-600/50 rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center"
                        >
                            <h3 className="text-xl font-bold text-white mb-4">Confirmar Remoção</h3>
                            <p className="text-gray-300 mb-6">
                                Tem certeza que deseja remover o usuário <span className="text-purple-400 font-medium">{confirmDelete.username}</span>?
                            </p>
                            <div className="flex gap-4 justify-center">
                                <button
                                    onClick={cancelRemove}
                                    className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-gray-300 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={confirmRemove}
                                    className="px-6 py-3 bg-red-600 hover:bg-red-500 rounded-xl text-white font-medium transition-colors"
                                >
                                    Remover
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Modal de Confirmação de Remoção Revendedor */}
                {confirmDeleteReseller && (
                    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-zinc-900 border border-purple-600/50 rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center"
                        >
                            <h3 className="text-xl font-bold text-white mb-4">Confirmar Remoção</h3>
                            <p className="text-gray-300 mb-6">
                                Tem certeza que deseja remover o revendedor <span className="text-purple-400 font-medium">{confirmDeleteReseller.name}</span>?
                            </p>
                            <div className="flex gap-4 justify-center">
                                <button
                                    onClick={cancelRemoveReseller}
                                    className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-gray-300 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={confirmRemoveReseller}
                                    className="px-6 py-3 bg-red-600 hover:bg-red-500 rounded-xl text-white font-medium transition-colors"
                                >
                                    Remover
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
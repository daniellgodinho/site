// src/pages/Dashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
    UserCheck, Trash, LogOut, CalendarDays, Clock4, Infinity as InfinityIcon,
    Check, X, Search as SearchXIcon, Copy, Edit3, Save
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';
import monkeyLogo from '../assets/monkeyLogo.png'; // Import direto da logo

const DiscordIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515a.074.074 0 00-.078.037c-.211.375-.444.864-.608 1.25c-1.845-.276-3.68-.276-5.487 0c-.164-.386-.398-.875-.608-1.25a.074.074 0 00-.078-.037a19.736 19.736 0 00-4.885 1.515a.07.07 0 00-.032.027c-4.35 6.474-5.533 12.84-4.936 19.108a.082.082 0 00.027.06c2.797 2.022 5.479 2.879 8.039 3.05a.074.074 0 00.078-.037c.461-.63.873-1.295 1.226-1.994a.076.076 0 00-.041-.106c-.652-.248-1.274-.55-1.872-.892a.077.077 0 01-.008-.128c.126-.094.249-.195.373-.294a.074.074 0 01.078-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 01.078.01c.124.099.247.2.373.294a.077.077 0 01-.008.128c-.598.342-1.22.644-1.872.892a.076.076 0 00-.041.106c.36.698.775.962 1.226 1.993a.074.074 0 00.078.037c2.56-.171 5.242-1.028 8.039-3.05a.082.082 0 00.027-.06c.598-6.268-.584-12.634-4.936-19.108a.07.07 0 00-.032-.027zM8.827 15.946a2.31 2.31 0 01-2.312-2.314a2.312 2.312 0 112.312 2.314zm6.346 0a2.31 2.31 0 01-2.312-2.314a2.312 2.312 0 112.312 2.314z" />
    </svg>
);

export default function Dashboard() {
    const selectedReseller = sessionStorage.getItem('reseller') || 'Neverpure Codes';
    const isMaster = sessionStorage.getItem('isMaster') === 'true';

    const [users, setUsers] = useState([]);
    const [usersFarm, setUsersFarm] = useState([]);
    const [newUser, setNewUser] = useState('');
    const [newUserFarm, setNewUserFarm] = useState('');
    const [selectedDuration, setSelectedDuration] = useState('lifetime');
    const [selectedDurationFarm, setSelectedDurationFarm] = useState('lifetime');
    const [activeTab, setActiveTab] = useState('users');
    const [searchQuery, setSearchQuery] = useState('');
    const [userListId, setUserListId] = useState(null);

    // Master only
    const [resellers, setResellers] = useState([]);
    const [scripts, setScripts] = useState({ dnmenu: '', dnfarm: '', dnsoftwares: '' });
    const [editingScript, setEditingScript] = useState(null);
    const [newReseller, setNewReseller] = useState({ name: '', password: '', discord_link: '' });

    // Graph data
    const [graphData, setGraphData] = useState([]);

    // Modal de confirmação
    const [confirmDelete, setConfirmDelete] = useState(null); // { tab: 'users', username: 'nome' }

    const navigate = useNavigate();

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
                const [username, duration = 'lifetime', expiration = ''] = s.split('|');
                return { username, duration, expiration };
            }) : [];
            setUsers(parseList(data.users));
            setUsersFarm(parseList(data.users_farm));
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
    }, [users, usersFarm]);

    useEffect(() => {
        fetchUserLists();
        cleanExpired();
        const interval = setInterval(cleanExpired, 60000); // Verifica a cada minuto
        return () => clearInterval(interval);
    }, [fetchUserLists, cleanExpired]);

    useEffect(() => {
        if (isMaster) {
            const fetchMasterData = async () => {
                const { data: res } = await supabase.from('resellers').select('*');
                setResellers(res || []);

                const { data: scr } = await supabase.from('scripts').select('*');
                const map = {};
                scr?.forEach(s => map[s.name] = s.code || '');
                setScripts(map);
            };
            fetchMasterData();
        }
    }, [isMaster]);

    useEffect(() => {
        setGraphData([
            { name: 'Jan', users: 400 },
            { name: 'Fev', users: 300 },
            { name: 'Mar', users: 500 },
            { name: 'Abr', users: 800 },
            { name: 'Mai', users: 700 },
            { name: 'Jun', users: 900 },
            { name: 'Jul', users: 1100 },
            { name: 'Ago', users: 1000 },
            { name: 'Set', users: 1200 },
            { name: 'Out', users: 1400 },
            { name: 'Nov', users: 1300 },
            { name: 'Dez', users: 1500 },
        ]);
    }, []);

    const handleLogout = () => {
        sessionStorage.clear();
        navigate('/');
    };

    const calculateExpiration = (duration) => {
        if (duration === 'lifetime') return null;
        const now = new Date();
        if (duration === 'daily') now.setDate(now.getDate() + 1);
        if (duration === 'weekly') now.setDate(now.getDate() + 7);
        if (duration === 'monthly') now.setDate(now.getDate() + 30);
        return now.toISOString();
    };

    const updateListsInSupabase = async (newUsers, newFarm) => {
        const toStr = (list) => list.map(u => `${u.username}|${u.duration}|${u.expiration || ''}`).join(',');
        const { error } = await supabase
            .from('user_lists')
            .update({ users: toStr(newUsers), users_farm: toStr(newFarm) })
            .eq('id', userListId);
        return !error;
    };

    const addUser = async () => {
        const isUsers = activeTab === 'users';
        const username = (isUsers ? newUser : newUserFarm).trim();
        if (!username) return alert('Nome de usuário obrigatório');

        const duration = isUsers ? selectedDuration : selectedDurationFarm;
        const expiration = calculateExpiration(duration);

        const newEntry = { username, duration, expiration };
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

    // Função para abrir modal de confirmação
    const openDeleteConfirm = (tab, username) => {
        setConfirmDelete({ tab, username });
    };

    // Função para confirmar remoção
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
            setResellers(data || []);
            alert('Revendedor adicionado!');
        } else {
            alert('Erro ao adicionar revendedor.');
        }
    };

    const saveScript = async (name) => {
        const { error } = await supabase.from('scripts').update({ code: scripts[name] }).eq('name', name);
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

    const filtered = (activeTab === 'users' ? users : usersFarm).filter(u => u.username.toLowerCase().includes(searchQuery.toLowerCase()));
    const total = users.length + usersFarm.length;
    const active = [...users, ...usersFarm].filter(u => !u.expiration || new Date(u.expiration) > new Date()).length;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-gradient-to-b from-black to-zinc-950 text-white">
            {/* Header */}
            <header className="bg-[#1a1a1a]/90 backdrop-blur-xl border-b border-purple-600/20">
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

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="p-6 bg-[#2e2e2e]/80 rounded-2xl border border-purple-600/20 shadow-lg shadow-purple-600/10">
                        <p className="text-gray-400">Total</p>
                        <p className="text-4xl font-bold text-purple-400">{total}</p>
                    </div>
                    <div className="p-6 bg-[#2e2e2e]/80 rounded-2xl border border-purple-600/20 shadow-lg shadow-purple-600/10">
                        <p className="text-gray-400">Ativos</p>
                        <p className="text-4xl font-bold text-green-400">{active}</p>
                    </div>
                    <div className="p-6 bg-[#2e2e2e]/80 rounded-2xl border border-purple-600/20 shadow-lg shadow-purple-600/10">
                        <p className="text-gray-400">Expirados</p>
                        <p className="text-4xl font-bold text-red-400">{total - active}</p>
                    </div>
                </div>

                {/* Gráfico */}
                <div className="mb-12 bg-[#2e2e2e]/80 rounded-2xl p-6 border border-purple-600/20">
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
                                <div key={r.id} className="bg-[#2e2e2e]/80 rounded-2xl p-6 border border-purple-600/30 shadow-md shadow-purple-600/20">
                                    <h3 className="text-xl font-bold mb-4">{r.name}</h3>
                                    <button
                                        onClick={() => window.open(r.discord_link, '_blank')}
                                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-500 transition-colors"
                                    >
                                        <DiscordIcon />
                                        Discord
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="bg-[#2e2e2e]/80 rounded-2xl p-6 border border-purple-600/30">
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
                <div className="flex gap-4 mb-6">
                    <button onClick={() => setActiveTab('users')} className={`px-6 py-3 rounded-xl transition-colors ${activeTab === 'users' ? 'bg-purple-600' : 'bg-[#2e2e2e]'}`}>Users ({users.length})</button>
                    <button onClick={() => setActiveTab('usersfarm')} className={`px-6 py-3 rounded-xl transition-colors ${activeTab === 'usersfarm' ? 'bg-purple-600' : 'bg-[#2e2e2e]'}`}>Users Farm ({usersFarm.length})</button>
                    <button onClick={() => setActiveTab('raw')} className={`px-6 py-3 rounded-xl transition-colors ${activeTab === 'raw' ? 'bg-purple-600' : 'bg-[#2e2e2e]'}`}>Raw</button>
                </div>

                {activeTab === 'raw' ? (
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
                        {/* Add user */}
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
                                <option value="daily">Diário</option>
                                <option value="weekly">Semanal</option>
                                <option value="monthly">Mensal</option>
                                <option value="lifetime">Vitalício</option>
                            </select>
                            <button onClick={addUser} className="flex items-center gap-2 px-6 py-3 bg-purple-600 rounded-xl hover:bg-purple-500 transition-colors">
                                <UserCheck className="w-5 h-5" /> Adicionar
                            </button>
                        </div>

                        {/* Search */}
                        <div className="relative mb-6">
                            <SearchXIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input
                                placeholder="Buscar usuário..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-[#2e2e2e]/80 rounded-xl border border-purple-600/30 text-white"
                            />
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto rounded-2xl border border-purple-600/20 bg-[#2e2e2e]/50">
                            <table className="w-full">
                                <thead className="bg-[#1a1a1a]">
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
                                                        {u.duration === 'daily' && <Clock4 className="w-4 h-4 text-yellow-400" />}
                                                        {u.duration === 'weekly' && <CalendarDays className="w-4 h-4 text-blue-400" />}
                                                        {u.duration === 'monthly' && <CalendarDays className="w-4 h-4 text-purple-400" />}
                                                        {u.duration === 'lifetime' && <InfinityIcon className="w-4 h-4 text-green-400" />}
                                                        <span className="capitalize">
                                                            {u.duration === 'lifetime' ? 'Vitalício' : u.duration === 'daily' ? 'Diário' : u.duration === 'weekly' ? 'Semanal' : 'Mensal'}
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

                {/* Modal de Confirmação de Remoção */}
                {confirmDelete && (
                    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-zinc-900 border border-purple-600/50 rounded-2xl p-8 max-w-sm w-full shadow-2xl"
                        >
                            <h3 className="text-xl font-bold text-white mb-4">Confirmar Remoção</h3>
                            <p className="text-gray-300 mb-6">
                                Tem certeza que deseja remover o usuário <span className="text-purple-400 font-medium">{confirmDelete.username}</span>?
                            </p>
                            <div className="flex gap-4 justify-end">
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
            </div>
        </motion.div>
    );
}
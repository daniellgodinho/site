import React, { useState, useEffect, useCallback } from 'react';
import {
    UserCheck, Trash, LogOut, CalendarDays, Clock4, Infinity as InfinityIcon,
    Check, X, Search as SearchXIcon, Copy, Edit3, Save, ArrowUp, ArrowDown
} from 'lucide-react';
import { supabase } from '../supabase';
import { Logo } from '../components/Logo';
import { useNavigate } from 'react-router-dom';
import { FaDiscord } from 'react-icons/fa';
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
    const navigate = useNavigate();
    // Fake monthly data for chart
    const cashFlowData = [
        { day: '14 May', inflow: 3821.24, outflow: -1211.73 },
        { day: '15 May', inflow: 4123.45, outflow: -1324.56 },
        { day: '16 May', inflow: 3567.89, outflow: -1100.00 },
        { day: '17 May', inflow: 4234.12, outflow: -1456.78 },
        { day: '18 May', inflow: 3890.34, outflow: -1234.56 },
        { day: '19 May', inflow: 4012.67, outflow: -1345.67 },
        { day: '20 May', inflow: 3678.90, outflow: -1123.45 }
    ];
    // Fetch user list
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
    // Master: fetch resellers and scripts
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
        fetchUserLists();
    }, [fetchUserLists]);
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
        if (!username) {
            // eslint-disable-next-line no-alert
            alert('Nome de usuário obrigatório');
            return;
        }
        const duration = isUsers ? selectedDuration : selectedDurationFarm;
        const expiration = calculateExpiration(duration);
        const newEntry = { username, duration, expiration };
        const newList = isUsers ? [...users, newEntry] : [...usersFarm, newEntry];
        const success = await updateListsInSupabase(isUsers ? newList : users, isUsers ? usersFarm : newList);
        if (success) {
            isUsers ? setUsers(newList) : setUsersFarm(newList);
            isUsers ? setNewUser('') : setNewUserFarm('');
            // eslint-disable-next-line no-alert
            alert(`${username} adicionado com sucesso!`);
        } else {
            // eslint-disable-next-line no-alert
            alert('Erro ao adicionar usuário. Tente novamente.');
        }
    };
    const removeUser = async (tab, username) => {
        // eslint-disable-next-line no-restricted-globals
        if (!confirm(`Remover ${username}?`)) return;
        const isUsers = tab === 'users';
        const newList = (isUsers ? users : usersFarm).filter(u => u.username !== username);
        const success = await updateListsInSupabase(
            isUsers ? newList : users,
            isUsers ? usersFarm : newList
        );
        if (success) {
            isUsers ? setUsers(newList) : setUsersFarm(newList);
            // eslint-disable-next-line no-alert
            alert(`${username} removido com sucesso!`);
        } else {
            // eslint-disable-next-line no-alert
            alert('Erro ao remover o usuário.');
        }
    };
    // Master functions
    const addReseller = async () => {
        if (!newReseller.name || !newReseller.password) {
            // eslint-disable-next-line no-alert
            alert('Nome e senha obrigatórios');
            return;
        }
        const { error } = await supabase.from('resellers').insert({ ...newReseller });
        if (!error) {
            setNewReseller({ name: '', password: '', discord_link: '' });
            const { data } = await supabase.from('resellers').select('*');
            setResellers(data || []);
            // eslint-disable-next-line no-alert
            alert('Revendedor adicionado com sucesso!');
        } else {
            // eslint-disable-next-line no-alert
            alert('Erro ao adicionar revendedor.');
        }
    };
    const saveScript = async (name) => {
        const { error } = await supabase.from('scripts').upsert({ name, code: scripts[name] }, { onConflict: 'name' });
        if (!error) {
            setEditingScript(null);
            // eslint-disable-next-line no-alert
            alert('Script salvo com sucesso!');
        } else {
            // eslint-disable-next-line no-alert
            alert('Erro ao salvar script.');
        }
    };
    const copyText = async (text) => {
        navigator.clipboard.writeText(text);
        // eslint-disable-next-line no-alert
        alert('Copiado para a área de transferência!');
    };
    const copyRawUsers = (type) => {
        let text = '';
        if (type === 'users' || type === 'usersfarm') {
            const all = type === 'users' ? users : usersFarm;
            text = all.map(u => u.username).join('\n');
        }
        copyText(text);
    };
    const filtered = (activeTab === 'users' ? users : usersFarm).filter(u => u.username.toLowerCase().includes(searchQuery.toLowerCase()));
    const total = users.length + usersFarm.length;
    // Fake monthly income
    const monthlyIncome = 4632.57;
    const monthlyChange = 6.12;
    const cashFlowUp = 6.18;
    const outflowDown = 2.1;
    return (
        <div className="min-h-screen bg-gradient-to-br from-black to-purple-950/50 text-white p-8">
            {/* Header */}
            <header className="bg-gradient-to-br from-gray-950 to-purple-950/30 backdrop-blur-md rounded-2xl shadow-2xl shadow-purple-900/20 mb-8 p-6">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Logo className="w-10 h-10" />
                        <div>
                            <h1 className="text-3xl font-bold">Welcome Back {selectedReseller}!</h1>
                            <p className="text-gray-400">We have summarized your account activity for the past month.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="p-2 bg-gray-900/50 rounded-full"><ArrowUp className="w-5 h-5 text-white" /></button>
                        <button className="p-2 bg-gray-900/50 rounded-full"><ArrowDown className="w-5 h-5 text-white" /></button>
                        <button className="p-2 bg-gray-900/50 rounded-full"><SearchXIcon className="w-5 h-5 text-white" /></button>
                        <button onClick={handleLogout} className="p-2 bg-gray-900/50 rounded-full"><LogOut className="w-5 h-5 text-white" /></button>
                    </div>
                </div>
            </header>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Total Balance */}
                <div className="bg-gradient-to-br from-gray-950 to-purple-950/30 rounded-2xl p-6 shadow-xl shadow-purple-900/10">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 bg-gray-900/50 rounded-lg"><UserCheck className="w-5 h-5 text-purple-300" /></div>
                        <h2 className="text-gray-300">Total Users</h2>
                    </div>
                    <p className="text-5xl font-bold">{total}</p>
                    <div className="mt-4 flex gap-4">
                        <div className="bg-gray-900/50 rounded-xl p-4 flex-1">
                            <p className="text-gray-400 text-sm">DN Menu</p>
                            <p className="text-2xl font-bold">{users.length}</p>
                        </div>
                        <div className="bg-gray-900/50 rounded-xl p-4 flex-1">
                            <p className="text-gray-400 text-sm">DN Farm</p>
                            <p className="text-2xl font-bold">{usersFarm.length}</p>
                        </div>
                    </div>
                </div>
                {/* Monthly Income */}
                <div className="bg-gradient-to-br from-gray-950 to-purple-950/30 rounded-2xl p-6 shadow-xl shadow-purple-900/10">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 bg-gray-900/50 rounded-lg"><ArrowUp className="w-5 h-5 text-purple-300" /></div>
                        <h2 className="text-gray-300">Monthly New Users</h2>
                    </div>
                    <p className="text-5xl font-bold">${monthlyIncome} <span className="text-green-400 text-2xl">~ +{monthlyChange}%</span></p>
                    <div className="mt-4 h-20 flex items-end gap-1">
                        {Array.from({ length: 30 }).map((_, i) => (
                            <div key={i} className="w-2 bg-gradient-to-t from-purple-500 to-purple-300 opacity-80" style={{ height: `${Math.random() * 100}%` }}></div>
                        ))}
                    </div>
                    <div className="mt-4 flex gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                            <p>Mutual Funds 27%</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                            <p>Crypto Market 44%</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-purple-300 rounded-full"></div>
                            <p>Bank Stocks 21%</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-purple-200 rounded-full"></div>
                            <p>Other 8%</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Cash Flow */}
                <div className="col-span-2 bg-gradient-to-br from-gray-950 to-purple-950/30 rounded-2xl p-6 shadow-xl shadow-purple-900/10">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 bg-gray-900/50 rounded-lg"><ArrowUp className="w-5 h-5 text-purple-300" /></div>
                        <h2 className="text-gray-300">Cash Flow</h2>
                    </div>
                    <p className="text-gray-400 mb-4">Cashflow up +{cashFlowUp}%, Outflow down -{outflowDown}%.</p>
                    <div className="flex justify-between mb-2 text-gray-400 text-sm">
                        <button className="px-2 py-1 bg-gray-900/50 rounded">D</button>
                        <button className="px-2 py-1 bg-gray-900/50 rounded">W</button>
                        <button className="px-2 py-1 bg-gray-900/50 rounded">M</button>
                        <button className="px-2 py-1 bg-gray-900/50 rounded">Custom</button>
                    </div>
                    <div className="h-32 flex items-end gap-4">
                        {cashFlowData.map((data, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center">
                                <div className="w-8 bg-gradient-to-t from-purple-800 to-purple-500" style={{ height: `${Math.abs(data.inflow / 5000 * 100)}%` }}></div>
                                <p className="text-gray-400 text-xs mt-2">{data.day}</p>
                            </div>
                        ))}
                    </div>
                </div>
                {/* AI Analysis */}
                <div className="bg-gradient-to-br from-purple-950/50 to-black rounded-2xl p-6 shadow-xl shadow-purple-900/10">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-400 rounded-full flex items-center justify-center mb-4">
                        <div className="grid grid-cols-3 gap-1">
                            {Array.from({ length: 9 }).map((_, i) => <div key={i} className="w-2 h-2 bg-white/20 rounded-sm"></div>)}
                        </div>
                    </div>
                    <h2 className="text-xl font-bold mb-2 text-white">Smart AI-Powered Financial Analytics</h2>
                    <p className="text-gray-400 mb-4">Retrieve May report, analyze key data for informed strategic decisions.</p>
                    <button className="w-full py-3 bg-white text-black rounded-full font-semibold">Analyze</button>
                </div>
            </div>
            {/* Rest of the dashboard below */}
            {isMaster && (
                <div className="mt-8 mb-12">
                    <h2 className="text-3xl font-semibold mb-6 text-purple-300">Resellers</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {resellers.map(r => (
                            <div key={r.id} className="bg-gradient-to-br from-gray-950 to-purple-950/30 rounded-2xl p-6 border border-purple-800/30 shadow-lg">
                                <h3 className="text-xl font-semibold mb-4 text-white">{r.name}</h3>
                                <button
                                    onClick={() => window.open(r.discord_link, '_blank')}
                                    className="flex items-center gap-2 px-4 py-2 bg-purple-900/50 rounded-lg hover:bg-purple-800/50 transition-all"
                                >
                                    <FaDiscord className="w-5 h-5" />
                                    Discord
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="bg-gradient-to-br from-gray-950 to-purple-950/30 rounded-2xl p-6 border border-purple-800/30 shadow-lg">
                        <h3 className="text-xl font-semibold mb-4 text-white">Add Reseller</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input placeholder="Name" value={newReseller.name} onChange={e => setNewReseller({ ...newReseller, name: e.target.value })} className="px-4 py-3 bg-gray-900/50 rounded-xl border border-purple-800/40 text-white" />
                            <input placeholder="Password" type="password" value={newReseller.password} onChange={e => setNewReseller({ ...newReseller, password: e.target.value })} className="px-4 py-3 bg-gray-900/50 rounded-xl border border-purple-800/40 text-white" />
                            <input placeholder="Discord Link" value={newReseller.discord_link} onChange={e => setNewReseller({ ...newReseller, discord_link: e.target.value })} className="px-4 py-3 bg-gray-900/50 rounded-xl border border-purple-800/40 text-white" />
                        </div>
                        <button onClick={addReseller} className="mt-4 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-500 transition-all">
                            Add
                        </button>
                    </div>
                </div>
            )}
            {/* Tabs */}
            <div className="flex gap-4 mb-6">
                <button onClick={() => setActiveTab('users')} className={`px-6 py-3 rounded-2xl ${activeTab === 'users' ? 'bg-purple-900/50' : 'bg-gray-900/50'} hover:bg-purple-800/50 transition-all text-white`}>Users ({users.length})</button>
                <button onClick={() => setActiveTab('usersfarm')} className={`px-6 py-3 rounded-2xl ${activeTab === 'usersfarm' ? 'bg-purple-900/50' : 'bg-gray-900/50'} hover:bg-purple-800/50 transition-all text-white`}>Users Farm ({usersFarm.length})</button>
                <button onClick={() => setActiveTab('raw')} className={`px-6 py-3 rounded-2xl ${activeTab === 'raw' ? 'bg-purple-900/50' : 'bg-gray-900/50'} hover:bg-purple-800/50 transition-all text-white`}>Raw</button>
            </div>
            {activeTab === 'raw' ? (
                <div className="space-y-6">
                    <h2 className="text-2xl font-semibold text-white">Raw Management</h2>
                    {!isMaster ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button onClick={() => copyText('https://dnsoftwares.vercel.app/raw/dnmenu')} className="flex items-center justify-center gap-2 py-4 bg-gray-900/50 rounded-2xl hover:bg-purple-900/30 transition-all shadow-md text-white">
                                <Copy className="w-5 h-5" /> Copy DN Menu Raw URL
                            </button>
                            <button onClick={() => copyText('https://dnsoftwares.vercel.app/raw/dnfarm')} className="flex items-center justify-center gap-2 py-4 bg-gray-900/50 rounded-2xl hover:bg-purple-900/30 transition-all shadow-md text-white">
                                <Copy className="w-5 h-5" /> Copy DN Farm Raw URL
                            </button>
                            <button onClick={() => copyText('https://dnsoftwares.vercel.app/raw/usermenu')} className="flex items-center justify-center gap-2 py-4 bg-gray-900/50 rounded-2xl hover:bg-purple-900/30 transition-all shadow-md text-white">
                                <Copy className="w-5 h-5" /> Copy User Menu Raw URL
                            </button>
                            <button onClick={() => copyText('https://dnsoftwares.vercel.app/raw/userfarm')} className="flex items-center justify-center gap-2 py-4 bg-gray-900/50 rounded-2xl hover:bg-purple-900/30 transition-all shadow-md text-white">
                                <Copy className="w-5 h-5" /> Copy User Farm Raw URL
                            </button>
                            <button onClick={() => copyText('https://dnsoftwares.vercel.app/raw/dnsoftwares')} className="flex items-center justify-center gap-2 py-4 bg-gray-900/50 rounded-2xl hover:bg-purple-900/30 transition-all shadow-md text-white col-span-2">
                                <Copy className="w-5 h-5" /> Copy DN Softwares Raw URL
                            </button>
                            <button onClick={() => copyRawUsers('users')} className="flex items-center justify-center gap-2 py-4 bg-gray-900/50 rounded-2xl hover:bg-purple-900/30 transition-all shadow-md text-white col-span-2">
                                <Copy className="w-5 h-5" /> Copy Local Users Raw
                            </button>
                            <button onClick={() => copyRawUsers('usersfarm')} className="flex items-center justify-center gap-2 py-4 bg-gray-900/50 rounded-2xl hover:bg-purple-900/30 transition-all shadow-md text-white col-span-2">
                                <Copy className="w-5 h-5" /> Copy Local Users Farm Raw
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-xl font-semibold mb-4 text-white">Edit Scripts (affects all resellers)</h3>
                                {['dnmenu', 'dnfarm', 'dnsoftwares'].map(name => (
                                    <div key={name} className="mb-6">
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="text-lg font-medium capitalize text-gray-300">{name.replace('dn', 'DN ')}</label>
                                            {editingScript === name ? (
                                                <button onClick={() => saveScript(name)} className="flex items-center gap-2 text-green-400">
                                                    <Save className="w-5 h-5" /> Save
                                                </button>
                                            ) : (
                                                <button onClick={() => setEditingScript(name)} className="flex items-center gap-2 text-purple-400">
                                                    <Edit3 className="w-5 h-5" /> Edit
                                                </button>
                                            )}
                                        </div>
                                        <textarea
                                            value={scripts[name] || ''}
                                            onChange={e => setScripts({ ...scripts, [name]: e.target.value })}
                                            readOnly={editingScript !== name}
                                            rows={10}
                                            className="w-full px-4 py-3 bg-gray-900/50 rounded-2xl border border-purple-800/40 font-mono text-sm text-white"
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
                            className="flex-1 px-4 py-3 bg-gray-900/50 rounded-2xl border border-purple-800/30 text-white"
                        />
                        <select
                            value={activeTab === 'users' ? selectedDuration : selectedDurationFarm}
                            onChange={e => activeTab === 'users' ? setSelectedDuration(e.target.value) : setSelectedDurationFarm(e.target.value)}
                            className="px-6 py-3 bg-gray-900/50 rounded-2xl border border-purple-800/30 text-white"
                        >
                            <option value="daily">Diário</option>
                            <option value="weekly">Semanal</option>
                            <option value="monthly">Mensal</option>
                            <option value="lifetime">Vitalício</option>
                        </select>
                        <button onClick={addUser} className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-2xl hover:bg-purple-500 transition-all">
                            <UserCheck className="w-5 h-5" /> Adicionar
                        </button>
                    </div>
                    {/* Search */}
                    <div className="relative mb-6">
                        <SearchXIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            placeholder="Buscar usuário..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-gray-900/50 rounded-2xl border border-purple-800/30 text-white"
                        />
                    </div>
                    {/* Table */}
                    <div className="overflow-x-auto rounded-2xl border border-purple-800/20 bg-gradient-to-br from-gray-950 to-purple-950/30 shadow-xl">
                        <table className="w-full">
                            <thead className="bg-gray-950/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-gray-300">Usuário</th>
                                    <th className="px-6 py-4 text-left text-gray-300">Duração</th>
                                    <th className="px-6 py-4 text-left text-gray-300">Tempo Restante</th>
                                    <th className="px-6 py-4 text-left text-gray-300">Status</th>
                                    <th className="px-6 py-4 text-right text-gray-300">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(u => {
                                    const remaining = u.expiration ? Math.max(0, new Date(u.expiration) - new Date()) : null;
                                    const days = remaining ? Math.floor(remaining / (1000 * 60 * 60 * 24)) : null;
                                    const hours = remaining ? Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) : null;
                                    const isActive = !u.expiration || new Date(u.expiration) > new Date();
                                    return (
                                        <tr key={u.username} className="border-t border-purple-800/20">
                                            <td className="px-6 py-4 text-white">{u.username}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-gray-300">
                                                    {u.duration === 'daily' && <Clock4 className="w-4 h-4 text-yellow-300" />}
                                                    {u.duration === 'weekly' && <CalendarDays className="w-4 h-4 text-blue-300" />}
                                                    {u.duration === 'monthly' && <CalendarDays className="w-4 h-4 text-purple-300" />}
                                                    {u.duration === 'lifetime' && <InfinityIcon className="w-4 h-4 text-green-300" />}
                                                    <span className="capitalize">{u.duration === 'lifetime' ? 'Vitalício' : u.duration === 'daily' ? 'Diário' : u.duration === 'weekly' ? 'Semanal' : 'Mensal'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-300">
                                                {u.expiration ? (days > 0 ? `${days}d ${hours}h` : `${hours}h`) : 'Vitalício'}
                                            </td>
                                            <td className="px-6 py-4">
                                                {isActive ? <div className="flex items-center gap-2 text-green-300"><Check className="w-4 h-4" /> Ativo</div>
                                                    : <div className="flex items-center gap-2 text-red-300"><X className="w-4 h-4" /> Expirado</div>}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button onClick={() => removeUser(activeTab, u.username)}>
                                                    <Trash className="w-5 h-5 text-red-300 hover:text-red-400 transition-colors" />
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
        </div>
    );
}
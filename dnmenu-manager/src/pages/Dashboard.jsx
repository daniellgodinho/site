import React, { useState, useEffect, useCallback } from 'react';
import {
    UserCheck, Trash, LogOut, CalendarDays, Clock4, Infinity as InfinityIcon,
    Check, X, Search as SearchXIcon, Copy, Edit3, Save
} from 'lucide-react';
import { supabase } from '../supabase';
import { Logo } from '../components/Logo';
import { useNavigate } from 'react-router-dom';
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
    const navigate = useNavigate();
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
        const { error } = await supabase.from('scripts').update({ code: scripts[name] }).eq('name', name);
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
    const active = [...users, ...usersFarm].filter(u => !u.expiration || new Date(u.expiration) > new Date()).length;
    return (
        <div className="min-h-screen bg-gradient-to-br from-black to-purple-950/20 text-white p-4"> {/* Enhanced gradient for minimalistic feel */}
            {/* Header */}
            <header className="bg-black/80 backdrop-blur-md border-b border-purple-800/30 rounded-xl shadow-lg shadow-purple-900/10 mb-8"> {/* Softer blur and shadow */}
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Logo className="w-32 h-32" />
                        <div>
                            <h1 className="text-2xl font-semibold text-purple-300">Welcome Back {selectedReseller}!</h1> {/* Purple accent */}
                            {isMaster && <p className="text-purple-400 font-medium">Master Mode</p>}
                        </div>
                    </div>
                    <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-purple-900/50 rounded-lg hover:bg-purple-800/50 transition-all shadow-md"> {/* Gradient button */}
                        <LogOut className="w-5 h-5" /> Logout
                    </button>
                </div>
            </header>
            <div className="max-w-7xl mx-auto">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="p-6 bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-purple-800/20 shadow-xl shadow-purple-900/10"> {/* Gradient card */}
                        <p className="text-gray-400 mb-2">Total Balance</p>
                        <p className="text-4xl font-bold text-purple-300">{total}</p>
                    </div>
                    <div className="p-6 bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-purple-800/20 shadow-xl shadow-purple-900/10">
                        <p className="text-gray-400 mb-2">Active</p>
                        <p className="text-4xl font-bold text-green-300">{active}</p>
                    </div>
                    <div className="p-6 bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-purple-800/20 shadow-xl shadow-purple-900/10">
                        <p className="text-gray-400 mb-2">Expired</p>
                        <p className="text-4xl font-bold text-red-300">{total - active}</p>
                    </div>
                </div>
                {/* Master: Resellers cards */}
                {isMaster && (
                    <div className="mb-12">
                        <h2 className="text-3xl font-semibold mb-6 text-purple-300">Resellers</h2> {/* Purple title */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            {resellers.map(r => (
                                <div key={r.id} className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border border-purple-800/30 shadow-lg"> {/* Enhanced card */}
                                    <h3 className="text-xl font-semibold mb-4 text-white">{r.name}</h3>
                                    <button
                                        onClick={() => window.open(r.discord_link, '_blank')}
                                        className="flex items-center gap-2 px-4 py-2 bg-purple-900/50 rounded-lg hover:bg-purple-800/50 transition-all"
                                    >
                                        <DiscordIcon />
                                        Discord
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border border-purple-800/30 shadow-lg">
                            <h3 className="text-xl font-semibold mb-4 text-white">Add Reseller</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <input placeholder="Name" value={newReseller.name} onChange={e => setNewReseller({ ...newReseller, name: e.target.value })} className="px-4 py-3 bg-black/60 rounded-xl border border-purple-800/40 text-white" /> {/* Minimal input */}
                                <input placeholder="Password" type="password" value={newReseller.password} onChange={e => setNewReseller({ ...newReseller, password: e.target.value })} className="px-4 py-3 bg-black/60 rounded-xl border border-purple-800/40 text-white" />
                                <input placeholder="Discord Link" value={newReseller.discord_link} onChange={e => setNewReseller({ ...newReseller, discord_link: e.target.value })} className="px-4 py-3 bg-black/60 rounded-xl border border-purple-800/40 text-white" />
                            </div>
                            <button onClick={addReseller} className="mt-4 px-6 py-3 bg-purple-900/50 rounded-xl hover:bg-purple-800/50 transition-all">
                                Add
                            </button>
                        </div>
                    </div>
                )}
                {/* Tabs */}
                <div className="flex gap-4 mb-6">
                    <button onClick={() => setActiveTab('users')} className={`px-6 py-3 rounded-2xl ${activeTab === 'users' ? 'bg-purple-900/50' : 'bg-gray-900/50'} hover:bg-purple-800/50 transition-all`}>Users ({users.length})</button>
                    <button onClick={() => setActiveTab('usersfarm')} className={`px-6 py-3 rounded-2xl ${activeTab === 'usersfarm' ? 'bg-purple-900/50' : 'bg-gray-900/50'} hover:bg-purple-800/50 transition-all`}>Users Farm ({usersFarm.length})</button>
                    <button onClick={() => setActiveTab('raw')} className={`px-6 py-3 rounded-2xl ${activeTab === 'raw' ? 'bg-purple-900/50' : 'bg-gray-900/50'} hover:bg-purple-800/50 transition-all`}>Raw</button>
                </div>
                {activeTab === 'raw' ? (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-semibold text-purple-300">Raw Management</h2> {/* Purple title */}
                        {!isMaster ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button onClick={() => copyText('https://dnsoftwares.vercel.app/raw/dnmenu')} className="flex items-center justify-center gap-2 py-4 bg-purple-900/50 rounded-2xl hover:bg-purple-800/50 transition-all shadow-md">
                                    <Copy className="w-5 h-5" /> Copy DN Menu Raw URL
                                </button>
                                <button onClick={() => copyText('https://dnsoftwares.vercel.app/raw/dnfarm')} className="flex items-center justify-center gap-2 py-4 bg-purple-900/50 rounded-2xl hover:bg-purple-800/50 transition-all shadow-md">
                                    <Copy className="w-5 h-5" /> Copy DN Farm Raw URL
                                </button>
                                <button onClick={() => copyText('https://dnsoftwares.vercel.app/raw/usermenu')} className="flex items-center justify-center gap-2 py-4 bg-purple-900/50 rounded-2xl hover:bg-purple-800/50 transition-all shadow-md">
                                    <Copy className="w-5 h-5" /> Copy User Menu Raw URL
                                </button>
                                <button onClick={() => copyText('https://dnsoftwares.vercel.app/raw/userfarm')} className="flex items-center justify-center gap-2 py-4 bg-purple-900/50 rounded-2xl hover:bg-purple-800/50 transition-all shadow-md">
                                    <Copy className="w-5 h-5" /> Copy User Farm Raw URL
                                </button>
                                <button onClick={() => copyText('https://dnsoftwares.vercel.app/raw/dnsoftwares')} className="flex items-center justify-center gap-2 py-4 bg-purple-900/50 rounded-2xl hover:bg-purple-800/50 transition-all shadow-md col-span-2">
                                    <Copy className="w-5 h-5" /> Copy DN Softwares Raw URL
                                </button>
                                {/* Kept users raw copy as direct for local, but automation is in API */}
                                <button onClick={() => copyRawUsers('users')} className="flex items-center justify-center gap-2 py-4 bg-purple-900/50 rounded-2xl hover:bg-purple-800/50 transition-all shadow-md col-span-2">
                                    <Copy className="w-5 h-5" /> Copy Local Users Raw
                                </button>
                                <button onClick={() => copyRawUsers('usersfarm')} className="flex items-center justify-center gap-2 py-4 bg-purple-900/50 rounded-2xl hover:bg-purple-800/50 transition-all shadow-md col-span-2">
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
                                                <label className="text-lg font-medium capitalize text-purple-300">{name.replace('dn', 'DN ')}</label> {/* Purple label */}
                                                {editingScript === name ? (
                                                    <button onClick={() => saveScript(name)} className="flex items-center gap-2 text-green-300">
                                                        <Save className="w-5 h-5" /> Save
                                                    </button>
                                                ) : (
                                                    <button onClick={() => setEditingScript(name)} className="flex items-center gap-2 text-purple-300">
                                                        <Edit3 className="w-5 h-5" /> Edit
                                                    </button>
                                                )}
                                            </div>
                                            <textarea
                                                value={scripts[name] || ''}
                                                onChange={e => setScripts({ ...scripts, [name]: e.target.value })}
                                                readOnly={editingScript !== name}
                                                rows={10}
                                                className="w-full px-4 py-3 bg-black/60 rounded-2xl border border-purple-800/40 font-mono text-sm text-white"
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
                                placeholder={activeTab === 'users' ? 'New User' : 'New Farm User'}
                                value={activeTab === 'users' ? newUser : newUserFarm}
                                onChange={e => activeTab === 'users' ? setNewUser(e.target.value) : setNewUserFarm(e.target.value)}
                                className="flex-1 px-4 py-3 bg-black/60 rounded-2xl border border-purple-800/30 text-white"
                            />
                            <select
                                value={activeTab === 'users' ? selectedDuration : selectedDurationFarm}
                                onChange={e => activeTab === 'users' ? setSelectedDuration(e.target.value) : setSelectedDurationFarm(e.target.value)}
                                className="px-6 py-3 bg-black/60 rounded-2xl border border-purple-800/30 text-white"
                            >
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                                <option value="lifetime">Lifetime</option>
                            </select>
                            <button onClick={addUser} className="flex items-center gap-2 px-6 py-3 bg-purple-900/50 rounded-2xl hover:bg-purple-800/50 transition-all">
                                <UserCheck className="w-5 h-5" /> Add
                            </button>
                        </div>
                        {/* Search */}
                        <div className="relative mb-6">
                            <SearchXIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                placeholder="Search user..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-black/60 rounded-2xl border border-purple-800/30 text-white"
                            />
                        </div>
                        {/* Table */}
                        <div className="overflow-x-auto rounded-2xl border border-purple-800/20 bg-gray-900/50 shadow-lg">
                            <table className="w-full">
                                <thead className="bg-black/80">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-purple-300">User</th> {/* Purple header */}
                                        <th className="px-6 py-4 text-left text-purple-300">Duration</th>
                                        <th className="px-6 py-4 text-left text-purple-300">Remaining Time</th>
                                        <th className="px-6 py-4 text-left text-purple-300">Status</th>
                                        <th className="px-6 py-4 text-right text-purple-300">Actions</th>
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
                                                        <span className="capitalize">{u.duration === 'lifetime' ? 'Lifetime' : u.duration}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-gray-300">
                                                    {u.expiration ? (days > 0 ? `${days}d ${hours}h` : `${hours}h`) : 'Lifetime'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {isActive ? <div className="flex items-center gap-2 text-green-300"><Check className="w-4 h-4" /> Active</div>
                                                        : <div className="flex items-center gap-2 text-red-300"><X className="w-4 h-4" /> Expired</div>}
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
        </div>
    );
}
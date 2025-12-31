import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
    UserPlus, Trash2, LogOut, Calendar, Clock, Infinity,
    CheckCircle, XCircle, Search, Edit
} from 'lucide-react';
import { supabase } from '../supabase';
import { Logo } from '../components/Logo';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const selectedReseller = sessionStorage.getItem('reseller') || 'Neverpure Codes';

    const [users, setUsers] = useState([]);
    const [usersFarm, setUsersFarm] = useState([]);
    const [newUser, setNewUser] = useState('');
    const [newUserFarm, setNewUserFarm] = useState('');
    const [selectedDuration, setSelectedDuration] = useState('lifetime');
    const [selectedDurationFarm, setSelectedDurationFarm] = useState('lifetime');
    const [activeTab, setActiveTab] = useState('users');
    const [session, setSession] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [userListId, setUserListId] = useState(null);
    const [isMaster, setIsMaster] = useState(false);
    const [subAdmins, setSubAdmins] = useState([]);
    const [newSubAdmin, setNewSubAdmin] = useState({ name: '', password: '' });

    const navigate = useNavigate();

    // Busca ou cria a lista de usuários do revendedor atual
    const fetchUserLists = useCallback(async () => {
        if (!session) return;

        const { data, error } = await supabase
            .from('user_lists')
            .select('*')
            .eq('owner_id', session.user.id)
            .eq('reseller', selectedReseller)
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error('Erro ao buscar listas:', error);
            return;
        }

        if (data) {
            setUserListId(data.id);
            const parsedUsers = data.users
                ? data.users.split(',').map((str) => {
                    const [username, duration, expiration] = str.split('|');
                    return { username, duration: duration || 'lifetime', expiration: expiration || null };
                })
                : [];
            setUsers(parsedUsers);

            const parsedFarm = data.users_farm
                ? data.users_farm.split(',').map((str) => {
                    const [username, duration, expiration] = str.split('|');
                    return { username, duration: duration || 'lifetime', expiration: expiration || null };
                })
                : [];
            setUsersFarm(parsedFarm);
        } else {
            // Cria nova lista se não existir
            const { data: newData, error: insertError } = await supabase
                .from('user_lists')
                .insert({
                    owner_id: session.user.id,
                    reseller: selectedReseller,
                    users: '',
                    users_farm: '',
                })
                .select()
                .single();

            if (insertError) {
                console.error('Erro ao criar lista:', insertError);
            } else {
                setUserListId(newData.id);
                setUsers([]);
                setUsersFarm([]);
            }
        }
    }, [session, selectedReseller]);

    // Busca todas as sub-dashboards (apenas para master)
    const fetchSubAdmins = useCallback(async () => {
        if (!isMaster) return;
        const { data, error } = await supabase.from('sub_admins').select('*');
        if (error) console.error('Erro ao buscar sub-admins:', error);
        else setSubAdmins(data || []);
    }, [isMaster]);

    // Verifica sessão e se é master (senha 'indef' no localStorage)
    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);

            if (session) {
                const masterPass = localStorage.getItem('admin_password');
                setIsMaster(masterPass === 'indef');
            }
        };
        getSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session) {
                const masterPass = localStorage.getItem('admin_password');
                setIsMaster(masterPass === 'indef');
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    // Carrega dados quando sessão ou master mudar
    useEffect(() => {
        if (session) {
            fetchUserLists();
            fetchSubAdmins();
        }
    }, [session, fetchUserLists, fetchSubAdmins]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        sessionStorage.removeItem('reseller');
        localStorage.removeItem('admin_password');
        navigate('/login');
    };

    const calculateExpiration = (duration) => {
        const now = new Date();
        if (duration === 'lifetime') return null;
        if (duration === 'daily') now.setDate(now.getDate() + 1);
        if (duration === 'weekly') now.setDate(now.getDate() + 7);
        if (duration === 'monthly') now.setDate(now.getDate() + 30);
        return now.toISOString();
    };

    const updateListsInSupabase = async (newUsers, newFarm) => {
        const usersStr = newUsers.map((u) => `${u.username}|${u.duration}|${u.expiration || ''}`).join(',');
        const farmStr = newFarm.map((u) => `${u.username}|${u.duration}|${u.expiration || ''}`).join(',');
        const { error } = await supabase
            .from('user_lists')
            .update({ users: usersStr, users_farm: farmStr })
            .eq('id', userListId);

        if (error) {
            console.error('Erro ao atualizar:', error);
            alert('Erro ao salvar');
            return false;
        }
        return true;
    };

    const addUser = async () => {
        const isUsersTab = activeTab === 'users';
        const username = isUsersTab ? newUser.trim() : newUserFarm.trim();
        if (!username) return alert('Insira um nome de usuário');

        const duration = isUsersTab ? selectedDuration : selectedDurationFarm;
        const expiration = calculateExpiration(duration);
        const newEntry = { username, duration, expiration };

        const currentList = isUsersTab ? users : usersFarm;
        const newList = [...currentList, newEntry];

        const success = await updateListsInSupabase(isUsersTab ? newList : users, isUsersTab ? usersFarm : newList);
        if (success) {
            if (isUsersTab) {
                setUsers(newList);
                setNewUser('');
            } else {
                setUsersFarm(newList);
                setNewUserFarm('');
            }
            alert(`${username} adicionado com sucesso!`);
        }
    };

    const removeUser = async (tab, username) => {
        if (!window.confirm(`Remover ${username}?`)) return;

        const isUsersTab = tab === 'users';
        const currentList = isUsersTab ? users : usersFarm;
        const newList = currentList.filter((u) => u.username !== username);

        const success = await updateListsInSupabase(isUsersTab ? newList : users, isUsersTab ? usersFarm : newList);
        if (success) {
            isUsersTab ? setUsers(newList) : setUsersFarm(newList);
            alert(`${username} removido!`);
        }
    };

    // Funções exclusivas do Master
    const addSubAdmin = async () => {
        const { name, password } = newSubAdmin;
        if (!name || !password) return alert('Nome e senha obrigatórios');

        const { error } = await supabase.from('sub_admins').insert({ name, password });
        if (error) {
            console.error('Erro ao criar sub-dashboard:', error);
            alert('Erro ao criar');
        } else {
            setNewSubAdmin({ name: '', password: '' });
            fetchSubAdmins();
            alert('Sub-dashboard criada com sucesso!');
        }
    };

    const editSubAdmin = async (id, currentName, currentPassword) => {
        const newName = prompt('Novo nome:', currentName);
        const newPassword = prompt('Nova senha:', currentPassword);
        if (newName && newPassword) {
            const { error } = await supabase.from('sub_admins').update({ name: newName, password: newPassword }).eq('id', id);
            if (error) alert('Erro ao editar');
            else {
                fetchSubAdmins();
                alert('Editado com sucesso!');
            }
        }
    };

    const deleteSubAdmin = async (id) => {
        if (!window.confirm('Deletar esta sub-dashboard e todos os dados dela?')) return;
        const { error } = await supabase.from('sub_admins').delete().eq('id', id);
        if (error) alert('Erro ao deletar');
        else {
            fetchSubAdmins();
            alert('Sub-dashboard deletada!');
        }
    };

    const formatTimeRemaining = (expiration) => {
        if (!expiration) return 'Vitalício';
        const diff = new Date(expiration) - new Date();
        if (diff <= 0) return 'Expirado';
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        if (days > 0) return `${days}d ${hours}h`;
        if (hours > 0) return `${hours}h ${minutes}m`;
        return `${minutes}m`;
    };

    const getDurationIcon = (duration) => {
        switch (duration) {
            case 'daily': return <Clock className="w-4 h-4" />;
            case 'weekly': return <Calendar className="w-4 h-4" />;
            case 'monthly': return <Calendar className="w-4 h-4" />;
            case 'lifetime': return <Infinity className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
        }
    };

    const getDurationColor = (duration) => {
        switch (duration) {
            case 'daily': return 'text-yellow-400';
            case 'weekly': return 'text-blue-400';
            case 'monthly': return 'text-purple-400';
            case 'lifetime': return 'text-green-400';
            default: return 'text-gray-400';
        }
    };

    const filteredUsers = (activeTab === 'users' ? users : usersFarm).filter(user =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalUsers = users.length + usersFarm.length;
    const activeTokens = [...users, ...usersFarm].filter(u => u.expiration === null || new Date(u.expiration) > new Date()).length;

    const durationOptions = [
        { value: 'daily', label: 'Diário' },
        { value: 'weekly', label: 'Semanal' },
        { value: 'monthly', label: 'Mensal' },
        { value: 'lifetime', label: 'Vitalício' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-black to-zinc-950 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-purple-900/10"></div>
            </div>

            <header className="relative z-10 bg-[#1a1a1a]/90 backdrop-blur-xl border-b border-purple-600/20 shadow-xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex items-center space-x-4">
                            <Logo className="w-24 h-24 md:w-32 h-32 lg:w-40 h-40 drop-shadow-2xl" />
                            <div>
                                <h1 className="text-2xl font-bold">Dashboard</h1>
                                <p className="text-purple-400 text-lg font-medium">{selectedReseller}</p>
                                {isMaster && <p className="text-green-400 text-sm font-bold">MESTRE</p>}
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="flex items-center space-x-2 px-4 py-2 bg-red-600/80 hover:bg-red-600 border border-red-700/50 rounded-lg transition-all duration-300"
                        >
                            <LogOut className="w-5 h-5" />
                            <span>Sair</span>
                        </button>
                    </div>
                </div>
            </header>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <motion.div whileHover={{ scale: 1.02 }} className="p-6 bg-gradient-to-br from-[#2e2e2e] to-[#1a1a1a] rounded-2xl border border-purple-600/20">
                        <h3 className="text-sm text-gray-400 mb-2">Total de Usuários</h3>
                        <p className="text-4xl font-bold text-purple-400">{totalUsers}</p>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }} className="p-6 bg-gradient-to-br from-[#2e2e2e] to-[#1a1a1a] rounded-2xl border border-purple-600/20">
                        <h3 className="text-sm text-gray-400 mb-2">Tokens Ativos</h3>
                        <p className="text-4xl font-bold text-green-400">{activeTokens}</p>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }} className="p-6 bg-gradient-to-br from-[#2e2e2e] to-[#1a1a1a] rounded-2xl border border-purple-600/20">
                        <h3 className="text-sm text-gray-400 mb-2">Tokens Expirados</h3>
                        <p className="text-4xl font-bold text-red-400">{totalUsers - activeTokens}</p>
                    </motion.div>
                </div>

                {/* Tabs Users / Users Farm */}
                <div className="flex space-x-4 mb-6">
                    <button onClick={() => setActiveTab('users')} className={`px-6 py-3 rounded-xl transition-all ${activeTab === 'users' ? 'bg-purple-600 shadow-lg shadow-purple-600/30' : 'bg-[#2e2e2e] border border-gray-700 hover:border-purple-600/40'}`}>
                        Users ({users.length})
                    </button>
                    <button onClick={() => setActiveTab('usersfarm')} className={`px-6 py-3 rounded-xl transition-all ${activeTab === 'usersfarm' ? 'bg-purple-600 shadow-lg shadow-purple-600/30' : 'bg-[#2e2e2e] border border-gray-700 hover:border-purple-600/40'}`}>
                        Users Farm ({usersFarm.length})
                    </button>
                </div>

                {/* Adicionar usuário */}
                <div className="mb-6 flex flex-col sm:flex-row gap-4">
                    <input
                        type="text"
                        placeholder={activeTab === 'users' ? 'Novo usuário' : 'Novo usuário farm'}
                        value={activeTab === 'users' ? newUser : newUserFarm}
                        onChange={(e) => activeTab === 'users' ? setNewUser(e.target.value) : setNewUserFarm(e.target.value)}
                        className="flex-grow px-4 py-3 bg-gradient-to-br from-[#2e2e2e] to-[#1a1a1a] border border-purple-600/30 rounded-xl placeholder-gray-500 focus:border-purple-600 transition-all"
                    />
                    <select
                        value={activeTab === 'users' ? selectedDuration : selectedDurationFarm}
                        onChange={(e) => activeTab === 'users' ? setSelectedDuration(e.target.value) : setSelectedDurationFarm(e.target.value)}
                        className="px-6 py-3 bg-gradient-to-br from-[#2e2e2e] to-[#1a1a1a] border border-purple-600/30 rounded-xl focus:border-purple-600 transition-all"
                    >
                        {durationOptions.map(opt => <option key={opt.value} value={opt.value} className="bg-[#1a1a1a]">{opt.label}</option>)}
                    </select>
                    <button onClick={addUser} className="flex items-center justify-center space-x-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl shadow-lg shadow-purple-600/30">
                        <UserPlus className="w-5 h-5" />
                        <span>Adicionar</span>
                    </button>
                </div>

                {/* Busca */}
                <div className="mb-6 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Buscar usuário..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gradient-to-br from-[#2e2e2e] to-[#1a1a1a] border border-purple-600/30 rounded-xl placeholder-gray-500 focus:border-purple-600 transition-all"
                    />
                </div>

                {/* Tabela de usuários */}
                <div className="overflow-x-auto rounded-2xl border border-purple-600/20 bg-gradient-to-br from-[#2e2e2e] to-[#1a1a1a]">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-[#1a1a1a] border-b border-gray-700">
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Usuário</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Duração</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Tempo Restante</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Status</th>
                                <th className="px-6 py-4 text-right text-sm font-medium text-gray-400">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user, i) => (
                                <motion.tr key={user.username} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="border-t border-gray-800 hover:bg-[#1a1a1a]">
                                    <td className="px-6 py-4">{user.username}</td>
                                    <td className="px-6 py-4">
                                        <div className={`flex items-center space-x-2 ${getDurationColor(user.duration)}`}>
                                            {getDurationIcon(user.duration)}
                                            <span className="capitalize">
                                                {user.duration === 'daily' ? 'Diário' : user.duration === 'weekly' ? 'Semanal' : user.duration === 'monthly' ? 'Mensal' : 'Vitalício'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-300">{formatTimeRemaining(user.expiration)}</td>
                                    <td className="px-6 py-4">
                                        {user.expiration === null || new Date(user.expiration) > new Date() ? (
                                            <div className="flex items-center space-x-2 bg-green-900/20 px-3 py-1 rounded-full border border-green-600/30">
                                                <CheckCircle className="w-4 h-4 text-green-400" />
                                                <span className="text-green-400 text-sm">Ativo</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center space-x-2 bg-red-900/20 px-3 py-1 rounded-full border border-red-600/30">
                                                <XCircle className="w-4 h-4 text-red-400" />
                                                <span className="text-red-400 text-sm">Expirado</span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => removeUser(activeTab, user.username)} className="p-2 hover:bg-red-500/20 rounded-lg transition-colors">
                                            <Trash2 className="w-5 h-5 text-red-400" />
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                            {filteredUsers.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        <Search className="w-12 h-12 opacity-30 mx-auto mb-2" />
                                        <p>Nenhum usuário encontrado</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Seção exclusiva do Master */}
                {isMaster && (
                    <section className="mt-16">
                        <h2 className="text-3xl font-bold mb-8 text-white">Gerenciar Sub-Dashboards</h2>
                        <div className="flex flex-col sm:flex-row gap-4 mb-8">
                            <input
                                type="text"
                                placeholder="Nome da sub-dashboard"
                                value={newSubAdmin.name}
                                onChange={(e) => setNewSubAdmin({ ...newSubAdmin, name: e.target.value })}
                                className="flex-grow px-4 py-3 bg-gradient-to-br from-[#2e2e2e] to-[#1a1a1a] border border-purple-600/30 rounded-xl placeholder-gray-500 focus:border-purple-600"
                            />
                            <input
                                type="password"
                                placeholder="Senha"
                                value={newSubAdmin.password}
                                onChange={(e) => setNewSubAdmin({ ...newSubAdmin, password: e.target.value })}
                                className="px-4 py-3 bg-gradient-to-br from-[#2e2e2e] to-[#1a1a1a] border border-purple-600/30 rounded-xl placeholder-gray-500 focus:border-purple-600"
                            />
                            <button onClick={addSubAdmin} className="flex items-center space-x-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl shadow-lg shadow-purple-600/30">
                                <UserPlus className="w-5 h-5" />
                                <span>Criar</span>
                            </button>
                        </div>

                        <div className="overflow-x-auto rounded-2xl border border-purple-600/20 bg-gradient-to-br from-[#2e2e2e] to-[#1a1a1a]">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-[#1a1a1a] border-b border-gray-700">
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Nome</th>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Senha</th>
                                        <th className="px-6 py-4 text-right text-sm font-medium text-gray-400">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {subAdmins.map((sub) => (
                                        <tr key={sub.id} className="border-t border-gray-800 hover:bg-[#1a1a1a]">
                                            <td className="px-6 py-4">{sub.name}</td>
                                            <td className="px-6 py-4 text-gray-300">{sub.password}</td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <button onClick={() => editSubAdmin(sub.id, sub.name, sub.password)} className="p-2 hover:bg-blue-500/20 rounded-lg">
                                                    <Edit className="w-5 h-5 text-blue-400" />
                                                </button>
                                                <button onClick={() => deleteSubAdmin(sub.id)} className="p-2 hover:bg-red-500/20 rounded-lg">
                                                    <Trash2 className="w-5 h-5 text-red-400" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {subAdmins.length === 0 && (
                                        <tr>
                                            <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                                                Nenhuma sub-dashboard criada
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
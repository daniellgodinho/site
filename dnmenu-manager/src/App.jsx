import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Drama, UserPlus, Trash2, LogOut, Calendar, Clock, Infinity, CheckCircle, XCircle, Search, Github } from 'lucide-react';
import { supabase } from './supabase';

export default function UserManager() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedReseller, setSelectedReseller] = useState('Reseller 1');
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);
  const [usersFarm, setUsersFarm] = useState([]);
  const [newUser, setNewUser] = useState('');
  const [newUserFarm, setNewUserFarm] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('lifetime');
  const [selectedDurationFarm, setSelectedDurationFarm] = useState('lifetime');
  const [activeTab, setActiveTab] = useState('users');
  const [saveStatus, setSaveStatus] = useState('');
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userListId, setUserListId] = useState(null);

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
      const parsedUsers = data.users ? data.users.split(',').map(str => {
        const [username, duration, expiration] = str.split('|');
        return { username, duration: duration || 'lifetime', expiration: expiration || null };
      }) : [];
      setUsers(parsedUsers);

      const parsedFarm = data.users_farm ? data.users_farm.split(',').map(str => {
        const [username, duration, expiration] = str.split('|');
        return { username, duration: duration || 'lifetime', expiration: expiration || null };
      }) : [];
      setUsersFarm(parsedFarm);
    } else {
      const { data: newData, error: insertError } = await supabase
        .from('user_lists')
        .insert({ owner_id: session.user.id, reseller: selectedReseller, users: '', users_farm: '' })
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

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
    };
    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      fetchUserLists();
    }
  }, [session, fetchUserLists]);

  const handleLogin = async () => {
    setIsLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    setIsLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUsers([]);
    setUsersFarm([]);
    setUserListId(null);
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
    const usersStr = newUsers.map(u => `${u.username}|${u.duration}|${u.expiration || ''}`).join(',');
    const farmStr = newFarm.map(u => `${u.username}|${u.duration}|${u.expiration || ''}`).join(',');

    const { error } = await supabase
      .from('user_lists')
      .update({ users: usersStr, users_farm: farmStr })
      .eq('id', userListId)
      .eq('reseller', selectedReseller);

    if (error) {
      console.error('Erro ao atualizar listas:', error);
      alert('Erro ao salvar mudanças');
      return false;
    }
    return true;
  };

  const addUser = async () => {
    const isUsersTab = activeTab === 'users';
    const username = isUsersTab ? newUser.trim() : newUserFarm.trim();
    if (!username) return alert('Por favor, insira um username');

    const duration = isUsersTab ? selectedDuration : selectedDurationFarm;
    const expiration = calculateExpiration(duration);

    const newEntry = { username, duration, expiration };
    const currentList = isUsersTab ? users : usersFarm;
    const newList = [...currentList, newEntry];

    const success = await updateListsInSupabase(
      isUsersTab ? newList : users,
      isUsersTab ? usersFarm : newList
    );

    if (success) {
      if (isUsersTab) {
        setUsers(newList);
        setNewUser('');
      } else {
        setUsersFarm(newList);
        setNewUserFarm('');
      }
      alert(`${username} adicionado com sucesso!`);
      await exportToGitHub(); // Auto-save após adicionar
    }
  };

  const removeUser = async (tab, username) => {
    if (!window.confirm(`Tem certeza que deseja remover ${username}?`)) return;

    const isUsersTab = tab === 'users';
    const currentList = isUsersTab ? users : usersFarm;
    const newList = currentList.filter(u => u.username !== username);

    const success = await updateListsInSupabase(
      isUsersTab ? newList : users,
      isUsersTab ? usersFarm : newList
    );

    if (success) {
      if (isUsersTab) setUsers(newList);
      else setUsersFarm(newList);
      alert(`${username} removido com sucesso!`);
      await exportToGitHub(); // Auto-save após remover
    }
  };

  const formatTimeRemaining = (expiration) => {
    if (!expiration) return 'Vitalício';

    const now = new Date();
    const exp = new Date(expiration);
    const diff = exp - now;

    if (diff <= 0) return 'Expirado';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
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

  const exportToGitHub = async () => {
    setSaveStatus('salvando');

    const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN || '';
    const REPO_OWNER = 'Aephic';
    const REPO_NAME = 'dnmenu';
    const BRANCH = 'main';

    if (!GITHUB_TOKEN) {
      alert('Token do GitHub não configurado.');
      setSaveStatus('erro');
      setTimeout(() => setSaveStatus(''), 3000);
      return;
    }

    try {
      // Buscar todas as listas de todos os resellers/owners
      const { data: allLists, error } = await supabase
        .from('user_lists')
        .select('*');

      if (error) throw error;

      const allUsers = new Set();
      const allFarm = new Set();

      allLists.forEach(list => {
        if (list.users) {
          list.users.split(',').forEach(str => {
            const [username] = str.split('|');
            if (username) allUsers.add(username.trim());
          });
        }
        if (list.users_farm) {
          list.users_farm.split(',').forEach(str => {
            const [username] = str.split('|');
            if (username) allFarm.add(username.trim());
          });
        }
      });

      const usersContent = Array.from(allUsers).join('\n');
      const usersFarmContent = Array.from(allFarm).join('\n');

      // Obter SHA e atualizar users
      const usersGetRes = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/security/users`, {
        headers: { 'Authorization': `Bearer ${GITHUB_TOKEN}` }
      });
      if (!usersGetRes.ok) throw new Error('Failed to fetch users SHA');
      const usersData = await usersGetRes.json();

      await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/security/users`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${GITHUB_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Atualizar users via DNMenu Manager',
          content: btoa(unescape(encodeURIComponent(usersContent))),
          branch: BRANCH,
          sha: usersData.sha
        })
      });

      // Obter SHA e atualizar usersfarm
      const farmGetRes = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/security/usersfarm`, {
        headers: { 'Authorization': `Bearer ${GITHUB_TOKEN}` }
      });
      if (!farmGetRes.ok) throw new Error('Failed to fetch usersfarm SHA');
      const farmData = await farmGetRes.json();

      await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/security/usersfarm`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${GITHUB_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Atualizar usersfarm via DNMenu Manager',
          content: btoa(unescape(encodeURIComponent(usersFarmContent))),
          branch: BRANCH,
          sha: farmData.sha
        })
      });

      setSaveStatus('salvo');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      console.error('Erro ao exportar para GitHub:', error);
      alert('Erro ao exportar para GitHub');
      setSaveStatus('erro');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  const filteredUsers = (activeTab === 'users' ? users : usersFarm).filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalUsers = users.length + usersFarm.length;
  const activeTokens = [...users, ...usersFarm].filter(u => u.expiration === null || new Date(u.expiration) > new Date()).length;

  if (!session) {
    return (
      <motion.div
        className="min-h-screen bg-gradient-to-br from-purple-950 via-black to-purple-950 flex items-center justify-center p-4 overflow-hidden relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/2 w-[150%] h-[150%] bg-purple-800 rounded-full opacity-20 blur-3xl animate-pulse-slow"></div>
          <div className="absolute -bottom-1/2 -right-1/2 w-[150%] h-[150%] bg-purple-600 rounded-full opacity-20 blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-900/40 to-transparent animate-slide"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent to-purple-900/40 animate-slide-fast"></div>
        </div>

        <motion.div
          className="relative bg-gradient-to-br from-purple-900/90 to-black/90 backdrop-blur-2xl rounded-3xl shadow-2xl p-12 w-full max-w-xl border border-purple-700/60 animate-glow z-10"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex justify-center mb-8">
            <motion.div
              className="relative"
              whileHover={{ scale: 1.05, rotate: 3 }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute inset-0 bg-purple-500 rounded-full blur-2xl opacity-50 animate-pulse-slow"></div>
              <div className="relative bg-gradient-to-br from-purple-800 to-purple-600 p-6 rounded-full shadow-xl">
                <Drama className="w-12 h-12 text-purple-200 animate-spin-slow" />
              </div>
            </motion.div>
          </div>
          <motion.h1
            className="text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 animate-gradient-x"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            DNMenu Manager
          </motion.h1>

          <motion.div
            className="space-y-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="relative">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-6 py-4 bg-black/50 border border-purple-700/50 rounded-2xl text-purple-100 placeholder-purple-400/50 focus:outline-none focus:border-purple-500 transition-all duration-300"
              />
            </div>

            <div className="relative">
              <input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-6 py-4 bg-black/50 border border-purple-700/50 rounded-2xl text-purple-100 placeholder-purple-400/50 focus:outline-none focus:border-purple-500 transition-all duration-300"
              />
            </div>

            {error && (
              <motion.p
                className="text-red-400 text-center animate-shake"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {error}
              </motion.p>
            )}

            <motion.button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl text-white font-semibold hover:from-purple-500 hover:to-pink-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10">{isLoading ? 'Entrando...' : 'Login'}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shine_1s]" />
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-black to-purple-950 p-8 text-purple-100">
      <div className="max-w-6xl mx-auto bg-black/60 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-purple-700/30">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            DNMenu Manager - {selectedReseller}
          </h1>
          <div className="flex items-center space-x-4">
            <select
              value={selectedReseller}
              onChange={(e) => setSelectedReseller(e.target.value)}
              className="bg-black/50 border border-purple-700/50 rounded-lg px-4 py-2 text-purple-100 focus:outline-none focus:border-purple-500"
            >
              <option value="Reseller 1">Reseller 1</option>
              <option value="Reseller 2">Reseller 2</option>
              {/* Adicione mais resellers conforme necessário */}
            </select>
            <button
              onClick={exportToGitHub}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all duration-300"
            >
              <Github className="w-5 h-5" />
              <span>Salvar no GitHub</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-6 py-3 bg-red-600/80 rounded-xl hover:bg-red-500 transition-all duration-300"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {saveStatus && (
          <div className={`p-4 rounded-xl mb-6 ${saveStatus === 'salvo' ? 'bg-green-900/50' : saveStatus === 'erro' ? 'bg-red-900/50' : 'bg-blue-900/50'}`}>
            {saveStatus === 'salvando' && 'Salvando no GitHub...'}
            {saveStatus === 'salvo' && 'Salvo com sucesso!'}
            {saveStatus === 'erro' && 'Erro ao salvar'}
          </div>
        )}

        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="p-6 bg-black/40 rounded-2xl border border-purple-700/30">
            <h3 className="text-lg font-semibold mb-2">Total de Usuários</h3>
            <p className="text-3xl font-bold text-purple-400">{totalUsers}</p>
          </div>
          <div className="p-6 bg-black/40 rounded-2xl border border-purple-700/30">
            <h3 className="text-lg font-semibold mb-2">Tokens Ativos</h3>
            <p className="text-3xl font-bold text-green-400">{activeTokens}</p>
          </div>
          <div className="p-6 bg-black/40 rounded-2xl border border-purple-700/30">
            <h3 className="text-lg font-semibold mb-2">Tokens Expirados</h3>
            <p className="text-3xl font-bold text-red-400">{totalUsers - activeTokens}</p>
          </div>
        </div>

        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 rounded-xl transition-all duration-300 ${activeTab === 'users'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600'
                : 'bg-black/40 border border-purple-700/30 hover:bg-black/60'
              }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab('usersfarm')}
            className={`px-6 py-3 rounded-xl transition-all duration-300 ${activeTab === 'usersfarm'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600'
                : 'bg-black/40 border border-purple-700/30 hover:bg-black/60'
              }`}
          >
            Users Farm
          </button>
        </div>

        <div className="mb-6 flex space-x-4">
          <input
            type="text"
            placeholder={activeTab === 'users' ? 'Novo user' : 'Novo user farm'}
            value={activeTab === 'users' ? newUser : newUserFarm}
            onChange={(e) => activeTab === 'users' ? setNewUser(e.target.value) : setNewUserFarm(e.target.value)}
            className="flex-grow px-6 py-4 bg-black/50 border border-purple-700/50 rounded-2xl text-purple-100 placeholder-purple-400/50 focus:outline-none focus:border-purple-500"
          />
          <select
            value={activeTab === 'users' ? selectedDuration : selectedDurationFarm}
            onChange={(e) => activeTab === 'users' ? setSelectedDuration(e.target.value) : setSelectedDurationFarm(e.target.value)}
            className="px-6 py-4 bg-black/50 border border-purple-700/50 rounded-2xl text-purple-100 focus:outline-none focus:border-purple-500"
          >
            <option value="daily">Diário</option>
            <option value="weekly">Semanal</option>
            <option value="monthly">Mensal</option>
            <option value="lifetime">Vitalício</option>
          </select>
          <button
            onClick={addUser}
            className="flex items-center space-x-2 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl hover:from-purple-500 hover:to-pink-500 transition-all duration-300"
          >
            <UserPlus className="w-5 h-5" />
            <span>Adicionar</span>
          </button>
        </div>

        <div className="mb-6 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400/50" />
          <input
            type="text"
            placeholder="Buscar usuário..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-12 py-4 bg-black/50 border border-purple-700/50 rounded-2xl text-purple-100 placeholder-purple-400/50 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="overflow-x-auto rounded-2xl border border-purple-700/30">
          <table className="w-full">
            <thead>
              <tr className="bg-black/50">
                <th className="px-6 py-4 text-left">Username</th>
                <th className="px-6 py-4 text-left">Duração</th>
                <th className="px-6 py-4 text-left">Tempo Restante</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.username} className="border-t border-purple-700/20 hover:bg-black/30 transition-colors">
                  <td className="px-6 py-4">{user.username}</td>
                  <td className="px-6 py-4">
                    <div className={`flex items-center space-x-2 ${getDurationColor(user.duration)}`}>
                      {getDurationIcon(user.duration)}
                      <span>{user.duration.charAt(0).toUpperCase() + user.duration.slice(1)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">{formatTimeRemaining(user.expiration)}</td>
                  <td className="px-6 py-4">
                    {user.expiration === null || new Date(user.expiration) > new Date() ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400" />
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => removeUser(activeTab, user.username)}
                      className="p-2 hover:bg-red-600/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5 text-red-400" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-purple-400/50">
                    Nenhum usuário encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
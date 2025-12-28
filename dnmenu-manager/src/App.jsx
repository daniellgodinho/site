import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Drama, UserPlus, Trash2, LogOut, Calendar, Clock, Infinity, CheckCircle, XCircle, Search, Github } from 'lucide-react';
import { supabase } from './supabase';
import { CustomSelect } from './components/CustomSelect';
import monkeyLogo from './assets/monkeyLogo.png';

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

    // Replace with your GitHub token
    const GITHUB_TOKEN = 'your-github-token-here';
    const REPO_OWNER = 'Aephic';
    const REPO_NAME = 'dnmenu';
    const BRANCH = 'main';

    if (!GITHUB_TOKEN || GITHUB_TOKEN === 'your-github-token-here') {
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

  const durationOptions = [
    { value: 'daily', label: 'Diário' },
    { value: 'weekly', label: 'Semanal' },
    { value: 'monthly', label: 'Mensal' },
    { value: 'lifetime', label: 'Vitalício' }
  ];

  const resellerOptions = [
    { value: 'Reseller 1', label: 'Reseller 1' },
    { value: 'Reseller 2', label: 'Reseller 2' }
  ];

  const GridBackground = () => (
    <div className="grid-background absolute inset-0 p-2 grid grid-cols-12 gap-2 transform -skew-y-12 scale-150 opacity-40 overflow-hidden">
      {/* row 1 */}
      <div className="col-span-2 bg-purple-950 rounded animate-pulse-slow" style={{ animationDelay: '0s', animationDuration: '4s' }}></div>
      <div className="col-span-5 bg-black rounded animate-pulse-slow" style={{ animationDelay: '2s', animationDuration: '5s' }}></div>
      <div className="col-span-1 bg-purple-900 rounded animate-pulse-slow" style={{ animationDelay: '1s', animationDuration: '3s' }}></div>
      <div className="col-span-4 bg-black rounded animate-pulse-slow" style={{ animationDelay: '3s', animationDuration: '6s' }}></div>

      {/* row 2 */}
      <div className="col-span-5 bg-black rounded animate-pulse-slow" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
      <div className="col-span-3 bg-purple-950 rounded animate-pulse-slow" style={{ animationDelay: '4s', animationDuration: '5s' }}></div>
      <div className="col-span-2 bg-purple-900 rounded animate-pulse-slow" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
      <div className="col-span-2 bg-black rounded animate-pulse-slow" style={{ animationDelay: '2s', animationDuration: '4s' }}></div>

      {/* row 3 */}
      <div className="col-span-4 bg-purple-900 rounded animate-pulse-slow" style={{ animationDelay: '3s', animationDuration: '5s' }}></div>
      <div className="col-span-7 bg-black rounded animate-pulse-slow" style={{ animationDelay: '1s', animationDuration: '6s' }}></div>
      <div className="col-span-1 bg-purple-950 rounded animate-pulse-slow" style={{ animationDelay: '2s', animationDuration: '3s' }}></div>

      {/* row 4 */}
      <div className="col-span-2 bg-black rounded animate-pulse-slow" style={{ animationDelay: '0s', animationDuration: '4s' }}></div>
      <div className="col-span-4 bg-purple-950 rounded animate-pulse-slow" style={{ animationDelay: '3s', animationDuration: '5s' }}></div>
      <div className="col-span-6 bg-purple-900 rounded animate-pulse-slow" style={{ animationDelay: '1s', animationDuration: '6s' }}></div>

      {/* row 5 */}
      <div className="col-span-5 bg-purple-900 rounded animate-pulse-slow" style={{ animationDelay: '2s', animationDuration: '4s' }}></div>
      <div className="col-span-5 bg-black rounded animate-pulse-slow" style={{ animationDelay: '4s', animationDuration: '3s' }}></div>
      <div className="col-span-2 bg-purple-950 rounded animate-pulse-slow" style={{ animationDelay: '0s', animationDuration: '5s' }}></div>

      {/* row 6 */}
      <div className="col-span-4 bg-black rounded animate-pulse-slow" style={{ animationDelay: '1s', animationDuration: '6s' }}></div>
      <div className="col-span-7 bg-purple-900 rounded animate-pulse-slow" style={{ animationDelay: '3s', animationDuration: '4s' }}></div>
      <div className="col-span-1 bg-purple-950 rounded animate-pulse-slow" style={{ animationDelay: '2s', animationDuration: '5s' }}></div>

      {/* row 7 */}
      <div className="col-span-4 bg-purple-950 rounded animate-pulse-slow" style={{ animationDelay: '4s', animationDuration: '3s' }}></div>
      <div className="col-span-7 bg-black rounded animate-pulse-slow" style={{ animationDelay: '0s', animationDuration: '6s' }}></div>
      <div className="col-span-1 bg-purple-900 rounded animate-pulse-slow" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>

      {/* row 8 */}
      <div className="col-span-3 bg-black rounded animate-pulse-slow" style={{ animationDelay: '2s', animationDuration: '5s' }}></div>
      <div className="col-span-6 bg-purple-950 rounded animate-pulse-slow" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
      <div className="col-span-3 bg-purple-900 rounded animate-pulse-slow" style={{ animationDelay: '3s', animationDuration: '6s' }}></div>

      {/* row 9 */}
      <div className="col-span-5 bg-purple-900 rounded animate-pulse-slow" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
      <div className="col-span-4 bg-black rounded animate-pulse-slow" style={{ animationDelay: '4s', animationDuration: '5s' }}></div>
      <div className="col-span-3 bg-purple-950 rounded animate-pulse-slow" style={{ animationDelay: '2s', animationDuration: '4s' }}></div>

      {/* row 10 */}
      <div className="col-span-2 bg-purple-950 rounded animate-pulse-slow" style={{ animationDelay: '1s', animationDuration: '6s' }}></div>
      <div className="col-span-7 bg-black rounded animate-pulse-slow" style={{ animationDelay: '3s', animationDuration: '4s' }}></div>
      <div className="col-span-3 bg-purple-900 rounded animate-pulse-slow" style={{ animationDelay: '0s', animationDuration: '5s' }}></div>
    </div>
  );

  if (!session) {
    return (
      <motion.div
        className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <GridBackground />

        <motion.div
          className="relative bg-black/90 backdrop-blur-xl rounded-3xl shadow-2xl p-12 w-full max-w-xl border border-purple-600/30 z-10"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ boxShadow: '0 0 60px rgba(168, 85, 247, 0.4)' }}
        >
          <div className="flex justify-center mb-4">
            <motion.div
              className="relative"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute inset-0 blur-3xl opacity-60">
                <img src={monkeyLogo} alt="DN Logo glow" className="w-full h-full" style={{ filter: 'brightness(1.3) saturate(1.5) hue-rotate(-10deg)' }} />
              </div>
              <div className="absolute inset-0 blur-2xl opacity-40">
                <img src={monkeyLogo} alt="DN Logo glow" className="w-full h-full" style={{ filter: 'brightness(1.8) saturate(1.8) hue-rotate(-10deg)' }} />
              </div>
              <img
                src={monkeyLogo}
                alt="DN Menu Logo"
                className="relative z-10 w-40 h-40 object-contain"
                style={{ filter: 'drop-shadow(0 0 25px #a855f7)' }}
              />
            </motion.div>
          </div>

          <motion.div
            className="space-y-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-purple-600/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="relative w-full px-6 py-4 bg-gray-800/50 border border-purple-600/30 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-600 focus:bg-gray-800/70 transition-all duration-300"
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-purple-600/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
              <input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="relative w-full px-6 py-4 bg-gray-800/50 border border-purple-600/30 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-600 focus:bg-gray-800/70 transition-all duration-300"
              />
            </div>

            {error && (
              <motion.p
                className="text-red-400 text-center animate-shake bg-red-900/20 py-2 px-4 rounded-xl border border-red-600/30"
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
              className="relative w-full py-4 bg-purple-600 rounded-2xl text-white font-semibold hover:bg-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{ boxShadow: '0 10px 40px rgba(182, 21, 236, 0.5)' }}
            >
              <span className="relative z-10">{isLoading ? 'Entrando...' : 'Entrar'}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shine_1s]" />
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="relative min-h-screen bg-black overflow-hidden p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <GridBackground />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="bg-black/80 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-purple-600/20" style={{ boxShadow: '0 0 60px rgba(168, 85, 247, 0.3)' }}>

          {/* Header com Logo */}
          <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-700">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-0 blur-2xl opacity-50">
                  <img src={monkeyLogo} alt="DN Logo glow" className="w-full h-full" style={{ filter: 'brightness(1.3) hue-rotate(-10deg)' }} />
                </div>
                <img
                  src={monkeyLogo}
                  alt="DN Menu Logo"
                  className="relative z-10 w-40 h-40 object-contain"
                  style={{ filter: 'drop-shadow(0 0 15px #a855f7)' }}
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  DNMenu Manager
                </h1>
                <p className="text-gray-400 text-sm">{selectedReseller}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <CustomSelect
                value={selectedReseller}
                onChange={setSelectedReseller}
                options={resellerOptions}
                className="w-40"
              />

              <button
                onClick={exportToGitHub}
                className="flex items-center space-x-2 px-6 py-3 bg-purple-600 rounded-xl hover:bg-purple-700 transition-all duration-300 shadow-lg shadow-purple-600/30 overflow-hidden group"
              >
                <Github className="w-5 h-5" />
                <span>Salvar</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shine_1s]" />
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-6 py-3 bg-gray-800 border border-gray-700 rounded-xl hover:bg-gray-700 transition-all duration-300"
              >
                <LogOut className="w-5 h-5" />
                <span>Sair</span>
              </button>
            </div>
          </div>

          {saveStatus && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-xl mb-6 border ${saveStatus === 'salvo'
                ? 'bg-green-900/30 border-green-500/30 text-green-400'
                : saveStatus === 'erro'
                  ? 'bg-red-900/30 border-red-500/30 text-red-400'
                  : 'bg-blue-900/30 border-blue-500/30 text-blue-400'
                }`}
            >
              {saveStatus === 'salvando' && '⏳ Salvando no GitHub...'}
              {saveStatus === 'salvo' && '✅ Salvo com sucesso!'}
              {saveStatus === 'erro' && '❌ Erro ao salvar'}
            </motion.div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <motion.div
              className="p-6 bg-gray-800/60 rounded-2xl border border-purple-600/20 backdrop-blur-sm overflow-hidden group"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-sm text-gray-400 mb-2">Total de Usuários</h3>
              <p className="text-4xl font-bold text-purple-400">{totalUsers}</p>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>

            <motion.div
              className="p-6 bg-gray-800/60 rounded-2xl border border-purple-600/20 backdrop-blur-sm overflow-hidden group"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-sm text-gray-400 mb-2">Tokens Ativos</h3>
              <p className="text-4xl font-bold text-green-400">{activeTokens}</p>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>

            <motion.div
              className="p-6 bg-gray-800/60 rounded-2xl border border-purple-600/20 backdrop-blur-sm overflow-hidden group"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-sm text-gray-400 mb-2">Tokens Expirados</h3>
              <p className="text-4xl font-bold text-red-400">{totalUsers - activeTokens}</p>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setActiveTab('users')}
              className={`px-8 py-3 rounded-xl transition-all duration-300 ${activeTab === 'users'
                ? 'bg-purple-600 shadow-lg shadow-purple-600/30'
                : 'bg-gray-800 border border-gray-700 hover:border-purple-600/40'
                }`}
            >
              Users ({users.length})
            </button>
            <button
              onClick={() => setActiveTab('usersfarm')}
              className={`px-8 py-3 rounded-xl transition-all duration-300 ${activeTab === 'usersfarm'
                ? 'bg-purple-600 shadow-lg shadow-purple-600/30'
                : 'bg-gray-800 border border-gray-700 hover:border-purple-600/40'
                }`}
            >
              Users Farm ({usersFarm.length})
            </button>
          </div>

          {/* Add User Form */}
          <div className="mb-6 flex space-x-4">
            <div className="relative group flex-grow">
              <div className="absolute inset-0 bg-purple-600/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
              <input
                type="text"
                placeholder={activeTab === 'users' ? 'Novo user' : 'Novo user farm'}
                value={activeTab === 'users' ? newUser : newUserFarm}
                onChange={(e) => activeTab === 'users' ? setNewUser(e.target.value) : setNewUserFarm(e.target.value)}
                className="relative w-full px-6 py-4 bg-gray-800/50 border border-purple-600/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-600 focus:bg-gray-800/70 transition-all duration-300"
              />
            </div>

            <CustomSelect
              value={activeTab === 'users' ? selectedDuration : selectedDurationFarm}
              onChange={(value) => activeTab === 'users' ? setSelectedDuration(value) : setSelectedDurationFarm(value)}
              options={durationOptions}
              className="w-48"
            />

            <button
              onClick={addUser}
              className="flex items-center space-x-2 px-8 py-4 bg-purple-600 rounded-xl hover:bg-purple-700 transition-all duration-300 shadow-lg shadow-purple-600/30 overflow-hidden group"
            >
              <UserPlus className="w-5 h-5" />
              <span>Adicionar</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shine_1s]" />
            </button>
          </div>

          {/* Search */}
          <div className="mb-6 relative group">
            <div className="absolute inset-0 bg-purple-600/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Buscar usuário..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="relative w-full px-12 py-4 bg-gray-800/50 border border-purple-600/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-600 focus:bg-gray-800/70 transition-all duration-300"
            />
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto rounded-2xl border border-purple-600/20">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-800/50 border-b border-gray-700">
                  <th className="px-6 py-4 text-left text-gray-400">Username</th>
                  <th className="px-6 py-4 text-left text-gray-400">Duração</th>
                  <th className="px-6 py-4 text-left text-gray-400">Tempo Restante</th>
                  <th className="px-6 py-4 text-left text-gray-400">Status</th>
                  <th className="px-6 py-4 text-right text-gray-400">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <motion.tr
                    key={user.username}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-t border-gray-800 hover:bg-gray-800/40 transition-colors"
                  >
                    <td className="px-6 py-4 text-white">{user.username}</td>
                    <td className="px-6 py-4">
                      <div className={`flex items-center space-x-2 ${getDurationColor(user.duration)}`}>
                        {getDurationIcon(user.duration)}
                        <span className="capitalize">{user.duration}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{formatTimeRemaining(user.expiration)}</td>
                    <td className="px-6 py-4">
                      {user.expiration === null || new Date(user.expiration) > new Date() ? (
                        <div className="flex items-center space-x-2 bg-green-900/20 px-3 py-1 rounded-full border border-green-600/30">
                          <CheckCircle className="w-5 h-5 text-green-400" />
                          <span className="text-green-400 text-sm">Ativo</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 bg-red-900/20 px-3 py-1 rounded-full border border-red-600/30">
                          <XCircle className="w-5 h-5 text-red-400" />
                          <span className="text-red-400 text-sm">Expirado</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => removeUser(activeTab, user.username)}
                        className="p-2 hover:bg-red-500/20 rounded-lg transition-colors border border-transparent hover:border-red-500/30"
                      >
                        <Trash2 className="w-5 h-5 text-red-400" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center space-y-2">
                        <Search className="w-12 h-12 opacity-30" />
                        <p>Nenhum usuário encontrado</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
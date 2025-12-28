import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Drama, UserPlus, Trash2, LogOut, Calendar, Clock, Infinity, CheckCircle, XCircle, Search, Github } from 'lucide-react';
import { supabase } from './supabase';
import { Glow, GlowCapture } from '@codaworks/react-glow'; // New import for light/glow effect

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
      case 'daily': return <Clock className="w-4 h-4 inline" />;
      case 'weekly': return <Calendar className="w-4 h-4 inline" />;
      case 'monthly': return <Calendar className="w-4 h-4 inline" />;
      case 'lifetime': return <Infinity className="w-4 h-4 inline" />;
      default: return null;
    }
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFarmUsers = usersFarm.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentList = activeTab === 'users' ? filteredUsers : filteredFarmUsers;
  const setCurrentNewUser = activeTab === 'users' ? setNewUser : setNewUserFarm;
  const currentNewUser = activeTab === 'users' ? newUser : newUserFarm;
  const setCurrentDuration = activeTab === 'users' ? setSelectedDuration : setSelectedDurationFarm;
  const currentDuration = activeTab === 'users' ? selectedDuration : selectedDurationFarm;

  const totalUsers = currentList.length;
  const activeTokens = currentList.filter(u => !u.expiration || new Date(u.expiration) > new Date()).length;

  const exportToGitHub = async () => {
    setSaveStatus('salvando');
    try {
      // Placeholder for GitHub export logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSaveStatus('salvo');
    } catch (err) {
      setSaveStatus('erro');
    }
  };

  if (!session) {
    return (
      <GlowCapture> {/* Wrap login for potential glow on elements */}
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-pink-900 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md"
          >
            <div className="text-center mb-8">
              <Drama className="w-16 h-16 mx-auto mb-4 text-purple-400" />
              <h1 className="text-3xl font-bold text-purple-100">DNMenu Manager</h1>
              <p className="text-purple-300 mt-2">Entre com sua conta</p>
            </div>

            <div className="bg-black/40 backdrop-blur-lg border border-purple-700/30 rounded-2xl p-8">
              {error && (
                <div className="mb-4 p-3 bg-red-900/50 border border-red-700/50 rounded-lg text-red-200">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-6 py-4 bg-black/50 border border-purple-700/50 rounded-2xl text-purple-100 placeholder-purple-400/50 focus:outline-none focus:border-purple-500 transition-all duration-300"
                />

                <input
                  type="password"
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-6 py-4 bg-black/50 border border-purple-700/50 rounded-2xl text-purple-100 placeholder-purple-400/50 focus:outline-none focus:border-purple-500 transition-all duration-300"
                />
              </div>

              <Glow color="purple"> {/* Glow on login button */}
                <button
                  onClick={handleLogin}
                  disabled={isLoading}
                  className="w-full mt-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold text-white hover:from-purple-700 hover:to-pink-700 transition-all duration-300 disabled:opacity-50 glow:bg-glow/20 glow:text-glow/80"
                >
                  {isLoading ? 'Entrando...' : 'Login'}
                </button>
              </Glow>
            </div>
          </motion.div>
        </div>
      </GlowCapture>
    );
  }

  return (
    <GlowCapture> {/* Root wrapper for mouse tracking */}
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-pink-900 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-purple-100">DNMenu Manager - {selectedReseller}</h1>
            <div className="flex gap-4">
              <select
                value={selectedReseller}
                onChange={(e) => setSelectedReseller(e.target.value)}
                className="bg-black/50 border border-purple-700/50 rounded-lg px-4 py-2 text-purple-100 focus:outline-none focus:border-purple-500"
              >
                <option value="Reseller 1">Reseller 1</option>
                <option value="Reseller 2">Reseller 2</option>
              </select>

              <Glow color="green"> {/* Glow on export button */}
                <button
                  onClick={exportToGitHub}
                  className="px-4 py-2 bg-green-600/20 border border-green-600/50 rounded-lg text-green-300 hover:bg-green-600/30 transition-colors glow:bg-glow/20 glow:text-glow/80"
                >
                  <Github className="w-5 h-5 inline" />
                </button>
              </Glow>

              <Glow color="red"> {/* Glow on logout button */}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600/20 border border-red-600/50 rounded-lg text-red-300 hover:bg-red-600/30 transition-colors flex items-center gap-2 glow:bg-glow/20 glow:text-glow/80"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </Glow>
            </div>
          </div>

          {saveStatus && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-blue-900/50 border border-blue-700/50 rounded-lg text-blue-200"
            >
              {saveStatus === 'salvando' ? 'Salvando no GitHub...' : saveStatus === 'salvo' ? 'Salvo com sucesso!' : 'Erro ao salvar'}
            </motion.div>
          )}

          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-3 rounded-xl ${activeTab === 'users' ? 'bg-purple-600' : 'bg-black/50'} text-white transition-colors`}
            >
              Users
            </button>
            <button
              onClick={() => setActiveTab('farm')}
              className={`px-6 py-3 rounded-xl ${activeTab === 'farm' ? 'bg-purple-600' : 'bg-black/50'} text-white transition-colors`}
            >
              Farm Users
            </button>
          </div>

          <div className="bg-black/40 backdrop-blur-lg border border-purple-700/30 rounded-2xl p-6 mb-6">
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Novo username"
                value={currentNewUser}
                onChange={(e) => setCurrentNewUser(e.target.value)}
                className="flex-grow px-6 py-4 bg-black/50 border border-purple-700/50 rounded-2xl text-purple-100 placeholder-purple-400/50 focus:outline-none focus:border-purple-500 transition-all duration-300"
              />

              <select
                value={currentDuration}
                onChange={(e) => setCurrentDuration(e.target.value)}
                className="px-6 py-4 bg-black/50 border border-purple-700/50 rounded-2xl text-purple-100 focus:outline-none focus:border-purple-500 transition-all duration-300"
              >
                <option value="daily">Diário</option>
                <option value="weekly">Semanal</option>
                <option value="monthly">Mensal</option>
                <option value="lifetime">Vitalício</option>
              </select>

              <Glow color="purple"> {/* Glow on add button */}
                <button
                  onClick={addUser}
                  className="px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl text-white hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center gap-2 glow:bg-glow/20 glow:text-glow/80"
                >
                  <UserPlus className="w-5 h-5" />
                  Adicionar
                </button>
              </Glow>
            </div>
          </div>

          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-purple-100">{activeTab === 'users' ? 'Users' : 'Farm Users'} ({totalUsers} total, {activeTokens} ativos)</h2>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
              <input
                type="text"
                placeholder="Buscar username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-6 py-3 bg-black/50 border border-purple-700/50 rounded-xl text-purple-100 placeholder-purple-400/50 focus:outline-none focus:border-purple-500 transition-all duration-300 w-64"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentList.map((user) => (
              <Glow key={user.username} color="hsl(270, 100%, 50%)"> {/* Glow on each user item for light effect */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-black/40 backdrop-blur-lg border border-purple-700/30 rounded-2xl p-6 flex flex-col gap-4 glow:bg-glow/10 glow:border-glow/50 glow:text-glow/70"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-purple-100">{user.username}</h3>
                    <button
                      onClick={() => removeUser(activeTab, user.username)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-purple-300">
                    {getDurationIcon(user.duration)}
                    <span className="capitalize">{user.duration}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {new Date(user.expiration) > new Date() ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400" />
                    )}
                    <span className="text-purple-200">{formatTimeRemaining(user.expiration)}</span>
                  </div>
                </motion.div>
              </Glow>
            ))}
          </div>
        </div>
      </div>
    </GlowCapture>
  );
}
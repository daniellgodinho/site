import React, { useState, useEffect, useCallback } from 'react';
import { Drama, UserPlus, Trash2, LogOut, Calendar, Clock, Infinity, XCircle, Github, Loader2, Check } from 'lucide-react';

export default function UserManager() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);
  const [usersFarm, setUsersFarm] = useState([]);
  const [newUser, setNewUser] = useState('');
  const [newUserFarm, setNewUserFarm] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('lifetime');
  const [selectedDurationFarm, setSelectedDurationFarm] = useState('lifetime');
  const [activeTab, setActiveTab] = useState('users');
  const [saveStatus, setSaveStatus] = useState('');
  const [showLogin, setShowLogin] = useState(true);
  const [authToken, setAuthToken] = useState(localStorage.getItem('auth_token'));
  const [isLoading, setIsLoading] = useState(false);

  // API URL - usa a mesma origem em produção
  const API_URL = '/api';

  const fetchUsersFromServer = useCallback(async () => {
    if (!authToken) return;

    try {
      const [usersRes, farmRes] = await Promise.all([
        fetch(`${API_URL}/users`, {
          headers: { 'Authorization': `Bearer ${authToken}` }
        }),
        fetch(`${API_URL}/usersfarm`, {
          headers: { 'Authorization': `Bearer ${authToken}` }
        })
      ]);

      if (usersRes.ok) {
        const data = await usersRes.json();
        setUsers(data.users);
      }

      if (farmRes.ok) {
        const data = await farmRes.json();
        setUsersFarm(data.usersFarm);
      }
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    }
  }, [authToken]);

  const validateToken = useCallback(async (token) => {
    try {
      const response = await fetch(`${API_URL}/validate-token`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setShowLogin(false);
      } else {
        localStorage.removeItem('auth_token');
        setAuthToken(null);
        setShowLogin(true);
      }
    } catch (error) {
      console.error('Erro ao validar token:', error);
      setShowLogin(true);
    }
  }, []);

  useEffect(() => {
    if (authToken) {
      validateToken(authToken);
      fetchUsersFromServer();
    }

    const userInterval = setInterval(() => {
      if (authToken) fetchUsersFromServer();
    }, 30000);

    return () => {
      clearInterval(userInterval);
    };
  }, [authToken, fetchUsersFromServer, validateToken]);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Email e senha são obrigatórios');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('auth_token', data.token);
        setAuthToken(data.token);
        setShowLogin(false);
        setError('');
        setEmail('');
        setPassword('');
      } else {
        const data = await response.json();
        setError(data.error || 'Falha no login');
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      setError('Erro de conexão. Verifique sua internet.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      if (authToken) {
        await fetch(`${API_URL}/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
      }
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }

    localStorage.removeItem('auth_token');
    setAuthToken(null);
    setShowLogin(true);
    setEmail('');
    setPassword('');
  };

  const addUser = async () => {
    const list = activeTab;
    const username = list === 'users' ? newUser.trim() : newUserFarm.trim();
    const duration = list === 'users' ? selectedDuration : selectedDurationFarm;

    if (!username) {
      alert('Por favor, insira um username');
      return;
    }

    try {
      const endpoint = list === 'users' ? '/users/add' : '/usersfarm/add';
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ username, duration })
      });

      if (response.ok) {
        await fetchUsersFromServer();
        if (list === 'users') setNewUser('');
        else setNewUserFarm('');
        alert(`✅ ${username} adicionado com sucesso!`);
      } else {
        const data = await response.json();
        alert(`❌ Erro: ${data.error}`);
      }
    } catch (error) {
      console.error('Erro ao adicionar usuário:', error);
      alert('❌ Erro ao adicionar usuário');
    }
  };

  const removeUser = async (list, username) => {
    if (!window.confirm(`Tem certeza que deseja remover ${username}?`)) return;

    try {
      const endpoint = list === 'users' ? `/users/${username}` : `/usersfarm/${username}`;
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (response.ok) {
        await fetchUsersFromServer();
        alert(`✅ ${username} removido com sucesso!`);
      } else {
        alert('❌ Erro ao remover usuário');
      }
    } catch (error) {
      console.error('Erro ao remover usuário:', error);
      alert('❌ Erro ao remover usuário');
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
      alert('Token do GitHub não configurado. Configure REACT_APP_GITHUB_TOKEN nas variáveis de ambiente.');
      setSaveStatus('erro');
      setTimeout(() => setSaveStatus(''), 3000);
      return;
    }

    try {
      const usersContent = users.map(u => u.username).join('\n');
      const usersFarmContent = usersFarm.map(u => u.username).join('\n');

      console.log('Iniciando sincronização com GitHub...');

      const usersGetResponse = await fetch(
        `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/security/users`,
        {
          headers: {
            'Authorization': `Bearer ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json',
          }
        }
      );

      if (!usersGetResponse.ok) {
        throw new Error(`Erro ao buscar arquivo users: ${usersGetResponse.status}`);
      }

      const usersData = await usersGetResponse.json();

      const usersPutResponse = await fetch(
        `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/security/users`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${GITHUB_TOKEN}`,
            'Content-Type': 'application/json',
            'Accept': 'application/vnd.github.v3+json',
          },
          body: JSON.stringify({
            message: 'Atualizar lista de usuários via DNMenu Manager',
            content: btoa(unescape(encodeURIComponent(usersContent))),
            branch: BRANCH,
            sha: usersData.sha
          })
        }
      );

      if (!usersPutResponse.ok) {
        throw new Error(`Erro ao atualizar users: ${usersPutResponse.status}`);
      }

      const usersFarmGetResponse = await fetch(
        `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/security/usersfarm`,
        {
          headers: {
            'Authorization': `Bearer ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json',
          }
        }
      );

      if (!usersFarmGetResponse.ok) {
        throw new Error(`Erro ao buscar arquivo usersfarm: ${usersFarmGetResponse.status}`);
      }

      const usersFarmData = await usersFarmGetResponse.json();

      const usersFarmPutResponse = await fetch(
        `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/security/usersfarm`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${GITHUB_TOKEN}`,
            'Content-Type': 'application/json',
            'Accept': 'application/vnd.github.v3+json',
          },
          body: JSON.stringify({
            message: 'Atualizar lista de usersfarm via DNMenu Manager',
            content: btoa(unescape(encodeURIComponent(usersFarmContent))),
            branch: BRANCH,
            sha: usersFarmData.sha
          })
        }
      );

      if (!usersFarmPutResponse.ok) {
        throw new Error(`Erro ao atualizar usersfarm: ${usersFarmPutResponse.status}`);
      }

      console.log('Sincronização completa!');
      setSaveStatus('salvo');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      console.error('Erro ao salvar no GitHub:', error);
      alert(`Erro ao sincronizar com GitHub: ${error.message}\n\nVerifique o console para mais detalhes.`);
      setSaveStatus('erro');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  if (showLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gray-800 rounded-full opacity-10 blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gray-700 rounded-full opacity-10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative bg-black/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 w-full max-w-md border border-gray-800 animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gray-600 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-gray-700 to-gray-900 p-5 rounded-full transform hover:scale-110 transition-transform duration-300">
                <Drama className="w-10 h-10 text-gray-300" />
              </div>
            </div>
          </div>

          <h1 className="text-4xl font-black text-center bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent mb-2">
            DNMenu Manager
          </h1>
          <p className="text-gray-500 text-center mb-8 font-medium">
            Sistema de Gerenciamento de Acesso
          </p>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-900/50 border border-gray-700 rounded-xl p-4 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors duration-200"
                placeholder="admin@dnmenu.com"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-900/50 border border-gray-700 rounded-xl p-4 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors duration-200"
                placeholder="••••••••"
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="bg-red-900/30 border border-red-700 rounded-xl p-3 text-red-300 text-sm text-center animate-fade-in">
                {error}
              </div>
            )}

            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Carregando...
                </>
              ) : (
                'Entrar'
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-8 text-gray-200 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gray-800 rounded-full opacity-5 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gray-700 rounded-full opacity-5 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-4xl mx-auto relative">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent flex items-center gap-3">
            <Drama className="w-8 h-8 text-indigo-400" />
            DNMenu Manager
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium py-2 px-4 rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </button>
            <button
              onClick={exportToGitHub}
              className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
              title="Sincronizar com GitHub"
            >
              {saveStatus === 'salvando' ? (
                <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
              ) : saveStatus === 'salvo' ? (
                <Check className="w-5 h-5 text-green-400" />
              ) : saveStatus === 'erro' ? (
                <XCircle className="w-5 h-5 text-red-400" />
              ) : (
                <Github className="w-5 h-5 text-gray-300" />
              )}
            </button>
          </div>
        </header>

        <div className="bg-black/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-gray-800">
          <div className="flex mb-6 gap-4">
            <button
              onClick={() => setActiveTab('users')}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-colors ${activeTab === 'users' ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
            >
              Users
            </button>
            <button
              onClick={() => setActiveTab('usersfarm')}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-colors ${activeTab === 'usersfarm' ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
            >
              Users Farm
            </button>
          </div>

          <div className="mb-6">
            <div className="flex gap-4">
              <input
                value={activeTab === 'users' ? newUser : newUserFarm}
                onChange={(e) => activeTab === 'users' ? setNewUser(e.target.value) : setNewUserFarm(e.target.value)}
                placeholder="Username do usuário"
                className="flex-1 bg-gray-900/50 border border-gray-700 rounded-xl p-4 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
              <select
                value={activeTab === 'users' ? selectedDuration : selectedDurationFarm}
                onChange={(e) => activeTab === 'users' ? setSelectedDuration(e.target.value) : setSelectedDurationFarm(e.target.value)}
                className="bg-gray-900/50 border border-gray-700 rounded-xl p-4 text-gray-200 focus:outline-none focus:border-indigo-500 transition-colors"
              >
                <option value="daily">Diário</option>
                <option value="weekly">Semanal</option>
                <option value="monthly">Mensal</option>
                <option value="lifetime">Vitalício</option>
              </select>
              <button
                onClick={addUser}
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium py-2 px-6 rounded-xl transition-all"
              >
                <UserPlus className="w-5 h-5" />
                Adicionar
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {(activeTab === 'users' ? users : usersFarm).map((user) => (
              <div
                key={user.username}
                className="bg-gray-900/50 border border-gray-700 rounded-xl p-4 flex items-center justify-between hover:border-indigo-500 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full bg-gray-800 ${getDurationColor(user.duration)}`}>
                    {getDurationIcon(user.duration)}
                  </div>
                  <div>
                    <p className="font-medium text-lg">{user.username}</p>
                    <p className="text-sm text-gray-400">
                      Expira em: <span className="text-indigo-400">{formatTimeRemaining(user.expiration)}</span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeUser(activeTab, user.username)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
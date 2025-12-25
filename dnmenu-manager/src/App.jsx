import React, { useState, useEffect, useCallback } from 'react';
import { Drama, UserPlus, Trash2, Save, LogOut, Calendar, Clock, Infinity, CheckCircle, XCircle } from 'lucide-react';

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
      alert(`❌ Erro ao sincronizar com GitHub: ${error.message}\n\nVerifique o console para mais detalhes.`);
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
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full px-4 py-4 bg-gray-900/50 border border-gray-800 rounded-xl text-white focus:outline-none focus:border-gray-600 focus:bg-gray-900/70 transition-all duration-300"
                placeholder="seu@email.com"
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
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full px-4 py-4 bg-gray-900/50 border border-gray-800 rounded-xl text-white focus:outline-none focus:border-gray-600 focus:bg-gray-900/70 transition-all duration-300"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl text-sm font-medium animate-shake">
                {error}
              </div>
            )}

            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Entrando...
                </span>
              ) : (
                'Entrar'
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentList = activeTab === 'users' ? users : usersFarm;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <div className="bg-black/60 backdrop-blur-xl rounded-3xl shadow-2xl p-6 mb-6 border border-gray-800 transform hover:scale-[1.01] transition-all duration-300">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-gray-700 to-gray-900 p-3 rounded-2xl">
                <Drama className="w-8 h-8 text-gray-300" />
              </div>
              <div>
                <h1 className="text-3xl font-black bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">
                  DNMenu Manager
                </h1>
                <p className="text-gray-500 text-sm font-medium">Sistema de Controle de Acesso Roblox</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={exportToGitHub}
                disabled={saveStatus === 'salvando'}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 font-bold shadow-lg ${saveStatus === 'salvando'
                  ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                  : saveStatus === 'erro'
                    ? 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-500 hover:to-red-600'
                    : saveStatus === 'salvo'
                      ? 'bg-gradient-to-r from-green-600 to-green-700 text-white'
                      : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white'
                  }`}
              >
                {saveStatus === 'salvando' ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Salvando...
                  </>
                ) : saveStatus === 'salvo' ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Sincronizado!
                  </>
                ) : saveStatus === 'erro' ? (
                  <>
                    <XCircle className="w-5 h-5" />
                    Erro ao Sincronizar
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Sincronizar GitHub
                  </>
                )}
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 font-bold shadow-lg"
              >
                <LogOut className="w-5 h-5" />
                Sair
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex-1 py-4 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 ${activeTab === 'users'
              ? 'bg-gradient-to-r from-gray-700 to-gray-800 text-white shadow-xl'
              : 'bg-gray-900/50 text-gray-500 hover:bg-gray-900/70 border border-gray-800'
              }`}
          >
            Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('usersfarm')}
            className={`flex-1 py-4 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 ${activeTab === 'usersfarm'
              ? 'bg-gradient-to-r from-gray-700 to-gray-800 text-white shadow-xl'
              : 'bg-gray-900/50 text-gray-500 hover:bg-gray-900/70 border border-gray-800'
              }`}
          >
            Users Farm ({usersFarm.length})
          </button>
        </div>

        <div className="bg-black/60 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-gray-800">
          <div className="mb-6 space-y-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={activeTab === 'users' ? newUser : newUserFarm}
                onChange={(e) => activeTab === 'users' ? setNewUser(e.target.value) : setNewUserFarm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addUser()}
                placeholder="Username do Roblox"
                className="flex-1 px-5 py-4 bg-gray-900/50 border border-gray-800 rounded-xl text-white focus:outline-none focus:border-gray-600 focus:bg-gray-900/70 transition-all duration-300 font-medium"
              />
              <button
                onClick={addUser}
                className="flex items-center gap-2 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 font-bold shadow-lg"
              >
                <UserPlus className="w-5 h-5" />
                Adicionar
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { value: 'daily', label: 'Diário', icon: <Clock className="w-4 h-4" /> },
                { value: 'weekly', label: 'Semanal', icon: <Calendar className="w-4 h-4" /> },
                { value: 'monthly', label: 'Mensal', icon: <Calendar className="w-4 h-4" /> },
                { value: 'lifetime', label: 'Vitalício', icon: <Infinity className="w-4 h-4" /> }
              ].map((dur) => (
                <button
                  key={dur.value}
                  onClick={() => activeTab === 'users' ? setSelectedDuration(dur.value) : setSelectedDurationFarm(dur.value)}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 ${(activeTab === 'users' ? selectedDuration : selectedDurationFarm) === dur.value
                    ? 'bg-gradient-to-r from-gray-700 to-gray-800 text-white shadow-lg'
                    : 'bg-gray-900/30 text-gray-500 hover:bg-gray-900/50 border border-gray-800'
                    }`}
                >
                  {dur.icon}
                  {dur.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-black text-gray-300 mb-4">
              Lista de Usuários - {activeTab === 'users' ? 'Users' : 'Users Farm'}
            </h3>

            {currentList.length === 0 ? (
              <div className="text-center py-20 text-gray-600">
                <Drama className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p className="font-medium">Nenhum usuário adicionado ainda</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {currentList.map((user, index) => (
                  <div
                    key={`${user.username}-${index}`}
                    className="flex items-center justify-between bg-gray-900/50 px-5 py-4 rounded-xl hover:bg-gray-900/70 transition-all duration-300 border border-gray-800 transform hover:scale-[1.02] group"
                  >
                    <div className="flex items-center gap-4 flex-wrap">
                      <span className="text-white font-bold text-lg">{user.username}</span>
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-lg ${getDurationColor(user.duration)} bg-gray-800/50`}>
                        {getDurationIcon(user.duration)}
                        <span className="text-sm font-bold">{formatTimeRemaining(user.expiration)}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeUser(activeTab, user.username)}
                      className="text-red-400 hover:text-red-300 transition-all duration-300 transform group-hover:scale-110 p-2 hover:bg-red-500/10 rounded-lg"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-800">
            <details className="cursor-pointer group">
              <summary className="text-gray-400 hover:text-gray-200 transition-all duration-300 font-bold text-lg list-none">
                📄 Visualizar Conteúdo para GitHub
              </summary>
              <div className="mt-4 space-y-4 animate-fade-in">
                <div>
                  <p className="text-sm text-gray-500 mb-2 font-bold">security/users:</p>
                  <pre className="bg-gray-900 p-4 rounded-xl text-green-400 text-sm overflow-x-auto border border-gray-800 font-mono">
                    {users.map(u => u.username).join('\n') || '(vazio)'}
                  </pre>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-2 font-bold">security/usersfarm:</p>
                  <pre className="bg-gray-900 p-4 rounded-xl text-green-400 text-sm overflow-x-auto border border-gray-800 font-mono">
                    {usersFarm.map(u => u.username).join('\n') || '(vazio)'}
                  </pre>
                </div>
              </div>
            </details>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        
        .animate-shake {
          animation: shake 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
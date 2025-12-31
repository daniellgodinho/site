const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');

// Configurações do Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Armazenamento em memória para tokens (stateless-friendly, mas tokens são voláteis por invocation)
const validTokens = new Map();

// Configurações
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
const PASSWORD_SALT = process.env.PASSWORD_SALT || 'default-salt-change-me';
const ADMIN_PASSWORD_HASH = hashPassword(process.env.ADMIN_PASSWORD || 'change-me');

function hashPassword(password) {
    return crypto
        .createHash('sha256')
        .update(password + PASSWORD_SALT)
        .digest('hex');
}

function generateToken() {
    return crypto.randomBytes(32).toString('hex');
}

function verifyToken(req) {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader) {
        console.log('Sem header de autorização');
        return false;
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        console.log('Token não encontrado no header');
        return false;
    }

    if (!validTokens.has(token)) {
        console.log('Token inválido ou não encontrado na memória');
        return false;
    }

    const tokenData = validTokens.get(token);
    if (tokenData.expiresAt && tokenData.expiresAt < Date.now()) {
        console.log('Token expirado');
        validTokens.delete(token);
        return false;
    }

    console.log('Token válido');
    return true;
}

function calculateExpiration(duration) {
    const now = new Date();
    switch (duration) {
        case 'daily':
            return new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
        case 'weekly':
            return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
        case 'monthly':
            return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
        case 'lifetime':
            return null;
        default:
            return null;
    }
}

// Handler principal
module.exports = async (req, res) => {
    // CORS Headers
    const allowedOrigins = [
        'https://dnmenu.vercel.app',
        'http://localhost:3000',
        'http://localhost:5000'
    ];

    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }

    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS,PUT,PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
    res.setHeader('Access-Control-Max-Age', '86400');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { method, url } = req;
    const path = url.split('?')[0];

    console.log(`[${new Date().toISOString()}] ${method} ${path}`);

    // ROTAS PÚBLICAS

    // Health check
    if (method === 'GET' && path === '/api/health') {
        const { data: usersData } = await supabase.from('users').select('*, count(*)');
        const { data: usersFarmData } = await supabase.from('users_farm').select('*, count(*)');
        return res.status(200).json({
            status: 'ok',
            users: usersData?.length || 0,
            usersFarm: usersFarmData?.length || 0,
            timestamp: new Date().toISOString(),
            tokensAtivos: validTokens.size,
            supabaseConnected: !!supabaseUrl && !!supabaseKey
        });
    }

    // Login
    if (method === 'POST' && path === '/api/login') {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ error: 'Email e senha são obrigatórios' });
            }

            const passwordHash = hashPassword(password);

            if (email === ADMIN_EMAIL && passwordHash === ADMIN_PASSWORD_HASH) {
                const token = generateToken();
                const expiresAt = null;  // Sem expiração

                validTokens.set(token, { expiresAt });

                // Limpar tokens expirados (mas como null, não expira)
                for (const [key, value] of validTokens.entries()) {
                    if (value.expiresAt && value.expiresAt < Date.now()) {
                        validTokens.delete(key);
                    }
                }

                console.log(`Login bem-sucedido para ${email}. Tokens ativos: ${validTokens.size}`);

                return res.status(200).json({
                    token,
                    expiresIn: null  // Sem expiração
                });
            }

            console.log(`Credenciais inválidas para ${email}`);
            return res.status(401).json({ error: 'Email ou senha incorretos' });
        } catch (error) {
            console.error('Erro no login:', error);
            return res.status(500).json({ error: 'Erro interno no servidor' });
        }
    }

    // ROTAS PROTEGIDAS

    if (!verifyToken(req)) {
        console.log(`Acesso negado para ${path}`);
        return res.status(401).json({ error: 'Não autorizado' });
    }

    // Logout
    if (method === 'POST' && path === '/api/logout') {
        const token = req.headers.authorization?.split(' ')[1];
        validTokens.delete(token);
        console.log(`Logout realizado. Tokens ativos: ${validTokens.size}`);
        return res.status(200).json({ success: true });
    }

    // Validar token
    if (method === 'GET' && path === '/api/validate-token') {
        return res.status(200).json({ valid: true });
    }

    // Obter users
    if (method === 'GET' && path === '/api/users') {
        let { data: allUsers, error } = await supabase
            .from('users')
            .select('*')
            .gte('expiration', new Date().toISOString());

        if (error) {
            console.error('Erro ao obter users:', error);
            return res.status(500).json({ error: 'Erro ao obter users' });
        }

        allUsers = allUsers.filter(u => !u.expiration || new Date(u.expiration) > new Date());
        console.log(`Retornando ${allUsers.length} users`);
        return res.status(200).json({ users: allUsers });
    }

    // Obter usersfarm
    if (method === 'GET' && path === '/api/usersfarm') {
        let { data: allUsersFarm, error } = await supabase
            .from('users_farm')
            .select('*')
            .gte('expiration', new Date().toISOString());

        if (error) {
            console.error('Erro ao obter usersfarm:', error);
            return res.status(500).json({ error: 'Erro ao obter usersfarm' });
        }

        allUsersFarm = allUsersFarm.filter(u => !u.expiration || new Date(u.expiration) > new Date());
        console.log(`Retornando ${allUsersFarm.length} usersfarm`);
        return res.status(200).json({ usersFarm: allUsersFarm });
    }

    // Adicionar user
    if (method === 'POST' && path === '/api/users/add') {
        try {
            const { username, duration } = req.body;

            if (!username || !username.trim()) {
                return res.status(400).json({ error: 'Username é obrigatório' });
            }

            const { data: existing } = await supabase
                .from('users')
                .select('username')
                .eq('username', username)
                .single();

            if (existing) {
                return res.status(400).json({ error: 'Usuário já existe' });
            }

            const newUser = {
                username,
                duration,
                expiration: calculateExpiration(duration),
                added_at: new Date().toISOString()  // Corrigido para snake_case
            };

            const { error } = await supabase.from('users').insert(newUser);

            if (error) {
                console.error('Erro ao inserir user:', error);
                return res.status(500).json({ error: 'Erro ao adicionar user' });
            }

            console.log(`User adicionado: ${username} (${duration})`);
            return res.status(201).json({ success: true, user: newUser });
        } catch (error) {
            console.error('Erro ao adicionar user:', error);
            return res.status(500).json({ error: 'Erro interno' });
        }
    }

    // Adicionar userfarm
    if (method === 'POST' && path === '/api/usersfarm/add') {
        try {
            const { username, duration } = req.body;

            if (!username || !username.trim()) {
                return res.status(400).json({ error: 'Username é obrigatório' });
            }

            const { data: existing } = await supabase
                .from('users_farm')
                .select('username')
                .eq('username', username)
                .single();

            if (existing) {
                return res.status(400).json({ error: 'Usuário já existe' });
            }

            const newUser = {
                username,
                duration,
                expiration: calculateExpiration(duration),
                added_at: new Date().toISOString()
            };

            const { error } = await supabase.from('users_farm').insert(newUser);

            if (error) {
                console.error('Erro ao inserir userfarm:', error);
                return res.status(500).json({ error: 'Erro ao adicionar userfarm' });
            }

            console.log(`UserFarm adicionado: ${username} (${duration})`);
            return res.status(201).json({ success: true, user: newUser });
        } catch (error) {
            console.error('Erro ao adicionar userfarm:', error);
            return res.status(500).json({ error: 'Erro interno' });
        }
    }

    // Remover user
    if (method === 'DELETE' && path.startsWith('/api/users/')) {
        const username = decodeURIComponent(path.replace('/api/users/', ''));
        const { error } = await supabase
            .from('users')
            .delete()
            .eq('username', username);

        if (error) {
            console.error('Erro ao deletar user:', error);
            return res.status(500).json({ error: 'Erro ao deletar user' });
        }

        console.log(`User removido: ${username}`);
        return res.status(200).json({ success: true });
    }

    // Remover userfarm
    if (method === 'DELETE' && path.startsWith('/api/usersfarm/')) {
        const username = decodeURIComponent(path.replace('/api/usersfarm/', ''));
        const { error } = await supabase
            .from('users_farm')
            .delete()
            .eq('username', username);

        if (error) {
            console.error('Erro ao deletar userfarm:', error);
            return res.status(500).json({ error: 'Erro ao deletar userfarm' });
        }

        console.log(`UserFarm removido: ${username}`);
        return res.status(200).json({ success: true });
    }

    // Rota não encontrada
    console.log(`Rota não encontrada: ${method} ${path}`);
    return res.status(404).json({ error: 'Rota não encontrada' });
};
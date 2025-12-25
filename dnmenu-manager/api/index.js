const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
    credentials: true
}));

// Rate limiting para login
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Muitas tentativas de login. Tente novamente em 15 minutos.',
    standardHeaders: true,
    legacyHeaders: false,
});

// Armazenar tokens e dados em memória (Vercel é serverless)
const validTokens = new Map();
let users = [];
let usersFarm = [];

// Credenciais
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@dnmenu.com';
const ADMIN_PASSWORD_HASH = hashPassword(process.env.ADMIN_PASSWORD || 'DNMenu2024!');

function hashPassword(password) {
    return crypto
        .createHash('sha256')
        .update(password + (process.env.PASSWORD_SALT || 'dnmenu-salt-2024'))
        .digest('hex');
}

function generateToken() {
    return crypto.randomBytes(32).toString('hex');
}

function verifyToken(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token || !validTokens.has(token)) {
        return res.status(401).json({ error: 'Não autorizado' });
    }

    next();
}

// Limpar tokens expirados
setInterval(() => {
    const now = Date.now();
    for (const [key, value] of validTokens.entries()) {
        if (value.expiresAt < now) {
            validTokens.delete(key);
        }
    }
}, 60000);

// Limpar usuários expirados
setInterval(() => {
    const now = new Date();
    users = users.filter(u => !u.expiration || new Date(u.expiration) > now);
    usersFarm = usersFarm.filter(u => !u.expiration || new Date(u.expiration) > now);
}, 60000);

// ENDPOINTS DE AUTENTICAÇÃO

app.post('/api/login', loginLimiter, (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    const passwordHash = hashPassword(password);

    if (email === ADMIN_EMAIL && passwordHash === ADMIN_PASSWORD_HASH) {
        const token = generateToken();
        const expiresAt = Date.now() + 24 * 60 * 60 * 1000;

        validTokens.set(token, { expiresAt });

        return res.json({
            token,
            expiresIn: 24 * 60 * 60
        });
    }

    res.status(401).json({ error: 'Email ou senha incorretos' });
});

app.post('/api/logout', verifyToken, (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    validTokens.delete(token);
    res.json({ success: true });
});

app.get('/api/validate-token', verifyToken, (req, res) => {
    res.json({ valid: true });
});

// ENDPOINTS DE USUÁRIOS

app.get('/api/users', verifyToken, (req, res) => {
    res.json({ users });
});

app.get('/api/usersfarm', verifyToken, (req, res) => {
    res.json({ usersFarm });
});

const calculateExpiration = (duration) => {
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
};

app.post('/api/users/add', verifyToken, (req, res) => {
    const { username, duration } = req.body;

    if (!username || !username.trim()) {
        return res.status(400).json({ error: 'Username é obrigatório' });
    }

    if (users.find(u => u.username === username)) {
        return res.status(400).json({ error: 'Usuário já existe' });
    }

    const newUser = {
        username,
        duration,
        expiration: calculateExpiration(duration),
        addedAt: new Date().toISOString()
    };

    users.push(newUser);
    res.status(201).json({ success: true, user: newUser });
});

app.post('/api/usersfarm/add', verifyToken, (req, res) => {
    const { username, duration } = req.body;

    if (!username || !username.trim()) {
        return res.status(400).json({ error: 'Username é obrigatório' });
    }

    if (usersFarm.find(u => u.username === username)) {
        return res.status(400).json({ error: 'Usuário já existe' });
    }

    const newUser = {
        username,
        duration,
        expiration: calculateExpiration(duration),
        addedAt: new Date().toISOString()
    };

    usersFarm.push(newUser);
    res.status(201).json({ success: true, user: newUser });
});

app.delete('/api/users/:username', verifyToken, (req, res) => {
    const { username } = req.params;
    const initialLength = users.length;
    users = users.filter(u => u.username !== username);

    if (users.length < initialLength) {
        return res.json({ success: true });
    }

    res.status(404).json({ error: 'Usuário não encontrado' });
});

app.delete('/api/usersfarm/:username', verifyToken, (req, res) => {
    const { username } = req.params;
    const initialLength = usersFarm.length;
    usersFarm = usersFarm.filter(u => u.username !== username);

    if (usersFarm.length < initialLength) {
        return res.json({ success: true });
    }

    res.status(404).json({ error: 'Usuário não encontrado' });
});

app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        users: users.length,
        usersFarm: usersFarm.length
    });
});

module.exports = app;
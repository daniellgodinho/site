import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const SECRET_TOKEN = process.env.RAW_SECRET_TOKEN; // "LoadV5"
const ALLOWED_IP = '128.201.211.9';
const ROBLOX_USER_AGENT = 'RobloxGameCloud/1.0 (+http://www.roblox.com)';

export default async function handler(req, res) {
    const token = req.query.token || '';

    let clientIP = 'unknown';
    const forwarded = req.headers['x-forwarded-for'];
    if (forwarded) {
        clientIP = Array.isArray(forwarded) ? forwarded[0] : forwarded.split(',')[0].trim();
    } else {
        clientIP = req.headers['x-real-ip'] || req.headers['x-vercel-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
    }

    const userAgent = req.headers['user-agent'] || '';

    const isAllowedIP = clientIP === ALLOWED_IP;
    const isRoblox = userAgent === ROBLOX_USER_AGENT;
    const isValidToken = token === SECRET_TOKEN;

    if (!isAllowedIP && !(isRoblox && isValidToken)) {
        return res.status(403).send('Acesso negado');
    }

    try {
        const { data: lists, error } = await supabase.from('user_lists').select('users_farm');

        if (error) throw error;

        const activeUsernames = new Set();

        lists.forEach(list => {
            if (list.users_farm) {
                list.users_farm.split(',').forEach(entry => {
                    const parts = entry.trim().split('|');
                    const username = parts[0]?.trim();
                    const expiration = parts[2]?.trim();

                    if (username && (!expiration || new Date(expiration) > new Date())) {
                        activeUsernames.add(username);
                    }
                });
            }
        });

        const text = Array.from(activeUsernames).sort().join('\n');

        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.setHeader('Cache-Control', 'no-cache');
        return res.status(200).send(text);
    } catch (error) {
        console.error('Erro usermenu:', error);
        return res.status(500).send('-- Erro interno');
    }
}
// api/raw/[type].js

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const ALLOWED_IP = '128.201.211.9';
const ROBLOX_USER_AGENT = 'RobloxGameCloud/1.0 (+http://www.roblox.com)';

export default async function handler(req, res) {
    // === RESTRIÇÃO POR IP OU USER-AGENT ROBLOX ===
    let clientIP = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.headers['x-vercel-forwarded-for'] || 'unknown';
    if (typeof clientIP === 'string') {
        clientIP = clientIP.split(',')[0].trim();
    }

    const userAgent = req.headers['user-agent'] || '';

    if (clientIP !== ALLOWED_IP && userAgent !== ROBLOX_USER_AGENT) {
        res.setHeader('Content-Type', 'text/plain');
        return res.status(403).send('Acesso negado');
    }
    // =========================

    const { type } = req.query;

    try {
        if (type === 'userdn' || type === 'usersfarm') {
            const table = type === 'userdn' ? 'users' : 'users_farm';
            const { data } = await supabase.from('user_lists').select(table);
            let allUsers = [];
            data.forEach(list => {
                const parsed = list[table] ? list[table].split(',').map(s => s.split('|')[0].trim()) : [];
                allUsers = [...allUsers, ...parsed];
            });
            res.status(200).send(allUsers.join('\n'));
        } else if (['dnmenu', 'dnfarm', 'dnsoftwares'].includes(type)) {
            const { data } = await supabase.from('scripts').select('code').eq('name', type).single();
            res.status(200).send(data?.code || '');
        } else {
            res.status(404).send('Not found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro interno');
    }
}
// api/raw/[slug].js

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Adicione essa no Vercel (service_role key, NUNCA a anon!)

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// CONFIGURAÇÕES DE SEGURANÇA
const ALLOWED_IP = '128.201.211.100';
const ROBLOX_USER_AGENT = 'RobloxGameCloud/1.0 (+http://www.roblox.com)'; // Confirmado como atual em 2026
const SECRET_TOKEN = process.env.RAW_SECRET_TOKEN; // "LoadV5" no seu caso

export default async function handler(req, res) {
    const { slug } = req.query;
    const token = req.query.token || '';

    // === VERIFICAÇÕES DE SEGURANÇA ===
    let clientIP = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.headers['x-vercel-forwarded-for'] || 'unknown';
    if (typeof clientIP === 'string') {
        clientIP = clientIP.split(',')[0].trim();
    }

    const userAgent = req.headers['user-agent'] || '';

    const isAllowedIP = clientIP === ALLOWED_IP;
    const isRoblox = userAgent === ROBLOX_USER_AGENT;
    const isValidToken = token === SECRET_TOKEN;

    // Permite: Seu IP OU (Roblox + token correto)
    if (!isAllowedIP && !(isRoblox && isValidToken)) {
        res.setHeader('Content-Type', 'text/plain');
        return res.status(403).send('Acesso negado');
    }
    // ==================================

    try {
        if (['dnmenu', 'dnfarm', 'dnsoftwares'].includes(slug)) {
            const { data, error } = await supabase
                .from('scripts')
                .select('code')
                .eq('name', slug)
                .single();

            if (error) throw error;

            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            res.setHeader('Cache-Control', 'no-cache');
            return res.status(200).send(data?.code || '');
        }

        if (slug === 'usermenu' || slug === 'userfarm') {
            const field = slug === 'usermenu' ? 'users' : 'users_farm';
            const { data: lists, error } = await supabase
                .from('user_lists')
                .select(field);

            if (error) throw error;

            const usernames = new Set();
            lists.forEach(list => {
                if (list[field]) {
                    list[field].split(',').forEach(entry => {
                        const [username] = entry.split('|');
                        if (username) usernames.add(username.trim());
                    });
                }
            });

            const text = Array.from(usernames).join('\n');
            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            res.setHeader('Cache-Control', 'no-cache');
            return res.status(200).send(text);
        }

        return res.status(404).send('Not found');

    } catch (error) {
        console.error('Erro no raw:', error);
        return res.status(500).send('Erro interno');
    }
}
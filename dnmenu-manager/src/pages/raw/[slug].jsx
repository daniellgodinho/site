// api/raw/[slug].js

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// CONFIGURAÇÕES DE SEGURANÇA
const ALLOWED_IP = '128.201.211.100';
const ROBLOX_USER_AGENT = 'RobloxGameCloud/1.0 (+http://www.roblox.com)';
const SECRET_TOKEN = process.env.RAW_SECRET_TOKEN; // "LoadV5"

export default async function handler(req, res) {
    // Pega o slug de duas formas possíveis (por causa das rotas fixas no vercel.json)
    const slug = req.query.slug || Object.keys(req.query)[0] || null;

    if (!slug) {
        return res.status(400).send('Slug inválido');
    }

    const token = req.query.token || '';

    // === VERIFICAÇÃO DE SEGURANÇA ===
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

    // Permite: seu IP OU (Roblox com token correto)
    if (!isAllowedIP && !(isRoblox && isValidToken)) {
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        return res.status(403).send('Acesso negado');
    }
    // ==================================

    try {
        // Scripts individuais
        if (['dnmenu', 'dnfarm', 'dnsoftwares'].includes(slug)) {
            const { data, error } = await supabase
                .from('scripts')
                .select('code')
                .eq('name', slug)
                .single();

            if (error || !data) {
                return res.status(404).send('-- Script não encontrado');
            }

            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            res.setHeader('Cache-Control', 'no-cache');
            return res.status(200).send(data.code || '');
        }

        // Listas de usuários
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
                        const username = entry.split('|')[0]?.trim();
                        if (username) usernames.add(username);
                    });
                }
            });

            const text = Array.from(usernames).join('\n');
            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            res.setHeader('Cache-Control', 'no-cache');
            return res.status(200).send(text);
        }

        // Slug não reconhecido
        return res.status(404).send('Not found');

    } catch (error) {
        console.error('Erro no raw/[slug]:', error);
        return res.status(500).send('-- Erro interno');
    }
}
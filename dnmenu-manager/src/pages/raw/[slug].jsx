// api/raw/[slug].js (atualizado para verificação de ban + logs)

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// CONFIGURAÇÕES DE SEGURANÇA
const ALLOWED_IP = '128.201.211.100';
const ROBLOX_USER_AGENT = 'RobloxGameCloud/1.0 (+http://www.roblox.com)';
const SECRET_TOKEN = process.env.RAW_SECRET_TOKEN; // "LoadV5"

export default async function handler(req, res) {
    // Pega o slug de duas formas possíveis
    const slug = req.query.slug || Object.keys(req.query)[0] || null;

    if (!slug) {
        return res.status(400).send('Slug inválido');
    }

    const token = req.query.token || '';
    const robloxNick = req.query.nick || '';
    const hwid = req.query.hwid || '';

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

    if (!isAllowedIP && !(isRoblox && isValidToken)) {
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        return res.status(403).send('Acesso negado');
    }
    // ==================================

    try {
        // Logar o acesso
        const logData = {
            ip: clientIP,
            user_agent: userAgent,
            script_type: slug,
            roblox_nick: robloxNick || null,
            hwid: hwid || null,
            created_at: new Date().toISOString(),
            status: 'access_attempt'
        };

        await supabase.from('access_logs').insert(logData);

        // Verificar ban
        if (robloxNick || hwid) {
            const { data: banData, error: banError } = await supabase
                .from('bans')
                .select('*')
                .or(`roblox_nick.eq.${robloxNick},hwid.eq.${hwid}`);

            if (banError) throw banError;

            if (banData.length > 0) {
                // Atualizar log para banido
                await supabase.from('access_logs').update({ status: 'banned' }).eq('id', logData.id); // Assumindo que insert retorna id, ajusta se necessário

                return res.status(403).send('-- Acesso banido');
            }
        }

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

            // Log sucesso
            await supabase.from('access_logs').update({ status: 'success' }).eq('id', logData.id);

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
                    list[field].split(',').forEach(s => {
                        const [username, duration = 'lifetime', expiration = ''] = s.split('|');
                        if (!expiration || new Date(expiration) > new Date()) {
                            usernames.add(username.trim());
                        }
                    });
                }
            });

            const text = Array.from(usernames).join('\n');

            // Log sucesso
            await supabase.from('access_logs').update({ status: 'success' }).eq('id', logData.id);

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
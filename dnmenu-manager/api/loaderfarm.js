// api/loaderfarm.js

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const SECRET_TOKEN = process.env.RAW_SECRET_TOKEN; // LoadV5
const BASE_URL = 'https://dnsoftwares.vercel.app';

export default async function handler(req, res) {
    // Mesma verificação de segurança
    let clientIP = 'unknown';
    const forwarded = req.headers['x-forwarded-for'];
    if (forwarded) {
        clientIP = Array.isArray(forwarded) ? forwarded[0] : forwarded.split(',')[0].trim();
    }

    const userAgent = req.headers['user-agent'] || '';

    const isAllowedIP = clientIP === '128.201.211.100';
    const isRoblox = userAgent === 'RobloxGameCloud/1.0 (+http://www.roblox.com)';

    if (!isAllowedIP && !isRoblox) {
        return res.status(403).send('Acesso negado');
    }

    const loaderCode = `-- DN Softwares - Loader Farm (Apenas DN Farm)
local token = "${SECRET_TOKEN}"
local base = "${BASE_URL}"

local function load(script)
    return loadstring(game:HttpGet(base .. "/" .. script .. "?token=" .. token))()
end

-- Carrega apenas o DN Farm
load("dnfarm")

print("DN Farm carregado com sucesso!")
`;

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache');
    return res.status(200).send(loaderCode);
}
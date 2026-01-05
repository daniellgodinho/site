// api/loader.js

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const SECRET_TOKEN = process.env.RAW_SECRET_TOKEN;
const BASE_URL = 'https://dnsoftwares.vercel.app/raw';

export default async function handler(req, res) {
    // Mesma checagem de IP + User-Agent (sem token aqui)
    let clientIP = req.headers['x-forwarded-for']?.split(',')[0].trim() || 'unknown';
    const userAgent = req.headers['user-agent'] || '';

    if (clientIP !== '128.201.211.100' && userAgent !== 'RobloxGameCloud/1.0 (+http://www.roblox.com)') {
        return res.status(403).send('Acesso negado');
    }

    const loaderCode = `-- Loader Seguro DN Softwares V5
local token = "${SECRET_TOKEN}"
local base = "${BASE_URL}"

local function load(script)
    return loadstring(game:HttpGet(base .. "/" .. script .. "?token=" .. token))()
end

-- Carregue o que precisar
load("dnmenu") -- ou dnfarm, dnsoftwares, etc.

-- Seu código principal aqui (ofuscado)
`;

    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Cache-Control', 'no-cache');
    return res.status(200).send(loaderCode);
}
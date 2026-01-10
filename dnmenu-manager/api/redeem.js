const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');
const { getRobloxUserInfo } = require('../lib/roblox'); // Assuma que criaremos isso depois

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const discordClientId = process.env.DISCORD_CLIENT_ID;
const discordClientSecret = process.env.DISCORD_CLIENT_SECRET;
const discordGuildId = process.env.DISCORD_GUILD_ID;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function handler(req, res) {
    const { method } = req;

    if (method === 'GET') {
        // Validação de link: /api/redeem/validate?reseller=xxx&tempo=yyy&random=zzz
        if (req.query.action === 'validate') {
            const { reseller, tempo, random } = req.query;
            const { data: linkData, error } = await supabase
                .from('links')
                .select('*')
                .eq('random_id', random)
                .single();

            if (error || !linkData) {
                return res.status(404).json({ error: 'Link inválido' });
            }

            if (linkData.reseller !== reseller || linkData.tempo !== tempo) {
                // Detectar modificação: Blacklist não é server-side aqui, mas logar ou retornar flag para client-side
                return res.status(403).json({ error: 'Modificação detectada', blacklist: true });
            }

            if (linkData.uses_atual >= linkData.max_uses) {
                return res.status(403).json({ error: 'Link expirado (usos máximos atingidos)' });
            }

            return res.status(200).json(linkData);
        }

        // Discord callback: /api/redeem/discord-callback?code=xxx
        if (req.query.action === 'discord-callback') {
            const { code } = req.query;
            try {
                const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({
                        client_id: discordClientId,
                        client_secret: discordClientSecret,
                        grant_type: 'authorization_code',
                        code,
                        redirect_uri: `${req.headers.origin}/redeem`, // Ajuste para sua rota
                    }),
                });
                const { access_token } = await tokenResponse.json();

                const userResponse = await fetch('https://discord.com/api/users/@me', {
                    headers: { Authorization: `Bearer ${access_token}` },
                });
                const user = await userResponse.json();

                const guildsResponse = await fetch('https://discord.com/api/users/@me/guilds', {
                    headers: { Authorization: `Bearer ${access_token}` },
                });
                const guilds = await guildsResponse.json();
                const guild = guilds.find(g => g.id === discordGuildId);

                if (!guild) {
                    return res.status(403).json({ error: 'Não está no servidor' });
                }

                const memberResponse = await fetch(`https://discord.com/api/guilds/${discordGuildId}/members/${user.id}`, {
                    headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` }, // Assuma que você tem um bot token no .env
                });
                const member = await memberResponse.json();
                const hasRole = member.roles.includes('1455001160539967691');

                // Checar se já usou link similar: Assumindo checagem global por user em qualquer link
                const { data: existingLicenses } = await supabase
                    .from('licencas')
                    .select('id')
                    .eq('discord_user_id', user.id);

                if (existingLicenses.length > 0 && hasRole) {
                    return res.status(403).json({ error: 'Já resgatou uma licença antes' });
                }

                if (!hasRole) {
                    return res.status(403).json({ error: 'Sem role necessário' });
                }

                return res.status(200).json({ user, access_token });
            } catch (error) {
                return res.status(500).json({ error: 'Erro no auth Discord' });
            }
        }
    }

    if (method === 'POST') {
        // Resgate final: /api/redeem com body { random, roblox_nick }
        const { random, roblox_nick } = req.body;
        try {
            const robloxData = await getRobloxUserInfo(roblox_nick);
            if (!robloxData) {
                return res.status(404).json({ error: 'Usuário Roblox não encontrado' });
            }

            const { data: linkData, error } = await supabase
                .from('links')
                .select('*')
                .eq('random_id', random)
                .single();

            if (error || linkData.uses_atual >= linkData.max_uses) {
                return res.status(403).json({ error: 'Link inválido ou expirado' });
            }

            // Calcular expiração
            const expiration = new Date();
            expiration.setDate(expiration.getDate() + parseInt(linkData.tempo.replace(/\D/g, ''))); // Assuma tempo como '30dias' → 30

            const { error: insertError } = await supabase
                .from('licencas')
                .insert({
                    discord_user_id: req.user.id, // Assuma user do middleware auth
                    roblox_nick,
                    roblox_id: robloxData.id,
                    roblox_data: robloxData,
                    expiration,
                    reseller: linkData.reseller,
                    link_id: random,
                });

            if (insertError) {
                return res.status(500).json({ error: 'Erro ao salvar licença' });
            }

            await supabase
                .from('links')
                .update({ uses_atual: linkData.uses_atual + 1 })
                .eq('random_id', random);

            return res.status(200).json({ success: true });
        } catch (error) {
            return res.status(500).json({ error: 'Erro no resgate' });
        }
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${method} Not Allowed`);
}

module.exports = handler;
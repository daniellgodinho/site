const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function handler(req, res) {
    if (req.method === 'POST') {
        const { reseller, tempo, max_uses } = req.body;
        const random_id = crypto.randomBytes(10).toString('hex'); // 20 caracteres hex

        const { error } = await supabase
            .from('links')
            .insert({
                reseller,
                tempo,
                max_uses: max_uses || 1,
                uses_atual: 0,
                random_id,
            });

        if (error) {
            return res.status(500).json({ error: 'Erro ao gerar link' });
        }

        const link = `https://dnsoftwares/${reseller}/${tempo}/${random_id}`;
        return res.status(200).json({ link });
    }

    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
}

module.exports = handler;
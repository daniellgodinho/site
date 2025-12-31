import { supabase } from '../../src/supabase';  // Ajuste path se preciso

export default async function handler(req, res) {
    const { key } = req.query;  // Chave via ?key=xxx
    if (key !== process.env.API_KEY) {  // Guarde API_KEY no Vercel env vars
        return res.status(403).send('Acesso negado');
    }

    // Armazene o código no Supabase (tabela 'code' ou storage), ou hardcoded/file.
    // Ex: Puxe de uma tabela 'scripts' (crie se preciso: CREATE TABLE scripts (code TEXT);)
    const { data, error } = await supabase.from('scripts').select('code').single();
    if (error) return res.status(500).send('Erro no DB');

    res.setHeader('Content-Type', 'text/plain');
    res.send(data.code);  // Ou fs.readFileSync se preferir file
}
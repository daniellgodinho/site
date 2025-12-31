import { supabase } from '../../src/supabase';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Método não permitido');

    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_KEY}`) {  // Chave admin no env
        return res.status(403).send('Não autorizado');
    }

    const { username, status } = req.body;
    if (!username) return res.status(400).send('Username obrigatório');

    const { error } = await supabase.from('users').insert({ username, status });
    if (error) return res.status(500).send('Erro ao adicionar');

    res.status(200).send('User adicionado');
}
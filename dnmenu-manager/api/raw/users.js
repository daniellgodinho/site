import { supabase } from '../../src/supabase';

export default async function handler(req, res) {
    const { data, error } = await supabase.from('users').select('username, status, updated_at');
    if (error) return res.status(500).send('Erro no DB');

    res.setHeader('Content-Type', 'application/json');  // Ou 'text/plain' se quiser stringified manual
    res.send(data);  // Retorna array de objetos: [{username: 'user1', status: 'ativo'}, ...]
}
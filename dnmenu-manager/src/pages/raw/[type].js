// api/raw/[type].js - Coloque isso em pages/api/raw/[type].js para Next.js (Vercel)
import { supabase } from '../../../supabase';

export default async function handler(req, res) {
    const { type } = req.query;

    if (type === 'userdn' || type === 'usersfarm') {
        // Fetch all users or usersfarm from all resellers
        const table = type === 'userdn' ? 'users' : 'users_farm';
        const { data } = await supabase.from('user_lists').select(table);
        let allUsers = [];
        data.forEach(list => {
            const parsed = list[table] ? list[table].split(',').map(s => s.split('|')[0]) : [];
            allUsers = [...allUsers, ...parsed];
        });
        res.status(200).send(allUsers.join('\n'));
    } else {
        // For scripts: dnmenu, dnfarm
        const { data } = await supabase.from('scripts').select('code').eq('name', type).single();
        res.status(200).send(data?.code || '');
    }
}
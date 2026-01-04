// pages/raw/[slug].js - Next.js dynamic page for /raw/slug, server-side rendered as text/plain. Public access, no auth required for loadstring compatibility. Automation for usermenu/userfarm aggregates users.

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

export async function getServerSideProps({ params, res }) {
    const { slug } = params

    try {
        if (['dnmenu', 'dnfarm', 'dnsoftwares'].includes(slug)) {
            const { data, error } = await supabase.from('scripts').select('code').eq('name', slug).single()
            if (error) throw error
            if (data) {
                res.setHeader('Content-Type', 'text/plain; charset=utf-8')
                res.statusCode = 200
                res.end(data.code || '')
                return { props: {} }
            } else {
                res.statusCode = 404
                res.end('Script not found')
                return { props: {} }
            }
        } else if (slug === 'usermenu' || slug === 'userfarm') {
            const field = slug === 'usermenu' ? 'users' : 'users_farm'
            const { data: lists, error } = await supabase.from('user_lists').select(field)
            if (error) throw error

            const usernames = new Set()
            lists.forEach(list => {
                if (list[field]) {
                    list[field].split(',').forEach(s => {
                        const [username] = s.split('|')
                        if (username) usernames.add(username)
                    })
                }
            })

            const text = Array.from(usernames).join('\n')
            res.setHeader('Content-Type', 'text/plain; charset=utf-8')
            res.statusCode = 200
            res.end(text)
            return { props: {} }
        } else {
            res.statusCode = 404
            res.end('Not found')
            return { props: {} }
        }
    } catch (error) {
        console.error(error)
        res.statusCode = 500
        res.end('Internal server error')
        return { props: {} }
    }
}

export default function Raw() {
    return null // Server-side only
}
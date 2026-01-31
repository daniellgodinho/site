import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl) {
    throw new Error(
        "Supabase URL is required. Set NEXT_PUBLIC_SUPABASE_URL (for client) or SUPABASE_URL (for server) in environment variables."
    );
}

if (!supabaseAnonKey) {
    throw new Error(
        "Supabase anon key is required. Set NEXT_PUBLIC_SUPABASE_ANON_KEY (for client) or SUPABASE_ANON_KEY (for server) in environment variables."
    );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

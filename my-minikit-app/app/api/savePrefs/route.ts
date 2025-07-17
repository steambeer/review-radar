import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
);

// POST /api/savePrefs
export async function POST(req: NextRequest) {
    try {
        const { fid, hubs, editors, keywords } = await req.json();

        // Simple validation
        if (!fid) {
            return NextResponse.json({ error: 'Missing fid' }, { status: 400 });
        }

        // Upsert = insert or update if row already exists
        const { error } = await supabase
            .from('user_prefs')
            .upsert({ fid, hubs, editors, keywords });

        if (error) {
            throw error;
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

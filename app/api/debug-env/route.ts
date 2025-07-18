import { NextResponse } from 'next/server';

export const runtime = 'nodejs';          // ensure standard lambda
export function GET() {
    return NextResponse.json({
        SUPABASE_URL: process.env.SUPABASE_URL ?? 'undefined',
        SUPABASE_KEY: process.env.SUPABASE_KEY ? 'present' : 'undefined',
        NODE_ENV: process.env.NODE_ENV,
    });
}

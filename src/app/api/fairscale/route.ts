import { getFairScore } from '@/lib/fairscale';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const wallet = searchParams.get('wallet');

    if (!wallet) {
        return NextResponse.json({ error: 'Wallet address required' }, { status: 400 });
    }

    try {
        const data = await getFairScore(wallet);
        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Fairscale API error:', error);
        return NextResponse.json({ error: error.message || 'Failed to fetch score' }, { status: 500 });
    }
}

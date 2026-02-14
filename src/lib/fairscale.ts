
export interface Badge {
    id: string;
    label: string;
    description: string;
    tier: string;
}

export interface FairScoreResponse {
    wallet: string;
    fairscore_base: number;
    social_score: number;
    fairscore: number;
    tier: string;
    badges: Badge[];
    actions: any[];
    timestamp: string;
    features: {
        lst_percentile_score: number;
        major_percentile_score: number;
        native_sol_percentile: number;
        tx_count: number;
        active_days: number;
        wallet_age_days: number;
        [key: string]: any;
    };
}

const BASE_URL = process.env.NEXT_PUBLIC_FAIRSCALE_API_URL || 'https://api.fairscale.xyz';
const API_KEY = process.env.FAIRSCALE_API_KEY;

export const getMockFairScore = (wallet: string): FairScoreResponse => {
    return {
        wallet,
        fairscore_base: 58.1,
        social_score: 36.0,
        fairscore: 94.1,
        tier: 'platinum',
        badges: [
            {
                id: 'diamond_hands',
                label: 'Diamond Hands',
                description: 'Long-term holder with conviction',
                tier: 'platinum',
            },
            {
                id: 'whale',
                label: 'Whale',
                description: 'High volume trader',
                tier: 'gold',
            }
        ],
        actions: [],
        timestamp: new Date().toISOString(),
        features: {
            lst_percentile_score: 0.75,
            major_percentile_score: 0.82,
            native_sol_percentile: 0.68,
            tx_count: 1250,
            active_days: 180,
            wallet_age_days: 365,
        },
    };
};

export const getFairScore = async (wallet: string): Promise<FairScoreResponse> => {
    if (!API_KEY || API_KEY === 'mock-key-for-development') {
        console.warn('Using mock FairScale data');
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        return getMockFairScore(wallet);
    }

    const res = await fetch(`${BASE_URL}/score?wallet=${wallet}`, {
        headers: {
            'fairkey': API_KEY,
        },
        next: { revalidate: 60 }, // Cache for 60 seconds
    });

    if (!res.ok) {
        if (res.status === 401) {
            throw new Error('Invalid FairScale API Key');
        }
        throw new Error(`FairScale API error: ${res.status} ${res.statusText}`);
    }

    return res.json();
};

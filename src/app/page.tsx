'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useEffect, useState } from 'react';
import { FairScoreResponse } from '@/lib/fairscale';
import { Loader2, Shieldcheck, Lock, Unlock, Zap } from 'lucide-react';
import { clsx } from 'clsx';
import { SolanaProvider } from '@/components/SolanaProvider';

function DashboardContent() {
  const { publicKey, connected } = useWallet();
  const [scoreData, setScoreData] = useState<FairScoreResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (connected && publicKey) {
      fetchScore(publicKey.toString());
    } else {
      setScoreData(null);
      setError(null);
    }
  }, [connected, publicKey]);

  const fetchScore = async (wallet: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/fairscale?wallet=${wallet}`);
      if (!res.ok) {
        throw new Error('Failed to fetch reputation score');
      }
      const data = await res.json();
      setScoreData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white selection:bg-purple-500/30">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Shieldcheck className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">FairGate</span>
          </div>
          <div className="flex items-center gap-4">
            <WalletMultiButton className="!bg-white/10 !hover:bg-white/20 !transition-all !rounded-full !px-6 !h-10 !text-sm !font-medium" />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 px-4">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[500px] bg-purple-500/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-b from-white via-white to-gray-400 bg-clip-text text-transparent">
            Reputation is the<br />New Currency
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            FairGate uses on-chain reputation to unlock exclusive utilities. Connect your wallet to verify your FairScore and access the portal.
          </p>
        </div>
      </div>

      {/* Dashboard Section */}
      <div className="container mx-auto px-4 pb-20">
        {!connected ? (
          <div className="max-w-md mx-auto text-center border border-white/10 rounded-2xl p-8 bg-white/5 backdrop-blur-sm hover:border-purple-500/30 transition-colors">
            <Lock className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Access Restricted</h3>
            <p className="text-gray-400 mb-6">Connect your Solana wallet to view your reputation score and unlock features.</p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Score Card */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-1 min-h-[300px] rounded-3xl bg-gradient-to-b from-white/10 to-transparent">
                <div className="bg-black/90 h-full rounded-[20px] p-8 flex flex-col items-center justify-center relative overflow-hidden group">
                  {loading ? (
                    <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                  ) : error ? (
                    <div className="text-red-400 text-center">
                      <p>{error}</p>
                      <button onClick={() => publicKey && fetchScore(publicKey.toString())} className="mt-2 text-sm underline">Retry</button>
                    </div>
                  ) : scoreData ? (
                    <>
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50" />
                      <div className="text-sm uppercase tracking-widest text-gray-500 mb-2">FairScore</div>
                      <div className="text-8xl font-bold bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
                        {scoreData.fairscore}
                      </div>
                      <div className={clsx(
                        "px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider border mb-6",
                        scoreData.tier === 'platinum' ? "border-blue-400/30 bg-blue-400/10 text-blue-400" :
                          scoreData.tier === 'gold' ? "border-yellow-400/30 bg-yellow-400/10 text-yellow-400" :
                            "border-gray-700 bg-gray-800 text-gray-300"
                      )}>
                        {scoreData.tier} Tier
                      </div>

                      <div className="grid grid-cols-2 gap-8 w-full border-t border-white/10 pt-6">
                        <div className="text-center">
                          <div className="text-sm text-gray-500 mb-1">Social Score</div>
                          <div className="text-xl font-semibold">{scoreData.social_score}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-500 mb-1">On-Chain Score</div>
                          <div className="text-xl font-semibold">{scoreData.fairscore_base}</div>
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>
              </div>

              {/* Badges & Unlocks */}
              <div className="flex flex-col gap-4">
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/[0.07] transition-colors">
                  <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                    <Unlock className="w-4 h-4 text-purple-400" />
                    Access Status
                  </h3>
                  {scoreData && scoreData.fairscore > 50 ? (
                    <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-2 opacity-20">
                        <Shieldcheck className="w-12 h-12" />
                      </div>
                      <div className="text-green-400 font-medium mb-1">VIP Access Granted</div>
                      <p className="text-sm text-gray-400">Your reputation unlocks premium features.</p>
                    </div>
                  ) : (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                      <div className="text-red-400 font-medium mb-1">Access Denied</div>
                      <p className="text-sm text-gray-400">You need a FairScore of 50+ to unlock this area.</p>
                    </div>
                  )}
                </div>

                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex-1 hover:bg-white/[0.07] transition-colors">
                  <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    Badges Earned
                  </h3>
                  {scoreData?.badges && scoreData.badges.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {scoreData.badges.map((badge, idx) => (
                        <div key={idx} className="group relative">
                          <span className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-xs transition-colors cursor-help block">
                            {badge.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No badges earned yet.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <SolanaProvider>
      <DashboardContent />
    </SolanaProvider>
  );
}

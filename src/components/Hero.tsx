import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Bitcoin, ArrowRight, Cpu, Zap, Shield, Globe, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const CG_TICKER_IDS = [
  { id: "bitcoin", symbol: "BTC" },
  { id: "ethereum", symbol: "ETH" },
  { id: "binancecoin", symbol: "BNB" },
  { id: "solana", symbol: "SOL" },
  { id: "cardano", symbol: "ADA" },
] as const;

const FALLBACK_TICKER: { symbol: string; price: string; change: string }[] = [
  { symbol: "BTC", price: "—", change: "—" },
  { symbol: "ETH", price: "—", change: "—" },
  { symbol: "BNB", price: "—", change: "—" },
  { symbol: "SOL", price: "—", change: "—" },
  { symbol: "ADA", price: "—", change: "—" },
  { symbol: "BTC", price: "—", change: "—" },
  { symbol: "ETH", price: "—", change: "—" },
  { symbol: "BNB", price: "—", change: "—" },
  { symbol: "SOL", price: "—", change: "—" },
  { symbol: "ADA", price: "—", change: "—" },
];

const BAR_HEIGHTS = [35, 58, 42, 75, 50, 88, 65, 80, 55, 92, 70, 85];

function formatUsdPrice(n: number): string {
  if (!Number.isFinite(n)) return "—";
  if (n >= 1000)
    return `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (n >= 1)
    return `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  return `$${n.toFixed(4)}`;
}

const FEATURES = [
  { icon: Zap, text: "Daily Payouts" },
  { icon: Shield, text: "99.9% Uptime" },
  { icon: Shield, text: "Bank-Grade Security" },
  { icon: Globe, text: "150+ Countries" },
];

const STATS = [
  { value: "$2.4M+", label: "Total Paid Out" },
  { value: "50K+", label: "Active Miners" },
  { value: "250+ BTC", label: "Mined To Date" },
];

export const Hero = () => {
  const [tickerItems, setTickerItems] = useState(FALLBACK_TICKER);
  const [hashRate, setHashRate] = useState(142.5);
  const [earnings, setEarnings] = useState(0.00142);

  const fetchTicker = useCallback(async () => {
    try {
      const url =
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,binancecoin,solana,cardano&vs_currencies=usd&include_24hr_change=true";
      const res = await fetch(url);
      if (!res.ok) return;
      const data = (await res.json()) as Record<
        string,
        { usd?: number; usd_24h_change?: number | null }
      >;
      const built = CG_TICKER_IDS.map(({ id, symbol }) => {
        const d = data[id];
        if (!d || typeof d.usd !== "number") return { symbol, price: "—", change: "—" };
        const ch = d.usd_24h_change;
        const pct = typeof ch === "number" && Number.isFinite(ch) ? ch : 0;
        const sign = pct >= 0 ? "+" : "";
        return { symbol, price: formatUsdPrice(d.usd), change: `${sign}${pct.toFixed(2)}%` };
      });
      setTickerItems([...built, ...built]);
    } catch {
      /* keep last values */
    }
  }, []);

  useEffect(() => {
    void fetchTicker();
    const tickId = window.setInterval(() => void fetchTicker(), 60_000);
    return () => window.clearInterval(tickId);
  }, [fetchTicker]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setHashRate((p) => +Math.max(100, Math.min(200, p + (Math.random() - 0.5) * 3)).toFixed(1));
      setEarnings((p) => +(p + 0.000008).toFixed(6));
    }, 2500);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-[#040a0f]">
      {/* Circuit dot background */}
      <div className="absolute inset-0 circuit-bg pointer-events-none" />

      {/* Diagonal stripe overlay */}
      <div className="absolute inset-0 diagonal-lines pointer-events-none" />

      {/* Glow orbs */}
      <div
        className="orb w-[700px] h-[700px] top-[-250px] left-[-300px]"
        style={{ background: "radial-gradient(circle, rgba(0,229,255,0.07) 0%, transparent 70%)" }}
      />
      <div
        className="orb w-[600px] h-[600px] bottom-[-150px] right-[-200px]"
        style={{ background: "radial-gradient(circle, rgba(0,200,83,0.06) 0%, transparent 70%)" }}
      />
      <div
        className="orb w-[400px] h-[400px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ background: "radial-gradient(circle, rgba(0,229,255,0.03) 0%, transparent 70%)" }}
      />

      {/* Ticker bar */}
      <div className="relative z-10 w-full bg-[#060d13]/80 border-b border-teal-500/10 mt-16 overflow-hidden">
        <div className="flex animate-ticker whitespace-nowrap py-2.5">
          {tickerItems.map((item, i) => (
            <span key={i} className="inline-flex items-center gap-2 mx-8 text-sm">
              <Bitcoin className="w-3.5 h-3.5 text-teal-400" />
              <span className="text-white/80 font-semibold">{item.symbol}</span>
              <span className="text-white/45">{item.price}</span>
              <span
                className={
                  item.change === "—"
                    ? "text-white/25"
                    : item.change.startsWith("+")
                      ? "text-emerald-400"
                      : "text-red-400"
                }
              >
                {item.change}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Two-column hero content */}
      <div className="relative z-10 flex-1 flex items-center px-4 py-12">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-[55%_45%] gap-10 xl:gap-16 items-center">

            {/* ── LEFT COLUMN: Text content ── */}
            <div className="space-y-7 animate-in fade-in slide-in-from-bottom-6 duration-700">

              {/* Live badge */}
              <div className="inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 text-sm font-medium border border-teal-500/25 bg-teal-500/8 text-teal-300">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                Live Mining Active — 50,000+ Miners Worldwide
              </div>

              {/* Headline */}
              <h1 className="text-5xl md:text-7xl font-black leading-none tracking-tight">
                <span className="block text-white">Mine Bitcoin</span>
                <span className="block text-gradient-teal leading-tight pb-1">From the Cloud</span>
              </h1>

              {/* Subheadline */}
              <p className="text-lg text-white/50 max-w-xl leading-relaxed">
                BtcNMiningBase gives you instant access to professional-grade mining infrastructure —
                no hardware, no setup, just earnings.
              </p>

              {/* Feature pills */}
              <div className="flex flex-wrap gap-2.5">
                {FEATURES.map((feat) => (
                  <span
                    key={feat.text}
                    className="flex items-center gap-1.5 text-xs text-teal-300/80 bg-teal-500/8 border border-teal-500/20 rounded-full px-3 py-1.5"
                  >
                    <feat.icon className="w-3 h-3 text-teal-400" />
                    {feat.text}
                  </span>
                ))}
              </div>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/login">
                  <Button
                    size="lg"
                    className="text-base px-8 py-6 font-bold text-black rounded-xl gap-2 border-0 hover:scale-105 transition-all duration-300 hover:shadow-lg"
                    style={{ background: "linear-gradient(135deg, #00e5ff 0%, #00c853 100%)" }}
                  >
                    Start Mining Now
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-base px-8 py-6 border-teal-500/30 text-white/80 hover:bg-teal-500/5 hover:border-teal-500/50 transition-all duration-300 rounded-xl"
                  >
                    View Mining Plans
                  </Button>
                </Link>
              </div>

              {/* Stats row */}
              <div className="flex gap-8 pt-4 border-t border-white/5">
                {STATS.map((item) => (
                  <div key={item.label}>
                    <div className="text-xl font-black text-gradient-teal">{item.value}</div>
                    <div className="text-xs text-white/35 mt-0.5">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── RIGHT COLUMN: Live Mining Dashboard ── */}
            <div className="hidden lg:block animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
              <div className="relative">
                {/* Card glow */}
                <div
                  className="absolute -inset-6 rounded-3xl blur-3xl opacity-15 pointer-events-none"
                  style={{ background: "linear-gradient(135deg, #00e5ff 0%, #00c853 100%)" }}
                />

                <div className="relative bg-[#060d13] border border-teal-500/20 rounded-2xl p-6 space-y-5">

                  {/* Card header */}
                  <div className="flex items-center justify-between pb-4 border-b border-white/5">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{ background: "linear-gradient(135deg, #00e5ff 0%, #00c853 100%)" }}
                      >
                        <Cpu className="w-4 h-4 text-black" />
                      </div>
                      <span className="text-white font-bold text-sm">BtcNMiningBase</span>
                    </div>
                    <span className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2.5 py-1">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                      LIVE
                    </span>
                  </div>

                  {/* Hash rate meter */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-white/40">Hash Rate</span>
                      <span className="text-teal-300 font-mono font-semibold">{hashRate} TH/s</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{
                          width: `${Math.min(99, (hashRate / 200) * 100)}%`,
                          background: "linear-gradient(90deg, #00e5ff, #00c853)",
                        }}
                      />
                    </div>
                    <div className="text-xs text-white/25">Max capacity: 200 TH/s</div>
                  </div>

                  {/* Today's earnings */}
                  <div
                    className="rounded-xl p-4 border"
                    style={{
                      background: "rgba(0,229,255,0.04)",
                      borderColor: "rgba(0,229,255,0.12)",
                    }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-white/40">Today's Earnings</span>
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <div className="text-2xl font-black font-mono" style={{ color: "#00e5a0" }}>
                      +{earnings.toFixed(6)} BTC
                    </div>
                    <div className="text-xs text-emerald-400/60 mt-1">
                      ≈ ${(earnings * 65000).toFixed(2)} USD
                    </div>
                  </div>

                  {/* 24h chart */}
                  <div>
                    <div className="text-xs text-white/30 mb-3">24h Mining Activity</div>
                    <div className="flex items-end gap-1 h-14">
                      {BAR_HEIGHTS.map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-sm transition-all duration-700"
                          style={{
                            height: `${h}%`,
                            background:
                              i === BAR_HEIGHTS.length - 1
                                ? "linear-gradient(to top, #00e5ff, #00c853)"
                                : "rgba(0,229,255,0.18)",
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Worker status */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="w-2 h-2 rounded-full bg-emerald-400" />
                        ))}
                        <div className="w-2 h-2 rounded-full bg-white/15" />
                      </div>
                      <span className="text-xs text-white/35">5/6 Workers Active</span>
                    </div>
                    <span className="text-xs font-semibold" style={{ color: "#00e5ff" }}>
                      99.9% uptime
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="relative z-10 flex justify-center pb-8">
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs tracking-[0.2em] uppercase text-teal-400/30">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-teal-400/30 to-transparent" />
        </div>
      </div>
    </section>
  );
};

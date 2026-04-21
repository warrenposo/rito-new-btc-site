import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Bitcoin, Cloud, TrendingUp, ArrowRight, ChevronDown } from "lucide-react";
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

function formatUsdPrice(n: number): string {
  if (!Number.isFinite(n)) return "—";
  if (n >= 1000) {
    return `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  if (n >= 1) {
    return `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return `$${n.toFixed(4)}`;
}

export const Hero = () => {
  const [tickerItems, setTickerItems] = useState(FALLBACK_TICKER);

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
      const row = (id: string) => data[id];
      const built = CG_TICKER_IDS.map(({ id, symbol }) => {
        const d = row(id);
        if (!d || typeof d.usd !== "number") return { symbol, price: "—", change: "—" };
        const ch = d.usd_24h_change;
        const pct = typeof ch === "number" && Number.isFinite(ch) ? ch : 0;
        const sign = pct >= 0 ? "+" : "";
        return {
          symbol,
          price: formatUsdPrice(d.usd),
          change: `${sign}${pct.toFixed(2)}%`,
        };
      });
      setTickerItems([...built, ...built]);
    } catch {
      /* keep last successful values */
    }
  }, []);

  useEffect(() => {
    void fetchTicker();
    const id = window.setInterval(() => void fetchTicker(), 60_000);
    return () => window.clearInterval(id);
  }, [fetchTicker]);

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-[#050c18]">
      {/* Grid background */}
      <div className="absolute inset-0 hero-grid opacity-60" />

      {/* Ambient orbs */}
      <div className="orb w-[600px] h-[600px] bg-yellow-500/10 top-[-100px] left-[-200px]" />
      <div className="orb w-[500px] h-[500px] bg-blue-600/10 bottom-[-50px] right-[-150px]" />
      <div className="orb w-[300px] h-[300px] bg-yellow-400/8 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      {/* Floating Bitcoin icons */}
      <Bitcoin className="absolute top-32 left-[8%] w-16 h-16 text-yellow-500/15 animate-float" />
      <Bitcoin className="absolute top-48 right-[10%] w-24 h-24 text-yellow-500/10 animate-float-delayed" />
      <Bitcoin className="absolute bottom-32 left-[15%] w-20 h-20 text-yellow-400/10 animate-float-slow" />
      <Cloud className="absolute top-40 left-[35%] w-12 h-12 text-blue-400/15 animate-float-delayed" />
      <Cloud className="absolute bottom-40 right-[20%] w-16 h-16 text-blue-400/10 animate-float-slow" />

      {/* Spinning ring */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] border border-yellow-500/5 rounded-full animate-spin-slow pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-yellow-500/8 rounded-full animate-spin-slow pointer-events-none" style={{ animationDirection: "reverse", animationDuration: "15s" }} />

      {/* Live ticker */}
      <div className="relative z-10 w-full bg-white/5 border-b border-white/10 backdrop-blur-sm mt-16 overflow-hidden">
        <div className="flex animate-ticker whitespace-nowrap py-2">
          {tickerItems.map((item, i) => (
            <span key={i} className="inline-flex items-center gap-2 mx-8 text-sm">
              <Bitcoin className="w-3.5 h-3.5 text-yellow-400" />
              <span className="text-white/80 font-semibold">{item.symbol}</span>
              <span className="text-white/60">{item.price}</span>
              <span
                className={
                  item.change === "—"
                    ? "text-white/40"
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

      {/* Main hero content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-16">
        <div className="container mx-auto text-center max-w-5xl">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded-full px-4 py-1.5 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-yellow-400/90 text-sm font-medium">Live Mining Active — 50,000+ Miners Worldwide</span>
          </div>

          {/* Headline */}
          <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tight leading-none animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            <span className="block text-white">Mine Bitcoin</span>
            <span className="block text-gradient-gold py-2">From the Cloud</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-white/50 mb-4 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            BtcCloudBase gives you instant access to professional-grade mining infrastructure — 
            no hardware, no setup, just pure earnings.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            {["Daily Payouts", "99.9% Uptime", "Bank-Grade Security", "150+ Countries"].map((feat) => (
              <span key={feat} className="flex items-center gap-1.5 text-xs text-white/60 bg-white/5 border border-white/10 rounded-full px-3 py-1">
                <TrendingUp className="w-3 h-3 text-yellow-400" />
                {feat}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400">
            <Link to="/login">
              <Button
                size="lg"
                className="text-base px-8 py-6 bg-gradient-gold hover:shadow-glow transition-all duration-300 hover:scale-105 font-bold text-black gap-2 rounded-xl"
              >
                Start Mining Now
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button
                size="lg"
                variant="outline"
                className="text-base px-8 py-6 border-white/20 text-white/80 hover:bg-white/5 hover:border-yellow-500/40 transition-all duration-300 rounded-xl gap-2"
              >
                View Mining Plans
              </Button>
            </Link>
          </div>

          {/* Trust bar */}
          <div className="mt-16 flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-12 text-center animate-in fade-in duration-700 delay-500">
            {[
              { value: "$2.4M+", label: "Total Paid Out" },
              { value: "50K+", label: "Active Miners" },
              { value: "250+ BTC", label: "Mined To Date" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center">
                <span className="text-2xl font-bold text-gradient-gold">{item.value}</span>
                <span className="text-white/40 text-xs mt-0.5">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="relative z-10 flex justify-center pb-8">
        <ChevronDown className="w-6 h-6 text-white/20 animate-bounce" />
      </div>
    </section>
  );
};

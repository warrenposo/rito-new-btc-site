import { Zap, Shield, DollarSign, BarChart3, Globe, MessageCircle } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "High Performance",
    description: "State-of-the-art ASIC hardware with optimized algorithms for maximum hash rate and profitability.",
    accent: "from-yellow-500 to-orange-500",
    num: "01",
  },
  {
    icon: Shield,
    title: "Secure Platform",
    description: "Bank-level security with multi-factor authentication and cold storage for all digital assets.",
    accent: "from-blue-500 to-cyan-500",
    num: "02",
  },
  {
    icon: DollarSign,
    title: "Daily Payouts",
    description: "Receive your mining rewards automatically every day, directly to your BtcCloudBase wallet.",
    accent: "from-emerald-500 to-teal-500",
    num: "03",
  },
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    description: "Monitor hash rate, earnings, and performance with live dashboards and detailed statistics.",
    accent: "from-purple-500 to-pink-500",
    num: "04",
  },
  {
    icon: Globe,
    title: "Global Network",
    description: "Mining facilities across 5 continents delivering 99.9% uptime and unmatched reliability.",
    accent: "from-sky-500 to-indigo-500",
    num: "05",
  },
  {
    icon: MessageCircle,
    title: "24/7 Support",
    description: "Dedicated specialists available round the clock via live chat, email, and Telegram.",
    accent: "from-rose-500 to-red-500",
    num: "06",
  },
];

export const Features = () => {
  return (
    <section className="py-24 px-4 bg-[#070f1e] relative overflow-hidden">
      {/* Subtle grid */}
      <div className="absolute inset-0 hero-grid opacity-30 pointer-events-none" />

      {/* Top accent line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent" />

      <div className="container mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-semibold tracking-widest text-yellow-400/80 uppercase mb-4 border border-yellow-500/20 rounded-full px-4 py-1 bg-yellow-500/5">
            Why BtcCloudBase?
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight">
            Everything You Need to
            <span className="text-gradient-gold block">Mine Smarter</span>
          </h2>
          <p className="text-white/40 max-w-xl mx-auto text-lg">
            Professional infrastructure, zero complexity — built for serious miners and beginners alike.
          </p>
        </div>

        {/* Feature cards grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.num}
              className="group relative bg-white/[0.03] border border-white/8 rounded-2xl p-7 hover:border-white/20 hover:bg-white/[0.05] transition-all duration-500 card-glow overflow-hidden"
            >
              {/* Number watermark */}
              <span className="absolute top-4 right-5 text-6xl font-black text-white/[0.04] select-none group-hover:text-white/[0.07] transition-colors">
                {feature.num}
              </span>

              {/* Icon */}
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.accent} mb-5 shadow-lg`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-yellow-400/90 transition-colors">
                {feature.title}
              </h3>
              <p className="text-white/45 text-sm leading-relaxed">
                {feature.description}
              </p>

              {/* Bottom accent line on hover */}
              <div className={`absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r ${feature.accent} group-hover:w-full transition-all duration-500 rounded-full`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

import { Zap, Shield, DollarSign, BarChart3, Globe, MessageCircle } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "High Performance",
    description: "State-of-the-art ASIC hardware with optimized algorithms for maximum hash rate and profitability.",
    iconColor: "text-yellow-400",
    iconBg: "bg-yellow-500/10",
    iconBorder: "border-yellow-500/20",
    barColor: "bg-gradient-to-b from-yellow-400 to-orange-500",
  },
  {
    icon: Shield,
    title: "Secure Platform",
    description: "Bank-level security with multi-factor authentication and cold storage for all digital assets.",
    iconColor: "text-sky-400",
    iconBg: "bg-sky-500/10",
    iconBorder: "border-sky-500/20",
    barColor: "bg-gradient-to-b from-sky-400 to-blue-600",
  },
  {
    icon: DollarSign,
    title: "Daily Payouts",
    description: "Receive your mining rewards automatically every day, directly to your BtcNMiningBase wallet.",
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-500/10",
    iconBorder: "border-emerald-500/20",
    barColor: "bg-gradient-to-b from-emerald-400 to-teal-600",
  },
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    description: "Monitor hash rate, earnings, and performance with live dashboards and detailed statistics.",
    iconColor: "text-purple-400",
    iconBg: "bg-purple-500/10",
    iconBorder: "border-purple-500/20",
    barColor: "bg-gradient-to-b from-purple-400 to-pink-600",
  },
  {
    icon: Globe,
    title: "Global Network",
    description: "Mining facilities across 5 continents delivering 99.9% uptime and unmatched reliability.",
    iconColor: "text-teal-400",
    iconBg: "bg-teal-500/10",
    iconBorder: "border-teal-500/20",
    barColor: "bg-gradient-to-b from-teal-400 to-cyan-600",
  },
  {
    icon: MessageCircle,
    title: "24/7 Support",
    description: "Dedicated specialists available round the clock via live chat, email, and Telegram.",
    iconColor: "text-rose-400",
    iconBg: "bg-rose-500/10",
    iconBorder: "border-rose-500/20",
    barColor: "bg-gradient-to-b from-rose-400 to-red-600",
  },
];

export const Features = () => {
  return (
    <section className="py-24 px-4 bg-[#050b10] relative overflow-hidden">
      {/* Diagonal lines */}
      <div className="absolute inset-0 diagonal-lines pointer-events-none opacity-60" />

      {/* Top separator */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-teal-500/30 to-transparent" />

      {/* Bottom separator */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-teal-500/20 to-transparent" />

      <div className="container mx-auto relative z-10">

        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-semibold tracking-widest text-teal-400 uppercase mb-4 border border-teal-500/20 rounded-full px-4 py-1 bg-teal-500/5">
            Why BtcNMiningBase?
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight">
            Everything You Need to
            <span className="text-gradient-teal block">Mine Smarter</span>
          </h2>
          <p className="text-white/40 max-w-xl mx-auto text-lg">
            Professional infrastructure, zero complexity — built for serious miners and beginners alike.
          </p>
        </div>

        {/* Feature cards — icon-left layout */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative bg-[#060d13] border border-white/5 rounded-2xl p-5 hover:border-teal-500/25 transition-all duration-400 overflow-hidden flex gap-4 items-start"
            >
              {/* Left accent bar */}
              <div
                className={`absolute left-0 top-4 bottom-4 w-[3px] rounded-full ${feature.barColor} opacity-0 group-hover:opacity-100 transition-opacity duration-400`}
              />

              {/* Circular icon */}
              <div
                className={`shrink-0 w-11 h-11 rounded-full flex items-center justify-center ${feature.iconBg} border ${feature.iconBorder} group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon className={`w-5 h-5 ${feature.iconColor}`} />
              </div>

              {/* Text */}
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-white mb-1.5 group-hover:text-teal-300 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-white/38 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Radial hover glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                style={{
                  background:
                    "radial-gradient(ellipse at 0% 50%, rgba(0,229,255,0.04) 0%, transparent 65%)",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

import { TrendingUp, Users, Clock, Globe } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "50,000+",
    label: "Active Miners",
    sub: "Across 150+ countries",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
  },
  {
    icon: TrendingUp,
    value: "250+ BTC",
    label: "Total Mined",
    sub: "Since launch in 2020",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  {
    icon: Clock,
    value: "99.9%",
    label: "Platform Uptime",
    sub: "Guaranteed SLA",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  {
    icon: Globe,
    value: "150+",
    label: "Countries Served",
    sub: "Global reach",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
  },
];

export const Statistics = () => {
  return (
    <section className="py-24 px-4 relative overflow-hidden bg-[#050c18]">
      {/* Gold glow at top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-1 bg-gradient-to-r from-transparent via-yellow-500/40 to-transparent blur-sm" />

      {/* Radial glow background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,hsl(45_93%_58%_/_0.05),transparent)] pointer-events-none" />

      <div className="container mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-semibold tracking-widest text-yellow-400/80 uppercase mb-4 border border-yellow-500/20 rounded-full px-4 py-1 bg-yellow-500/5">
            By the Numbers
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">
            Trusted by Miners
            <span className="text-gradient-gold block">Around the Globe</span>
          </h2>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`group relative rounded-2xl border ${stat.border} ${stat.bg} p-8 text-center hover:scale-105 transition-all duration-300 overflow-hidden`}
            >
              {/* Icon */}
              <div className="flex justify-center mb-4">
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>

              {/* Value */}
              <div className={`text-4xl md:text-5xl font-black ${stat.color} mb-1 leading-none`}>
                {stat.value}
              </div>

              {/* Label */}
              <div className="text-white font-semibold text-base mt-2">
                {stat.label}
              </div>

              {/* Sub */}
              <div className="text-white/35 text-xs mt-1">
                {stat.sub}
              </div>

              {/* Glow on hover */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl`}
                style={{ boxShadow: "inset 0 0 40px rgba(255,255,255,0.03)" }}
              />
            </div>
          ))}
        </div>

        {/* CTA strip */}
        <div className="mt-16 text-center">
          <p className="text-white/30 text-sm">
            Join the fastest-growing cloud mining community — start earning in minutes.
          </p>
        </div>
      </div>
    </section>
  );
};

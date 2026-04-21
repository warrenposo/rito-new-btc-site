import { TrendingUp, Users, Clock, Globe } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "50,000+",
    label: "Active Miners",
    sub: "Across 150+ countries",
    color: "text-teal-400",
    glow: "rgba(0,229,255,0.15)",
    bar: "from-teal-400 to-cyan-500",
    pct: 85,
  },
  {
    icon: TrendingUp,
    value: "250+ BTC",
    label: "Total Mined",
    sub: "Since launch in 2020",
    color: "text-emerald-400",
    glow: "rgba(0,200,83,0.15)",
    bar: "from-emerald-400 to-green-500",
    pct: 72,
  },
  {
    icon: Clock,
    value: "99.9%",
    label: "Platform Uptime",
    sub: "Guaranteed SLA",
    color: "text-sky-400",
    glow: "rgba(56,189,248,0.15)",
    bar: "from-sky-400 to-blue-500",
    pct: 99,
  },
  {
    icon: Globe,
    value: "150+",
    label: "Countries Served",
    sub: "Global reach",
    color: "text-purple-400",
    glow: "rgba(168,85,247,0.15)",
    bar: "from-purple-400 to-violet-500",
    pct: 78,
  },
];

export const Statistics = () => {
  return (
    <section className="py-24 px-4 relative overflow-hidden bg-[#040a0f]">
      {/* Circuit background */}
      <div className="absolute inset-0 circuit-bg opacity-60 pointer-events-none" />

      {/* Top separator */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-teal-500/25 to-transparent" />

      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 100%, rgba(0,229,255,0.04) 0%, transparent 70%)",
        }}
      />

      <div className="container mx-auto relative z-10">

        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-semibold tracking-widest text-teal-400 uppercase mb-4 border border-teal-500/20 rounded-full px-4 py-1 bg-teal-500/5">
            By the Numbers
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">
            Trusted by Miners
            <span className="text-gradient-teal block">Around the Globe</span>
          </h2>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="group relative bg-[#060d13] border border-white/5 rounded-2xl p-7 hover:border-teal-500/20 transition-all duration-400 overflow-hidden"
            >
              {/* Top corner glow */}
              <div
                className="absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(circle at top right, ${stat.glow}, transparent 70%)` }}
              />

              {/* Icon row */}
              <div className="flex items-center justify-between mb-5">
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                <div className={`text-xs font-mono ${stat.color} bg-white/3 border border-white/5 rounded-full px-2.5 py-0.5`}>
                  {stat.pct}%
                </div>
              </div>

              {/* Value */}
              <div className={`text-4xl font-black ${stat.color} leading-none mb-2`}>
                {stat.value}
              </div>

              {/* Progress bar */}
              <div className="h-1 bg-white/5 rounded-full overflow-hidden mb-4">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${stat.bar} group-hover:opacity-100 opacity-60 transition-opacity duration-400`}
                  style={{ width: `${stat.pct}%` }}
                />
              </div>

              {/* Label */}
              <div className="text-white font-semibold text-sm">{stat.label}</div>
              <div className="text-white/30 text-xs mt-0.5">{stat.sub}</div>
            </div>
          ))}
        </div>

        {/* CTA strip */}
        <div className="mt-14 text-center">
          <p className="text-white/25 text-sm">
            Join the fastest-growing cloud mining community — start earning in minutes.
          </p>
        </div>
      </div>
    </section>
  );
};

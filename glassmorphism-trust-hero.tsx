import {
  Star,
  Crown,
  Hexagon,
  Triangle,
  Command,
  Ghost,
  Gem,
  Cpu,
  TrendingUp,
  Shield,
} from "lucide-react";

const CLIENTS = [
  { name: "Acme Corp", icon: Hexagon },
  { name: "Quantum", icon: Triangle },
  { name: "Command+Z", icon: Command },
  { name: "Phantom", icon: Ghost },
  { name: "Ruby", icon: Gem },
  { name: "Chipset", icon: Cpu },
];

export default function HeroStatsCard() {
  return (
    <div className="space-y-4 w-full max-w-sm">
      {/* Main stats card */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-xl shadow-2xl">
        <div className="absolute top-0 right-0 -mr-12 -mt-12 h-48 w-48 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
              <TrendingUp className="h-5 w-5 text-sky-300" />
            </div>
            <div>
              <div className="text-3xl font-black tracking-tight text-white">2,400+</div>
              <div className="text-xs text-zinc-400 mt-0.5">Businesses Growing</div>
            </div>
          </div>

          <div className="space-y-2 mb-6">
            <div className="flex justify-between text-xs">
              <span className="text-zinc-400">Avg. Star Rating Increase</span>
              <span className="text-white font-semibold">+0.8★</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[80%] rounded-full bg-gradient-to-r from-sky-400 to-sky-400" />
            </div>
          </div>

          <div className="h-px w-full bg-white/10 mb-5" />

          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { v: "94%", l: "Routed" },
              { v: "480K", l: "Reviews" },
              { v: "4.8★", l: "Avg Score" },
            ].map((s) => (
              <div key={s.l}>
                <div className="text-sm font-black text-white">{s.v}</div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-wider mt-0.5">{s.l}</div>
              </div>
            ))}
          </div>

          <div className="mt-5 flex gap-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-medium text-zinc-300">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-sky-400" />
              </span>
              LIVE
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-medium text-zinc-300">
              <Shield className="w-2.5 h-2.5 text-sky-400" />
              GDPR SAFE
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-medium text-zinc-300">
              <Crown className="w-2.5 h-2.5 text-red-400" />
              #1 RATED
            </div>
          </div>
        </div>
      </div>

      {/* Trusted by marquee card */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 py-6 backdrop-blur-xl">
        <p className="mb-4 px-6 text-xs font-medium text-zinc-500 uppercase tracking-widest">Trusted by businesses like</p>
        <div
          className="relative flex overflow-hidden"
          style={{
            maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
            WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
          }}
        >
          <div className="animate-marquee flex gap-8 px-4">
            {[...CLIENTS, ...CLIENTS, ...CLIENTS].map((client, i) => {
              const Icon = client.icon;
              return (
                <div
                  key={i}
                  className="flex items-center gap-2 opacity-40 hover:opacity-80 transition-opacity cursor-default flex-shrink-0"
                >
                  <Icon className="h-4 w-4 text-white" />
                  <span className="text-sm font-bold text-white tracking-tight whitespace-nowrap">
                    {client.name}
                  </span>
                  <Star className="h-2.5 w-2.5 text-red-400 fill-red-400" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

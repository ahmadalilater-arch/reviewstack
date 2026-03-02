import { useState } from "react";
import { Zap, LogOut, User, ChevronDown, LayoutDashboard, Sparkles, Sun, Moon } from "lucide-react";
import { AppView } from "../types";
import { ReputeLogo } from "@/components/ui/repute-logo";
import { useTheme } from "@/context/ThemeContext";
import { InteractiveHoverButton } from "@/components/ui/interactive-button";

interface NavbarProps {
  view: AppView;
  setView: (v: AppView) => void;
  campaignCount: number;
  user: { name: string } | null;
  onSignOut: () => void;
}

export function Navbar({ view, setView, campaignCount, user, onSignOut }: NavbarProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  const navLinks = [
    ...(user ? [{ label: "Dashboard", view: "dashboard" as AppView, badge: campaignCount > 0 ? String(campaignCount) : undefined }] : []),
  ];

  const pillBg     = isDark ? "bg-zinc-950/85 border-white/[0.08]"    : "bg-white/90 border-black/[0.08]";
  const linkActive = isDark ? "text-sky-400 bg-sky-500/[0.10]"         : "text-sky-600 bg-sky-500/[0.08]";
  const linkIdle   = isDark ? "text-zinc-400 hover:text-white hover:bg-white/[0.05]"
                            : "text-zinc-500 hover:text-zinc-900 hover:bg-black/[0.04]";
  const menuBg     = isDark ? "bg-zinc-900/95 border-white/[0.08]"    : "bg-white/98 border-black/[0.08]";
  const menuText   = isDark ? "text-zinc-300 hover:text-white hover:bg-white/[0.05]"
                            : "text-zinc-600 hover:text-zinc-900 hover:bg-black/[0.04]";
  const userBtnBg  = isDark ? "border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08]"
                            : "border-black/[0.08] bg-black/[0.03] hover:bg-black/[0.06]";
  const signInBtn  = isDark ? "text-zinc-400 hover:text-white" : "text-zinc-500 hover:text-zinc-900";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-6xl px-6 pt-5">
        <div className={`flex items-center justify-between h-14 px-5 rounded-2xl border backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.12)] transition-colors duration-300 ${pillBg}`}>

          {/* Logo */}
          <button onClick={() => setView("landing")} className="flex-shrink-0 opacity-90 hover:opacity-100 transition-opacity">
            <ReputeLogo />
          </button>

          {/* Center nav */}
          <div className="hidden md:flex items-center gap-0.5">
            {navLinks.map((item) => (
              <button
                key={item.label}
                onClick={() => setView(item.view)}
                className={`relative flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  view === item.view ? linkActive : linkIdle
                }`}
              >
                {item.label}
                {item.badge && (
                  <span className="ml-1 text-[10px] font-black bg-sky-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className={`p-2.5 rounded-xl border transition-all duration-200 hover:scale-105 active:scale-95 ${
                isDark
                  ? "border-white/[0.08] bg-white/[0.04] text-zinc-400 hover:text-sky-400 hover:bg-sky-500/[0.08]"
                  : "border-black/[0.08] bg-black/[0.03] text-zinc-500 hover:text-sky-600 hover:bg-sky-500/[0.08]"
              }`}
            >
              <span className="block" key={isDark ? "moon" : "sun"}>
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </span>
            </button>

            {user ? (
              <>
                {/* New Campaign CTA */}
                <button
                  onClick={() => setView("new-campaign")}
                  className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white text-sm font-bold shadow-lg shadow-sky-900/30 hover:shadow-sky-900/50 hover:scale-[1.03] hover:from-sky-400 hover:to-sky-500 transition-all"
                >
                  <Zap className="w-3.5 h-3.5" />
                  New Campaign
                </button>

                {/* User menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen((o) => !o)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all ${userBtnBg}`}
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center text-white text-xs font-black">
                      {user.name[0].toUpperCase()}
                    </div>
                    <span className={`text-sm font-medium hidden sm:block ${isDark ? "text-white" : "text-zinc-800"}`}>
                      {user.name}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isDark ? "text-zinc-500" : "text-zinc-400"} ${userMenuOpen ? "rotate-180" : ""}`} />
                  </button>

                  {userMenuOpen && (
                    <div className={`absolute right-0 top-[calc(100%+8px)] w-52 rounded-2xl border backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] py-2 z-50 modal-enter ${menuBg}`}>
                      <div className={`px-4 py-3 border-b ${isDark ? "border-white/[0.06]" : "border-black/[0.06]"}`}>
                        <p className={`font-semibold text-sm ${isDark ? "text-white" : "text-zinc-900"}`}>{user.name}</p>
                        <p className={`text-xs mt-0.5 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>Free Trial · 14 days left</p>
                      </div>
                      <div className="py-1">
                        {[
                          { icon: LayoutDashboard, label: "Dashboard",       action: () => { setView("dashboard");    setUserMenuOpen(false); } },
                          { icon: Sparkles,        label: "New Campaign",    action: () => { setView("new-campaign"); setUserMenuOpen(false); } },
                          { icon: User,            label: "Account Settings",action: () => setUserMenuOpen(false) },
                        ].map((item) => (
                          <button key={item.label} onClick={item.action}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${menuText}`}>
                            <item.icon className="w-4 h-4" />
                            {item.label}
                          </button>
                        ))}
                      </div>
                      <div className={`border-t py-1 ${isDark ? "border-white/[0.06]" : "border-black/[0.06]"}`}>
                        <button
                          onClick={() => { onSignOut(); setUserMenuOpen(false); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:text-red-400 hover:bg-red-500/[0.06] transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setView("login")}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${signInBtn}`}
                >
                  Sign In
                </button>
                <InteractiveHoverButton
                  onClick={() => setView("signup")}
                  text="Get Started Free"
                  variant="blue"
                  className="text-sm px-5 py-2"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

import React from "react";
import { Mic, MicOff, Shield, Sparkles, Volume2, VolumeX, Smartphone, TrendingUp, Bell, HardDrive, Code2, PhoneCall } from "lucide-react";

interface NavbarProps {
  activeTab: "assistant" | "trading" | "phone" | "calls" | "notifications" | "memory" | "android";
  setActiveTab: (tab: "assistant" | "trading" | "phone" | "calls" | "notifications" | "memory" | "android") => void;
  isListening: boolean;
  onToggleListening: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  wakeWordDetected: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isListening,
  onToggleListening,
  isMuted,
  onToggleMute,
  wakeWordDetected,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-[#070709]/95 backdrop-blur-md border-b border-[#D4AF37]/20 shadow-lg shadow-black/60">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Crest */}
        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-[#D4AF37] via-[#AA771C] to-[#593e10] p-[1.5px] shadow-lg shadow-[#D4AF37]/20 flex items-center justify-center">
              <div className="w-full h-full bg-[#0d0d12] rounded-[10px] flex items-center justify-center">
                <span className="font-cinzel font-black text-lg sm:text-xl text-[#F5DEB3] tracking-tighter">
                  M
                </span>
              </div>
            </div>
            {wakeWordDetected && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FFD700]"></span>
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-cinzel text-base sm:text-lg font-bold tracking-wider gold-gradient-text uppercase">
                MAVLA AI
              </h1>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30">
                RO v3.0
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-[#A0A0AB] tracking-wide flex items-center gap-1.5">
              <span>YOUR VOICE. YOUR COMMANDS.</span>
              <span className="text-[#D4AF37]/40">•</span>
              <span className="text-[#D4AF37]">Dev by Samarth Bhor</span>
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 overflow-x-auto py-1 max-w-full">
          {[
            { id: "assistant", label: "Ro Assistant", icon: Sparkles },
            { id: "trading", label: "Trading AI (SMC)", icon: TrendingUp },
            { id: "phone", label: "Phone Control", icon: Smartphone },
            { id: "calls", label: "Call Assistant", icon: PhoneCall },
            { id: "notifications", label: "Notifications", icon: Bell },
            { id: "memory", label: "Memory Vault", icon: HardDrive },
            { id: "android", label: "Android Source", icon: Code2 },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-[#D4AF37]/25 to-[#AA771C]/20 text-[#FFF7D6] border border-[#D4AF37]/40 shadow-sm shadow-[#D4AF37]/20"
                    : "text-[#A0A0AB] hover:text-[#E6E6EB] hover:bg-[#14141c]"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#D4AF37]" : "text-[#70707D]"}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Global Controls & Voice Pill */}
        <div className="flex items-center gap-2">
          {/* Audio Output Mute Toggle */}
          <button
            onClick={onToggleMute}
            title={isMuted ? "Unmute Voice" : "Mute Voice"}
            className="p-2 rounded-lg bg-[#14141c] hover:bg-[#1f1f2b] text-[#A0A0AB] hover:text-[#D4AF37] border border-[#D4AF37]/20 transition-all cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-[#D4AF37]" />}
          </button>

          {/* Voice Listening Master Button */}
          <button
            onClick={onToggleListening}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium text-xs transition-all cursor-pointer ${
              isListening
                ? "bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-black font-semibold shadow-md shadow-[#D4AF37]/30 animate-pulse"
                : "bg-[#14141c] text-[#A0A0AB] hover:text-[#FFF] border border-[#D4AF37]/30"
            }`}
          >
            {isListening ? (
              <>
                <Mic className="w-3.5 h-3.5 text-black" />
                <span>"Hey Ro" Active</span>
              </>
            ) : (
              <>
                <MicOff className="w-3.5 h-3.5 text-[#70707D]" />
                <span>Mic Standby</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

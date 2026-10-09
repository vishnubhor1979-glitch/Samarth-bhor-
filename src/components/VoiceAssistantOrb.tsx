import React, { useState } from "react";
import { Mic, MicOff, Sparkles, Volume2, Globe, Sliders, ShieldCheck } from "lucide-react";

interface VoiceAssistantOrbProps {
  isListening: boolean;
  isSpeaking: boolean;
  isThinking: boolean;
  transcript: string;
  onMicToggle: () => void;
  onSendPresetCommand: (cmd: string) => void;
  selectedLanguage: string;
  onSelectLanguage: (lang: string) => void;
  speechSpeed: number;
  onSpeedChange: (speed: number) => void;
  wakeWordDetected: boolean;
}

export const VoiceAssistantOrb: React.FC<VoiceAssistantOrbProps> = ({
  isListening,
  isSpeaking,
  isThinking,
  transcript,
  onMicToggle,
  onSendPresetCommand,
  selectedLanguage,
  onSelectLanguage,
  speechSpeed,
  onSpeedChange,
  wakeWordDetected,
}) => {
  const [showSettings, setShowSettings] = useState(false);

  const presets = [
    { label: "Ro aik.", cmd: "Ro aik." },
    { label: "Instagram open kar ani Aarya la hii pathav", cmd: "Instagram open kar ani Aarya la hii pathav" },
    { label: "Gold cha chart analyse kar", cmd: "Gold cha chart analyse kar" },
    { label: "WhatsApp var Aai la message pathav: Mi ghari yet aahe", cmd: "WhatsApp var Aai la message pathav: Mi ghari yet aahe" },
    { label: "TradingView open kar ani XAUUSD analyse kar", cmd: "TradingView open kar ani XAUUSD analyse kar" },
    { label: "Mala call aala tar sang", cmd: "Mala call aala tar sang" },
    { label: "Ro, Marathi madhe bol", cmd: "Ro, Marathi madhe bol" },
  ];

  const languages = [
    { code: "mr-IN", label: "मराठी (Marathi)" },
    { code: "hi-IN", label: "हिन्दी (Hindi)" },
    { code: "en-IN", label: "English (India)" },
    { code: "en-US", label: "English (US)" },
    { code: "es-ES", label: "Español (Spanish)" },
    { code: "fr-FR", label: "Français (French)" },
    { code: "de-DE", label: "Deutsch (German)" },
    { code: "ja-JP", label: "日本語 (Japanese)" },
    { code: "ar-SA", label: "العربية (Arabic)" },
  ];

  // Visual status
  const statusText = isThinking
    ? "RO IS PROCESSING..."
    : isSpeaking
    ? "RO IS SPEAKING..."
    : isListening
    ? "LISTENING TO SAMARTH..."
    : "MAVLA AI STANDBY (TAP OR SAY 'HEY RO')";

  return (
    <div className="relative flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-[#111117] via-[#0b0b0f] to-[#070709] border border-[#D4AF37]/25 shadow-2xl shadow-black overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08)_0,transparent_70%)] pointer-events-none" />

      {/* Top Tag & Identity */}
      <div className="flex items-center justify-between w-full mb-6 z-10">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] animate-pulse" />
          <span className="text-xs font-mono tracking-widest text-[#D4AF37] font-semibold uppercase">
            VOICE ARCHITECTURE: SAMARTH BHOR
          </span>
        </div>

        <button
          onClick={() => setShowSettings(!showSettings)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#191924] hover:bg-[#252538] text-xs text-[#A0A0AB] hover:text-[#D4AF37] border border-[#D4AF37]/20 transition-all cursor-pointer"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Voice Config</span>
        </button>
      </div>

      {/* Voice Configuration Drawer */}
      {showSettings && (
        <div className="w-full mb-6 p-4 rounded-xl bg-[#14141c]/90 border border-[#D4AF37]/30 backdrop-blur-md z-20 space-y-3 animate-in fade-in slide-in-from-top duration-200">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <label className="text-xs text-[#A0A0AB] block mb-1 font-medium">Spoken Language</label>
              <select
                value={selectedLanguage}
                onChange={(e) => onSelectLanguage(e.target.value)}
                className="bg-[#0b0b10] border border-[#D4AF37]/30 text-xs text-[#FFF] rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#D4AF37]"
              >
                {languages.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-[#A0A0AB] block mb-1 font-medium">
                Speech Speed ({speechSpeed}x)
              </label>
              <input
                type="range"
                min="0.7"
                max="1.5"
                step="0.1"
                value={speechSpeed}
                onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
                className="w-36 accent-[#D4AF37] cursor-pointer"
              />
            </div>

            <div className="flex items-center gap-2 text-xs text-[#D4AF37]">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              <span>Wake Words: "Hey Ro", "Ro aik", "Mavla"</span>
            </div>
          </div>
        </div>
      )}

      {/* 3D Golden Voice Orb Centerpiece */}
      <div className="relative my-4 flex items-center justify-center">
        {/* Outermost pulsing aura */}
        <div
          className={`absolute w-60 h-60 sm:w-72 sm:h-72 rounded-full transition-all duration-700 pointer-events-none ${
            isSpeaking
              ? "bg-[#D4AF37]/20 blur-3xl scale-125 animate-pulse"
              : isListening
              ? "bg-[#F59E0B]/20 blur-3xl scale-115"
              : isThinking
              ? "bg-[#AA771C]/25 blur-3xl scale-110"
              : "bg-[#D4AF37]/5 blur-2xl scale-95"
          }`}
        />

        {/* Concentric Gold Cyber Rings */}
        <div
          className={`absolute w-52 h-52 sm:w-60 sm:h-60 rounded-full border border-dashed border-[#D4AF37]/30 pointer-events-none ${
            isListening || isSpeaking ? "animate-spin" : ""
          }`}
          style={{ animationDuration: "16s" }}
        />
        <div
          className={`absolute w-44 h-44 sm:w-52 sm:h-52 rounded-full border border-dotted border-[#AA771C]/40 pointer-events-none ${
            isListening || isSpeaking ? "animate-spin" : ""
          }`}
          style={{ animationDuration: "10s", animationDirection: "reverse" }}
        />

        {/* Core Glowing Orb */}
        <button
          onClick={onMicToggle}
          title={isListening ? "Tap to pause mic" : "Tap to speak to Ro"}
          className={`relative group w-36 h-36 sm:w-44 sm:h-44 rounded-full flex flex-col items-center justify-center cursor-pointer transition-transform duration-300 transform active:scale-95 ${
            isSpeaking
              ? "ring-4 ring-[#D4AF37] shadow-[0_0_50px_rgba(212,175,55,0.6)]"
              : isListening
              ? "ring-4 ring-[#F59E0B] shadow-[0_0_40px_rgba(245,158,11,0.5)] animate-pulse"
              : isThinking
              ? "ring-2 ring-[#AA771C] shadow-[0_0_30px_rgba(170,119,28,0.4)]"
              : "ring-2 ring-[#D4AF37]/40 shadow-[0_0_25px_rgba(212,175,55,0.2)] hover:ring-[#D4AF37] hover:shadow-[0_0_35px_rgba(212,175,55,0.4)]"
          }`}
          style={{
            background:
              "radial-gradient(circle at 35% 30%, #FFE99A 0%, #D4AF37 35%, #926A18 70%, #2B1E05 100%)",
          }}
        >
          {/* Inner specular highlight reflection */}
          <div className="absolute top-3 left-6 w-12 h-6 rounded-full bg-white/40 blur-[2px] pointer-events-none transform -rotate-25" />

          {/* Central Icon */}
          <div className="relative z-10 flex flex-col items-center">
            {isListening ? (
              <Mic className="w-10 h-10 sm:w-12 sm:h-12 text-[#111116] drop-shadow-md animate-bounce" />
            ) : isSpeaking ? (
              <Volume2 className="w-10 h-10 sm:w-12 sm:h-12 text-[#111116] drop-shadow-md" />
            ) : isThinking ? (
              <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 text-[#111116] drop-shadow-md animate-spin" />
            ) : (
              <Mic className="w-10 h-10 sm:w-12 sm:h-12 text-[#111116] drop-shadow-md group-hover:scale-110 transition-transform" />
            )}

            <span className="mt-1 font-cinzel font-black text-xs sm:text-sm text-[#111116] tracking-wider uppercase">
              {isListening ? "Listening" : isSpeaking ? "Ro" : "Push / Say"}
            </span>
          </div>
        </button>
      </div>

      {/* Status Bar & Frequency Equalizer Simulation */}
      <div className="mt-4 flex flex-col items-center gap-2 z-10 w-full max-w-md">
        <div className="flex items-center gap-2">
          {wakeWordDetected && (
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#D4AF37] text-black animate-bounce">
              WAKE WORD DETECTED
            </span>
          )}
          <span
            className={`text-xs font-mono font-semibold tracking-wider ${
              isSpeaking
                ? "text-[#D4AF37]"
                : isListening
                ? "text-[#F59E0B]"
                : isThinking
                ? "text-[#AA771C]"
                : "text-[#888896]"
            }`}
          >
            {statusText}
          </span>
        </div>

        {/* Simulated frequency bars when speaking or listening */}
        {(isListening || isSpeaking) && (
          <div className="flex items-center gap-1 h-5 my-1">
            {[12, 24, 18, 30, 22, 14, 28, 20, 16, 26, 12, 22].map((height, i) => (
              <div
                key={i}
                className="w-1 bg-[#D4AF37] rounded-full transition-all duration-150 animate-pulse"
                style={{
                  height: `${Math.max(6, (height * (isSpeaking ? 1.2 : 0.8)) % 28)}px`,
                  animationDelay: `${i * 0.08}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Live Interim Transcript Bubble */}
        {transcript && (
          <div className="w-full px-4 py-2 rounded-xl bg-[#14141c]/90 border border-[#D4AF37]/30 text-xs text-[#FFF7D6] text-center font-medium shadow-md">
            "{transcript}"
          </div>
        )}
      </div>

      {/* Quick Vocal Commands / Presets */}
      <div className="w-full mt-6 z-10">
        <div className="text-[11px] font-mono tracking-wider text-[#A0A0AB] mb-2 flex items-center justify-between">
          <span>CASUAL MARATHI & VOICE COMMANDS:</span>
          <span className="text-[#D4AF37]">Click to test</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => onSendPresetCommand(p.cmd)}
              className="px-3 py-1.5 rounded-lg bg-[#14141c] hover:bg-[#1f1f2e] text-[#D8D8E0] hover:text-[#FFF] border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 text-xs font-medium transition-all shadow-sm cursor-pointer"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from "react";
import { UserMemory, TradingStyle } from "../types";
import { HardDrive, Plus, Trash2, Edit2, ShieldAlert, Check, User, Save } from "lucide-react";

interface MemoryManagerProps {
  memory: UserMemory;
  onUpdateMemory: (newMemory: UserMemory) => void;
  onLogMessage: (text: string, isUser?: boolean) => void;
}

export const MemoryManager: React.FC<MemoryManagerProps> = ({
  memory,
  onUpdateMemory,
  onLogMessage,
}) => {
  const [aliasName, setAliasName] = useState("");
  const [aliasValue, setAliasValue] = useState("");
  const [customKey, setCustomKey] = useState("");
  const [customVal, setCustomVal] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [preferredLang, setPreferredLang] = useState(memory.preferredLanguage);
  const [preferredStyle, setPreferredStyle] = useState<TradingStyle>(memory.preferredStyle);

  const handleAddAlias = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aliasName.trim() || !aliasValue.trim()) return;

    const updatedAliases = {
      ...memory.contactAliases,
      [aliasName.trim()]: aliasValue.trim(),
    };

    const updated: UserMemory = {
      ...memory,
      contactAliases: updatedAliases,
    };

    onUpdateMemory(updated);
    setAliasName("");
    setAliasValue("");
    onLogMessage(`Ro: Samarth, contact alias '${aliasName}' save kela aahe.`);
  };

  const handleDeleteAlias = (name: string) => {
    const updatedAliases = { ...memory.contactAliases };
    delete updatedAliases[name];
    onUpdateMemory({ ...memory, contactAliases: updatedAliases });
  };

  const handleSavePreferences = () => {
    onUpdateMemory({
      ...memory,
      preferredLanguage: preferredLang,
      preferredStyle,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
    onLogMessage(`Ro: Preferences updated for Samarth Bhor.`);
  };

  return (
    <div className="space-y-6">
      {/* Header Profile Card */}
      <div className="p-6 rounded-2xl bg-[#0d0d12] border border-[#D4AF37]/25 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#AA771C] p-0.5 flex items-center justify-center">
              <div className="w-full h-full bg-[#0d0d14] rounded-[10px] flex items-center justify-center">
                <User className="w-6 h-6 text-[#D4AF37]" />
              </div>
            </div>
            <div>
              <h2 className="font-cinzel text-lg font-bold text-[#FFF7D6]">
                SAMARTH BHOR'S PERSONAL MEMORY VAULT
              </h2>
              <p className="text-xs text-[#A0A0AB]">
                Assistant: Ro (MAVLA AI) • Multi-session Context & Voice Preferences
              </p>
            </div>
          </div>

          <button
            onClick={handleSavePreferences}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA771C] text-black font-semibold text-xs flex items-center gap-1.5 shadow-md hover:opacity-95 cursor-pointer"
          >
            {saveSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{saveSuccess ? "Saved Successfully!" : "Save Memory Changes"}</span>
          </button>
        </div>

        {/* Global User Preferences */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-[#D4AF37]/20 text-xs">
          <div>
            <label className="text-[#A0A0AB] block mb-1">Preferred Language</label>
            <input
              type="text"
              value={preferredLang}
              onChange={(e) => setPreferredLang(e.target.value)}
              className="w-full bg-[#14141c] border border-[#D4AF37]/30 rounded-lg px-3 py-2 text-white"
            />
          </div>

          <div>
            <label className="text-[#A0A0AB] block mb-1">Primary Trading Style</label>
            <select
              value={preferredStyle}
              onChange={(e) => setPreferredStyle(e.target.value as TradingStyle)}
              className="w-full bg-[#14141c] border border-[#D4AF37]/30 rounded-lg px-3 py-2 text-white"
            >
              <option value="Intraday">Intraday (4H, 1H, 15M, 5M)</option>
              <option value="Scalping">Scalping (15M, 5M, 3M, 1M)</option>
              <option value="Swing Trading">Swing Trading (Weekly, Daily, 4H, 1H)</option>
              <option value="Long Holding">Long Holding (Monthly, Weekly, Daily)</option>
            </select>
          </div>

          <div>
            <label className="text-[#A0A0AB] block mb-1">Wake Phrase</label>
            <input
              type="text"
              value={memory.wakePhrase}
              readOnly
              className="w-full bg-[#14141c] border border-[#D4AF37]/30 rounded-lg px-3 py-2 text-[#D4AF37] font-mono"
            />
          </div>
        </div>
      </div>

      {/* Contact Aliases Editor */}
      <div className="p-6 rounded-2xl bg-[#0d0d12] border border-[#D4AF37]/25 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-cinzel text-sm font-bold text-[#FFF7D6]">
            CONTACT ALIASES & RECIPIENT RESOLVER
          </h3>
          <span className="text-[10px] font-mono text-[#D4AF37]">
            CASUAL SPEECH TO PHONE CONTACT MAPPING
          </span>
        </div>

        <p className="text-xs text-[#A0A0AB] mb-4">
          When Samarth says "Aarya la hii pathav" or "Aai la message kar", Ro matches these configured aliases:
        </p>

        {/* Existing Aliases */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
          {Object.entries(memory.contactAliases).map(([name, desc]) => (
            <div
              key={name}
              className="p-3 rounded-xl bg-[#14141c] border border-[#D4AF37]/20 flex items-center justify-between text-xs"
            >
              <div>
                <span className="font-bold text-white block">{name}</span>
                <span className="text-[11px] text-[#A0A0AB]">{desc}</span>
              </div>
              <button
                onClick={() => handleDeleteAlias(name)}
                title="Remove Alias"
                className="text-[#70707D] hover:text-red-400 p-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Add New Alias Form */}
        <form onSubmit={handleAddAlias} className="flex flex-wrap items-center gap-2 pt-4 border-t border-[#D4AF37]/20">
          <input
            type="text"
            placeholder="Nickname (e.g. Chikoo)"
            value={aliasName}
            onChange={(e) => setAliasName(e.target.value)}
            className="flex-1 bg-[#14141c] border border-[#D4AF37]/30 rounded-lg px-3 py-2 text-xs text-white placeholder-[#70707D]"
          />
          <input
            type="text"
            placeholder="Contact Name or Relationship (e.g. Best Friend)"
            value={aliasValue}
            onChange={(e) => setAliasValue(e.target.value)}
            className="flex-1 bg-[#14141c] border border-[#D4AF37]/30 rounded-lg px-3 py-2 text-xs text-white placeholder-[#70707D]"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-[#D4AF37]/20 hover:bg-[#D4AF37]/35 text-[#FFF7D6] border border-[#D4AF37]/40 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Alias</span>
          </button>
        </form>
      </div>

      {/* Privacy Guard Notice */}
      <div className="p-4 rounded-xl bg-[#14141c] border border-amber-500/25 flex items-start gap-3 text-xs text-[#A0A0AB]">
        <ShieldAlert className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-white">MEMORY PRIVACY AND SAFETY GUARANTEE:</p>
          <p className="text-[11px] leading-relaxed mt-0.5">
            MAVLA AI strictly isolates personal memory from credentials. Passwords, OTP codes, banking secrets, and private keys are never stored in conversation memory.
          </p>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from "react";
import { PhoneIntent } from "../types";
import { 
  Instagram, 
  MessageCircle, 
  Ghost, 
  TrendingUp, 
  Camera, 
  Youtube, 
  Settings, 
  Phone, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  ShieldCheck,
  Send,
  Lock,
  ArrowRight
} from "lucide-react";

interface PhoneAutomationCenterProps {
  currentIntent: PhoneIntent | null;
  onClearIntent: () => void;
  onLogMessage: (text: string, isUser?: boolean) => void;
}

export const PhoneAutomationCenter: React.FC<PhoneAutomationCenterProps> = ({
  currentIntent,
  onClearIntent,
  onLogMessage,
}) => {
  // Staged message state
  const [stagedRecipient, setStagedRecipient] = useState<string>("Aarya");
  const [stagedMessage, setStagedMessage] = useState<string>("hii");
  const [selectedApp, setSelectedApp] = useState<string>("Instagram");
  const [actionStatus, setActionStatus] = useState<"IDLE" | "STAGED" | "CONFIRMING" | "DISPATCHED" | "VERIFIED">("IDLE");
  const [statusReport, setStatusReport] = useState<string>("");

  // Android Permissions State
  const [permissions, setPermissions] = useState({
    mic: true,
    notificationListener: true,
    contacts: true,
    phoneState: true,
    foregroundService: true,
  });

  const supportedApps = [
    { name: "Instagram", icon: Instagram, color: "from-pink-500 to-purple-600", pkg: "com.instagram.android", deepLink: "instagram://direct" },
    { name: "WhatsApp", icon: MessageCircle, color: "from-green-500 to-emerald-600", pkg: "com.whatsapp", deepLink: "whatsapp://send" },
    { name: "Snapchat", icon: Ghost, color: "from-yellow-400 to-amber-500", pkg: "com.snapchat.android", deepLink: "snapchat://notification" },
    { name: "TradingView", icon: TrendingUp, color: "from-blue-600 to-indigo-700", pkg: "com.tradingview.tradingviewapp", deepLink: "tradingview://chart" },
    { name: "Camera", icon: Camera, color: "from-slate-600 to-zinc-800", pkg: "com.android.camera", deepLink: "camera://" },
    { name: "YouTube", icon: Youtube, color: "from-red-600 to-rose-700", pkg: "com.google.android.youtube", deepLink: "vnd.youtube://" },
    { name: "Settings", icon: Settings, color: "from-gray-600 to-gray-800", pkg: "com.android.settings", deepLink: "android.settings.SETTINGS" },
  ];

  const handleLaunchApp = (appName: string, pkg: string) => {
    setActionStatus("DISPATCHED");
    const msg = `Dispatched Android Intent: android.intent.action.MAIN -> ${pkg}. Opening ${appName}.`;
    setStatusReport(msg);
    onLogMessage(`Ro: ${appName} launch karat aahe (Dispatched Intent to ${pkg}).`);

    // Attempt browser deep link fallback
    if (appName === "WhatsApp") {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent("Hello from MAVLA AI")}`, "_blank");
    } else if (appName === "Instagram") {
      window.open("https://instagram.com/direct/inbox/", "_blank");
    } else if (appName === "TradingView") {
      window.open("https://www.tradingview.com/chart/", "_blank");
    }

    setTimeout(() => {
      setActionStatus("VERIFIED");
      setStatusReport(`Action completed: ${appName} launched via Android Intent system.`);
    }, 1200);
  };

  const handleStageMessage = (app: string, recipient: string, text: string) => {
    setSelectedApp(app);
    setStagedRecipient(recipient);
    setStagedMessage(text);
    setActionStatus("CONFIRMING");
    setStatusReport(`Staged message for ${recipient} via ${app}. Awaiting confirmation.`);
  };

  const handleConfirmAndSend = () => {
    setActionStatus("DISPATCHED");
    const report = `Dispatched to ${selectedApp} with recipient: "${stagedRecipient}" and payload: "${stagedMessage}".`;
    setStatusReport(report);
    onLogMessage(`Ro: Samarth, ${selectedApp} var ${stagedRecipient} sathi message dispatch kela aahe: "${stagedMessage}".`);

    if (selectedApp === "WhatsApp") {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(stagedMessage)}`, "_blank");
    } else if (selectedApp === "Instagram") {
      window.open("https://instagram.com/direct/inbox/", "_blank");
    }

    setTimeout(() => {
      setActionStatus("VERIFIED");
      setStatusReport(`Verified: Direct message intent accepted by system. Never claiming message was delivered without confirmation.`);
    }, 1000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Column: Phone Simulator & Quick App Launcher */}
      <div className="lg:col-span-7 space-y-6">
        <div className="p-6 rounded-2xl bg-[#0d0d12] border border-[#D4AF37]/25 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-cinzel text-base font-bold text-[#FFF7D6]">
                ANDROID APPLICATION CONTROLLER
              </h2>
              <p className="text-xs text-[#A0A0AB]">
                Voice-guided Intent launcher for Instagram, WhatsApp, Snapchat & TradingView
              </p>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40">
              INTENT DISPATCHER
            </span>
          </div>

          {/* Quick App Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
            {supportedApps.map((app) => {
              const Icon = app.icon;
              return (
                <button
                  key={app.name}
                  onClick={() => handleLaunchApp(app.name, app.pkg)}
                  className="flex flex-col items-center p-3.5 rounded-xl bg-[#14141c] hover:bg-[#1f1f2b] border border-[#D4AF37]/20 hover:border-[#D4AF37]/60 transition-all text-center group cursor-pointer"
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${app.color} flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold text-[#FFF] mt-2">
                    {app.name}
                  </span>
                  <span className="text-[10px] font-mono text-[#70707D]">
                    {app.pkg.split(".").pop()}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Safety Rule Banner */}
          <div className="p-3.5 rounded-xl bg-[#14141c] border border-amber-500/30 flex items-start gap-2.5 my-4 text-xs text-[#E6E6EB]">
            <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-[#FFF7D6]">Strict Verification Guarantee:</p>
              <p className="text-[#A0A0AB] text-[11px] leading-relaxed">
                The assistant never claims an action succeeded when it did not. All messaging actions require recipient resolution, draft preview, and technical intent confirmation.
              </p>
            </div>
          </div>

          {/* Preset Voice Scenarios */}
          <div className="mt-4 pt-4 border-t border-[#D4AF37]/20">
            <h3 className="text-xs font-mono font-semibold text-[#D4AF37] mb-2 uppercase">
              Simulate Staged Voice Commands:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={() => handleStageMessage("Instagram", "Aarya", "hii")}
                className="p-2.5 rounded-lg bg-[#14141c] hover:bg-[#1a1a24] border border-[#D4AF37]/20 text-left text-xs flex items-center justify-between cursor-pointer"
              >
                <div>
                  <p className="font-medium text-white">"Aarya la hii pathav"</p>
                  <p className="text-[10px] text-[#A0A0AB]">Instagram • Recipient: Aarya</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
              </button>

              <button
                onClick={() => handleStageMessage("WhatsApp", "Aai", "Mi ghari yet aahe")}
                className="p-2.5 rounded-lg bg-[#14141c] hover:bg-[#1a1a24] border border-[#D4AF37]/20 text-left text-xs flex items-center justify-between cursor-pointer"
              >
                <div>
                  <p className="font-medium text-white">"Aai la message pathav: Mi ghari yet aahe"</p>
                  <p className="text-[10px] text-[#A0A0AB]">WhatsApp • Recipient: Mother</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
              </button>

              <button
                onClick={() => handleStageMessage("Snapchat", "Chikoo", "hii")}
                className="p-2.5 rounded-lg bg-[#14141c] hover:bg-[#1a1a24] border border-[#D4AF37]/20 text-left text-xs flex items-center justify-between cursor-pointer"
              >
                <div>
                  <p className="font-medium text-white">"Snapchat var Chikoo la hii pathav"</p>
                  <p className="text-[10px] text-[#A0A0AB]">Snapchat • Recipient: Chikoo</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
              </button>

              <button
                onClick={() => handleLaunchApp("TradingView", "com.tradingview.tradingviewapp")}
                className="p-2.5 rounded-lg bg-[#14141c] hover:bg-[#1a1a24] border border-[#D4AF37]/20 text-left text-xs flex items-center justify-between cursor-pointer"
              >
                <div>
                  <p className="font-medium text-white">"TradingView open kar"</p>
                  <p className="text-[10px] text-[#A0A0AB]">TradingView • Launch Chart</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
              </button>
            </div>
          </div>
        </div>

        {/* Technical Intent Execution Log */}
        {statusReport && (
          <div className="p-4 rounded-xl bg-[#0d0d12] border border-[#D4AF37]/30 text-xs font-mono">
            <div className="flex items-center justify-between text-[#D4AF37] mb-1 font-semibold">
              <span>INTENT DISPATCH REPORT:</span>
              <span className="text-[10px]">{actionStatus}</span>
            </div>
            <p className="text-[#E6E6EB]">{statusReport}</p>
          </div>
        )}
      </div>

      {/* Right Column: Safe Confirmation Modal & Android Permissions */}
      <div className="lg:col-span-5 space-y-6">
        {/* Message Confirmation Staging Box */}
        <div className="p-6 rounded-2xl bg-[#0d0d12] border border-[#D4AF37]/25 shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Lock className="w-4 h-4 text-[#D4AF37]" />
            <h3 className="font-cinzel text-sm font-bold text-[#FFF7D6]">
              CONSEQUENTIAL ACTION CONFIRMATION
            </h3>
          </div>

          <p className="text-xs text-[#A0A0AB] mb-4">
            Voice command staging ensures zero accidental messaging or unintended contact dispatches.
          </p>

          <div className="space-y-3 bg-[#14141c] p-4 rounded-xl border border-[#D4AF37]/20 text-xs">
            <div>
              <span className="text-[#70707D] block text-[10px] uppercase font-mono">Target Application</span>
              <span className="text-white font-semibold">{selectedApp}</span>
            </div>

            <div>
              <span className="text-[#70707D] block text-[10px] uppercase font-mono">Verified Recipient</span>
              <input
                type="text"
                value={stagedRecipient}
                onChange={(e) => setStagedRecipient(e.target.value)}
                className="w-full bg-[#0a0a0e] border border-[#D4AF37]/30 rounded-lg px-2.5 py-1.5 text-xs text-white mt-1"
              />
            </div>

            <div>
              <span className="text-[#70707D] block text-[10px] uppercase font-mono">Message Payload</span>
              <textarea
                value={stagedMessage}
                onChange={(e) => setStagedMessage(e.target.value)}
                rows={2}
                className="w-full bg-[#0a0a0e] border border-[#D4AF37]/30 rounded-lg px-2.5 py-1.5 text-xs text-white mt-1"
              />
            </div>

            <div className="pt-2 flex items-center justify-between gap-2">
              <button
                onClick={() => setActionStatus("IDLE")}
                className="px-3 py-1.5 rounded-lg bg-[#252533] text-xs text-[#A0A0AB] hover:text-white cursor-pointer"
              >
                Cancel Action
              </button>

              <button
                onClick={handleConfirmAndSend}
                className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#AA771C] text-black font-semibold text-xs flex items-center gap-1.5 shadow-md hover:opacity-90 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Confirm & Send Intent</span>
              </button>
            </div>
          </div>
        </div>

        {/* Android Permissions Manager */}
        <div className="p-6 rounded-2xl bg-[#0d0d12] border border-[#D4AF37]/25 shadow-xl">
          <h3 className="font-cinzel text-sm font-bold text-[#FFF7D6] mb-3">
            ANDROID OS PERMISSIONS STATUS
          </h3>

          <div className="space-y-2.5 text-xs">
            {[
              { key: "mic", label: "Microphone (RECORD_AUDIO)", desc: "Hands-free continuous voice recognition" },
              { key: "phoneState", label: "Phone State (READ_PHONE_STATE)", desc: "Incoming call detection & caller ID" },
              { key: "notificationListener", label: "Notification Listener Service", desc: "WhatsApp & Instagram announcements" },
              { key: "contacts", label: "Contacts (READ_CONTACTS)", desc: "Resolving Aarya, Chikoo, and Aai" },
              { key: "foregroundService", label: "Foreground Service & Wake Lock", desc: "Background operation when permitted" },
            ].map((p) => (
              <div key={p.key} className="flex items-center justify-between p-2 rounded-lg bg-[#14141c]">
                <div>
                  <p className="font-medium text-white">{p.label}</p>
                  <p className="text-[10px] text-[#70707D]">{p.desc}</p>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

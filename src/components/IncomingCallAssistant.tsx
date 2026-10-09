import React, { useState, useEffect } from "react";
import { IncomingCallSimulation } from "../types";
import { Phone, PhoneCall, PhoneIncoming, PhoneOff, Volume2, Mic, AlertCircle, CheckCircle2, ShieldAlert } from "lucide-react";
import { speechService } from "../services/speechService";

interface IncomingCallAssistantProps {
  onLogMessage: (text: string, isUser?: boolean) => void;
}

export const IncomingCallAssistant: React.FC<IncomingCallAssistantProps> = ({
  onLogMessage,
}) => {
  const [callState, setCallState] = useState<IncomingCallSimulation>({
    active: false,
    callerName: "Aarya",
    callerNumber: "+91 98234 56789",
    appSource: "Phone",
    status: "IDLE",
    speakerOn: false,
  });

  const [announcementsEnabled, setAnnouncementsEnabled] = useState(true);
  const [lastActionReport, setLastActionReport] = useState<string>("");
  const [isListeningForCallCommand, setIsListeningForCallCommand] = useState(false);

  // Trigger simulated incoming call
  const triggerIncomingCall = (caller = "Aarya") => {
    setCallState({
      active: true,
      callerName: caller,
      callerNumber: caller === "Aarya" ? "+91 98234 56789" : "+91 98220 12345",
      appSource: "Phone",
      status: "RINGING",
      speakerOn: false,
    });
    setLastActionReport(`Incoming call detected from ${caller} via Android Telephony Manager.`);

    if (announcementsEnabled) {
      // Announce in Marathi as required
      const announcement = `Samarth, तुला ${caller} चा call आला आहे. Receive करायचा की reject?`;
      onLogMessage(`Ro (Voice Announcement): "${announcement}"`);
      speechService.speak(announcement, "mr-IN");
    }

    setIsListeningForCallCommand(true);
  };

  const handleVoiceCommandAction = (cmd: "RECEIVE" | "REJECT" | "SPEAKER" | "HOLD") => {
    if (cmd === "RECEIVE") {
      setCallState((prev) => ({ ...prev, status: "ACCEPTED", speakerOn: true }));
      const msg = `Call from ${callState.callerName} answered. TelecomManager.acceptRingingCall() invoked. Speakerphone enabled.`;
      setLastActionReport(msg);
      speechService.speak("Call connect zala aahe, speaker on kela aahe.", "mr-IN");
      onLogMessage(`Ro: Samarth, ${callState.callerName} cha call receive kela aahe.`);
    } else if (cmd === "REJECT") {
      setCallState((prev) => ({ ...prev, status: "REJECTED", active: false }));
      const msg = `Call from ${callState.callerName} rejected via TelecomManager.endCall(). Logged to CallLog.`;
      setLastActionReport(msg);
      speechService.speak("Call cut kela aahe.", "mr-IN");
      onLogMessage(`Ro: ${callState.callerName} cha call reject kela.`);
    } else if (cmd === "SPEAKER") {
      setCallState((prev) => ({ ...prev, speakerOn: !prev.speakerOn }));
      setLastActionReport(`AudioManager.setSpeakerphoneOn(${!callState.speakerOn}) toggled.`);
    } else if (cmd === "HOLD") {
      setLastActionReport("Call put on hold / ringer muted.");
      speechService.speak("Ringtone mute keli aahe.", "mr-IN");
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="p-6 rounded-2xl bg-[#0d0d12] border border-[#D4AF37]/25 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <PhoneCall className="w-5 h-5 text-[#D4AF37]" />
              <h2 className="font-cinzel text-lg font-bold text-[#FFF7D6]">
                SMART INCOMING CALL ASSISTANT
              </h2>
            </div>
            <p className="text-xs text-[#A0A0AB] mt-1">
              Automated caller identification, Marathi voice announcements, and hands-free call control
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setAnnouncementsEnabled(!announcementsEnabled)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                announcementsEnabled
                  ? "bg-[#D4AF37]/20 border-[#D4AF37] text-[#FFF7D6]"
                  : "bg-[#14141c] border-gray-700 text-[#70707D]"
              }`}
            >
              Announcements: {announcementsEnabled ? "ENABLED" : "MUTED"}
            </button>
          </div>
        </div>

        {/* Test Trigger Buttons */}
        <div className="flex flex-wrap gap-3 my-4">
          <button
            onClick={() => triggerIncomingCall("Aarya")}
            disabled={callState.active}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA771C] text-black font-semibold text-xs flex items-center gap-2 hover:opacity-95 disabled:opacity-40 shadow-md cursor-pointer"
          >
            <PhoneIncoming className="w-4 h-4" />
            <span>Simulate Incoming Call: Aarya</span>
          </button>

          <button
            onClick={() => triggerIncomingCall("Baba")}
            disabled={callState.active}
            className="px-4 py-2 rounded-xl bg-[#1a1a26] text-white font-medium text-xs flex items-center gap-2 border border-[#D4AF37]/30 hover:border-[#D4AF37] disabled:opacity-40 cursor-pointer"
          >
            <PhoneIncoming className="w-4 h-4" />
            <span>Simulate Incoming Call: Baba</span>
          </button>
        </div>

        {/* Active Ringing Overlay / Interactive Screen */}
        {callState.active && (
          <div className="my-6 p-6 rounded-2xl bg-gradient-to-b from-[#181824] via-[#101018] to-[#0a0a0e] border-2 border-[#D4AF37] shadow-[0_0_50px_rgba(212,175,55,0.3)] animate-pulse">
            <div className="text-center space-y-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#D4AF37] text-black">
                {callState.status === "RINGING" ? "INCOMING CALL ALERT" : "CALL CONNECTED"}
              </span>

              <h3 className="font-cinzel text-2xl font-bold text-white mt-3">
                {callState.callerName}
              </h3>
              <p className="text-xs text-[#A0A0AB] font-mono">{callState.callerNumber}</p>

              {/* Spoken Marathi Announcement Display */}
              <div className="max-w-md mx-auto p-3 rounded-xl bg-[#09090d]/90 border border-[#D4AF37]/40 text-xs text-[#FFF7D6] font-medium my-4">
                <Volume2 className="w-4 h-4 text-[#D4AF37] inline mr-2" />
                "Samarth, तुला {callState.callerName} चा call आला आहे. Receive करायचा की reject?"
              </div>

              {/* Voice Command Recognition Badges */}
              <div className="py-2">
                <p className="text-[11px] font-mono text-[#D4AF37] uppercase mb-2">
                  Recognized Voice Commands:
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  <button
                    onClick={() => handleVoiceCommandAction("RECEIVE")}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-600/30 cursor-pointer"
                  >
                    <Phone className="w-4 h-4" />
                    <span>"Receive kar"</span>
                  </button>

                  <button
                    onClick={() => handleVoiceCommandAction("REJECT")}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-rose-600/30 cursor-pointer"
                  >
                    <PhoneOff className="w-4 h-4" />
                    <span>"Reject kar"</span>
                  </button>

                  <button
                    onClick={() => handleVoiceCommandAction("HOLD")}
                    className="px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs cursor-pointer"
                  >
                    <span>"Thamb" (Hold)</span>
                  </button>

                  <button
                    onClick={() => handleVoiceCommandAction("SPEAKER")}
                    className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs cursor-pointer"
                  >
                    <span>"Speaker lav"</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Execution Log */}
        {lastActionReport && (
          <div className="p-3.5 rounded-xl bg-[#14141c] border border-[#D4AF37]/30 text-xs font-mono flex items-center justify-between text-[#E6E6EB]">
            <span>{lastActionReport}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
          </div>
        )}
      </div>

      {/* Android Version & Technical Architecture Documentation */}
      <div className="p-6 rounded-2xl bg-[#0d0d12] border border-[#D4AF37]/25 shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-[#D4AF37]" />
          <h3 className="font-cinzel text-base font-bold text-[#FFF7D6]">
            ANDROID TELEPHONY & IN-CALL SERVICE ARCHITECTURE
          </h3>
        </div>

        <p className="text-xs text-[#A0A0AB] leading-relaxed">
          To provide legitimate, rock-solid hands-free call answering on Android devices without violating Google Play or OS security models, MAVLA AI implements the official Android Telecom Framework:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-[#14141c] border border-[#D4AF37]/20 space-y-2">
            <h4 className="font-semibold text-white">1. Android InCallService Implementation</h4>
            <p className="text-[#A0A0AB] text-[11px] leading-relaxed">
              MAVLA AI registers an <code className="text-[#D4AF37]">InCallService</code> subclass in <code className="text-[#D4AF37]">AndroidManifest.xml</code> with the <code className="text-[#D4AF37]">android.permission.BIND_INCALL_SERVICE</code> permission. When configured as a Default Dialer or Companion Assistant via <code className="text-[#D4AF37]">TelecomManager</code>, the OS routes all incoming call states to MAVLA AI.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#14141c] border border-[#D4AF37]/20 space-y-2">
            <h4 className="font-semibold text-white">2. OEM Restrictions & Locked-Screen Handling</h4>
            <p className="text-[#A0A0AB] text-[11px] leading-relaxed">
              On Android 10+ (API 29+), background microphone recording is restricted for apps not in the foreground. MAVLA AI utilizes a high-priority <code className="text-[#D4AF37]">Foreground Service</code> with type <code className="text-[#D4AF37]">FOREGROUND_SERVICE_TYPE_MICROPHONE</code> and locked-screen window flags (<code className="text-[#D4AF37]">FLAG_SHOW_WHEN_LOCKED</code>, <code className="text-[#D4AF37]">FLAG_TURN_SCREEN_ON</code>) to wake the screen when Aarya calls.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

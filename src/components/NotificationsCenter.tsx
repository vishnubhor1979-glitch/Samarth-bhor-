import React, { useState } from "react";
import { AppNotification } from "../types";
import { Bell, Volume2, Shield, EyeOff, CheckCircle2, Lock, MessageSquare, PhoneMissed } from "lucide-react";
import { speechService } from "../services/speechService";

interface NotificationsCenterProps {
  onLogMessage: (text: string, isUser?: boolean) => void;
}

export const NotificationsCenter: React.FC<NotificationsCenterProps> = ({
  onLogMessage,
}) => {
  const [spokenAnnouncements, setSpokenAnnouncements] = useState<boolean>(true);
  const [privateMode, setPrivateMode] = useState<boolean>(false);
  const [readMessageBody, setReadMessageBody] = useState<boolean>(false);

  // Per app settings
  const [appSettings, setAppSettings] = useState({
    WhatsApp: true,
    Instagram: true,
    Snapchat: true,
    Phone: true,
  });

  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: "notif-1",
      app: "WhatsApp",
      sender: "Aarya",
      preview: "Hey Samarth! Free aahes ka call sathi?",
      timestamp: "2 mins ago",
      read: false,
    },
    {
      id: "notif-2",
      app: "Phone",
      sender: "Aai (Mother)",
      preview: "Missed Call (1)",
      timestamp: "15 mins ago",
      read: false,
    },
    {
      id: "notif-3",
      app: "Instagram",
      sender: "Chikoo",
      preview: "Sent a reel: 'SMC Gold Scalping Setup'",
      timestamp: "32 mins ago",
      read: true,
    },
  ]);

  const simulateIncomingNotification = (app: "WhatsApp" | "Instagram" | "Phone", sender: string, preview: string) => {
    if (!appSettings[app]) {
      return;
    }

    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      app,
      sender,
      preview,
      timestamp: "Just now",
      read: false,
    };

    setNotifications((prev) => [newNotif, ...prev]);

    // Announce via Speech
    if (spokenAnnouncements) {
      let announcementText = "";
      if (app === "Phone" && preview.includes("Missed")) {
        announcementText = `Samarth, tula ${sender} cha missed call aala aahe.`;
      } else if (privateMode) {
        announcementText = `Samarth, ${app} var navin notification aali aahe.`;
      } else if (readMessageBody) {
        announcementText = `Samarth, ${sender} cha message aala aahe: "${preview}".`;
      } else {
        announcementText = `Samarth, ${sender} cha message aala aahe.`;
      }

      onLogMessage(`Ro (Notification Announcement): "${announcementText}"`);
      speechService.speak(announcementText, "mr-IN");
    }
  };

  const toggleAppSetting = (appName: keyof typeof appSettings) => {
    setAppSettings((prev) => ({ ...prev, [appName]: !prev[appName] }));
  };

  return (
    <div className="space-y-6">
      {/* Settings Card */}
      <div className="p-6 rounded-2xl bg-[#0d0d12] border border-[#D4AF37]/25 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#D4AF37]" />
              <h2 className="font-cinzel text-lg font-bold text-[#FFF7D6]">
                NOTIFICATION ANNOUNCEMENT ENGINE
              </h2>
            </div>
            <p className="text-xs text-[#A0A0AB] mt-1">
              Spoken notification reader with per-app controls & privacy guard
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSpokenAnnouncements(!spokenAnnouncements)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                spokenAnnouncements
                  ? "bg-[#D4AF37]/20 border-[#D4AF37] text-[#FFF7D6]"
                  : "bg-[#14141c] border-gray-700 text-[#70707D]"
              }`}
            >
              Voice Announcements: {spokenAnnouncements ? "ON" : "OFF"}
            </button>
          </div>
        </div>

        {/* Privacy & Reading Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          <div className="p-3.5 rounded-xl bg-[#14141c] border border-[#D4AF37]/20 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-white">Private Mode</p>
              <p className="text-[10px] text-[#70707D]">Announces app only, hides sender name in public</p>
            </div>
            <button
              onClick={() => setPrivateMode(!privateMode)}
              className={`px-2.5 py-1 rounded text-xs font-bold cursor-pointer ${
                privateMode ? "bg-purple-600 text-white" : "bg-gray-800 text-gray-400"
              }`}
            >
              {privateMode ? "ACTIVE" : "OFF"}
            </button>
          </div>

          <div className="p-3.5 rounded-xl bg-[#14141c] border border-[#D4AF37]/20 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-white">Read Message Content</p>
              <p className="text-[10px] text-[#70707D]">Speaks aloud preview of the message</p>
            </div>
            <button
              onClick={() => setReadMessageBody(!readMessageBody)}
              className={`px-2.5 py-1 rounded text-xs font-bold cursor-pointer ${
                readMessageBody ? "bg-[#D4AF37] text-black" : "bg-gray-800 text-gray-400"
              }`}
            >
              {readMessageBody ? "READ BODY" : "SENDER ONLY"}
            </button>
          </div>
        </div>

        {/* Per-App Controls */}
        <div className="pt-3 border-t border-[#D4AF37]/20">
          <h3 className="text-xs font-mono font-semibold text-[#D4AF37] mb-2 uppercase">
            Per-App Listeners:
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {(["WhatsApp", "Instagram", "Snapchat", "Phone"] as (keyof typeof appSettings)[]).map((app) => (
              <button
                key={app}
                onClick={() => toggleAppSetting(app)}
                className={`p-2.5 rounded-xl border text-xs font-medium flex items-center justify-between cursor-pointer ${
                  appSettings[app]
                    ? "bg-[#161622] text-white border-[#D4AF37]/40"
                    : "bg-[#0d0d12] text-[#60606d] border-white/5 line-through"
                }`}
              >
                <span>{app}</span>
                <CheckCircle2 className={`w-3.5 h-3.5 ${appSettings[app] ? "text-[#D4AF37]" : "text-gray-600"}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Test Notification Triggers */}
        <div className="mt-4 pt-4 border-t border-[#D4AF37]/20 flex flex-wrap gap-2">
          <button
            onClick={() => simulateIncomingNotification("WhatsApp", "Aarya", "Aarya: Ro aik, aaj bhetoy ka?")}
            className="px-3 py-1.5 rounded-lg bg-[#14141c] hover:bg-[#1d1d2b] text-xs text-[#FFF] border border-[#D4AF37]/30 cursor-pointer"
          >
            Trigger WhatsApp: Aarya
          </button>
          <button
            onClick={() => simulateIncomingNotification("Phone", "Aai", "Missed call from Aai")}
            className="px-3 py-1.5 rounded-lg bg-[#14141c] hover:bg-[#1d1d2b] text-xs text-[#FFF] border border-[#D4AF37]/30 cursor-pointer"
          >
            Trigger Missed Call: Aai
          </button>
          <button
            onClick={() => simulateIncomingNotification("Instagram", "Chikoo", "Chikoo liked your story")}
            className="px-3 py-1.5 rounded-lg bg-[#14141c] hover:bg-[#1d1d2b] text-xs text-[#FFF] border border-[#D4AF37]/30 cursor-pointer"
          >
            Trigger Instagram: Chikoo
          </button>
        </div>
      </div>

      {/* Notifications Stream */}
      <div className="p-6 rounded-2xl bg-[#0d0d12] border border-[#D4AF37]/25 shadow-xl">
        <h3 className="font-cinzel text-sm font-bold text-[#FFF7D6] mb-3">
          ACTIVE NOTIFICATIONS LOG
        </h3>

        <div className="space-y-2.5">
          {notifications.map((n) => (
            <div
              key={n.id}
              className="p-3 rounded-xl bg-[#14141c] border border-white/5 flex items-start justify-between gap-3 text-xs"
            >
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#1d1d2b] flex items-center justify-center text-[#D4AF37] shrink-0">
                  {n.app === "Phone" ? <PhoneMissed className="w-4 h-4 text-rose-400" /> : <MessageSquare className="w-4 h-4 text-[#D4AF37]" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{n.sender}</span>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-[#D4AF37]/15 text-[#D4AF37]">
                      {n.app}
                    </span>
                  </div>
                  <p className="text-[#A0A0AB] text-[11px] mt-0.5">{n.preview}</p>
                </div>
              </div>
              <span className="text-[10px] text-[#70707D] font-mono shrink-0">{n.timestamp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

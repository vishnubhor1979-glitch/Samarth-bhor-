import React, { useState, useEffect, useRef } from "react";
import { Navbar } from "./components/Navbar";
import { VoiceAssistantOrb } from "./components/VoiceAssistantOrb";
import { ChatView } from "./components/ChatView";
import { PhoneAutomationCenter } from "./components/PhoneAutomationCenter";
import { IncomingCallAssistant } from "./components/IncomingCallAssistant";
import { TradingAnalysisDashboard } from "./components/TradingAnalysisDashboard";
import { NotificationsCenter } from "./components/NotificationsCenter";
import { MemoryManager } from "./components/MemoryManager";
import { AndroidCodeExport } from "./components/AndroidCodeExport";
import { ChatMessage, PhoneIntent, UserMemory } from "./types";
import { speechService } from "./services/speechService";
import { sendChatMessage } from "./services/apiService";

const DEFAULT_MEMORY: UserMemory = {
  ownerName: "Samarth Bhor",
  assistantNickname: "Ro",
  preferredLanguage: "mr-IN", // Marathi
  speechRate: 1.0,
  speechPitch: 1.0,
  contactAliases: {
    Aarya: "Aarya (Friend)",
    Aai: "Mother",
    Chikoo: "Chikoo (Best Friend)",
    Baba: "Father",
  },
  favoriteInstruments: ["XAUUSD", "BTCUSD", "XAGUSD"],
  preferredStyle: "Intraday",
  notificationAnnouncements: true,
  privateNotificationMode: false,
  wakePhraseEnabled: true,
  wakePhrase: "Hey Ro / Ro aik",
};

export default function App() {
  const [activeTab, setActiveTab] = useState<
    "assistant" | "trading" | "phone" | "calls" | "notifications" | "memory" | "android"
  >("assistant");

  // User Memory state
  const [memory, setMemory] = useState<UserMemory>(() => {
    try {
      const saved = localStorage.getItem("mavla_memory_v3");
      return saved ? JSON.parse(saved) : DEFAULT_MEMORY;
    } catch {
      return DEFAULT_MEMORY;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("mavla_memory_v3", JSON.stringify(memory));
    } catch {}
  }, [memory]);

  // Messages state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-init-1",
      sender: "ro",
      text: "Namaskar Samarth! Ro here. MAVLA AI is online. 'YOUR VOICE. YOUR COMMANDS.'\nCasual Marathi speech or English, phone operations, incoming call assistance, ani XAUUSD / BTC multi-timeframe SMC market analysis sathi mi tayar aahe. 'Ro aik' mhanun command dya!",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      detectedLanguage: "Marathi",
    },
  ]);

  // Voice & Processing State
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [speechTranscript, setSpeechTranscript] = useState("");
  const [wakeWordDetected, setWakeWordDetected] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(memory.preferredLanguage);
  const [speechSpeed, setSpeechSpeed] = useState(memory.speechRate);
  const [currentIntent, setCurrentIntent] = useState<PhoneIntent | null>(null);
  const [tradingSymbolForView, setTradingSymbolForView] = useState("XAUUSD");

  // Speech service setup
  useEffect(() => {
    speechService.setCallbacks({
      onTranscriptChange: (transcript, isFinal) => {
        setSpeechTranscript(transcript);
        if (isFinal && transcript.trim().length > 1) {
          handleUserCommand(transcript.trim());
          setSpeechTranscript("");
        }
      },
      onWakeWordDetected: (wakeWord) => {
        setWakeWordDetected(true);
        setTimeout(() => setWakeWordDetected(false), 3000);
      },
      onListeningStateChange: (listening) => {
        setIsListening(listening);
      },
      onError: (err) => {
        console.warn("Speech recognition notice:", err);
      },
    });

    speechService.setLanguage(selectedLanguage);
  }, [selectedLanguage]);

  const handleToggleListening = () => {
    speechService.toggleListening();
  };

  const handleToggleMute = () => {
    if (!isMuted) {
      speechService.stopSpeaking();
    }
    setIsMuted(!isMuted);
  };

  const handleLanguageChange = (lang: string) => {
    setSelectedLanguage(lang);
    speechService.setLanguage(lang);
    setMemory((prev) => ({ ...prev, preferredLanguage: lang }));
  };

  const handleSpeedChange = (spd: number) => {
    setSpeechSpeed(spd);
    setMemory((prev) => ({ ...prev, speechRate: spd }));
  };

  const handleUserCommand = async (commandText: string) => {
    // Add user message to conversation
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-u`,
      sender: "user",
      text: commandText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsThinking(true);

    try {
      const response = await sendChatMessage(commandText, messages, memory);

      const roMsg: ChatMessage = {
        id: `msg-${Date.now()}-r`,
        sender: "ro",
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        detectedLanguage: response.detectedLanguage,
        intent: response.intent,
      };

      setMessages((prev) => [...prev, roMsg]);

      // Speak response aloud if not muted
      if (!isMuted && response.speechSynthesisText) {
        setIsSpeaking(true);
        const langCode =
          response.detectedLanguage === "Marathi"
            ? "mr-IN"
            : response.detectedLanguage === "Hindi"
            ? "hi-IN"
            : selectedLanguage;

        await speechService.speak(
          response.speechSynthesisText,
          langCode,
          speechSpeed,
          memory.speechPitch
        );
        setIsSpeaking(false);
      }

      // Handle extracted action intent
      if (response.intent && response.intent.action !== "GENERAL_CHAT") {
        setCurrentIntent(response.intent);

        if (response.intent.action === "TRADING_ANALYSIS") {
          if (response.intent.symbol) {
            setTradingSymbolForView(response.intent.symbol);
          }
          setActiveTab("trading");
        } else if (
          response.intent.action === "OPEN_APP" ||
          response.intent.action === "PREPARE_MESSAGE"
        ) {
          setActiveTab("phone");
        } else if (response.intent.action === "INCOMING_CALL_ACTION") {
          setActiveTab("calls");
        } else if (response.intent.action === "READ_NOTIFICATIONS") {
          setActiveTab("notifications");
        }
      }
    } catch (err: any) {
      console.error("Failed to process command:", err);
    } finally {
      setIsThinking(false);
    }
  };

  const handleReplayAudio = async (text: string, lang = "Marathi") => {
    if (isMuted) return;
    setIsSpeaking(true);
    const langCode = lang === "Marathi" ? "mr-IN" : lang === "Hindi" ? "hi-IN" : "en-IN";
    await speechService.speak(text, langCode, speechSpeed);
    setIsSpeaking(false);
  };

  const handleTriggerIntentAction = (intent: PhoneIntent) => {
    setCurrentIntent(intent);
    if (intent.action === "TRADING_ANALYSIS") {
      if (intent.symbol) setTradingSymbolForView(intent.symbol);
      setActiveTab("trading");
    } else if (intent.action === "OPEN_APP" || intent.action === "PREPARE_MESSAGE") {
      setActiveTab("phone");
    } else if (intent.action === "INCOMING_CALL_ACTION") {
      setActiveTab("calls");
    } else if (intent.action === "READ_NOTIFICATIONS") {
      setActiveTab("notifications");
    }
  };

  const handleLogMessage = (text: string, isUser = false) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        sender: isUser ? "user" : "ro",
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        detectedLanguage: "Marathi",
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-[#070709] text-[#E6E6EB] flex flex-col font-sans">
      {/* Header & Brand Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isListening={isListening}
        onToggleListening={handleToggleListening}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        wakeWordDetected={wakeWordDetected}
      />

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-6">
        {/* Ro Assistant View: Voice Orb + Live Chat Stream */}
        {activeTab === "assistant" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 space-y-6">
              <VoiceAssistantOrb
                isListening={isListening}
                isSpeaking={isSpeaking}
                isThinking={isThinking}
                transcript={speechTranscript}
                onMicToggle={handleToggleListening}
                onSendPresetCommand={handleUserCommand}
                selectedLanguage={selectedLanguage}
                onSelectLanguage={handleLanguageChange}
                speechSpeed={speechSpeed}
                onSpeedChange={handleSpeedChange}
                wakeWordDetected={wakeWordDetected}
              />
            </div>

            <div className="lg:col-span-6">
              <ChatView
                messages={messages}
                onSendMessage={handleUserCommand}
                onReplayAudio={handleReplayAudio}
                onTriggerIntentAction={handleTriggerIntentAction}
                onClearChat={() => setMessages([])}
                isProcessing={isThinking}
              />
            </div>
          </div>
        )}

        {/* Advanced Trading AI (SMC / ICT Multi-Timeframe) */}
        {activeTab === "trading" && (
          <TradingAnalysisDashboard
            initialSymbol={tradingSymbolForView}
            onLogMessage={handleLogMessage}
          />
        )}

        {/* Android Phone Automation Center */}
        {activeTab === "phone" && (
          <PhoneAutomationCenter
            currentIntent={currentIntent}
            onClearIntent={() => setCurrentIntent(null)}
            onLogMessage={handleLogMessage}
          />
        )}

        {/* Smart Incoming Call Assistant */}
        {activeTab === "calls" && (
          <IncomingCallAssistant onLogMessage={handleLogMessage} />
        )}

        {/* Notification Announcements */}
        {activeTab === "notifications" && (
          <NotificationsCenter onLogMessage={handleLogMessage} />
        )}

        {/* Personal Memory Vault */}
        {activeTab === "memory" && (
          <MemoryManager
            memory={memory}
            onUpdateMemory={setMemory}
            onLogMessage={handleLogMessage}
          />
        )}

        {/* Android Native Kotlin Source & APK Instructions */}
        {activeTab === "android" && <AndroidCodeExport />}
      </main>

      {/* Footer Credential */}
      <footer className="py-4 border-t border-[#D4AF37]/15 bg-[#050508] text-center text-xs text-[#70707D]">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-2">
          <p className="font-mono">
            MAVLA AI • Designed & Developed by{" "}
            <span className="text-[#D4AF37] font-semibold">Samarth Bhor</span>
          </p>
          <p className="text-[11px] text-[#A0A0AB]">
            Tagline: <span className="text-[#FFF7D6]">YOUR VOICE. YOUR COMMANDS.</span>
          </p>
          <p className="text-[11px]">
            Assistant Nickname: <span className="text-[#D4AF37]">Ro</span> • Black & Gold Android Edition
          </p>
        </div>
      </footer>
    </div>
  );
}

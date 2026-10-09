import React, { useState, useRef, useEffect } from "react";
import { ChatMessage, PhoneIntent } from "../types";
import { Send, Volume2, Sparkles, Smartphone, TrendingUp, User, Bot, Trash2 } from "lucide-react";

interface ChatViewProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onReplayAudio: (text: string, lang?: string) => void;
  onTriggerIntentAction: (intent: PhoneIntent) => void;
  onClearChat: () => void;
  isProcessing: boolean;
}

export const ChatView: React.FC<ChatViewProps> = ({
  messages,
  onSendMessage,
  onReplayAudio,
  onTriggerIntentAction,
  onClearChat,
  isProcessing,
}) => {
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isProcessing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isProcessing) return;
    onSendMessage(inputText);
    setInputText("");
  };

  return (
    <div className="flex flex-col h-[560px] rounded-2xl bg-[#0d0d12] border border-[#D4AF37]/25 shadow-xl overflow-hidden">
      {/* Chat Header */}
      <div className="px-4 py-3 bg-[#111118] border-b border-[#D4AF37]/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-[#D4AF37]" />
          <span className="text-xs font-semibold font-mono tracking-wider text-[#FFF7D6] uppercase">
            CONVERSATION WITH RO (MAVLA AI)
          </span>
        </div>
        <button
          onClick={onClearChat}
          title="Clear Conversation"
          className="text-xs text-[#70707D] hover:text-red-400 p-1.5 rounded-lg hover:bg-[#1b1b24] transition-all cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#A0A0AB]">
            <Sparkles className="w-8 h-8 text-[#D4AF37]/40 mb-2" />
            <p className="text-sm font-semibold text-[#E6E6EB]">
              Namaskar Samarth! Ro is ready for your voice.
            </p>
            <p className="text-xs text-[#70707D] mt-1 max-w-sm">
              Say "Ro aik", "Instagram open kar", "Aarya la hii pathav", or "Gold cha chart analyse kar".
            </p>
          </div>
        )}

        {messages.map((msg) => {
          const isUser = msg.sender === "user";
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
            >
              <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-[#70707D] font-mono">
                {isUser ? (
                  <>
                    <span>Samarth Bhor</span>
                    <User className="w-3 h-3 text-[#D4AF37]" />
                  </>
                ) : (
                  <>
                    <Bot className="w-3 h-3 text-[#D4AF37]" />
                    <span className="text-[#D4AF37]">Ro (MAVLA AI)</span>
                    {msg.detectedLanguage && (
                      <span className="px-1.5 py-0.2 rounded bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30">
                        {msg.detectedLanguage}
                      </span>
                    )}
                  </>
                )}
                <span>• {msg.timestamp}</span>
              </div>

              {/* Message Bubble */}
              <div
                className={`relative max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-md ${
                  isUser
                    ? "bg-gradient-to-r from-[#AA771C]/25 to-[#D4AF37]/30 text-[#FFF] border border-[#D4AF37]/40 rounded-tr-sm"
                    : "bg-[#14141c] text-[#E6E6EB] border border-[#D4AF37]/20 rounded-tl-sm"
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>

                {/* Intent Card if Ro extracted an action */}
                {msg.intent && msg.intent.action !== "GENERAL_CHAT" && (
                  <div className="mt-3 pt-2 border-t border-[#D4AF37]/20 flex flex-col gap-1.5">
                    <div className="text-[10px] font-mono font-semibold text-[#D4AF37] uppercase flex items-center gap-1">
                      {msg.intent.action === "TRADING_ANALYSIS" ? (
                        <TrendingUp className="w-3 h-3 text-[#D4AF37]" />
                      ) : (
                        <Smartphone className="w-3 h-3 text-[#D4AF37]" />
                      )}
                      <span>Detected Intent: {msg.intent.action.replace("_", " ")}</span>
                    </div>

                    {msg.intent.targetApp && (
                      <div className="text-[11px] text-[#A0A0AB]">
                        App: <span className="text-white font-medium">{msg.intent.targetApp}</span>
                      </div>
                    )}

                    {msg.intent.recipient && (
                      <div className="text-[11px] text-[#A0A0AB]">
                        Recipient: <span className="text-[#D4AF37] font-medium">{msg.intent.recipient}</span>
                        {msg.intent.message && <span> • Message: "{msg.intent.message}"</span>}
                      </div>
                    )}

                    {msg.intent.symbol && (
                      <div className="text-[11px] text-[#A0A0AB]">
                        Instrument: <span className="text-white font-medium">{msg.intent.symbol}</span>
                      </div>
                    )}

                    <button
                      onClick={() => onTriggerIntentAction(msg.intent!)}
                      className="mt-1 px-2.5 py-1 rounded bg-[#D4AF37]/20 hover:bg-[#D4AF37]/35 text-[#FFF7D6] border border-[#D4AF37]/40 text-[11px] font-medium transition-all w-fit cursor-pointer"
                    >
                      Execute / View Details →
                    </button>
                  </div>
                )}

                {/* Speech Replay Button */}
                {!isUser && (
                  <button
                    onClick={() => onReplayAudio(msg.text, msg.detectedLanguage)}
                    title="Speak Aloud"
                    className="absolute -bottom-2 -right-2 p-1 rounded-full bg-[#1e1e2c] border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all shadow-sm cursor-pointer"
                  >
                    <Volume2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {isProcessing && (
          <div className="flex items-center gap-2 text-xs text-[#D4AF37] font-mono">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            <span>Ro is thinking & checking context...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <form
        onSubmit={handleSubmit}
        className="p-3 bg-[#111118] border-t border-[#D4AF37]/20 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Command Ro in Marathi, Hindi, or English..."
          disabled={isProcessing}
          className="flex-1 bg-[#09090d] border border-[#D4AF37]/30 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#70707D] focus:outline-none focus:border-[#D4AF37] transition-all"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isProcessing}
          className="p-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA771C] text-black font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-all cursor-pointer shadow-md shadow-[#D4AF37]/20"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

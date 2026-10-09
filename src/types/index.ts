export type SupportedLanguage = 
  | "Marathi" 
  | "Hindi" 
  | "English" 
  | "Gujarati" 
  | "Bengali" 
  | "Punjabi" 
  | "Tamil" 
  | "Telugu" 
  | "Kannada" 
  | "Malayalam" 
  | "Urdu" 
  | "Nepali" 
  | "Spanish" 
  | "French" 
  | "German" 
  | "Arabic" 
  | "Japanese" 
  | "Russian" 
  | "Portuguese";

export interface PhoneIntent {
  action: "GENERAL_CHAT" | "OPEN_APP" | "PREPARE_MESSAGE" | "INCOMING_CALL_ACTION" | "TRADING_ANALYSIS" | "READ_NOTIFICATIONS" | "SET_REMINDER";
  targetApp?: "Instagram" | "WhatsApp" | "Snapchat" | "TradingView" | "Camera" | "YouTube" | "Settings" | "Phone" | null;
  recipient?: string | null;
  message?: string | null;
  callAction?: "RECEIVE" | "REJECT" | "SPEAKER" | "HOLD" | null;
  symbol?: string | null;
  tradingStyle?: "INTRADAY" | "SCALPING" | "SWING" | "LONG_HOLDING" | null;
  timeframe?: string | null;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ro";
  text: string;
  timestamp: string;
  detectedLanguage?: string;
  intent?: PhoneIntent;
  audioSpoken?: boolean;
}

export interface Candle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface LiquidityPool {
  id: string;
  type: "BSL" | "SSL" | "EQH" | "EQL" | "PDH" | "PDL" | "PWH" | "PWL";
  price: number;
  label: string;
  isSwept: boolean;
  timeframe: string;
}

export interface FairValueGap {
  id: string;
  type: "BULLISH_FVG" | "BEARISH_FVG" | "IFVG";
  topPrice: number;
  bottomPrice: number;
  startIndex: number;
  endIndex: number;
  isMitigated: boolean;
  label: string;
}

export interface OrderBlock {
  id: string;
  type: "BULLISH_OB" | "BEARISH_OB";
  topPrice: number;
  bottomPrice: number;
  startIndex: number;
  isMitigated: boolean;
  label: string;
}

export interface MarketStructureMarker {
  index: number;
  price: number;
  type: "BOS" | "CHoCH" | "MSS";
  direction: "BULLISH" | "BEARISH";
  label: string;
}

export interface TrendlineAnnotation {
  startIndex: number;
  startPrice: number;
  endIndex: number;
  endPrice: number;
  direction: "BULLISH" | "BEARISH";
  label: string;
  broken: boolean;
}

export type TradingStyle = "Long Holding" | "Swing Trading" | "Intraday" | "Scalping";

export interface TradingAnalysisReport {
  instrument: string;
  timestamp: string;
  tradingStyle: TradingStyle;
  htfBias: "BULLISH" | "BEARISH" | "NEUTRAL";
  ltfStructure: string;
  liquidityConditions: string;
  supportResistance: string;
  supplyDemand: string;
  fvgAndOrderBlocks: string;
  sweepStatus: "CONFIRMED_SWEEP" | "SUSPECTED_SWEEP" | "PENDING_SWEEP" | "NO_SWEEP";
  confirmationStatus: "CONFIRMED" | "WAITING_DISPLACEMENT" | "INCOMPLETE";
  tradeDecision: "BUY" | "SELL" | "NO_TRADE";
  potentialEntry: number;
  stopLoss: number;
  tp1: number;
  tp2: number;
  tp3: number;
  tp4: number;
  tp5: number;
  riskToReward: string;
  invalidationConditions: string;
  reasonsToAvoid: string;
  marathiSummary: string;
  englishSummary: string;
}

export interface UserMemory {
  ownerName: string;
  assistantNickname: string;
  preferredLanguage: string;
  speechRate: number;
  speechPitch: number;
  contactAliases: Record<string, string>;
  favoriteInstruments: string[];
  preferredStyle: TradingStyle;
  notificationAnnouncements: boolean;
  privateNotificationMode: boolean;
  wakePhraseEnabled: boolean;
  wakePhrase: string;
}

export interface IncomingCallSimulation {
  active: boolean;
  callerName: string;
  callerNumber: string;
  appSource: "Phone" | "WhatsApp";
  status: "RINGING" | "ACCEPTED" | "REJECTED" | "IDLE";
  speakerOn: boolean;
}

export interface AppNotification {
  id: string;
  app: "WhatsApp" | "Instagram" | "Snapchat" | "Phone";
  sender: string;
  preview: string;
  timestamp: string;
  read: boolean;
}

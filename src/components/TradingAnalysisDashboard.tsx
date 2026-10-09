import React, { useState, useEffect, useMemo } from "react";
import { TradingStyle, TradingAnalysisReport } from "../types";
import { generateCandleData, generatePineScript, ChartPackage } from "../services/chartDataGenerator";
import { requestTradingAnalysis } from "../services/apiService";
import { 
  TrendingUp, 
  Layers, 
  ShieldAlert, 
  CheckCircle2, 
  Copy, 
  Check, 
  RefreshCw, 
  Sparkles, 
  Volume2, 
  Crosshair, 
  Zap,
  BarChart3,
  SlidersHorizontal
} from "lucide-react";
import { speechService } from "../services/speechService";

interface TradingAnalysisDashboardProps {
  onLogMessage: (text: string, isUser?: boolean) => void;
  initialSymbol?: string;
}

export const TradingAnalysisDashboard: React.FC<TradingAnalysisDashboardProps> = ({
  onLogMessage,
  initialSymbol = "XAUUSD",
}) => {
  const [symbol, setSymbol] = useState<string>(initialSymbol);
  const [tradingStyle, setTradingStyle] = useState<TradingStyle>("Intraday");
  const [timeframe, setTimeframe] = useState<string>("15M");
  const [chartData, setChartData] = useState<ChartPackage>(() => generateCandleData(initialSymbol, "15M"));
  const [report, setReport] = useState<TradingAnalysisReport | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedPine, setCopiedPine] = useState<boolean>(false);

  // Annotation layer visibility toggles
  const [showLiquidity, setShowLiquidity] = useState(true);
  const [showFVG, setShowFVG] = useState(true);
  const [showOB, setShowOB] = useState(true);
  const [showStructure, setShowStructure] = useState(true);
  const [showEquilibrium, setShowEquilibrium] = useState(true);
  const [showTrendlines, setShowTrendlines] = useState(true);

  // Timeframe configurations per style as strictly specified in prompt:
  // Long holding: Monthly, Weekly, Daily, 4H, and 1H.
  // Swing trading: Weekly, Daily, 4H, and 1H.
  // Intraday: 4H, 1H, 15M, and 5M.
  // Scalping: 15M, 5M, 3M, and 1M.
  const timeframesForStyle: Record<TradingStyle, string[]> = {
    "Long Holding": ["Monthly", "Weekly", "Daily", "4H", "1H"],
    "Swing Trading": ["Weekly", "Daily", "4H", "1H"],
    "Intraday": ["4H", "1H", "15M", "5M"],
    "Scalping": ["15M", "5M", "3M", "1M"],
  };

  // Re-generate chart when symbol or timeframe changes
  useEffect(() => {
    const pkg = generateCandleData(symbol, timeframe);
    setChartData(pkg);
    runAnalysis(symbol, timeframe, tradingStyle, pkg);
  }, [symbol, timeframe]);

  // Handle style change
  const handleStyleChange = (newStyle: TradingStyle) => {
    setTradingStyle(newStyle);
    const validTfs = timeframesForStyle[newStyle];
    if (!validTfs.includes(timeframe)) {
      setTimeframe(validTfs[0]);
    }
  };

  const runAnalysis = async (
    targetSymbol: string,
    targetTf: string,
    targetStyle: TradingStyle,
    pkg: ChartPackage
  ) => {
    setIsLoading(true);
    const currentPrice = pkg.candles[pkg.candles.length - 1]?.close || 2684.5;
    try {
      const rep = await requestTradingAnalysis(
        targetSymbol,
        targetTf,
        targetStyle,
        currentPrice,
        pkg.candles
      );
      setReport(rep);
      onLogMessage(
        `Ro: Samarth, ${targetSymbol} (${targetTf}) cha SMC analysis report tayar aahe. Bias: ${rep.htfBias}, Sweep: ${rep.sweepStatus}.`
      );
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeakReport = () => {
    if (report) {
      speechService.speak(report.marathiSummary, "mr-IN");
    }
  };

  const copyPineScriptToClipboard = () => {
    const script = generatePineScript(symbol, timeframe);
    navigator.clipboard.writeText(script);
    setCopiedPine(true);
    setTimeout(() => setCopiedPine(false), 2000);
  };

  // SVG Chart Dimensions & Math
  const candles = chartData.candles;
  const svgWidth = 840;
  const svgHeight = 360;
  const padding = { top: 30, right: 70, bottom: 30, left: 20 };

  const { minPrice, maxPrice, priceToY, indexToX, candleWidth } = useMemo(() => {
    if (!candles.length) return { minPrice: 0, maxPrice: 1, priceToY: () => 0, indexToX: () => 0, candleWidth: 8 };

    const lows = candles.map((c) => c.low);
    const highs = candles.map((c) => c.high);
    const minP = Math.min(...lows) * 0.999;
    const maxP = Math.max(...highs) * 1.001;

    const plotHeight = svgHeight - padding.top - padding.bottom;
    const plotWidth = svgWidth - padding.left - padding.right;

    const pToY = (price: number) => {
      return padding.top + plotHeight - ((price - minP) / (maxP - minP)) * plotHeight;
    };

    const cW = Math.max(4, Math.floor(plotWidth / candles.length) - 3);

    const iToX = (idx: number) => {
      return padding.left + (idx / (candles.length - 1)) * plotWidth;
    };

    return {
      minPrice: minP,
      maxPrice: maxP,
      priceToY: pToY,
      indexToX: iToX,
      candleWidth: cW,
    };
  }, [candles]);

  const currentPrice = candles[candles.length - 1]?.close || 0;

  return (
    <div className="space-y-6">
      {/* Dashboard Top Header & Instrument Selectors */}
      <div className="p-6 rounded-2xl bg-[#0d0d12] border border-[#D4AF37]/25 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#D4AF37]" />
              <h2 className="font-cinzel text-lg font-bold text-[#FFF7D6]">
                ADVANCED SMC & ICT TRADING ENGINE
              </h2>
            </div>
            <p className="text-xs text-[#A0A0AB] mt-1">
              Multi-Timeframe Liquidity Analysis • Order Blocks • Fair Value Gaps • Sweep Entry Planning
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => runAnalysis(symbol, timeframe, tradingStyle, chartData)}
              disabled={isLoading}
              className="px-3 py-1.5 rounded-lg bg-[#191926] hover:bg-[#252538] text-xs font-semibold text-[#D4AF37] border border-[#D4AF37]/30 flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
              <span>Refresh SMC Feed</span>
            </button>

            <button
              onClick={copyPineScriptToClipboard}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#AA771C] text-black font-semibold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              {copiedPine ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedPine ? "Copied Pine Script!" : "TradingView Indicator"}</span>
            </button>
          </div>
        </div>

        {/* Instrument & Trading Style Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[#D4AF37]/20">
          {/* Instruments */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            <span className="text-xs font-mono text-[#70707D] mr-1">PAIR:</span>
            {["XAUUSD", "BTCUSD", "XAGUSD", "EURUSD", "GBPUSD", "US30", "NAS100", "NIFTY 50"].map((inst) => (
              <button
                key={inst}
                onClick={() => setSymbol(inst)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  symbol === inst
                    ? "bg-[#D4AF37] text-black shadow-md shadow-[#D4AF37]/30"
                    : "bg-[#14141c] text-[#A0A0AB] hover:text-white border border-[#D4AF37]/20"
                }`}
              >
                {inst}
              </button>
            ))}
          </div>

          {/* Trading Styles */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            <span className="text-xs font-mono text-[#70707D] mr-1">STYLE:</span>
            {(["Long Holding", "Swing Trading", "Intraday", "Scalping"] as TradingStyle[]).map((style) => (
              <button
                key={style}
                onClick={() => handleStyleChange(style)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  tradingStyle === style
                    ? "bg-[#AA771C] text-white border border-[#D4AF37] shadow-sm"
                    : "bg-[#14141c] text-[#A0A0AB] hover:text-white"
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        {/* Timeframe Switcher */}
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#D4AF37]/10 overflow-x-auto">
          <span className="text-xs font-mono text-[#70707D]">TIMEFRAMES ({tradingStyle}):</span>
          {timeframesForStyle[tradingStyle].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold cursor-pointer ${
                timeframe === tf
                  ? "bg-[#D4AF37]/25 text-[#FFF7D6] border border-[#D4AF37]"
                  : "text-[#70707D] hover:text-white hover:bg-[#1a1a24]"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Candlestick Chart with Automated ICT Annotations */}
      <div className="p-6 rounded-2xl bg-[#0a0a0f] border border-[#D4AF37]/25 shadow-2xl relative overflow-hidden">
        {/* Layer Toggle Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-[#D4AF37]/15">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-[#D4AF37] flex items-center gap-1">
              <Crosshair className="w-3.5 h-3.5" />
              <span>{symbol} • {timeframe} • ${currentPrice.toFixed(2)}</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[11px] text-[#70707D] font-mono mr-1">LAYERS:</span>
            {[
              { label: "Liquidity Pools (BSL/SSL)", state: showLiquidity, set: setShowLiquidity, color: "text-amber-400" },
              { label: "FVG & IFVG", state: showFVG, set: setShowFVG, color: "text-yellow-300" },
              { label: "Order Blocks (OB)", state: showOB, set: setShowOB, color: "text-emerald-400" },
              { label: "Structure (BOS/MSS)", state: showStructure, set: setShowStructure, color: "text-blue-400" },
              { label: "50% EQ & OTE", state: showEquilibrium, set: setShowEquilibrium, color: "text-purple-400" },
              { label: "Trendlines", state: showTrendlines, set: setShowTrendlines, color: "text-cyan-400" },
            ].map((layer, idx) => (
              <button
                key={idx}
                onClick={() => layer.set(!layer.state)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                  layer.state
                    ? `bg-[#1a1a28] ${layer.color} border border-[#D4AF37]/30`
                    : "bg-[#101016] text-[#555562] line-through"
                }`}
              >
                {layer.label}
              </button>
            ))}
          </div>
        </div>

        {/* SVG Interactive Candlestick Chart */}
        <div className="w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-[360px] select-none"
          >
            {/* Grid Lines */}
            {[0.2, 0.4, 0.6, 0.8].map((pct, i) => {
              const y = padding.top + (svgHeight - padding.top - padding.bottom) * pct;
              const p = maxPrice - (maxPrice - minPrice) * pct;
              return (
                <g key={i}>
                  <line
                    x1={padding.left}
                    y1={y}
                    x2={svgWidth - padding.right}
                    y2={y}
                    stroke="#181822"
                    strokeDasharray="3 3"
                  />
                  <text
                    x={svgWidth - padding.right + 6}
                    y={y + 3}
                    fill="#60606d"
                    fontSize="9"
                    fontFamily="JetBrains Mono"
                  >
                    {p.toFixed(2)}
                  </text>
                </g>
              );
            })}

            {/* Premium / Discount / 50% Equilibrium Zone */}
            {showEquilibrium && (
              <g>
                {/* 50% Equilibrium Line */}
                <line
                  x1={padding.left}
                  y1={priceToY(chartData.equilibrium)}
                  x2={svgWidth - padding.right}
                  y2={priceToY(chartData.equilibrium)}
                  stroke="#A855F7"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
                <text
                  x={padding.left + 8}
                  y={priceToY(chartData.equilibrium) - 4}
                  fill="#C084FC"
                  fontSize="9"
                  fontFamily="JetBrains Mono"
                  fontWeight="bold"
                >
                  50% EQUILIBRIUM (${chartData.equilibrium})
                </text>

                {/* OTE (Optimal Trade Entry 0.618 - 0.786) Shaded Box */}
                <rect
                  x={padding.left}
                  y={priceToY(chartData.oteZone.top)}
                  width={svgWidth - padding.left - padding.right}
                  height={Math.max(4, priceToY(chartData.oteZone.bottom) - priceToY(chartData.oteZone.top))}
                  fill="rgba(168, 85, 247, 0.08)"
                  stroke="rgba(168, 85, 247, 0.3)"
                  strokeDasharray="2 2"
                />
                <text
                  x={svgWidth - padding.right - 140}
                  y={priceToY(chartData.oteZone.top) + 12}
                  fill="#D8B4FE"
                  fontSize="9"
                  fontFamily="JetBrains Mono"
                >
                  OTE (0.618 - 0.786 FIB)
                </text>
              </g>
            )}

            {/* Fair Value Gaps (FVG) */}
            {showFVG &&
              chartData.fvgs.map((fvg) => {
                const x1 = indexToX(fvg.startIndex);
                const x2 = indexToX(fvg.endIndex);
                const yTop = priceToY(fvg.topPrice);
                const yBottom = priceToY(fvg.bottomPrice);
                const height = Math.max(4, yBottom - yTop);
                return (
                  <g key={fvg.id}>
                    <rect
                      x={x1}
                      y={yTop}
                      width={Math.max(12, x2 - x1)}
                      height={height}
                      fill="rgba(245, 158, 11, 0.18)"
                      stroke="#F59E0B"
                      strokeWidth="1"
                      strokeDasharray="3 2"
                    />
                    <text
                      x={x1 + 4}
                      y={yTop + 11}
                      fill="#FBBF24"
                      fontSize="9"
                      fontFamily="JetBrains Mono"
                      fontWeight="bold"
                    >
                      {fvg.label}
                    </text>
                  </g>
                );
              })}

            {/* Order Blocks (OB) */}
            {showOB &&
              chartData.orderBlocks.map((ob) => {
                const x = indexToX(ob.startIndex);
                const yTop = priceToY(ob.topPrice);
                const yBottom = priceToY(ob.bottomPrice);
                const height = Math.max(4, yBottom - yTop);
                return (
                  <g key={ob.id}>
                    <rect
                      x={x}
                      y={yTop}
                      width={svgWidth - padding.right - x}
                      height={height}
                      fill="rgba(212, 175, 55, 0.15)"
                      stroke="#D4AF37"
                      strokeWidth="1.2"
                    />
                    <text
                      x={x + 4}
                      y={yTop + 12}
                      fill="#FFF7D6"
                      fontSize="9"
                      fontFamily="JetBrains Mono"
                      fontWeight="bold"
                    >
                      {ob.label}
                    </text>
                  </g>
                );
              })}

            {/* Liquidity Pools (BSL / SSL / EQH / PDH / PDL) */}
            {showLiquidity &&
              chartData.liquidityPools.map((pool) => {
                const y = priceToY(pool.price);
                const isSwept = pool.isSwept;
                const strokeColor = isSwept ? "#10B981" : pool.type.startsWith("B") ? "#F59E0B" : "#EC4899";
                return (
                  <g key={pool.id}>
                    <line
                      x1={padding.left}
                      y1={y}
                      x2={svgWidth - padding.right}
                      y2={y}
                      stroke={strokeColor}
                      strokeWidth={isSwept ? "1.5" : "1"}
                      strokeDasharray={isSwept ? "none" : "4 3"}
                    />
                    <rect
                      x={padding.left + 4}
                      y={y - 14}
                      width={180}
                      height={14}
                      fill="#0d0d14"
                      rx="2"
                    />
                    <text
                      x={padding.left + 8}
                      y={y - 3}
                      fill={strokeColor}
                      fontSize="9"
                      fontFamily="JetBrains Mono"
                      fontWeight="bold"
                    >
                      {pool.label} {isSwept ? "[✓ SWEPT]" : "[TARGET]"}
                    </text>
                  </g>
                );
              })}

            {/* Dynamic Trendlines */}
            {showTrendlines &&
              chartData.trendlines.map((tl, i) => {
                const x1 = indexToX(tl.startIndex);
                const y1 = priceToY(tl.startPrice);
                const x2 = indexToX(tl.endIndex);
                const y2 = priceToY(tl.endPrice);
                return (
                  <g key={i}>
                    <line
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="#06B6D4"
                      strokeWidth="1.5"
                      strokeDasharray="5 3"
                    />
                    <text
                      x={x2 - 120}
                      y={y2 - 6}
                      fill="#22D3EE"
                      fontSize="8"
                      fontFamily="JetBrains Mono"
                    >
                      {tl.label}
                    </text>
                  </g>
                );
              })}

            {/* Candlesticks */}
            {candles.map((c, i) => {
              const x = indexToX(i);
              const yOpen = priceToY(c.open);
              const yClose = priceToY(c.close);
              const yHigh = priceToY(c.high);
              const yLow = priceToY(c.low);
              const isBull = c.close >= c.open;
              const candleColor = isBull ? "#10B981" : "#EF4444";
              const candleTop = Math.min(yOpen, yClose);
              const candleHeight = Math.max(2, Math.abs(yClose - yOpen));

              return (
                <g key={i}>
                  {/* Wick */}
                  <line
                    x1={x}
                    y1={yHigh}
                    x2={x}
                    y2={yLow}
                    stroke={candleColor}
                    strokeWidth="1.2"
                  />
                  {/* Body */}
                  <rect
                    x={x - candleWidth / 2}
                    y={candleTop}
                    width={candleWidth}
                    height={candleHeight}
                    fill={isBull ? "#10B981" : "#EF4444"}
                    stroke={isBull ? "#059669" : "#DC2626"}
                    strokeWidth="0.8"
                    rx="1"
                  />
                </g>
              );
            })}

            {/* Structure Markers (MSS / BOS / CHoCH) */}
            {showStructure &&
              chartData.structureMarkers.map((sm, i) => {
                const x = indexToX(sm.index);
                const y = priceToY(sm.price);
                return (
                  <g key={i}>
                    <circle cx={x} cy={y} r="3" fill="#D4AF37" />
                    <text
                      x={x + 5}
                      y={y - 5}
                      fill="#FFF7D6"
                      fontSize="9"
                      fontFamily="JetBrains Mono"
                      fontWeight="bold"
                    >
                      {sm.label}
                    </text>
                  </g>
                );
              })}

            {/* Current Price Marker */}
            <g>
              <line
                x1={padding.left}
                y1={priceToY(currentPrice)}
                x2={svgWidth - padding.right}
                y2={priceToY(currentPrice)}
                stroke="#D4AF37"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
              <rect
                x={svgWidth - padding.right + 2}
                y={priceToY(currentPrice) - 8}
                width={62}
                height={16}
                fill="#D4AF37"
                rx="3"
              />
              <text
                x={svgWidth - padding.right + 6}
                y={priceToY(currentPrice) + 4}
                fill="#000"
                fontSize="10"
                fontFamily="JetBrains Mono"
                fontWeight="bold"
              >
                {currentPrice.toFixed(2)}
              </text>
            </g>
          </svg>
        </div>
      </div>

      {/* Structured Pre-Trade Report (Section 14 & 13) */}
      {report && (
        <div className="p-6 rounded-2xl bg-[#0d0d12] border border-[#D4AF37]/25 shadow-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#D4AF37]/20">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold ${
                report.tradeDecision === "BUY"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  : report.tradeDecision === "SELL"
                  ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                  : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
              }`}>
                SIGNAL: {report.tradeDecision}
              </span>
              <h3 className="font-cinzel text-base font-bold text-white">
                STRUCTURED PRE-TRADE ANALYSIS ({report.instrument})
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSpeakReport}
                className="px-3 py-1.5 rounded-lg bg-[#14141c] hover:bg-[#1e1e2c] text-xs text-[#D4AF37] border border-[#D4AF37]/30 flex items-center gap-1.5 cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Hear Ro Summary (Marathi)</span>
              </button>
            </div>
          </div>

          {/* Marathi Executive Voice Summary */}
          <div className="p-3.5 rounded-xl bg-[#14141c] border border-[#D4AF37]/30 text-xs text-[#FFF7D6] flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white">Ro's Summary for Samarth Bhor:</p>
              <p className="mt-0.5 text-[#E6E6EB] leading-relaxed">{report.marathiSummary}</p>
            </div>
          </div>

          {/* Setup Parameters Table */}
          {report.tradeDecision !== "NO_TRADE" && (
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 text-xs font-mono">
              <div className="p-3 rounded-xl bg-[#14141c] border border-[#D4AF37]/20">
                <span className="text-[10px] text-[#70707D] block">POTENTIAL ENTRY</span>
                <span className="text-white font-bold text-sm">{report.potentialEntry}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#14141c] border border-rose-500/30">
                <span className="text-[10px] text-rose-400 block">STOP LOSS (SL)</span>
                <span className="text-rose-300 font-bold text-sm">{report.stopLoss}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#14141c] border border-emerald-500/30">
                <span className="text-[10px] text-emerald-400 block">TP1</span>
                <span className="text-emerald-300 font-bold text-sm">{report.tp1}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#14141c] border border-emerald-500/30">
                <span className="text-[10px] text-emerald-400 block">TP2</span>
                <span className="text-emerald-300 font-bold text-sm">{report.tp2}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#14141c] border border-emerald-500/30">
                <span className="text-[10px] text-emerald-400 block">TP3</span>
                <span className="text-emerald-300 font-bold text-sm">{report.tp3}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#14141c] border border-emerald-500/30">
                <span className="text-[10px] text-emerald-400 block">TP4</span>
                <span className="text-emerald-300 font-bold text-sm">{report.tp4}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#14141c] border border-emerald-500/30">
                <span className="text-[10px] text-emerald-400 block">TP5</span>
                <span className="text-emerald-300 font-bold text-sm">{report.tp5}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#14141c] border border-[#D4AF37]/30">
                <span className="text-[10px] text-[#D4AF37] block">RISK : REWARD</span>
                <span className="text-[#FFF7D6] font-bold text-sm">{report.riskToReward}</span>
              </div>
            </div>
          )}

          {/* Deep SMC Conditions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-2 bg-[#14141c] p-4 rounded-xl border border-[#D4AF37]/20">
              <div className="flex justify-between">
                <span className="text-[#70707D]">Higher-Timeframe Bias:</span>
                <span className="font-semibold text-white">{report.htfBias}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#70707D]">Liquidity Sweep Status:</span>
                <span className="font-semibold text-emerald-400">{report.sweepStatus}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#70707D]">Confirmation Status:</span>
                <span className="font-semibold text-[#D4AF37]">{report.confirmationStatus}</span>
              </div>
              <div className="pt-2 border-t border-white/5">
                <span className="text-[#70707D] block mb-1">Liquidity Conditions:</span>
                <p className="text-[#E6E6EB]">{report.liquidityConditions}</p>
              </div>
            </div>

            <div className="space-y-2 bg-[#14141c] p-4 rounded-xl border border-[#D4AF37]/20">
              <div>
                <span className="text-[#70707D] block mb-1">FVG & Order Block Details:</span>
                <p className="text-[#E6E6EB]">{report.fvgAndOrderBlocks}</p>
              </div>
              <div className="pt-2 border-t border-white/5">
                <span className="text-rose-400 font-semibold block mb-1">Invalidation Rule:</span>
                <p className="text-[#E6E6EB]">{report.invalidationConditions}</p>
              </div>
              <div className="pt-2 border-t border-white/5">
                <span className="text-amber-400 font-semibold block mb-1">Risk Factors & Reasons to Avoid:</span>
                <p className="text-[#A0A0AB]">{report.reasonsToAvoid}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Trade Execution Safety Protocol (Section 16) */}
      <div className="p-4 rounded-xl bg-[#14141c] border border-amber-500/25 flex items-start gap-3 text-xs text-[#A0A0AB]">
        <ShieldAlert className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-white">TRADE EXECUTION SAFETY (ANALYSIS ONLY):</p>
          <p className="text-[11px] leading-relaxed mt-0.5">
            This module operates in strict analysis mode. It does not place live broker orders or risk real capital without user verification. Market conditions fluctuate and Smart Money Concepts are probabilistic frameworks rather than guaranteed outcomes.
          </p>
        </div>
      </div>
    </div>
  );
};

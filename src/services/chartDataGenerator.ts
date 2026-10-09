import {
  Candle,
  LiquidityPool,
  FairValueGap,
  OrderBlock,
  MarketStructureMarker,
  TrendlineAnnotation,
} from "../types";

export interface ChartPackage {
  symbol: string;
  timeframe: string;
  candles: Candle[];
  liquidityPools: LiquidityPool[];
  fvgs: FairValueGap[];
  orderBlocks: OrderBlock[];
  structureMarkers: MarketStructureMarker[];
  trendlines: TrendlineAnnotation[];
  equilibrium: number;
  premiumZone: { top: number; bottom: number };
  discountZone: { top: number; bottom: number };
  oteZone: { top: number; bottom: number };
}

const BASE_PRICES: Record<string, number> = {
  XAUUSD: 2684.5,
  XAGUSD: 31.85,
  BTCUSD: 89450.0,
  EURUSD: 1.054,
  GBPUSD: 1.268,
  US30: 42800.0,
  NAS100: 20450.0,
  "NIFTY 50": 24200.0,
};

export function generateCandleData(
  symbol = "XAUUSD",
  timeframe = "15M",
  count = 60
): ChartPackage {
  const base = BASE_PRICES[symbol] || 2500;
  const volatility =
    symbol === "BTCUSD"
      ? base * 0.003
      : symbol === "XAUUSD"
      ? base * 0.0018
      : symbol.includes("USD")
      ? base * 0.0008
      : base * 0.0015;

  const candles: Candle[] = [];
  let currentPrice = base;
  const now = Date.now();
  const stepMs = getTimeframeStepMs(timeframe);

  // Generate sequence of realistic candles with intentional SMC footprints
  for (let i = count; i >= 0; i--) {
    const timeStr = new Date(now - i * stepMs).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const isBullishBias = i < 15; // Recent displacement upwards
    const change =
      (Math.random() - (isBullishBias ? 0.35 : 0.5)) * volatility;
    const open = +(currentPrice).toFixed(2);
    let close = +(open + change).toFixed(2);

    let high = +Math.max(open, close) + Math.random() * volatility * 0.7;
    let low = +Math.min(open, close) - Math.random() * volatility * 0.7;

    // Intentional liquidity sweep candle at index 12
    if (i === 12) {
      // Deep wick below previous lows that reverses sharply
      low = +(open - volatility * 2.8).toFixed(2);
      close = +(open + volatility * 1.2).toFixed(2);
      high = +(close + volatility * 0.4).toFixed(2);
    }

    // Intentional FVG creation at index 10 (impulsive displacement)
    if (i === 10) {
      open;
      close = +(open + volatility * 2.2).toFixed(2);
      high = +(close + volatility * 0.2).toFixed(2);
      low = +(open - volatility * 0.1).toFixed(2);
    }

    high = +high.toFixed(2);
    low = +low.toFixed(2);

    candles.push({
      time: timeStr,
      open,
      high,
      low,
      close,
      volume: Math.floor(Math.random() * 5000 + 1000),
    });

    currentPrice = close;
  }

  // Calculate SMC annotations
  const minPrice = Math.min(...candles.map((c) => c.low));
  const maxPrice = Math.max(...candles.map((c) => c.high));
  const equilibrium = +((minPrice + maxPrice) / 2).toFixed(2);
  const range = maxPrice - minPrice;

  // Premium & Discount
  const premiumZone = {
    top: maxPrice,
    bottom: +(equilibrium).toFixed(2),
  };
  const discountZone = {
    top: +(equilibrium).toFixed(2),
    bottom: minPrice,
  };
  // Optimal Trade Entry (OTE: 0.618 - 0.786 retracement from low to high)
  const oteZone = {
    top: +(maxPrice - range * 0.618).toFixed(2),
    bottom: +(maxPrice - range * 0.786).toFixed(2),
  };

  // Liquidity Pools
  const pdhPrice = +(maxPrice * 0.999).toFixed(2);
  const pdlPrice = +(minPrice * 1.001).toFixed(2);
  const sweptLowPrice = +(minPrice * 0.998).toFixed(2);

  const liquidityPools: LiquidityPool[] = [
    {
      id: "bsl-1",
      type: "BSL",
      price: +(maxPrice * 0.998).toFixed(2),
      label: "Buy-Side Liquidity (BSL / EQH)",
      isSwept: false,
      timeframe,
    },
    {
      id: "ssl-1",
      type: "SSL",
      price: sweptLowPrice,
      label: "Sell-Side Liquidity (SSL / Asian Low)",
      isSwept: true, // Swept by the long wick!
      timeframe,
    },
    {
      id: "pdh-1",
      type: "PDH",
      price: pdhPrice,
      label: "Previous Day High (PDH)",
      isSwept: false,
      timeframe,
    },
    {
      id: "pdl-1",
      type: "PDL",
      price: pdlPrice,
      label: "Previous Day Low (PDL)",
      isSwept: true,
      timeframe,
    },
  ];

  // Fair Value Gaps (3-candle imbalance)
  const fvgs: FairValueGap[] = [];
  for (let idx = 1; idx < candles.length - 1; idx++) {
    const c1 = candles[idx - 1];
    const c3 = candles[idx + 1];
    // Bullish FVG: candle 1 high is lower than candle 3 low
    if (c3.low > c1.high + volatility * 0.2) {
      fvgs.push({
        id: `fvg-${idx}`,
        type: "BULLISH_FVG",
        topPrice: c3.low,
        bottomPrice: c1.high,
        startIndex: idx - 1,
        endIndex: Math.min(candles.length - 1, idx + 8),
        isMitigated: false,
        label: "Bullish FVG (+FVG)",
      });
      break;
    }
  }

  // Order Blocks
  const orderBlocks: OrderBlock[] = [
    {
      id: "ob-bullish",
      type: "BULLISH_OB",
      topPrice: +(candles[Math.max(0, candles.length - 14)].high).toFixed(2),
      bottomPrice: +(candles[Math.max(0, candles.length - 14)].low).toFixed(2),
      startIndex: Math.max(0, candles.length - 14),
      isMitigated: false,
      label: "+OB (Bullish Order Block)",
    },
  ];

  // Market Structure Markers (MSS / BOS / CHoCH)
  const structureMarkers: MarketStructureMarker[] = [
    {
      index: Math.max(0, candles.length - 12),
      price: minPrice,
      type: "MSS",
      direction: "BULLISH",
      label: "SSL Swept + MSS",
    },
    {
      index: Math.max(0, candles.length - 6),
      price: +(equilibrium + volatility * 0.5).toFixed(2),
      type: "BOS",
      direction: "BULLISH",
      label: "BOS (Break of Structure)",
    },
    {
      index: Math.max(0, candles.length - 2),
      price: +(candles[candles.length - 2].high).toFixed(2),
      type: "CHoCH",
      direction: "BULLISH",
      label: "CHoCH (Bullish Confirmation)",
    },
  ];

  // Trendline
  const trendlines: TrendlineAnnotation[] = [
    {
      startIndex: Math.max(0, candles.length - 20),
      startPrice: +(candles[candles.length - 20].low).toFixed(2),
      endIndex: candles.length - 1,
      endPrice: +(candles[candles.length - 1].close).toFixed(2),
      direction: "BULLISH",
      label: "Bullish Momentum Trendline",
      broken: false,
    },
  ];

  return {
    symbol,
    timeframe,
    candles,
    liquidityPools,
    fvgs,
    orderBlocks,
    structureMarkers,
    trendlines,
    equilibrium,
    premiumZone,
    discountZone,
    oteZone,
  };
}

function getTimeframeStepMs(tf: string): number {
  switch (tf) {
    case "1M":
      return 60 * 1000;
    case "3M":
      return 3 * 60 * 1000;
    case "5M":
      return 5 * 60 * 1000;
    case "15M":
      return 15 * 60 * 1000;
    case "30M":
      return 30 * 60 * 1000;
    case "1H":
      return 60 * 60 * 1000;
    case "4H":
      return 4 * 60 * 60 * 1000;
    case "Daily":
      return 24 * 60 * 60 * 1000;
    case "Weekly":
      return 7 * 24 * 60 * 60 * 1000;
    case "Monthly":
      return 30 * 24 * 60 * 60 * 1000;
    default:
      return 15 * 60 * 1000;
  }
}

// Generate Pine Script for TradingView
export function generatePineScript(symbol: string, tf: string): string {
  return `//@version=5
indicator("MAVLA AI - SMC & Liquidity Engine v3", shorttitle="MAVLA_SMC", overlay=true)

// Designed & Developed by Samarth Bhor
// Instrument: ${symbol} | Timeframe: ${tf}

// --- SMC Colors ---
colorBullishOB = color.new(#D4AF37, 75)
colorBearishOB = color.new(#EF4444, 75)
colorFVG       = color.new(#F59E0B, 80)
colorSweep     = color.new(#10B981, 60)

// --- Swing Highs & Lows ---
len = input.int(5, "Swing Length")
ph = ta.pivothigh(high, len, len)
pl = ta.pivotlow(low, len, len)

// --- Equal Highs & Lows Detection ---
threshold = syminfo.mintick * 10
if not na(ph)
    line.new(bar_index[len], ph, bar_index, ph, color=color.yellow, style=line.style_dashed)
    label.new(bar_index, ph, "BSL / EQH", color=color.new(color.black, 100), textcolor=color.yellow, size=size.small)

if not na(pl)
    line.new(bar_index[len], pl, bar_index, pl, color=color.green, style=line.style_dashed)
    label.new(bar_index, pl, "SSL / EQL", color=color.new(color.black, 100), textcolor=color.green, size=size.small)

// --- Fair Value Gap (FVG) Detection ---
isBullFVG = low > high[2]
isBearFVG = high < low[2]

if isBullFVG
    box.new(bar_index[2], low, bar_index, high[2], bgcolor=colorFVG, border_color=color.yellow)
if isBearFVG
    box.new(bar_index[2], low[2], bar_index, high, bgcolor=color.new(color.red, 85), border_color=color.red)

// --- Liquidity Sweep Alert ---
isSweepLow = low < ta.lowest(low[1], 10) and close > ta.lowest(low[1], 10)
if isSweepLow
    plotshape(true, title="Liquidity Sweep", style=shape.triangleup, location=location.belowbar, color=color.green, size=size.normal, text="SWEEP")
`;
}

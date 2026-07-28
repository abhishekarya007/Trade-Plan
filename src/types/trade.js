export const DIRECTION_TYPES = {
  LONG: 'Long',
  SHORT: 'Short'
};

export const TRADE_STYLES = {
  DIRECTIONAL: 'Directional',
  SCALPING: 'Scalping'
};

export const BIAS_TYPES = {
  BULLISH: 'Bullish',
  BEARISH: 'Bearish',
  NEUTRAL: 'Neutral',
  RANGEBOUND: 'Rangebound'
};

export const SETUP_TYPES = [
  'Breakout',
  'VWAP Pullback',
  'Liquidity Sweep',
  'Opening Range Breakout (ORB)',
  'Support Bounce',
  'Resistance Short',
  'Gap & Go',
  'Trend Continuation',
  'Reversal'
];

export const CONVICTION_LEVELS = ['High', 'Medium', 'Low'];

export const EXCHANGES = ['NSE', 'BSE', 'NASDAQ', 'NYSE', 'CRYPTO', 'FOREX'];

export const EXECUTION_STATUSES = [
  'Planned',
  'Executed as Planned',
  'Executed with Variation',
  'Valid Plan - Not Executed',
  'Not Valid Plan',
  'Setup Didn\'t Trigger',
  'Impulse Trade'
];

export const OUTCOMES = [
  'Pending EOD',
  'Target Hit',
  'Stop Loss Hit',
  'Breakeven',
  'Partial Profit',
  'No Trade'
];

export const EMOTION_TAGS = [
  'Disciplined Execution',
  'Patience Paid Off',
  'FOMO Entry',
  'Early Exit',
  'Hesitation / Missed Entry',
  'Revenge Trade',
  'Over-Leveraged',
  'Followed Rules 100%'
];

export const SAMPLE_TRADES = [
  {
    id: 'trade-101',
    date: new Date().toISOString().split('T')[0],
    symbol: 'RELIANCE',
    exchange: 'NSE',
    tradeDirection: 'Long',
    tradeStyle: 'Directional',
    weeklyBias: 'Bullish',
    dailyBias: 'Bullish',
    setupType: 'Breakout',
    conviction: 'High',
    planRationale: 'Forming tight consolidation above 20 EMA on daily chart. Looking for opening range breakout with volume expansion.',
    status: 'Executed as Planned',
    outcome: 'Target Hit',
    disciplineScore: 5,
    tags: ['Disciplined Execution', 'Followed Rules 100%'],
    eodNotes: 'Waited for 15-min candle closing confirmation. Plan executed seamlessly and target hit in afternoon session.'
  },
  {
    id: 'trade-102',
    date: new Date().toISOString().split('T')[0],
    symbol: 'TCS',
    exchange: 'NSE',
    tradeDirection: 'Short',
    tradeStyle: 'Scalping',
    weeklyBias: 'Bearish',
    dailyBias: 'Bearish',
    setupType: 'Resistance Short',
    conviction: 'High',
    planRationale: 'IT sector showing relative weakness. Expecting rejection near previous day high & VWAP confluence.',
    status: 'Executed as Planned',
    outcome: 'Target Hit',
    disciplineScore: 5,
    tags: ['Patience Paid Off', 'Disciplined Execution'],
    eodNotes: 'Short setup triggered right at VWAP rejection. Target reached cleanly before closing.'
  },
  {
    id: 'trade-103',
    date: new Date().toISOString().split('T')[0],
    symbol: 'NVDA',
    exchange: 'NASDAQ',
    tradeDirection: 'Long',
    tradeStyle: 'Directional',
    weeklyBias: 'Bullish',
    dailyBias: 'Rangebound',
    setupType: 'VWAP Pullback',
    conviction: 'Medium',
    planRationale: 'Post-earnings momentum continuation. Looking for first pullback to VWAP during US open session.',
    status: 'Planned',
    outcome: 'Pending EOD',
    disciplineScore: 0,
    tags: [],
    eodNotes: ''
  },
  {
    id: 'trade-104',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0], // Yesterday
    symbol: 'INFY',
    exchange: 'NSE',
    tradeDirection: 'Long',
    tradeStyle: 'Scalping',
    weeklyBias: 'Neutral',
    dailyBias: 'Bullish',
    setupType: 'Support Bounce',
    conviction: 'Medium',
    planRationale: 'Testing key daily demand zone with RSI divergence. Plan to enter on lower timeframe reversal pattern.',
    status: 'Executed with Variation',
    outcome: 'Partial Profit',
    disciplineScore: 3,
    tags: ['Early Exit'],
    eodNotes: 'Entered slightly early before full 15-min confirmation. Booked partial profits early due to market volatility.'
  },
  {
    id: 'trade-105',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    symbol: 'TATAMOTORS',
    exchange: 'NSE',
    tradeDirection: 'Long',
    tradeStyle: 'Directional',
    weeklyBias: 'Bullish',
    dailyBias: 'Bullish',
    setupType: 'Liquidity Sweep',
    conviction: 'High',
    planRationale: 'Liquidity sweep below morning low followed by sharp reversal above VWAP.',
    status: 'Valid Plan - Not Executed',
    outcome: 'No Trade',
    disciplineScore: 2,
    tags: ['Hesitation / Missed Entry'],
    eodNotes: 'Price touched sweep level perfectly, but hesitated to take the entry due to market noise.'
  },
  {
    id: 'trade-106',
    date: new Date(Date.now() - 172800000).toISOString().split('T')[0], // 2 days ago
    symbol: 'AAPL',
    exchange: 'NASDAQ',
    tradeDirection: 'Short',
    tradeStyle: 'Scalping',
    weeklyBias: 'Bearish',
    dailyBias: 'Bearish',
    setupType: 'Trend Continuation',
    conviction: 'High',
    planRationale: 'Lower highs and lower lows structure on 1H chart. Shorting on intraday retest of breakdown level.',
    status: 'Executed as Planned',
    outcome: 'Target Hit',
    disciplineScore: 5,
    tags: ['Disciplined Execution'],
    eodNotes: 'Clean trend continuation trade. Closed 100% position at target.'
  }
];

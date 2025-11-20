import { getDailyCandles } from './yahooFinanceService.js';
import { calculateSMA, calculateRSI, calculateAverageVolume } from '../indicators/indicators.js';

/**
 * Analiza un símbolo para detectar señales de trading basadas en la estrategia de triple confirmación.
 * @param {string} symbol - El símbolo del activo a analizar.
 * @returns {Promise<object|null>} Un objeto con la señal o null si no hay señal.
 */
export const analyzeSymbol = async (symbol) => {
  const candles = await getDailyCandles(symbol);

  if (!candles || candles.close.length < 201) { // SMA 200 + 1 para el cruce
    console.log(`No hay suficientes datos para analizar ${symbol}. Se requieren al menos 201 velas.`);
    return null;
  }

  const prices = candles.close;
  const volumes = candles.volume;

  // 1. Calcular Indicadores
  const sma50 = calculateSMA(prices, 50);
  const sma200 = calculateSMA(prices, 200);
  const rsi = calculateRSI(prices, 14);
  const avgVolume10 = calculateAverageVolume(volumes, 10);

  if (!sma50 || !sma200 || !rsi || !avgVolume10) {
    return null;
  }

  // 2. Lógica de Detección de Señal (en la última vela)
  const lastIndex = prices.length - 1;
  const prevIndex = lastIndex - 1;

  const lastSma50 = sma50[lastIndex];
  const lastSma200 = sma200[lastIndex];
  const prevSma50 = sma50[prevIndex];
  const prevSma200 = sma200[prevIndex];
  const lastRsi = rsi[lastIndex];
  const lastVolume = volumes[lastIndex];
  const lastAvgVolume = avgVolume10[lastIndex];

  // Verificar que tenemos todos los datos necesarios para la última vela
  if ([lastSma50, lastSma200, prevSma50, prevSma200, lastRsi, lastVolume, lastAvgVolume].some(v => v === null)) {
      return null;
  }

  // 3. Comprobar Condiciones de la Estrategia

  // Condición 1: Cruce de Medias Móviles
  const isGoldenCross = prevSma50 < prevSma200 && lastSma50 > lastSma200;
  const isDeathCross = prevSma50 > prevSma200 && lastSma50 < lastSma200;

  const details = {
    lastSma50: lastSma50 ? lastSma50.toFixed(2) : 'N/A',
    lastSma200: lastSma200 ? lastSma200.toFixed(2) : 'N/A',
    prevSma50: prevSma50 ? prevSma50.toFixed(2) : 'N/A',
    prevSma200: prevSma200 ? prevSma200.toFixed(2) : 'N/A',
    lastRsi: lastRsi ? lastRsi.toFixed(2) : 'N/A',
    lastVolume: lastVolume || 'N/A',
    lastAvgVolume: lastAvgVolume ? lastAvgVolume.toFixed(2) : 'N/A',
    isGoldenCross,
    isDeathCross,
  };

  if (isGoldenCross) {
    // Condición 2: Confirmación de Momentum (RSI)
    if (lastRsi > 50) {
      // Condición 3: Confirmación de Volumen
      if (lastVolume > lastAvgVolume) {
        return {
          symbol,
          signal: 'BUY',
          price: prices[lastIndex],
          date: new Date(candles.timestamps[lastIndex] * 1000).toISOString(),
          reason: `Golden Cross (SMA50/200), RSI (${lastRsi.toFixed(2)}) > 50, Volume > Avg. Volume`,
          details: details,
        };
      }
    }
  } else if (isDeathCross) {
    // Condición 2: Confirmación de Momentum (RSI)
    if (lastRsi < 50) {
      // Condición 3: Confirmación de Volumen
      if (lastVolume > lastAvgVolume) {
        return {
          symbol,
          signal: 'SELL',
          price: prices[lastIndex],
          date: new Date(candles.timestamps[lastIndex] * 1000).toISOString(),
          reason: `Death Cross (SMA50/200), RSI (${lastRsi.toFixed(2)}) < 50, Volume > Avg. Volume`,
          details: details,
        };
      }
    }
  }

  // Si no hay señal, devuelve un objeto con los detalles y señal nula
  return {
    symbol,
    signal: null, // O 'HOLD' si prefieres un string
    price: prices[lastIndex],
    date: new Date(candles.timestamps[lastIndex] * 1000).toISOString(),
    reason: 'No se cumplieron las condiciones de la estrategia.',
    details: details,
  };
};
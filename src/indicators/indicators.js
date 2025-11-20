
/**
 * Calcula la Media Móvil Simple (SMA) para un conjunto de datos.
 * @param {number[]} prices - Un array de precios (normalmente precios de cierre).
 * @param {number} period - El período de la SMA (ej: 10, 30).
 * @returns {number[]|null} Un array con los valores de la SMA. Los primeros `period - 1` valores son null.
 */
export const calculateSMA = (prices, period) => {
  if (!prices || prices.length < period) {
    return null; // No hay suficientes datos para calcular
  }

  const smaValues = new Array(prices.length).fill(null);

  for (let i = period - 1; i < prices.length; i++) {
    const sum = prices.slice(i - period + 1, i + 1).reduce((acc, val) => acc + val, 0);
    smaValues[i] = sum / period;
  }

  return smaValues;
};

/**
 * Calcula el Índice de Fuerza Relativa (RSI) para un conjunto de datos.
 * @param {number[]} prices - Un array de precios de cierre.
 * @param {number} period - El período para el cálculo del RSI (normalmente 14).
 * @returns {number[]|null} Un array con los valores del RSI. Los primeros `period` valores son null.
 */
export const calculateRSI = (prices, period = 14) => {
  if (!prices || prices.length <= period) {
    return null; // No hay suficientes datos
  }

  const rsiValues = new Array(prices.length).fill(null);
  let gains = 0;
  let losses = 0;

  // Calcular la primera ganancia y pérdida promedio
  for (let i = 1; i <= period; i++) {
    const change = prices[i] - prices[i - 1];
    if (change > 0) {
      gains += change;
    } else {
      losses -= change; // Las pérdidas son positivas
    }
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  rsiValues[period] = 100 - (100 / (1 + (avgGain / avgLoss)));

  // Calcular el resto de los valores del RSI
  for (let i = period + 1; i < prices.length; i++) {
    const change = prices[i] - prices[i - 1];
    let currentGain = 0;
    let currentLoss = 0;

    if (change > 0) {
      currentGain = change;
    } else {
      currentLoss = -change;
    }

    avgGain = (avgGain * (period - 1) + currentGain) / period;
    avgLoss = (avgLoss * (period - 1) + currentLoss) / period;

    if (avgLoss === 0) {
      rsiValues[i] = 100;
    } else {
      const rs = avgGain / avgLoss;
      rsiValues[i] = 100 - (100 / (1 + rs));
    }
  }

  return rsiValues;
};

/**
 * Calcula el volumen promedio durante un período determinado.
 * @param {number[]} volumes - Un array de volúmenes.
 * @param {number} period - El período para calcular el promedio.
 * @returns {number[]|null} Un array con los valores del volumen promedio. Los primeros `period - 1` valores son null.
 */
export const calculateAverageVolume = (volumes, period) => {
  if (!volumes || volumes.length < period) {
    return null;
  }

  const avgVolumeValues = new Array(volumes.length).fill(null);

  for (let i = period - 1; i < volumes.length; i++) {
    const sum = volumes.slice(i - period + 1, i + 1).reduce((acc, val) => acc + val, 0);
    avgVolumeValues[i] = sum / period;
  }

  return avgVolumeValues;
};

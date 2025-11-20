import YahooFinance from 'yahoo-finance2';

// Crea una instancia del cliente de Yahoo Finance
const yahoo = new YahooFinance();

/**
 * Obtiene los datos de velas diarias para un símbolo.
 * @param {string} symbol - El símbolo del activo (ej: 'AAPL' para acciones, 'BTC-USD' para criptos).
 * @returns {Promise<object|null>} Una promesa que se resuelve con los datos de las velas o null si hay un error.
 */
export const getDailyCandles = async (symbol) => {
  try {
    const threeYearsAgo = new Date();
    threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3);

    const queryOptions = {
      period1: threeYearsAgo.toISOString().split('T')[0], // Formato YYYY-MM-DD
      period2: new Date().toISOString().split('T')[0],   // Formato YYYY-MM-DD
      interval: '1d', // Intervalo diario
    };

    const result = await yahoo.chart(symbol, queryOptions);

    if (!result || result.length === 0) {
      return null;
    }

    // Mapeamos los datos desde la propiedad 'quotes' al formato que usábamos antes
    const candles = {
      close: result.quotes.map(r => r.close),
      high: result.quotes.map(r => r.high),
      low: result.quotes.map(r => r.low),
      open: result.quotes.map(r => r.open),
      volume: result.quotes.map(r => r.volume),
      timestamps: result.quotes.map(r => Math.floor(new Date(r.date).getTime() / 1000)),
    };

    return candles;

  } catch (error) {
    // La librería yahoo-finance2 a menudo lanza errores con códigos 404 para símbolos no encontrados
    if (error.code === 404) {
        return null;
    }
    throw error; // Lanza otros errores
  }
};
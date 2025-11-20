import 'dotenv/config';
import { analyzeSymbol } from './src/services/analysisService.js';
import { sendMessage } from './src/telegram/bot.js';
import { logger } from './src/utils/logger.js';

// Lista de activos a monitorear
const assets = [
  'BTC-USD',
  'ETH-USD',
  'SOL-USD',
  'LINK-USD',
  'BNB-USD',
  'AAVE-USD',
  'TAO-USD',
  'NVDA',
  'META',
  'IONQ',
  'ENPH',
  'TSLA',
  'AAPL',
  'TSM',
  'ASML',
  'CRM',
  'VOO',
  'QQQ',
  'MELI',
  'MSFT',
  'GOOGL'
  // Agrega aquí más activos de Yahoo Finance
];

/**
 * Formatea un mensaje de señal para Telegram.
 * @param {object} signal - El objeto de la señal.
 * @returns {string} El mensaje formateado.
 */
const formatSignalMessage = (signal) => {
  const { symbol, signal: signalType, price, reason, date } = signal;
  const icon = signalType === 'BUY' ? '✅' : '❌';
  const formattedPrice = price.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

  return `
    ${icon} *Señal de ${signalType === 'BUY' ? 'Compra' : 'Venta'}*

    *Activo:* ${symbol}
    *Precio:* ${formattedPrice}
    *Fecha:* ${new Date(date).toLocaleString('es-ES')}

    *Motivo:* ${reason}
  `;
};

/**
 * Función principal que ejecuta el análisis.
 */
const main = async () => {
  const signals = [];
  for (const asset of assets) {
    console.log(`Analizando activo: ${asset}`);
    try {
      const result = await analyzeSymbol(asset); // Captura el objeto de resultado completo

      if (!result) { // analyzeSymbol puede devolver null si los datos son insuficientes
        console.log(`No se pudo analizar ${asset} debido a datos insuficientes o error interno.`);
        signals.push(null);
        continue;
      }

      const { signal, reason, details } = result; // Desestructura el resultado

      if (signal !== null) { // Verifica si hay una señal real (BUY/SELL)
        console.log(`Señal encontrada para ${asset}: ${signal} - ${reason}`);
        signals.push(result); // Añade el objeto de resultado completo si hay señal
      } else {
        let detailMessage = '';
        if (details) {
          detailMessage = ` Detalles: SMA50: ${details.lastSma50}, SMA200: ${details.lastSma200}, RSI: ${details.lastRsi}, Volumen: ${details.lastVolume}, Vol. Promedio: ${details.lastAvgVolume}. Cruce Dorado: ${details.isGoldenCross}, Cruce de la Muerte: ${details.isDeathCross}.`;
        }
        console.log(`No se encontró señal para ${asset}. ${reason}.${detailMessage}`);
        signals.push(null); // No hay señal, añade null al array de señales
      }
    } catch (error) {
      logger.error(`Error al analizar el activo ${asset}:`, error);
      signals.push(null); // Añade null para mantener la consistencia
      console.log(`Error al analizar el activo ${asset}.`);
    }
  }

  for (const signal of signals) {
    if (signal && signal.signal !== null) { // Asegura que sea un objeto de señal real
      const message = formatSignalMessage(signal);
      sendMessage(message, { parse_mode: 'Markdown' });
    }
  }
};

// Ejecutar el análisis una vez.
main();

// TODO: La estrategia actual es semanal. Se necesita cambiar a datos diarios para que el análisis diario sea útil.
// Se ejecutará cada 24 horas (en milisegundos)
const ANALYSIS_INTERVAL = 8 * 60 * 60 * 1000; // Intervalo de 8 horas

// Descomentar para ejecución automática en un servidor.
// setInterval(main, ANALYSIS_INTERVAL);

// logger.info(`El análisis se ejecutará cada 8 horas. Próxima ejecución en: ${new Date(Date.now() + ANALYSIS_INTERVAL).toLocaleString('es-ES')}`);
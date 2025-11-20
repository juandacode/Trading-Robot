
import { getWeeklyCandles } from './src/services/yahooFinanceService.js';
import { logger } from './src/utils/logger.js';

const testSymbol = 'BTC-USD';

const runTest = async () => {
  logger.info(`Iniciando prueba de obtención de datos para ${testSymbol}...`);
  const startTime = Date.now();

  try {
    const candles = await getWeeklyCandles(testSymbol);
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;

    if (candles) {
      logger.info(`Datos obtenidos exitosamente para ${testSymbol}.`);
      logger.info(`Número de velas semanales recibidas: ${candles.close.length}`);
      logger.info(`Prueba completada en ${duration} segundos.`);
    } else {
      logger.warn(`La prueba finalizó, pero no se recibieron datos para ${testSymbol}.`);
      logger.info(`Prueba completada en ${duration} segundos.`);
    }
  } catch (error) {
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    logger.error(`La prueba falló para ${testSymbol} después de ${duration} segundos.`, error);
  }
};

runTest();

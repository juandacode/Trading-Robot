import axios from 'axios';
import { logger } from '../utils/logger.js';

const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

if (!token || !chatId) {
  logger.error('Las variables de entorno TELEGRAM_BOT_TOKEN y TELEGRAM_CHAT_ID son obligatorias.');
  // No salimos del proceso para permitir que el análisis se complete incluso si el bot no está configurado.
}

/**
 * Envía un mensaje a través de una llamada directa a la API de Telegram usando axios.
 * @param {string} text - El texto del mensaje a enviar.
 * @param {object} [options] - Opciones adicionales para el mensaje (ej: parse_mode).
 * @returns {Promise<void>}
 */
export const sendMessage = async (text, options) => {
  if (!token || !chatId) {
    logger.warn('No se puede enviar el mensaje: TELEGRAM_BOT_TOKEN o TELEGRAM_CHAT_ID no están configurados.');
    logger.info('Contenido del mensaje que no se envió:');
    console.log(text);
    return;
  }

  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const payload = {
    chat_id: chatId,
    text: text,
    ...options, // Expande opciones como parse_mode: 'Markdown'
  };

  try {
    await axios.post(url, payload);
    logger.info('Mensaje enviado a Telegram exitosamente.');
  } catch (error) {
    logger.error('Error al enviar el mensaje a Telegram:');
    if (error.response) {
      // La petición se hizo y el servidor respondió con un código de estado fuera del rango 2xx
      logger.error(`- Data: ${JSON.stringify(error.response.data)}`);
      logger.error(`- Status: ${error.response.status}`);
    } else if (error.request) {
      // La petición se hizo pero no se recibió respuesta
      logger.error('- No se recibió respuesta del servidor de Telegram.');
    } else {
      // Algo ocurrió al configurar la petición
      logger.error('- Error de configuración de Axios:', error.message);
    }
  }
};

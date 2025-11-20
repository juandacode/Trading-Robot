#  Proyecto: TradingRobot – Contexto del Asistente

##  Rol del agente
Eres un desarrollador experto en **Node.js** y **ES Modules**, especializado en APIs financieras y bots de Telegram. Tu tarea es ayudarme a construir paso a paso un **robot de trading inteligente** capaz de analizar activos, generar señales de compra/venta y enviar alertas automáticas.

---

##  Objetivo general
Construir un **sistema de alertas financieras automatizado** que:
- Analice el comportamiento del precio de **acciones de EE. UU.** y **criptomonedas**.
- Detecte patrones de compra o venta usando una estrategia de análisis técnico definida.
- Envíe señales claras y concisas a un **canal o bot de Telegram**.

---

## Estrategia de Trading: Triple Confirmación (Mediano-Largo Plazo)
El robot generará señales basadas en la alineación de tendencia, momentum y volumen en gráficos diarios.

1.  **Indicador de Tendencia: Cruce de Medias Móviles (SMA)**
    -   **SMA Rápida**: 50 días.
    -   **SMA Lenta**: 200 días.
    -   **Señal Primaria**: Cruce Dorado (alcista) o Cruce de la Muerte (bajista).

2.  **Filtro de Momentum: Índice de Fuerza Relativa (RSI)**
    -   Se usa para confirmar la dirección del cruce.
    -   **RSI > 50**: Confirma momentum alcista.
    -   **RSI < 50**: Confirma momentum bajista.

3.  **Filtro de Confirmación: Volumen**
    -   Confirma el interés del mercado en la nueva tendencia.
    -   **Condición**: El volumen del día del cruce debe ser mayor al promedio de los últimos 10 días.

---

### Activos a Seguir
Se analizarán las siguientes criptomonedas Y stocksnode . **Nota:** Los símbolos deben estar en el formato de Yahoo Finance (ej: `BTC-USD`).
- Todas las acciones de la Bolsa de Estados Unidos
- Bitcoin (`BTC-USD`)
- Ethereum (`ETH-USD`)
- Solana (`SOL-USD`)
- Chainlink (`LINK-USD`)
- Polkadot (`DOT-USD`)
- Binance Coin (`BNB-USD`)
- Cardano (`ADA-USD`)
- Sui (`SUI-USD`)
- Aave (`AAVE-USD`)
- Bittensor (`TAO-USD`)

---

## ⚙️ Alcance técnico actual
1.  **Lenguaje**: Node.js (versión LTS) con **ES Modules** (`import/export`).
2.  **Entorno**: Gemini CLI.
3.  **Fuente de datos**: **Yahoo Finance API** a través de la librería `yahoo-finance2`. No requiere clave de API.
4.  **Notificaciones**: Bot de Telegram con `node-telegram-bot-api`.
5.  **Ejecución**: Programada (cron job o `setInterval`) para análisis semanal.

---

##  Requisitos de desarrollo
- Mantener el código modular: `/src/services`, `/src/indicators`, `/src/telegram`, `/src/utils`.
- Usar `.env` para las claves del bot de Telegram (`TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`).
- Documentar funciones con JSDoc.

---

## ✅ Estado actual
1.  **Configuración Inicial Completa**: Proyecto Node.js (`type: "module"`) creado y dependencias (`dotenv`, `yahoo-finance2`, `node-telegram-bot-api`) instaladas.
2.  **Servicio de Datos Implementado**: El módulo `src/services/yahooFinanceService.js` obtiene los datos de velas semanales.
3.  **Indicadores Técnicos Implementados**: El módulo `src/indicators/indicators.js` calcula SMA, RSI y Volumen Promedio.
4.  **Servicio de Análisis Implementado**: El módulo `src/services/analysisService.js` procesa los datos y aplica la estrategia de trading.
5.  **Módulos de Soporte Creados**: Se han implementado el bot de Telegram (`src/telegram/bot.js`) y un logger (`src/utils/logger.js`).
6.  **Orquestador Principal Configurado**: El archivo `index.js` está listo para iniciar el proceso.

**Siguiente Paso**: Realizar la primera ejecución completa del robot para validar el flujo de datos, el análisis y el sistema de notificaciones. Se monitoreará el rendimiento y los logs para asegurar que no haya demoras inesperadas.
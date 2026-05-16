const express = require('express');
const app = express();
app.use(express.json());

// Signal strength validator
function isStrongSignal(data) {
  const rsi = parseFloat(data.rsi);
  const atr = parseFloat(data.atr);
  const signal = data.signal;

  // RSI must be strong (not near 50)
  const rsiStrong = signal === 'BUY' ? rsi > 55 : rsi < 45;

  // ATR must be above minimum (market must be moving)
  const atrStrong = atr > 50;

  return rsiStrong && atrStrong;
}

app.post('/webhook', async (req, res) => {
  try {
    const data = req.body;

    const pair   = data.pair   || 'UNKNOWN';
    const signal = data.signal || 'UNKNOWN';
    const tf     = data.tf     || '1M';
    const entry  = parseFloat(data.entry).toFixed(2);
    const sl     = parseFloat(data.sl).toFixed(2);
    const tp     = parseFloat(data.tp).toFixed(2);
    const rsi    = parseFloat(data.rsi).toFixed(2);
    const atr    = parseFloat(data.atr).toFixed(2);

    console.log(`Signal received: ${signal} ${pair} | RSI: ${rsi} | ATR: ${atr}`);

    if (!isStrongSignal(data)) {
      console.log(`❌ Signal REJECTED - too weak | RSI: ${rsi} | ATR: ${atr}`);
      return res.status(200).send('Signal too weak - ignored');
    }

    console.log(`✅ Signal APPROVED - ${signal} ${pair} | Entry: ${entry} | SL: ${sl} | TP: ${tp}`);

    // MT5 execution will be added here in Stage 4
    // For now we log the approved signal

    res.status(200).send('OK');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error');
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Project 2 Bot running on port ${PORT}`));

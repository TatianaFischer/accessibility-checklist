const express = require('express');
const { calculateContrastRatio } = require('./contrast');

const app = express();
app.use(express.json());

// Rota de Health Check (usada no CI/CD e AWS)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'accessibility-api', uptime: process.uptime() });
});

// Rota para calcular contraste de cores (WCAG)
app.post('/v1/contrast', (req, res) => {
  const { textHex, bgHex } = req.body;
  if (!textHex || !bgHex) {
    return res.status(400).json({ error: 'Informe textHex e bgHex (ex: #000000 e #FFFFFF).' });
  }

  try {
    const result = calculateContrastRatio(textHex, bgHex);
    res.status(200).json({ textHex, bgHex, ...result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Rota com diretrizes WCAG
app.get('/v1/guidelines', (req, res) => {
  res.status(200).json({
    guidelines: [
      { rule: '1.4.3 Contrast (Minimum)', level: 'AA', ratioRequired: '4.5:1' },
      { rule: '1.4.6 Contrast (Enhanced)', level: 'AAA', ratioRequired: '7.0:1' },
      { rule: '1.1.1 Non-text Content', requirement: 'Fornecer texto alternativo (alt) em imagens' }
    ]
  });
});

if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`API de Acessibilidade rodando na porta ${PORT}`));
}

module.exports = app;
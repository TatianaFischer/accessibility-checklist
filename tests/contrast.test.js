const request = require('supertest');
const app = require('../src/app');
const { calculateContrastRatio } = require('../src/contrast');

describe('Testes de Acessibilidade - Contraste WCAG', () => {
  test('Deve calcular contraste máximo (21:1) para preto e branco', () => {
    const res = calculateContrastRatio('#000000', '#FFFFFF');
    expect(res.ratio).toBe(21);
    expect(res.wcagAA).toBe(true);
    expect(res.wcagAAA).toBe(true);
  });

  test('GET /health deve retornar status 200 OK', async () => {
    const response = await request(app).get('/health');
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('ok');
  });

  test('POST /v1/contrast deve retornar cálculo correto', async () => {
    const response = await request(app)
      .post('/v1/contrast')
      .send({ textHex: '#000000', bgHex: '#FFFFFF' });
    expect(response.statusCode).toBe(200);
    expect(response.body.ratio).toBe(21);
  });
});
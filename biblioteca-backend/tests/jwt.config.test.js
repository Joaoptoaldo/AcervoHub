// testes para jwt.config.js
const path = require('path');

describe('getJwtSecret behavior', () => {
  const MODULE_PATH = path.resolve(__dirname, '..', 'jwt.config.js');

  beforeEach(() => {
    jest.resetModules();
  });

  test('returns JWT_SECRET when set', () => {
    process.env.JWT_SECRET = 'meu-segredo-de-teste';
    process.env.NODE_ENV = 'development';
    const { getJwtSecret } = require(MODULE_PATH);
    expect(getJwtSecret()).toBe('meu-segredo-de-teste');
    delete process.env.JWT_SECRET;
  });

  test('throws when in production and secret is not set', () => {
    delete process.env.JWT_SECRET;
    process.env.NODE_ENV = 'production';
    const { getJwtSecret } = require(MODULE_PATH);
    expect(() => getJwtSecret()).toThrow(/nao definido em producao/i);
    delete process.env.NODE_ENV;
  });

  test('returns fallback in non-production when secret missing', () => {
    delete process.env.JWT_SECRET;
    process.env.NODE_ENV = 'development';
    const { getJwtSecret } = require(MODULE_PATH);
    expect(getJwtSecret()).toBeDefined();
  });
});

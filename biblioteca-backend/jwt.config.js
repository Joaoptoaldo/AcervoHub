const FALLBACK_DEV_SECRET = 'segredo-super-seguro';

let warnedAboutFallback = false;

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  const ambiente = process.env.NODE_ENV;

  if (secret) {
    return secret;
  }

  if (ambiente === 'production') {
    throw new Error('JWT_SECRET nao definido em producao. Configure a variavel de ambiente para iniciar o backend.');
  }

  if (!warnedAboutFallback) {
    warnedAboutFallback = true;
    console.warn('JWT_SECRET nao definido. Usando segredo padrao apenas para ambiente nao-producao.');
  }

  return FALLBACK_DEV_SECRET;
}

module.exports = { getJwtSecret };
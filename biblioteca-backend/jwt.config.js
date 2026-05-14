const FALLBACK_DEV_SECRET = 'segredo-super-seguro';

let warnedAboutFallback = false;

// retorna segredo jwt de variavel de ambiente ou valor padrao em dev
function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  const ambiente = process.env.NODE_ENV;

  if (secret) {
    return secret;
  }

  // obriga configurar JWT_SECRET em producao por segurança
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
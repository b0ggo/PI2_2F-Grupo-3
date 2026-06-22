const calcularDigitoVerificadorCNPJ = (digitos, multiplicadores) => {
  let soma = 0;
  for (let i = 0; i < multiplicadores.length; i++) {
    soma += parseInt(digitos[i]) * multiplicadores[i];
  }
  const resto = soma % 11;
  return resto < 2 ? 0 : 11 - resto;
};

export const validarCNPJ = (cnpj) => {
  if (!cnpj || typeof cnpj !== 'string') return false;
  
  const digitos = cnpj.replace(/\D/g, '');
  
  if (digitos.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(digitos)) return false;
  
  const multiplicadoresPrimeiro = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const primeiroDigito = calcularDigitoVerificadorCNPJ(digitos, multiplicadoresPrimeiro);
  if (parseInt(digitos[12]) !== primeiroDigito) return false;
  
  const multiplicadoresSegundo = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const segundoDigito = calcularDigitoVerificadorCNPJ(digitos, multiplicadoresSegundo);
  return parseInt(digitos[13]) === segundoDigito;
};

export const getMensagemErroCNPJ = () => {
  return "CNPJ inválido. Deve ter 14 dígitos válidos";
};

export const extrairDigitosCNPJ = (cnpj) => {
  if (!cnpj || typeof cnpj !== 'string') return '';
  return cnpj.replace(/\D/g, '');
};

export const temComprimentoCNPJCorreto = (cnpj) => {
  if (!cnpj || typeof cnpj !== 'string') return false;
  const digitos = cnpj.replace(/\D/g, '');
  return digitos.length === 14;
};

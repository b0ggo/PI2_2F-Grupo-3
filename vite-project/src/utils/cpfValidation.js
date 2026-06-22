const calcularDigitoVerificador = (digitos, posicoes) => {
  let soma = 0;
  for (let i = 0; i < posicoes; i++) {
    soma += parseInt(digitos[i]) * (posicoes + 1 - i);
  }
  const resto = soma % 11;
  return resto < 2 ? 0 : 11 - resto;
};

export const validarCPF = (cpf) => {
  if (!cpf || typeof cpf !== 'string') return false;
  
  const digitos = cpf.replace(/\D/g, '');
  
  if (digitos.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(digitos)) return false;
  
  const primeiroDigito = calcularDigitoVerificador(digitos, 9);
  if (parseInt(digitos[9]) !== primeiroDigito) return false;
  
  const segundoDigito = calcularDigitoVerificador(digitos, 10);
  return parseInt(digitos[10]) === segundoDigito;
};

export const getMensagemErroCPF = () => {
  return "CPF inválido. Deve ter 11 dígitos válidos";
};

export const extrairDigitosCPF = (cpf) => {
  if (!cpf || typeof cpf !== 'string') return '';
  return cpf.replace(/\D/g, '');
};

export const temComprimentoCPFCorreto = (cpf) => {
  if (!cpf || typeof cpf !== 'string') return false;
  const digitos = cpf.replace(/\D/g, '');
  return digitos.length === 11;
};

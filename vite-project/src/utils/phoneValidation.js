export const validarTelefoneBrasileiro = (telefone) => {
  if (!telefone || typeof telefone !== 'string') return false;
  
  const digitos = telefone.replace(/\D/g, '');
  
  return digitos.length >= 10;
};

export const getMensagemErroTelefone = () => {
  return "Telefone deve ter no mínimo 10 dígitos";
};

export const extrairDigitosTelefone = (telefone) => {
  if (!telefone || typeof telefone !== 'string') return '';
  return telefone.replace(/\D/g, '');
};

export const ehDDVValido = (ddd) => {
  if (!ddd || typeof ddd !== 'string') return false;
  
  const digitos = parseInt(ddd.replace(/\D/g, ''));
  
  return digitos >= 11 && digitos <= 99;
};

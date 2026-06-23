export const validarNomeMunicipio = (municipio) => {
  if (!municipio || typeof municipio !== 'string') return false;
  
  const trimado = municipio.trim();
  
  return trimado.length >= 2 && trimado.length <= 100;
};

export const getMensagemErroMunicipio = () => {
  return "Município inválido";
};

export const normalizarNomeMunicipio = (municipio) => {
  if (!municipio || typeof municipio !== 'string') return '';
  
  const trimado = municipio.trim();
  
  return trimado
    .split(' ')
    .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase())
    .join(' ');
};

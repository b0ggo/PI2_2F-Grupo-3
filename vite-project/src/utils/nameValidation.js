export const validarNomeCompleto = (nome) => {
  if (!nome || typeof nome !== 'string') return false;
  
  const trimado = nome.trim();
  const palavras = trimado.split(/\s+/).filter(palavra => palavra.length > 0);
  
  return palavras.length >= 2;
};

export const getMensagemErroNome = () => {
  return "O nome deve conter pelo menos 2 palavras";
};

export const validarFormatoEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regexEmail.test(email.trim());
};

export const getMensagemErroEmail = () => {
  return "Email inválido";
};

export const normalizarEmail = (email) => {
  if (!email || typeof email !== 'string') return '';
  return email.trim().toLowerCase();
};

export const validarForcaSenha = (senha) => {
  if (!senha || typeof senha !== 'string') return false;
  
  const temLetra = /[a-zA-Z]/.test(senha);
  const temNumero = /\d/.test(senha);
  const temCaractereEspecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(senha);
  
  return temLetra && temNumero && temCaractereEspecial;
};

export const getMensagemErroSenha = () => {
  return "Senha deve ter pelo menos 1 letra, 1 número e 1 caractere especial (!@#$%^&*)";
};

export const temLetra = (senha) => {
  if (!senha || typeof senha !== 'string') return false;
  return /[a-zA-Z]/.test(senha);
};

export const temNumero = (senha) => {
  if (!senha || typeof senha !== 'string') return false;
  return /\d/.test(senha);
};

export const temCaractereEspecial = (senha) => {
  if (!senha || typeof senha !== 'string') return false;
  return /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(senha);
};

export const obterDetalhesValidacaoSenha = (senha) => {
  if (!senha || typeof senha !== 'string') {
    return {
      valida: false,
      temLetra: false,
      temNumero: false,
      temCaractereEspecial: false,
    };
  }
  
  return {
    valida: validarForcaSenha(senha),
    temLetra: temLetra(senha),
    temNumero: temNumero(senha),
    temCaractereEspecial: temCaractereEspecial(senha),
  };
};

export const formatarTelefone = (valor) => {
  if (!valor || typeof valor !== 'string') return '';
  
  const digitos = valor.replace(/\D/g, '').slice(0, 11);
  if (!digitos) return '';
  if (digitos.length < 3) return `(${digitos}`;
  
  const ddd = digitos.slice(0, 2);
  const resto = digitos.slice(2);
  
  if (resto.length <= 4) return `(${ddd}) ${resto}`;
  if (resto.length <= 8) return `(${ddd}) ${resto.slice(0, 4)}-${resto.slice(4)}`;
  return `(${ddd}) ${resto.slice(0, 5)}-${resto.slice(5)}`;
};

export const formatarCPF = (valor) => {
  if (!valor || typeof valor !== 'string') return '';
  
  const digitos = valor.replace(/\D/g, '').slice(0, 11);
  
  if (digitos.length <= 3) return digitos;
  if (digitos.length <= 6) return `${digitos.slice(0, 3)}.${digitos.slice(3)}`;
  if (digitos.length <= 9) return `${digitos.slice(0, 3)}.${digitos.slice(3, 6)}.${digitos.slice(6)}`;
  return `${digitos.slice(0, 3)}.${digitos.slice(3, 6)}.${digitos.slice(6, 9)}-${digitos.slice(9)}`;
};

export const formatarCNPJ = (valor) => {
  if (!valor || typeof valor !== 'string') return '';
  
  const digitos = valor.replace(/\D/g, '').slice(0, 14);
  
  if (digitos.length <= 2) return digitos;
  if (digitos.length <= 5) return `${digitos.slice(0, 2)}.${digitos.slice(2)}`;
  if (digitos.length <= 8) return `${digitos.slice(0, 2)}.${digitos.slice(2, 5)}.${digitos.slice(5)}`;
  if (digitos.length <= 12) {
    return `${digitos.slice(0, 2)}.${digitos.slice(2, 5)}.${digitos.slice(5, 8)}/${digitos.slice(8)}`;
  }
  return `${digitos.slice(0, 2)}.${digitos.slice(2, 5)}.${digitos.slice(5, 8)}/${digitos.slice(8, 12)}-${digitos.slice(12)}`;
};

export const formatarCPFOuCNPJ = (valor) => {
  if (!valor || typeof valor !== 'string') return '';
  
  const digitos = valor.replace(/\D/g, '');
  
  if (digitos.length <= 11) {
    return formatarCPF(valor);
  }
  return formatarCNPJ(valor);
};

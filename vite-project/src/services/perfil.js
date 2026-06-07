const STORAGE_KEY = "perfil";

/** @typedef {{ nome: string, email: string, telefone: string, localizacao: string, cpfCnpj: string, tipoConta: string }} Perfil */

/** @type {Perfil} */
export const PERFIL_VAZIO = {
  nome: "",
  email: "",
  telefone: "",
  localizacao: "",
  cpfCnpj: "",
  tipoConta: "",
};

/** @param {Partial<Perfil> & Record<string, unknown>} [dados] */
export function normalizarPerfil(dados = {}) {
  return {
    nome: String(dados.nome ?? ""),
    email: String(dados.email ?? ""),
    telefone: String(dados.telefone ?? ""),
    localizacao: String(dados.localizacao ?? ""),
    cpfCnpj: String(dados.cpfCnpj ?? dados.cpf ?? ""),
    tipoConta: String(dados.tipoConta ?? ""),
  };
}

function lerCacheLocal() {
  try {
    const salvo = localStorage.getItem(STORAGE_KEY);
    return salvo ? normalizarPerfil(JSON.parse(salvo)) : { ...PERFIL_VAZIO };
  } catch {
    return { ...PERFIL_VAZIO };
  }
}

function salvarCacheLocal(perfil) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(perfil));
}

function migrarChaveAntiga() {
  const legado = localStorage.getItem("perfilUsuario");
  if (!legado || localStorage.getItem(STORAGE_KEY)) return;

  try {
    salvarCacheLocal(normalizarPerfil(JSON.parse(legado)));
    localStorage.removeItem("perfilUsuario");
  } catch {
    /* ignora dados corrompidos */
  }
}

/**
 * Busca o perfil do usuário.
 * Hoje: lê do localStorage (cache local).
 * Depois: trocar o corpo por fetch na API — as telas não precisam mudar.
 */
export async function getPerfil() {
  migrarChaveAntiga();

  // TODO (backend): const res = await fetch(`${BASE_URL}/api/perfil`); return normalizarPerfil(await res.json());
  return lerCacheLocal();
}

/**
 * Salva o perfil completo.
 * Hoje: grava no localStorage (cache local).
 * Depois: trocar o corpo por fetch na API — as telas não precisam mudar.
 *
 * @param {Partial<Perfil> & Record<string, unknown>} dados
 */
export async function savePerfil(dados) {
  const atual = lerCacheLocal();
  const perfil = normalizarPerfil({ ...atual, ...dados });

  // TODO (backend): await fetch(`${BASE_URL}/api/perfil`, { method: 'PUT', body: JSON.stringify(perfil) });
  salvarCacheLocal(perfil);

  return perfil;
}

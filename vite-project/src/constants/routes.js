/** Caminhos centrais de rotas — manter importações como `.js` para consistência com arquivos existentes */
export const ROUTES = {
  HOME: "/inicio",
  LOGIN: "/login",
  ESQUECI_SENHA: "/esqueci-senha",
  CADASTRO_PRODUTOR: "/cadastro-produtor",
  CADASTRO_EMPRESA: "/cadastro-empresa",
  CADASTRO_ANIMAL: "/cadastro-animal",
  CADASTRO_LOTES: "/cadastro-lotes",
  COOPERATIVA: "/cooperativa",
  PRODUTOR: "/produtor/:id",
  VACINACAO: "/vacinacao",
  ALERTA: "/alertas/:id",
  NOTIFICACAO: "/alertas",
  CHAT: "/chat",
  COOPERATIVA_CHAT: "/chat-cooperativa",
  PERFIL: "/perfil",
  EDITAR_PERFIL: "/editar-perfil",
  CONSULTAR: "/consultar",
  EDITAR_ANIMAL: "/editar-animal/:id",
  EDITAR_LOTE: "/editar-lote/:id",
};

export function rotaEditarAnimal(id) {
  return `/editar-animal/${encodeURIComponent(id)}`;
}

export function rotaEditarLote(id) {
  return `/editar-lote/${encodeURIComponent(id)}`;
}
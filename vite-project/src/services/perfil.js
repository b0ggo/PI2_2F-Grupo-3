import {
  getPerfilApi,
  loginUsuario,
  logoutUsuario,
  registrarUsuario,
  savePerfilApi,
} from './api.js'
import { estaLogado as temToken, getToken } from './auth.js'

const STORAGE_KEY = 'perfil'

export const PERFIL_VAZIO = {
  nome: '',
  email: '',
  telefone: '',
  localizacao: '',
  cpfCnpj: '',
  tipoConta: '',
}

export function normalizarPerfil(dados = {}) {
  return {
    nome: String(dados.nome ?? ''),
    email: String(dados.email ?? ''),
    telefone: String(dados.telefone ?? ''),
    localizacao: String(dados.localizacao ?? ''),
    cpfCnpj: String(dados.cpfCnpj ?? dados.cpf ?? ''),
    tipoConta: String(dados.tipoConta ?? ''),
  }
}

function lerCacheLocal() {
  try {
    const salvo = localStorage.getItem(STORAGE_KEY)
    return salvo ? normalizarPerfil(JSON.parse(salvo)) : { ...PERFIL_VAZIO }
  } catch {
    return { ...PERFIL_VAZIO }
  }
}

function salvarCacheLocal(perfil) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(perfil))
}

export function getLoginTipoConta() {
  try {
    return sessionStorage.getItem('loginTipoConta')
  } catch {
    return null
  }
}

export function setLoginTipoConta(tipo) {
  const normalized = tipo === 'cooperativa' ? 'cooperativa' : 'produtor'
  try {
    sessionStorage.setItem('loginTipoConta', normalized)
    sessionStorage.setItem('bottomNavMode', normalized)
  } catch {
    /* ignorar falhas de armazenamento */
  }
}

export function clearLoginTipoConta() {
  try {
    sessionStorage.removeItem('loginTipoConta')
    sessionStorage.removeItem('bottomNavMode')
  } catch {
    /* ignorar falhas de armazenamento */
  }
}

export function isProdutorTipoConta(tipoConta) {
  return String(tipoConta || "").trim().toLowerCase() === "produtor";
}

export function isCooperativaTipoConta(tipoConta) {
  const normalized = String(tipoConta || "").trim().toLowerCase();
  return normalized !== "" && normalized !== "produtor";
}

export function resolveUserMode(perfil = {}) {
  const selected = getLoginTipoConta();
  if (selected) {
    return selected === 'cooperativa' ? 'cooperativa' : 'produtor';
  }
  return isCooperativaTipoConta(perfil.tipoConta) ? 'cooperativa' : 'produtor';
}

export async function getPerfil() {
  if (!getToken()) return lerCacheLocal()
  try {
    const perfil = normalizarPerfil(await getPerfilApi())
    salvarCacheLocal(perfil)
    return perfil
  } catch {
    return lerCacheLocal()
  }
}

export async function savePerfil(dados) {
  const perfil = normalizarPerfil({ ...lerCacheLocal(), ...dados })

  if (getToken()) {
    try {
      const salvo = normalizarPerfil(await savePerfilApi(perfil))
      salvarCacheLocal(salvo)
      return salvo
    } catch {
      salvarCacheLocal(perfil)
      return perfil
    }
  }

  salvarCacheLocal(perfil)
  return perfil
}

export async function registrar(dados) {
  const result = await registrarUsuario({
    nome: dados.nome,
    email: dados.email,
    telefone: dados.telefone,
    localizacao: dados.localizacao,
    cpfCnpj: dados.cpfCnpj,
    tipoConta: dados.tipoConta,
    senha: dados.senha,
  })
  salvarCacheLocal(normalizarPerfil(result.perfil))
  return result
}

export async function login(email, senha) {
  const result = await loginUsuario(email, senha)
  salvarCacheLocal(normalizarPerfil(result.perfil))
  return result
}

export async function fazerLogout() {
  try {
    await logoutUsuario();
  } finally {
    clearLoginTipoConta();
  }
}

export function estaLogado() {
  return temToken()
}

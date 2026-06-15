import { getToken, limparSessao, setToken } from './auth.js'

const BASE_URL = import.meta.env.VITE_API_URL || ''

async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }

  const token = getToken()
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  })

  if (response.status === 401) {
    limparSessao()
  }

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.message || `Erro HTTP ${response.status}`)
  }

  if (response.status === 204) return null
  return response.json()
}

async function requestNoAuth(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.message || `Erro HTTP ${response.status}`)
  }

  if (response.status === 204) return null
  return response.json()
}

export async function validarLoginUsuario(email, senha) {
  return requestNoAuth('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, senha }),
  })
}

export async function registrarUsuario(dados) {
  const result = await request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(dados),
  })
  setToken(result.token)
  return result
}

export async function redefinirSenha(email, senha) {
  return request('/api/auth/redefinir-senha', {
    method: 'POST',
    body: JSON.stringify({ email, senha }),
  })
}

export async function loginUsuario(email, senha) {
  const result = await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, senha }),
  })
  setToken(result.token)
  return result
}

export async function logoutUsuario() {
  try {
    await request('/api/auth/logout', { method: 'POST' })
  } catch {
    /* ignora erro de rede no logout */
  } finally {
    limparSessao()
  }
}

export async function getPerfilApi() {
  return request('/api/perfil')
}

export async function savePerfilApi(dados) {
  return request('/api/perfil', {
    method: 'PUT',
    body: JSON.stringify(dados),
  })
}

export async function postAnimal(animal) {
  return request('/api/animais', {
    method: 'POST',
    body: JSON.stringify(animal),
  })
}

export async function getAnimais(q = '') {
  const query = q ? `?q=${encodeURIComponent(q)}` : ''
  return request(`/api/animais${query}`)
}

export async function postLote(lote) {
  return request('/api/lotes', {
    method: 'POST',
    body: JSON.stringify(lote),
  })
}

async function requestWithToken(path, token, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.message || `Erro HTTP ${response.status}`)
  }

  if (response.status === 204) return null
  return response.json()
}

export async function getLotes() {
  return request('/api/lotes')
}

export async function getLotesByToken(token) {
  return requestWithToken('/api/lotes', token)
}

export async function getVacinacoes() {
  return request('/api/vacinacoes')
}

export async function postVacinacao(dados) {
  return request('/api/vacinacoes', {
    method: 'POST',
    body: JSON.stringify(dados),
  })
}

export async function getAlertas() {
  return request('/api/alertas')
}

export async function getStats() {
  return request('/api/stats')
}

export async function buscarGlobal(q) {
  return request(`/api/busca?q=${encodeURIComponent(q)}`)
}

export async function getConversas() {
  return request('/api/conversas')
}

export async function enviarMensagem(conversaId, text) {
  return request(`/api/conversas/${conversaId}/mensagens`, {
    method: 'POST',
    body: JSON.stringify({ text }),
  })
}

export async function associateProducerByEmail(payload) {
  return request('/api/cooperativa/produtores/associar', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

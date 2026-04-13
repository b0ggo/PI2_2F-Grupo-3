const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5173'

export async function postAnimal(animal) {
  const response = await fetch(`${BASE_URL}/api/animais`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(animal),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.message || `Erro HTTP ${response.status}`)
  }

  return response.json()
}
const DB_NAME    = 'agrogestor'
const DB_VERSION = 1
const STORE      = 'animais'

let _db = null

export function abrirDB() {
  return new Promise((resolve, reject) => {
    if (_db) return resolve(_db)

    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = (event) => {
      const db = event.target.result
      if (!db.objectStoreNames.contains(STORE)) {
        const store = db.createObjectStore(STORE, {
          keyPath: 'id',
          autoIncrement: true,
        })
        store.createIndex('sincronizado', 'sincronizado', { unique: false })
      }
    }

    request.onsuccess = (event) => {
      _db = event.target.result
      resolve(_db)
    }

    request.onerror = () => reject(request.error)
  })
}

export async function salvarAnimal(animal) {
  const db = await abrirDB()
  return new Promise((resolve, reject) => {
    const tx  = db.transaction(STORE, 'readwrite')
    const req = tx.objectStore(STORE).add(animal)
    tx.oncomplete = () => resolve(req.result)
    tx.onerror    = () => reject(tx.error)
  })
}

export async function buscarPendentes() {
  const db = await abrirDB()
  return new Promise((resolve, reject) => {
    const tx    = db.transaction(STORE, 'readonly')
    const index = tx.objectStore(STORE).index('sincronizado')
    const req   = index.getAll(IDBKeyRange.only(false))
    req.onsuccess = () => resolve(req.result)
    req.onerror   = () => reject(req.error)
  })
}

export async function contarPendentes() {
  const db = await abrirDB()
  return new Promise((resolve, reject) => {
    const tx    = db.transaction(STORE, 'readonly')
    const index = tx.objectStore(STORE).index('sincronizado')
    const req   = index.count(IDBKeyRange.only(false))
    req.onsuccess = () => resolve(req.result)
    req.onerror   = () => reject(req.error)
  })
}

export async function marcarComoSincronizado(id) {
  const db = await abrirDB()
  return new Promise((resolve, reject) => {
    const tx    = db.transaction(STORE, 'readwrite')
    const store = tx.objectStore(STORE)
    const req   = store.get(id)

    req.onsuccess = () => {
      const animal = req.result
      if (animal) store.put({ ...animal, sincronizado: true })
    }

    tx.oncomplete = () => resolve()
    tx.onerror    = () => reject(tx.error)
  })
}
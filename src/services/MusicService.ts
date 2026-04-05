import axios from 'axios'

const api = axios.create({
  baseURL: 'http://srv906410.hstgr.cloud/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})


export const MusicService = {
  // Listar todas
  getAll() {
    return api.get('/musics')
  },

  // Criar nova
  create(payload: any) {
    return api.post('/musics', payload)
  },

  // Atualizar (usaremos depois)
  update(id: number, payload: any) {
    return api.put(`/musics/${id}`, payload)
  },

  // Deletar (usaremos depois)
  delete(id: number) {
    return api.delete(`/musics/${id}`)
  }
}
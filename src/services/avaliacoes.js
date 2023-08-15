import { http } from 'src/config/http'

export default {
  async getAll (empresa) {
    return await http.get('/avaliacoes', { params: { cnempresa: empresa } })
  },

  async create (data) {
    return await http.post('/avaliacoes', data)
  },

  async modify (cnavaliacao, data) {
    return await http.patch(`/avaliacoes/${cnavaliacao}`, data)
  }
}

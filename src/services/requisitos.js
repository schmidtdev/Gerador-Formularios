import { http } from 'src/config/http'

export default {
  async getAll (empresa) {
    return await http.get('/requisitos', { params: { cnempresa: empresa } })
  },

  async create (data) {
    return await http.post('/requisitos', data)
  },

  async modify (cnrequisito, data) {
    return await http.patch(`/requisitos/${cnrequisito}`, data)
  }
}

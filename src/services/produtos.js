import { http } from 'src/config/http'

export default {
  async getAll (empresa, query) {
    query = {
      ...query,
      cnempresa: empresa,
      status: 'S'
    }
    return await http.get('/produtos', {
      params: query
    })
  }
}

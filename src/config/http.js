import axios from 'axios'
import { LocalStorage } from 'quasar'
import { useToast } from 'vue-toastification'

const toast = useToast()

export const http = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 60000
})
http.interceptors.request.use(async (config) => {
  try {
    const token = LocalStorage.getItem('apiToken')
    if (token) {
      config.headers.Authorization = 'Bearer ' + token
    }
    return config
  } catch (error) {
  }
})
http.interceptors.response.use(function (response) {
  return response
}, function (error) {
  if (error.response) {
    const { data, status } = error.response
    if (status === 400 || status === 404 || status === 500) {
      if (data.message !== null) {
        toast.error(data.message)
      }
    }
    if (status === 401 || status === 403) {
      if (LocalStorage.getItem('apiToken')) {
        LocalStorage.clear('apiToken')
        toast.error('Por medida de segurança, desconectamos você do sistema pelo longo período de inatividade.')
        window.location.href = 'http://localhost:8081/dashboard'
      }
    }
  } else {
    alert('Tempo de carregamento excedido, verifique sua conexão e tente novamente')
  }
  return Promise.reject(error)
})

// axios-config.js — Axios interceptors: inject Bearer token + handle 401
const BASE_URL = 'http://localhost:85/Web2-Inventory/backend-api/public'

axios.defaults.baseURL = BASE_URL

// Request interceptor — inject token
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor — catch 401
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.clear()
      // Redirect to login
      if (window.__vueRouter__) {
        window.__vueRouter__.push('/login')
      }
    }
    return Promise.reject(error)
  }
)

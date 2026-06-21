// axios-config.js — Axios interceptors: inject Bearer token + handle 401
let BASE_URL = 'http://localhost/UASWeb2/backend-api/public'

if (window.location.protocol.startsWith('http')) {
  const origin = window.location.origin
  const pathname = window.location.pathname
  
  if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
    // Jalur lokal (XAMPP / Laragon)
    let projectPath = '/UASWeb2'
    if (pathname.includes('/Web2-Inventory')) {
      projectPath = '/Web2-Inventory'
    }
    BASE_URL = `${origin}${projectPath}/backend-api/public`
  } else {
    // Jalur produksi di InfinityFree (Frontend di root, Backend di /backend-api)
    BASE_URL = `${origin}/backend-api/public`
  }
}

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

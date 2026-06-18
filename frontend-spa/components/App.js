import Sidebar from './components/Sidebar.js'

export default {
  name: 'App',
  components: { Sidebar },
  data() {
    return {
      user: null,
      showLayout: false,
    }
  },
  computed: {
    isFullWidthPage() {
      return ['/login', '/', '/home'].includes(this.$route.path)
    }
  },
  watch: {
    $route() { this.syncUser() }
  },
  created() {
    this.syncUser()
    // expose router for axios-config.js 401 redirect
    window.__vueRouter__ = this.$router
  },
  methods: {
    syncUser() {
      const raw = localStorage.getItem('user')
      this.user = raw ? JSON.parse(raw) : null
    },
    async handleLogout() {
      try {
        await axios.post('/api/auth/logout')
      } catch (_) { /* ignore */ }
      localStorage.clear()
      this.user = null
      this.$router.push('/login')
    }
  },
  template: `
    <template v-if="isFullWidthPage">
      <router-view />
    </template>
    <template v-else>
      <div class="app-layout">
        <Sidebar :user="user" @logout="handleLogout" />
        <main class="app-main">
          <div class="page-content">
            <router-view />
          </div>
        </main>
      </div>
    </template>
  `
}

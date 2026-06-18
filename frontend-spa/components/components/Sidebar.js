import icons from '../icons.js'

export default {
  name: 'AppSidebar',
  props: {
    user: { type: Object, default: null }
  },
  emits: ['logout'],
  data() {
    return { icons }
  },
  computed: {
    navItems() {
      return [
        {
          section: 'HOME',
          items: [
            { label: 'Dashboard',  to: '/dashboard', icon: 'dashboard' },
            { label: 'Part',       to: '/part',      icon: 'box' },
            { label: 'Kategori',   to: '/kategori',  icon: 'tag' },
            { label: 'Brand',      to: '/brand',     icon: 'bookmark' },
            { label: 'Supplier',   to: '/supplier',  icon: 'truck' },
          ]
        },
        {
          section: 'TRANSAKSI',
          items: [
            { label: 'Stok Masuk',  to: '/transaksi-masuk',  icon: 'arrowDown' },
            { label: 'Stok Keluar', to: '/transaksi-keluar', icon: 'arrowUp' },
          ]
        },
      ]
    }
  },
  methods: {
    isActive(path) {
      return this.$route.path === path || this.$route.path.startsWith(path + '/')
    }
  },
  template: `
    <aside class="sidebar">
      <!-- Logo -->
      <div class="sidebar-logo">
        <div class="sidebar-logo-icon" v-html="icons.logo"></div>
        <span class="sidebar-logo-text">E-Inventory PC</span>
      </div>

      <!-- User Greeting -->
      <div class="sidebar-greeting" v-if="user">
        <div class="sidebar-greeting-name">Selamat Datang,<br><strong>{{ user.nama }}</strong></div>
        <div class="sidebar-greeting-role">{{ user.role === 'admin' ? 'Administrator' : 'Staff Gudang' }}</div>
      </div>

      <!-- Navigation -->
      <nav class="sidebar-nav">
        <div v-for="group in navItems" :key="group.section" class="sidebar-group">
          <div class="section-label" style="padding: 0 10px; margin-top: 6px;">{{ group.section }}</div>
          <router-link
            v-for="item in group.items"
            :key="item.to"
            :to="item.to"
            class="sidebar-link"
            :class="{ active: isActive(item.to) }"
          >
            <span class="sidebar-link-icon" v-html="icons[item.icon]"></span>
            <span>{{ item.label }}</span>
          </router-link>
        </div>
      </nav>

      <!-- Logout -->
      <div class="sidebar-footer">
        <button class="sidebar-logout" @click="$emit('logout')">
          <span v-html="icons.logout"></span>
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  `
}

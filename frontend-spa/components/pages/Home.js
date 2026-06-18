import icons from '../icons.js'

export default {
  name: 'HomePage',
  data() {
    return {
      icons,
      loading: true,
      stats: {
        total_part: 0,
        total_kategori: 0,
        total_brand: 0,
        total_supplier: 0
      },
      parts: [],
      searchQuery: ''
    }
  },
  computed: {
    filteredParts() {
      return this.parts.filter(p => {
        const query = this.searchQuery.toLowerCase()
        return (
          p.nama_part.toLowerCase().includes(query) ||
          p.kode_part.toLowerCase().includes(query) ||
          p.nama_kategori.toLowerCase().includes(query) ||
          p.nama_brand.toLowerCase().includes(query)
        )
      })
    }
  },
  async created() {
    await Promise.all([
      this.loadStats(),
      this.loadParts()
    ])
  },
  methods: {
    async loadStats() {
      try {
        const res = await axios.get('/api/part/dashboard-stats')
        if (res.data.status) {
          this.stats = res.data.data
        }
      } catch (err) {
        console.error('Failed to load stats', err)
      }
    },
    async loadParts() {
      this.loading = true
      try {
        const res = await axios.get('/api/part')
        if (res.data.status) {
          this.parts = res.data.data
        }
      } catch (err) {
        console.error('Failed to load parts', err)
      } finally {
        this.loading = false
      }
    },
    formatRupiah(value) {
      if (!value) return 'Rp 0'
      return 'Rp ' + parseFloat(value).toLocaleString('id-ID', { minimumFractionDigits: 0 })
    },
    getStockBadgeClass(p) {
      if (p.stok === 0) return 'bg-red-50 text-red-700 border-red-100'
      if (p.stok <= p.stok_minimum) return 'bg-amber-50 text-amber-700 border-amber-100'
      return 'bg-emerald-50 text-emerald-700 border-emerald-100'
    }
  },
  template: `
    <div class="public-landing">
      <!-- Glow ambient background effects -->
      <div class="glow-sphere" style="top: -10%; left: 10%; width: 450px; height: 450px; background: radial-gradient(circle, rgba(26,112,245,0.08) 0%, rgba(26,112,245,0) 70%);"></div>
      <div class="glow-sphere" style="top: 40%; right: -5%; width: 500px; height: 500px; background: radial-gradient(circle, rgba(99,102,241,0.06) 0%, rgba(99,102,241,0) 70%);"></div>

      <!-- Header / Navbar -->
      <header class="public-header glass-card flex items-center justify-between px-6 py-4 mb-10">
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white" v-html="icons.logo"></div>
          <span class="text-base font-bold text-gray-900 tracking-tight">E-Inventory PC</span>
        </div>
        <router-link to="/login" class="btn btn-primary btn-sm flex items-center gap-1.5 shadow-sm">
          <span>Masuk Ke Sistem</span>
          <span v-html="icons.chevronRight"></span>
        </router-link>
      </header>

      <!-- Hero Section -->
      <div class="hero-section text-center max-w-2xl mx-auto mb-12">
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-blue-600 bg-blue-50/80 border border-blue-100 mb-4">
          <span class="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
          Katalog Publik Aktif
        </span>
        <h1 class="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight mb-4">
          Kelola & Pantau Komponen PC dengan Presisi
        </h1>
        <p class="text-sm text-gray-500 leading-relaxed max-w-lg mx-auto">
          Selamat datang di platform E-Inventory PC. Pantau ketersediaan stok processor, VGA, RAM, dan peripheral lainnya secara realtime.
        </p>
      </div>

      <!-- Grid Ringkasan Data -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <!-- Card 1 -->
        <div class="glass-card p-5 relative overflow-hidden transition-all duration-300 hover:-translate-y-1">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-semibold text-gray-400 tracking-wider">TOTAL KOMPONEN</span>
            <div class="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600" v-html="icons.box"></div>
          </div>
          <div class="text-2xl font-bold text-gray-900">{{ stats.total_part }}</div>
          <div class="text-[10px] text-gray-400 mt-1">Item PC Terdaftar</div>
        </div>

        <!-- Card 2 -->
        <div class="glass-card p-5 relative overflow-hidden transition-all duration-300 hover:-translate-y-1">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-semibold text-gray-400 tracking-wider">KATEGORI</span>
            <div class="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600" v-html="icons.tag"></div>
          </div>
          <div class="text-2xl font-bold text-gray-900">{{ stats.total_kategori }}</div>
          <div class="text-[10px] text-gray-400 mt-1">Pengelompokan Komponen</div>
        </div>

        <!-- Card 3 -->
        <div class="glass-card p-5 relative overflow-hidden transition-all duration-300 hover:-translate-y-1">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-semibold text-gray-400 tracking-wider">BRAND / PRODUSEN</span>
            <div class="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600" v-html="icons.bookmark"></div>
          </div>
          <div class="text-2xl font-bold text-gray-900">{{ stats.total_brand }}</div>
          <div class="text-[10px] text-gray-400 mt-1">Produsen Komponen</div>
        </div>

        <!-- Card 4 -->
        <div class="glass-card p-5 relative overflow-hidden transition-all duration-300 hover:-translate-y-1">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-semibold text-gray-400 tracking-wider">MITRA SUPPLIER</span>
            <div class="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600" v-html="icons.truck"></div>
          </div>
          <div class="text-2xl font-bold text-gray-900">{{ stats.total_supplier }}</div>
          <div class="text-[10px] text-gray-400 mt-1">Pemasok Terpercaya</div>
        </div>
      </div>

      <!-- Catalog / List Section -->
      <div class="glass-card p-6">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 class="text-base font-bold text-gray-950">Katalog Komponen PC</h2>
            <p class="text-xs text-gray-400 mt-0.5">Daftar stok barang di gudang yang terupdate saat ini.</p>
          </div>
          <div class="relative w-full md:max-w-xs">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400" v-html="icons.search"></span>
            <input
              type="text"
              class="form-control pl-10"
              placeholder="Cari nama, SKU, kategori..."
              v-model="searchQuery"
            />
          </div>
        </div>

        <div v-if="loading" class="flex items-center justify-center py-20 text-gray-400">
          <div class="flex flex-col items-center gap-3">
            <div class="spinner" style="border-color:rgba(26,112,245,0.2);border-top-color:#1A70F5;width:28px;height:28px;border-width:2.5px;"></div>
            <span class="text-xs">Memuat katalog...</span>
          </div>
        </div>

        <div v-else-if="filteredParts.length === 0" class="empty-state py-16">
          <div class="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-3 text-gray-400" v-html="icons.box"></div>
          <h3 class="text-sm font-semibold text-gray-800">Tidak ada komponen ditemukan</h3>
          <p class="text-xs text-gray-400 mt-1">Gunakan kata kunci pencarian yang lain.</p>
        </div>

        <div v-else class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th class="w-32">Kode SKU</th>
                <th>Nama Komponen</th>
                <th>Kategori</th>
                <th>Brand</th>
                <th class="text-right">Stok</th>
                <th class="text-right">Harga Jual</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in filteredParts" :key="p.id" class="hover:bg-gray-50/50">
                <td>
                  <span class="text-xs font-mono font-semibold text-gray-700 bg-gray-100/80 px-2 py-0.5 rounded border border-gray-200/50">
                    {{ p.kode_part }}
                  </span>
                </td>
                <td class="text-sm font-semibold text-gray-900">
                  {{ p.nama_part }}
                </td>
                <td class="text-sm text-gray-600">
                  {{ p.nama_kategori }}
                </td>
                <td class="text-sm text-gray-600">
                  {{ p.nama_brand }}
                </td>
                <td class="text-right">
                  <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold border" :class="getStockBadgeClass(p)">
                    {{ p.stok }} {{ p.satuan }}
                  </span>
                </td>
                <td class="text-right text-sm font-bold text-gray-950">
                  {{ formatRupiah(p.harga_jual) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
}

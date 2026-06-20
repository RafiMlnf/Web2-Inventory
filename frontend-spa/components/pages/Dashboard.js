import icons from '../icons.js'

export default {
  name: 'DashboardPage',
  data() {
    return {
      icons,
      loading: true,
      stats: { total_part: 0, part_aktif: 0, stok_menipis: 0, total_nilai_stok: 0 },
      stokMenipis: [],
      transaksiMasuk: [],
      transaksiKeluar: [],
      activeTab: 'masuk',
    }
  },
  computed: {
    user() {
      const raw = localStorage.getItem('user')
      return raw ? JSON.parse(raw) : null
    },
    recentList() {
      return this.activeTab === 'masuk'
        ? this.transaksiMasuk.slice(0, 6)
        : this.transaksiKeluar.slice(0, 6)
    },
    statCards() {
      return [
        {
          label: 'Total Part',
          value: this.stats.total_part,
          sub: 'jenis komponen terdaftar',
          icon: 'box',
          color: 'bg-primary/10 text-primary-DEFAULT',
          iconBg: '#EBF2FF',
          iconColor: '#1A70F5',
        },
        {
          label: 'Part Aktif',
          value: this.stats.part_aktif,
          sub: `dari ${this.stats.total_part} total part`,
          icon: 'check',
          iconBg: '#ECFDF5',
          iconColor: '#10B981',
        },
        {
          label: 'Stok Menipis',
          value: this.stats.stok_menipis,
          sub: 'perlu segera restock',
          icon: 'warning',
          iconBg: this.stats.stok_menipis > 0 ? '#FEF2F2' : '#ECFDF5',
          iconColor: this.stats.stok_menipis > 0 ? '#EF4444' : '#10B981',
          highlight: this.stats.stok_menipis > 0,
        },
        {
          label: 'Nilai Stok',
          value: this.formatRupiah(this.stats.total_nilai_stok),
          sub: 'estimasi total harga beli',
          icon: 'tag',
          iconBg: '#F5F0FF',
          iconColor: '#7C3AED',
          isString: true,
        },
      ]
    },
  },
  async created() {
    await this.loadAll()
  },
  methods: {
    async loadAll() {
      this.loading = true
      try {
        const [statsRes, menipis, masuk, keluar] = await Promise.all([
          axios.get('/api/part/dashboard-stats'),
          axios.get('/api/part/stok-menipis'),
          axios.get('/api/transaksi-masuk'),
          axios.get('/api/transaksi-keluar'),
        ])
        this.stats         = statsRes.data.data
        this.stokMenipis   = menipis.data.data
        this.transaksiMasuk  = masuk.data.data
        this.transaksiKeluar = keluar.data.data
      } catch (err) {
        console.error('Dashboard load error:', err)
      } finally {
        this.loading = false
      }
    },
    formatRupiah(amount) {
      if (!amount) return 'Rp 0'
      const n = parseFloat(amount)
      if (n >= 1_000_000_000) return `Rp ${(n / 1_000_000_000).toFixed(1)} M`
      if (n >= 1_000_000)     return `Rp ${(n / 1_000_000).toFixed(1)} jt`
      return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n)
    },
    formatDate(d) {
      if (!d) return '-'
      return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    },
    stockPercent(stok, min) {
      return Math.min(Math.max((stok / (min * 2)) * 100, 4), 100)
    },
    stockBarColor(stok, min) {
      if (stok <= min)       return '#EF4444'
      if (stok <= min * 1.5) return '#F59E0B'
      return '#10B981'
    },
  },
  template: `
    <div v-if="loading" class="flex items-center justify-center h-64 text-gray-400">
      <div class="flex flex-col items-center gap-3">
        <div class="spinner" style="border-color:rgba(26,112,245,0.2);border-top-color:#1A70F5;width:32px;height:32px;border-width:3px;"></div>
        <span class="text-sm">Memuat data dashboard...</span>
      </div>
    </div>

    <div v-else>

      <!-- ── Page Header ─────────────────────── -->
      <div class="page-header mb-6">
        <div class="page-header-title">
          <h1>Dashboard</h1>
          <p v-if="user">Selamat datang kembali, <strong>{{ user.nama }}</strong> — berikut ringkasan inventaris hari ini.</p>
        </div>
        <div class="page-header-actions">
          <button class="btn btn-outline btn-sm flex items-center gap-2" @click="loadAll">
            <span v-html="icons.check" style="opacity:0.6;"></span>
            Refresh Data
          </button>
        </div>
      </div>

      <!-- ── Stat Cards ──────────────────────── -->
      <div class="grid grid-cols-4 gap-4 mb-6">
        <div
          v-for="(card, i) in statCards"
          :key="i"
          class="stat-card relative overflow-hidden"
          :class="card.highlight ? 'ring-1 ring-red-200' : ''"
        >
          <!-- Icon -->
          <div class="flex items-start justify-between mb-4">
            <div class="stat-card-label">{{ card.label }}</div>
            <div
              class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              :style="{ background: card.iconBg, color: card.iconColor }"
              v-html="icons[card.icon]"
            ></div>
          </div>
          <!-- Value -->
          <div
            class="stat-card-value animate-swipe-up-fade"
            :style="{ color: card.highlight ? '#EF4444' : '', animationDelay: (i * 100) + 'ms' }"
          >
            {{ card.value }}
          </div>
          <div class="stat-card-sub">{{ card.sub }}</div>

          <!-- Highlight dot -->
          <div v-if="card.highlight" class="absolute top-3 right-3 w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
        </div>
      </div>

      <!-- ── Content Row ─────────────────────── -->
      <div class="grid grid-cols-5 gap-4 mb-6">

        <!-- Stok Menipis card (col 3) -->
        <div class="col-span-3 card p-6">
          <div class="flex items-center justify-between mb-5">
            <div>
              <h2 class="text-base font-bold text-gray-900">Alert Stok Menipis</h2>
              <p class="text-xs text-gray-400 mt-0.5">Part dengan stok di bawah atau mendekati batas minimum</p>
            </div>
            <router-link to="/part" class="btn btn-outline btn-sm flex items-center gap-1.5">
              Lihat Semua
              <span v-html="icons.chevronRight"></span>
            </router-link>
          </div>

          <!-- Empty state -->
          <div v-if="stokMenipis.length === 0" class="empty-state py-10">
            <div class="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-3" style="color:#10B981;">
              <span v-html="icons.check"></span>
            </div>
            <h3 class="text-sm font-semibold text-gray-800">Semua stok aman</h3>
            <p class="text-xs text-gray-400 mt-1">Tidak ada part yang memerlukan restock saat ini.</p>
          </div>

          <!-- List -->
          <div v-else class="space-y-3">
            <div
              v-for="item in stokMenipis.slice(0, 6)"
              :key="item.id"
              class="flex items-center gap-4 p-3 rounded-xl bg-gray-50 hover:bg-red-50 transition-colors"
            >

              <!-- Info -->
              <div class="flex-1 min-w-0">
                <div class="text-sm font-semibold text-gray-900 truncate">{{ item.nama_part }}</div>
                <div class="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5">
                  <span class="flex items-center gap-1">
                    <span class="text-primary-DEFAULT/70" v-html="icons.getCategoryIcon(item.nama_kategori)"></span>
                    <span>{{ item.nama_kategori }}</span>
                  </span>
                  <span>·</span>
                  <div class="w-3.5 h-3.5 rounded bg-white border border-gray-200 flex items-center justify-center p-0.5 overflow-hidden flex-shrink-0">
                    <img v-if="item.brand_logo_url" :src="item.brand_logo_url" :alt="item.nama_brand" class="max-w-full max-h-full object-contain" referrerpolicy="no-referrer" @error="item.brand_logo_url = null" />
                    <span v-else class="text-[7px] font-bold text-gray-400">{{ item.nama_brand.substring(0, 1).toUpperCase() }}</span>
                  </div>
                  <span>{{ item.nama_brand }}</span>
                </div>
                <!-- Progress bar -->
                <div class="mt-1.5 w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    class="h-1.5 rounded-full transition-all"
                    :style="{ width: stockPercent(item.stok, item.stok_minimum) + '%', background: stockBarColor(item.stok, item.stok_minimum) }"
                  ></div>
                </div>
              </div>
              <!-- Stock badge -->
              <div class="text-right flex-shrink-0">
                <div class="text-sm font-bold" :style="{ color: stockBarColor(item.stok, item.stok_minimum) }">{{ item.stok }}</div>
                <div class="text-xs text-gray-400">min {{ item.stok_minimum }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right column (col 2) -->
        <div class="col-span-2 flex flex-col gap-4">

          <!-- Dark card: Transaksi Masuk Summary -->
          <div class="card-dark p-6 flex-1">
            <div class="flex items-center justify-between mb-4">
              <div>
                <div class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Stok Masuk</div>
                <div class="text-2xl font-bold text-white">{{ transaksiMasuk.length }}</div>
                <div class="text-xs text-gray-500 mt-1">total transaksi</div>
              </div>
              <div class="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white" v-html="icons.arrowDown"></div>
            </div>
            <div class="border-t border-white/10 pt-4">
              <div class="text-xs text-gray-500 mb-1">Total nilai masuk</div>
              <div class="text-sm font-bold text-white">
                {{ formatRupiah(transaksiMasuk.reduce((s, t) => s + parseFloat(t.total_harga || 0), 0)) }}
              </div>
            </div>
          </div>

          <!-- White card: Transaksi Keluar Summary -->
          <div class="card p-6 flex-1">
            <div class="flex items-center justify-between mb-4">
              <div>
                <div class="stat-card-label">Stok Keluar</div>
                <div class="stat-card-value mt-2">{{ transaksiKeluar.length }}</div>
                <div class="stat-card-sub mt-1">total transaksi penjualan</div>
              </div>
              <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                   style="background:#F5F0FF;color:#7C3AED;" v-html="icons.arrowUp"></div>
            </div>
            <div class="pt-3 border-t border-gray-100">
              <div class="text-xs text-gray-400 mb-1">Total nilai keluar</div>
              <div class="text-sm font-bold text-gray-900">
                {{ formatRupiah(transaksiKeluar.reduce((s, t) => s + parseFloat(t.total_harga || 0), 0)) }}
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- ── Transaksi Terbaru ────────────────── -->
      <div class="card p-6">
        <!-- Header + tabs -->
        <div class="flex items-center justify-between mb-5">
          <div>
            <h2 class="text-base font-bold text-gray-900">Transaksi Terbaru</h2>
            <p class="text-xs text-gray-400 mt-0.5">6 transaksi terakhir</p>
          </div>
          <div class="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
            <button
              class="px-4 py-1.5 text-xs font-semibold rounded-lg transition-all"
              :class="activeTab === 'masuk' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'"
              @click="activeTab = 'masuk'"
            >
              Stok Masuk
            </button>
            <button
              class="px-4 py-1.5 text-xs font-semibold rounded-lg transition-all"
              :class="activeTab === 'keluar' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'"
              @click="activeTab = 'keluar'"
            >
              Stok Keluar
            </button>
          </div>
        </div>

        <!-- Table -->
        <div class="table-wrapper">
          <table class="data-table compact">
            <thead>
              <tr>
                <th>{{ activeTab === 'masuk' ? 'No. Invoice' : 'No. Transaksi' }}</th>
                <th>Part</th>
                <th>{{ activeTab === 'masuk' ? 'Supplier' : 'Pembeli' }}</th>
                <th>Jumlah</th>
                <th>Total</th>
                <th>Tanggal</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="recentList.length === 0">
                <td colspan="6" class="text-center py-8 text-gray-400 text-sm">Belum ada transaksi.</td>
              </tr>
              <tr v-for="t in recentList" :key="t.id">
                <td>
                  <span class="inline-flex items-center gap-1.5">
                    <span class="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                          :style="activeTab==='masuk' ? 'background:#ECFDF5;color:#10B981' : 'background:#FEF2F2;color:#EF4444'"
                          v-html="activeTab==='masuk' ? icons.arrowDown : icons.arrowUp"
                          style="width:16px;height:16px;"></span>
                    <code class="text-[11px] font-mono text-gray-600 bg-gray-50/70 px-1.5 py-0.5 rounded border border-gray-100/80 whitespace-nowrap">{{ activeTab === 'masuk' ? t.no_invoice : t.no_transaksi }}</code>
                  </span>
                </td>
                <td>
                  <div class="font-medium text-gray-900 text-sm">{{ t.nama_part }}</div>
                  <div class="text-xs text-gray-400">{{ t.kode_part }}</div>
                </td>
                <td class="text-sm text-gray-600">{{ activeTab === 'masuk' ? t.nama_supplier : t.nama_pembeli }}</td>
                <td>
                  <span class="badge" :class="activeTab === 'masuk' ? 'badge-success' : 'badge-danger'">
                    {{ activeTab === 'masuk' ? '+' : '-' }}{{ t.jumlah }} pcs
                  </span>
                </td>
                <td class="font-semibold text-sm">{{ formatRupiah(t.total_harga) }}</td>
                <td class="text-sm text-gray-400">{{ formatDate(activeTab === 'masuk' ? t.tgl_masuk : t.tgl_keluar) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Footer -->
        <div class="mt-4 pt-4 border-t border-gray-100 flex justify-end">
          <router-link
            :to="activeTab === 'masuk' ? '/transaksi-masuk' : '/transaksi-keluar'"
            class="btn btn-outline btn-sm flex items-center gap-1.5"
          >
            Lihat Semua Transaksi
            <span v-html="icons.chevronRight"></span>
          </router-link>
        </div>
      </div>

    </div>
  `
}

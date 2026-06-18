# PROJECT BRIEF
# Inventory Part PC (E-Inventory)
# UAS Pemrograman Web 2

---

## 📌 Deskripsi Proyek

Sistem informasi manajemen inventaris toko/gudang komponen PC berbasis web.
Mengelola data part (processor, RAM, storage, motherboard, dll), kategori,
brand, supplier, serta transaksi stok masuk dan keluar.

Dibangun dengan arsitektur **Decoupled (Frontend ↔ Backend terpisah)**:
- Backend sebagai pure RESTful API (CodeIgniter 4)
- Frontend sebagai Single Page Application (VueJS 3 via CDN)

---

## 🗂️ Tema UAS

**Tema: Sistem Manajemen Inventaris Barang (E-Inventory)**
Studi Kasus: **Toko/Gudang Komponen PC**

---

## 🛠️ Tech Stack

### Backend
| Komponen        | Teknologi                        |
|-----------------|----------------------------------|
| Framework       | CodeIgniter 4 (CI4)              |
| Pattern         | RESTful API (Resource Controller)|
| Database        | MySQL / MariaDB                  |
| Auth            | Bearer Token (CI4 Filters)       |
| CORS            | Config/Filters.php global filter |
| Server lokal    | XAMPP / Laragon                  |

### Frontend
| Komponen        | Teknologi                        |
|-----------------|----------------------------------|
| Framework       | VueJS 3 (CDN)                    |
| Router          | Vue Router 4 (CDN)               |
| HTTP Client     | Axios (CDN)                      |
| UI Framework    | TailwindCSS (CDN)                |
| Storage         | localStorage (token & session)   |

---

## 🗃️ Desain Database (7 Tabel Utama)

### Skema Relasi

```
kategori_part
  └─ (1-N) → part

brand
  └─ (1-N) → part

supplier
  └─ (1-N) → part (sumber barang)
  └─ (1-N) → transaksi_masuk

users
  └─ (1-N) → transaksi_masuk
  └─ (1-N) → transaksi_keluar

part  ← TABEL UTAMA
  ├─ FK: kategori_id → kategori_part
  ├─ FK: brand_id → brand
  ├─ FK: supplier_id → supplier
  ├─ (1-N) → transaksi_masuk
  └─ (1-N) → transaksi_keluar

transaksi_masuk (Stok Masuk)
  ├─ FK: part_id → part
  ├─ FK: supplier_id → supplier
  └─ FK: user_id → users

transaksi_keluar (Stok Keluar)
  ├─ FK: part_id → part
  └─ FK: user_id → users
```

### Detail Setiap Tabel

#### 1. `users`
```sql
id, nama, email, password, role (admin/staff), created_at
```

#### 2. `kategori_part`
```sql
id, nama_kategori (Processor/RAM/Storage/Motherboard/PSU/VGA/Cooling/Casing),
deskripsi, created_at
```

#### 3. `brand`
```sql
id, nama_brand (Intel/AMD/Asus/Corsair/Samsung/dll), logo_url, created_at
```

#### 4. `supplier`
```sql
id, nama_supplier, alamat, no_telp, email, kontak_person, created_at
```

#### 5. `part` ← MASTER UTAMA
```sql
id, kode_part (SKU), nama_part, kategori_id (FK), brand_id (FK),
supplier_id (FK), spesifikasi (text — socket/kapasitas/clock speed dll),
harga_beli, harga_jual, stok, stok_minimum,
satuan (pcs/unit), gambar_url, status (aktif/discontinue), created_at
```

#### 6. `transaksi_masuk`
```sql
id, part_id (FK), supplier_id (FK), user_id (FK),
no_invoice, jumlah, harga_satuan, total_harga,
tgl_masuk, keterangan, created_at
```

#### 7. `transaksi_keluar`
```sql
id, part_id (FK), user_id (FK),
no_transaksi, jumlah, harga_satuan, total_harga,
nama_pembeli, tgl_keluar, keterangan, created_at
```

---

## 💡 Logika Stok Otomatis

```
Stok part bertambah  → saat insert transaksi_masuk (update di controller)
Stok part berkurang  → saat insert transaksi_keluar (update di controller,
                        validasi stok cukup sebelum kurangi)
Alert "Stok Menipis" → jika stok <= stok_minimum (tampil di Dashboard)
```

---

## 📁 Struktur Folder Proyek

```
UAS_Web2_NIM_Nama/
│
├── backend-api/                  ← CodeIgniter 4
│   ├── app/
│   │   ├── Controllers/
│   │   │   ├── AuthController.php
│   │   │   ├── PartController.php          (Resource)
│   │   │   ├── KategoriController.php      (Resource)
│   │   │   ├── BrandController.php         (Resource)
│   │   │   ├── SupplierController.php      (Resource)
│   │   │   ├── TransaksiMasukController.php(Resource)
│   │   │   └── TransaksiKeluarController.php(Resource)
│   │   ├── Filters/
│   │   │   ├── AuthFilter.php              ← Bearer Token check
│   │   │   └── CorsFilter.php              ← CORS global
│   │   ├── Models/
│   │   │   ├── UserModel.php
│   │   │   ├── PartModel.php
│   │   │   ├── KategoriModel.php
│   │   │   ├── BrandModel.php
│   │   │   ├── SupplierModel.php
│   │   │   ├── TransaksiMasukModel.php
│   │   │   └── TransaksiKeluarModel.php
│   │   └── Config/
│   │       ├── Filters.php                 ← Register CORS + Auth filter
│   │       └── Routes.php                  ← Daftarkan semua resource route
│   └── .env
│
└── frontend-spa/                 ← VueJS 3 SPA
    ├── index.html                ← Entry point, load Vue + Router + Axios + Tailwind CDN
    └── components/
        ├── App.js                ← Root component + router-view
        ├── router.js             ← Vue Router + Navigation Guard
        ├── axios-config.js       ← Axios interceptors (inject token + handle 401)
        ├── pages/
        │   ├── Home.js           ← Public landing page (ringkasan data)
        │   ├── Login.js          ← Form login → POST /auth/login
        │   ├── Dashboard.js      ← Admin dashboard (statistik + stok menipis)
        │   ├── Part.js           ← CRUD part (tabel + modal)
        │   ├── Kategori.js       ← CRUD kategori part
        │   ├── Brand.js          ← CRUD brand
        │   ├── Supplier.js       ← CRUD supplier
        │   ├── TransaksiMasuk.js ← Form & log stok masuk
        │   └── TransaksiKeluar.js← Form & log stok keluar
        └── components/
            ├── Navbar.js         ← Navbar dengan tombol Logout
            ├── Sidebar.js        ← Menu navigasi admin
            └── Modal.js          ← Reusable modal tambah/edit

```

---

## 🔗 API Endpoints

### Auth
```
POST   /api/auth/login     → Login, return token
POST   /api/auth/logout    → Logout (butuh token)
```

### Part (Protected)
```
GET    /api/part           → List semua part
GET    /api/part/{id}      → Detail 1 part
POST   /api/part           → Tambah part         🔒
PUT    /api/part/{id}      → Edit part            🔒
DELETE /api/part/{id}      → Hapus part           🔒
```

### Kategori (Protected)
```
GET    /api/kategori
POST   /api/kategori                              🔒
PUT    /api/kategori/{id}                         🔒
DELETE /api/kategori/{id}                         🔒
```

### Brand (Protected)
```
GET    /api/brand
POST   /api/brand                                 🔒
PUT    /api/brand/{id}                            🔒
DELETE /api/brand/{id}                            🔒
```

### Supplier (Protected)
```
GET    /api/supplier
POST   /api/supplier                              🔒
PUT    /api/supplier/{id}                         🔒
DELETE /api/supplier/{id}                         🔒
```

### Transaksi Masuk (Protected)
```
GET    /api/transaksi-masuk
GET    /api/transaksi-masuk?part_id={id}
POST   /api/transaksi-masuk                       🔒 (auto update stok part)
DELETE /api/transaksi-masuk/{id}                  🔒
```

### Transaksi Keluar (Protected)
```
GET    /api/transaksi-keluar
GET    /api/transaksi-keluar?part_id={id}
POST   /api/transaksi-keluar                      🔒 (auto update stok part)
DELETE /api/transaksi-keluar/{id}                 🔒
```

🔒 = Butuh `Authorization: Bearer {token}` di HTTP Header

---

## 👤 Hak Akses (User Matrix)

| Halaman              | Public (Tanpa Login) | Admin (Login) |
|----------------------|:---------------------:|:-------------:|
| Landing Page         | ✅                    | ✅            |
| Ringkasan Statistik  | ✅ (read only)        | ✅            |
| Dashboard Admin      | ❌                    | ✅            |
| CRUD Part            | ❌                    | ✅            |
| CRUD Kategori        | ❌                    | ✅            |
| CRUD Brand           | ❌                    | ✅            |
| CRUD Supplier        | ❌                    | ✅            |
| Transaksi Masuk      | ❌                    | ✅            |
| Transaksi Keluar     | ❌                    | ✅            |

---

## 🔐 Implementasi Keamanan

### Backend — CI4 Auth Filter
```php
// app/Filters/AuthFilter.php
// Cek header Authorization: Bearer {token}
// Jika tidak ada / tidak valid → return 401 Unauthorized
```

### Frontend — Navigation Guard
```javascript
// router.js
router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn')
  if (to.meta.requiresAuth && !isLoggedIn) {
    next('/login')
  } else {
    next()
  }
})
```

### Frontend — Axios Interceptors
```javascript
// axios-config.js

// Request interceptor → inject token otomatis
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Response interceptor → tangkap error 401
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.clear()
      alert('Sesi habis, silakan login kembali.')
      router.push('/login')
    }
    return Promise.reject(error)
  }
)
```

---

## 📋 Step-by-Step Pengerjaan

### FASE 1 — Setup & Database (Hari 1)
```
[ ] Install XAMPP/Laragon
[ ] Install CodeIgniter 4 via Composer
[ ] Buat database: inventory_part_pc_db
[ ] Buat 7 tabel sesuai skema di atas
[ ] Isi data dummy untuk testing (kategori, brand, supplier, part)
[ ] Konfigurasi .env CI4 (database connection)
```

### FASE 2 — Backend CI4 (Hari 2-3)
```
[ ] Buat semua Model (7 model)
[ ] Buat AuthController (login/logout + generate token)
[ ] Buat Resource Controller untuk masing-masing entitas
[ ] Implementasi logika update stok di Transaksi Masuk/Keluar
[ ] Buat AuthFilter.php (cek Bearer Token)
[ ] Buat CorsFilter.php
[ ] Register filter di Config/Filters.php
[ ] Daftarkan semua route di Config/Routes.php
[ ] Test semua endpoint via Postman
[ ] Screenshot error 401 (untuk README)
```

### FASE 3 — Frontend VueJS (Hari 4-5)
```
[ ] Buat index.html (load CDN: Vue, Vue Router, Axios, Tailwind)
[ ] Buat router.js (semua route + meta requiresAuth)
[ ] Buat axios-config.js (interceptors)
[ ] Buat komponen Navbar.js dan Sidebar.js
[ ] Buat halaman Login.js
[ ] Buat halaman Home.js (public landing page)
[ ] Buat halaman Dashboard.js (statistik + alert stok menipis)
[ ] Buat halaman Part.js (tabel + modal CRUD)
[ ] Buat halaman Kategori.js
[ ] Buat halaman Brand.js
[ ] Buat halaman Supplier.js
[ ] Buat halaman TransaksiMasuk.js
[ ] Buat halaman TransaksiKeluar.js
```

### FASE 4 — Polish & Testing (Hari 6)
```
[ ] Test semua fitur end-to-end
[ ] Test navigation guard (akses admin tanpa login)
[ ] Test interceptor (token expired → redirect login)
[ ] Test logika stok (masuk tambah, keluar kurangi, validasi stok cukup)
[ ] Rapikan UI TailwindCSS semua halaman
[ ] Responsiveness check (mobile/tablet)
```

### FASE 5 — Dokumentasi & Pengumpulan (Hari 7)
```
[ ] Screenshot ERD dari phpMyAdmin
[ ] Screenshot error 401 dari Postman
[ ] Screenshot UI: Login, Dashboard, Modal, Tabel
[ ] Tulis README.md lengkap
[ ] Push semua ke GitHub (repo: UAS_Web2_NIM_Nama)
[ ] Rekam video presentasi (maks 7 menit, tampilkan wajah)
[ ] Upload YouTube + share ke medsos
[ ] Submit ke form: https://forms.gle/WZLj2XDxPupppc869
```

---

## 💡 Tips Pengerjaan

1. **Mulai dari backend dulu** — pastikan semua endpoint sudah jalan di Postman
   sebelum mulai frontend.
2. **Token sederhana saja** — untuk UAS, random string atau hash MD5 dari
   email+timestamp sudah cukup. Tidak perlu JWT kecuali mau nilai plus.
3. **Prioritas halaman Part.js** — ini tabel utama, paling dinilai. Pastikan
   modal tambah/edit dan tabel data sudah sempurna di sini dulu.
4. **Gunakan komponen Modal reusable** — satu Modal.js bisa dipakai di semua
   halaman untuk efisiensi.
5. **Data dummy realistis** — gunakan nama part PC asli (Ryzen 5 5600X,
   Samsung 970 EVO, dll) supaya demo lebih menarik.
6. **CORS** — sumber masalah paling umum. Pastikan CorsFilter aktif sebelum
   mulai development frontend.
7. **Validasi stok keluar** — pastikan jumlah keluar tidak melebihi stok
   yang tersedia (logika penting untuk dinilai).

---

*Brief ini dibuat sebagai panduan pengerjaan UAS Pemrograman Web 2.*
*Studi kasus: Inventory Part PC — Toko/Gudang Komponen PC.*

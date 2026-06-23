# Skrip Video Presentasi Proyek Akhir (UAS)
**Mata Kuliah:** Pemrograman Web 2  
**Nama Aplikasi:** Omniacomp Inventory  
**Target Durasi:** 5 - 6 Menit (Maksimal Batas Aman: 7 Menit)  

---

## 🎬 Panduan Perekaman Video
1. **Wajah Presenter:** Wajib menampilkan wajah menggunakan webcam (bisa ditaruh di pojok layar/PiP).
2. **Kualitas Audio:** Pastikan suara terdengar jelas dan minim *noise*.
3. **Persiapan Layar:** Buka browser (tampilkan website demo), database client (phpMyAdmin), editor kode (VS Code), dan Postman sebelum merekam.

---

## 📝 Rundown & Skrip Video

### Bagian 1: Pembukaan & Perkenalan Diri (00:00 - 01:00)
**Visual di Layar:** Webcam penuh menampilkan wajah Anda, lalu mulai *screen share* menampilkan halaman beranda (Landing Page) aplikasi.

> **Dialog/Skrip:**
> "Halo semuanya, perkenalkan nama saya **[Nama Anda]** dengan NIM **[NIM Anda]**. Saya adalah mahasiswa kelas Pemrograman Web 2.
>
> Pada kesempatan kali ini, saya akan mempresentasikan proyek Ujian Akhir Semester (UAS) saya yang berjudul **Omniacomp Inventory**. Ini adalah Sistem Manajemen Inventaris Gudang dan Toko Komponen PC.
>
> Aplikasi ini dibangun dengan menggunakan **Decoupled Architecture** (Arsitektur Terpisah), di mana bagian server (backend) dan klien (frontend) terpisah sepenuhnya. Backend menggunakan PHP framework **CodeIgniter 4** sebagai RESTful API Server, dan frontend menggunakan **VueJS 3** dengan Vue Router berbasis CDN serta dipercantik dengan utility-first CSS framework **TailwindCSS**."

---

### Bagian 2: Struktur Database & Backend RESTful API (01:00 - 02:15)
**Visual di Layar:** Tampilkan skema relasi database di phpMyAdmin (atau gambar relasi DB di README), kemudian beralih ke editor teks menampilkan berkas `Routes.php` atau file Controller di folder `backend-api`.

> **Dialog/Skrip:**
> "Pertama, mari kita lihat arsitektur database. Sistem ini didukung oleh basis data relasional MySQL dengan nama **inventory_part_pc_db** yang memiliki 7 tabel saling berelasi. Ada tabel `users`, `kategori_part`, `brand`, `supplier`, tabel master utama `part` (komponen PC), serta tabel `transaksi_masuk` dan `transaksi_keluar` untuk mencatat log mutasi barang.
>
> Pada sisi backend, semua routing diatur sebagai RESTful API. Kita menyediakan Resource Controller penuh untuk melayani operasi CRUD data master.
>
> Dari sisi keamanan server, kita menerapkan **CodeIgniter Filters** melalui berkas `AuthFilter.php` untuk memproteksi endpoint penting seperti POST, PUT, dan DELETE. Endpoint ini tidak dapat diakses tanpa melampirkan **Authorization Bearer Token** yang valid pada HTTP Header. 
>
> Selain itu, penanganan CORS global sudah dikonfigurasi pada `Filters.php` agar frontend VueJS dapat menembak API lintas origin dengan aman tanpa diblokir oleh browser."

---

### Bagian 3: Demo Aplikasi - Landing Page / Sisi Publik (02:15 - 03:00)
**Visual di Layar:** Buka browser, tunjukkan halaman Landing Page, geser layar ke bawah menampilkan katalog produk dan fitur pencarian barang.

> **Dialog/Skrip:**
> "Sekarang kita beralih ke demonstrasi aplikasi. Ini adalah tampilan depan atau **Landing Page** yang dapat diakses oleh pengunjung umum (publik) tanpa perlu login.
>
> Halaman ini didesain responsif dan modern dengan gaya *glassmorphism* menggunakan TailwindCSS. Di sini, pengunjung dapat melihat informasi umum toko, katalog lengkap komponen PC yang tersedia, status stok, serta melakukan pencarian barang secara instan.
>
> Sesuai dengan User Matrix, hak akses publik hanya dibatasi untuk melihat informasi katalog saja (read-only) dan tidak memiliki akses untuk menambah atau mengubah data."

---

### Bagian 4: Demo Aplikasi - Login & Dashboard Admin (03:00 - 04:30)
**Visual di Layar:** Klik menu login, masukkan email `admin@inventorypc.com` dan password `password123`. Masuk ke halaman Dashboard Admin, lalu tunjukkan navigasi sidebar, sistem peringatan stok menipis, dan tunjukkan modal box untuk tambah/edit data.

> **Dialog/Skrip:**
> "Selanjutnya, kita akan masuk sebagai **Administrator**. Saya akan memasukkan kredensial login. Di balik layar, frontend mengirimkan request POST berformat JSON ke server, menerima token otentikasi, lalu menyimpannya di **LocalStorage** browser.
>
> Halaman admin dilindungi oleh **Navigation Guards (`router.beforeEach`)** di Vue Router. Jika pengguna belum login mencoba mengakses halaman ini secara ilegal, sistem akan otomatis melemparnya kembali ke halaman login.
>
> Ini adalah halaman **Dashboard Admin**. Di sini kita disajikan ringkasan data inventaris dan widget peringatan dinamis jika ada stok barang yang berada di bawah stok minimum.
>
> Di sini juga terintegrasi **Axios Request Interceptor** yang otomatis menyuntikkan token dari LocalStorage ke dalam header setiap request API. Kita coba buka menu Data Part dan menekan tombol tambah barang. Form input muncul secara elegan menggunakan modal interaktif TailwindCSS."

---

### Bagian 5: Uji Coba Keamanan - Error 401 di Postman (04:30 - 05:15)
**Visual di Layar:** Buka aplikasi Postman, tunjukkan penembakan request POST ke `http://localhost:8080/api/part` (atau port 85). Tunjukkan respon 401 saat `No Auth` dan saat token diubah secara asal.

> **Dialog/Skrip:**
> "Untuk membuktikan bahwa sistem keamanan token di backend berjalan secara mandiri, mari kita lakukan uji coba menggunakan **Postman**.
>
> Di sini saya mencoba mengirimkan request POST untuk menambah data barang baru ke endpoint `/api/part`. Saat saya memilih opsi **No Auth** (tanpa token), backend merespon dengan status **401 Unauthorized** dan pesan *'Token tidak ditemukan'*.
>
> Begitu pula ketika saya memasukkan token asal atau palsu, filter backend akan mendeteksi bahwa token tersebut tidak cocok dengan database, dan merespon kembali dengan **401 Unauthorized** dengan pesan *'Token tidak valid atau expired'*.
>
> Di frontend, jika terjadi error 401 ini, **Axios Response Interceptor** akan langsung menangkapnya secara global, menghapus sesi localStorage yang usang, dan mengarahkan pengguna kembali ke halaman login."

---

### Bagian 6: Penutup (05:15 - End)
**Visual di Layar:** Kembali tampilkan wajah Anda (webcam penuh) atau halaman penutup demo.

> **Dialog/Skrip:**
> "Demikianlah presentasi proyek aplikasi **Omniacomp Inventory** ini. Seluruh kriteria tugas mulai dari pemisahan arsitektur backend-frontend, relasi database, otentikasi Bearer Token, navigasi SPA, hingga penataan gaya TailwindCSS telah diimplementasikan dengan lengkap dan berfungsi dengan baik.
>
> Terima kasih banyak atas perhatiannya, khususnya kepada dosen pengampu mata kuliah Pemrograman Web 2. Kurang lebihnya mohon maaf, sampai jumpa dan terima kasih."

---

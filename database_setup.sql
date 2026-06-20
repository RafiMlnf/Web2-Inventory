-- ============================================================
-- DATABASE SETUP: inventory_part_pc_db
-- Project: UAS Pemrograman Web 2 - E-Inventory Part PC
-- ============================================================

-- Hapus database lama jika ada agar bersih saat di-import ulang
DROP DATABASE IF EXISTS inventory_part_pc_db;

CREATE DATABASE IF NOT EXISTS inventory_part_pc_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE inventory_part_pc_db;

-- Hapus tabel-tabel lama jika ada (berguna jika di-import ke database yang sudah ada)
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS transaksi_keluar;
DROP TABLE IF EXISTS transaksi_masuk;
DROP TABLE IF EXISTS part;
DROP TABLE IF EXISTS supplier;
DROP TABLE IF EXISTS brand;
DROP TABLE IF EXISTS kategori_part;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- TABEL 1: users
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  nama        VARCHAR(100)  NOT NULL,
  email       VARCHAR(150)  NOT NULL UNIQUE,
  password    VARCHAR(255)  NOT NULL,
  role        ENUM('admin','staff') NOT NULL DEFAULT 'staff',
  token       VARCHAR(255)  NULL,
  created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- TABEL 2: kategori_part
-- ============================================================
CREATE TABLE IF NOT EXISTS kategori_part (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  nama_kategori  VARCHAR(100) NOT NULL,
  deskripsi      TEXT         NULL,
  created_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- TABEL 3: brand
-- ============================================================
CREATE TABLE IF NOT EXISTS brand (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  nama_brand  VARCHAR(100) NOT NULL,
  logo_url    VARCHAR(255) NULL,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- TABEL 4: supplier
-- ============================================================
CREATE TABLE IF NOT EXISTS supplier (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  nama_supplier   VARCHAR(150) NOT NULL,
  alamat          TEXT         NULL,
  no_telp         VARCHAR(20)  NULL,
  email           VARCHAR(150) NULL,
  kontak_person   VARCHAR(100) NULL,
  created_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- TABEL 5: part (MASTER UTAMA)
-- ============================================================
CREATE TABLE IF NOT EXISTS part (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  kode_part     VARCHAR(50)  NOT NULL UNIQUE,
  nama_part     VARCHAR(200) NOT NULL,
  kategori_id   INT          NOT NULL,
  brand_id      INT          NOT NULL,
  supplier_id   INT          NOT NULL,
  spesifikasi   TEXT         NULL,
  harga_beli    DECIMAL(15,2) NOT NULL DEFAULT 0,
  harga_jual    DECIMAL(15,2) NOT NULL DEFAULT 0,
  stok          INT          NOT NULL DEFAULT 0,
  stok_minimum  INT          NOT NULL DEFAULT 5,
  satuan        ENUM('pcs','unit') NOT NULL DEFAULT 'pcs',
  gambar_url    VARCHAR(255) NULL,
  status        ENUM('aktif','discontinue') NOT NULL DEFAULT 'aktif',
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_part_kategori  FOREIGN KEY (kategori_id) REFERENCES kategori_part(id) ON DELETE RESTRICT,
  CONSTRAINT fk_part_brand     FOREIGN KEY (brand_id)    REFERENCES brand(id)         ON DELETE RESTRICT,
  CONSTRAINT fk_part_supplier  FOREIGN KEY (supplier_id) REFERENCES supplier(id)      ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- TABEL 6: transaksi_masuk
-- ============================================================
CREATE TABLE IF NOT EXISTS transaksi_masuk (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  part_id       INT           NOT NULL,
  supplier_id   INT           NOT NULL,
  user_id       INT           NOT NULL,
  no_invoice    VARCHAR(50)   NOT NULL,
  jumlah        INT           NOT NULL,
  harga_satuan  DECIMAL(15,2) NOT NULL,
  total_harga   DECIMAL(15,2) NOT NULL,
  tgl_masuk     DATE          NOT NULL,
  keterangan    TEXT          NULL,
  created_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_tm_part     FOREIGN KEY (part_id)     REFERENCES part(id)     ON DELETE RESTRICT,
  CONSTRAINT fk_tm_supplier FOREIGN KEY (supplier_id) REFERENCES supplier(id) ON DELETE RESTRICT,
  CONSTRAINT fk_tm_user     FOREIGN KEY (user_id)     REFERENCES users(id)    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- TABEL 7: transaksi_keluar
-- ============================================================
CREATE TABLE IF NOT EXISTS transaksi_keluar (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  part_id        INT           NOT NULL,
  user_id        INT           NOT NULL,
  no_transaksi   VARCHAR(50)   NOT NULL,
  jumlah         INT           NOT NULL,
  harga_satuan   DECIMAL(15,2) NOT NULL,
  total_harga    DECIMAL(15,2) NOT NULL,
  nama_pembeli   VARCHAR(150)  NOT NULL,
  tgl_keluar     DATE          NOT NULL,
  keterangan     TEXT          NULL,
  created_at     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_tk_part FOREIGN KEY (part_id) REFERENCES part(id)  ON DELETE RESTRICT,
  CONSTRAINT fk_tk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- DATA DUMMY
-- ============================================================

-- Users (password = MD5("password123") untuk demo)
INSERT INTO users (nama, email, password, role) VALUES
  ('Administrator', 'admin@inventorypc.com', MD5('password123'), 'admin'),
  ('Staff Gudang',  'staff@inventorypc.com', MD5('password123'), 'staff');

-- Kategori Part
INSERT INTO kategori_part (nama_kategori, deskripsi) VALUES
  ('Processor',    'Unit pemrosesan utama (CPU) komputer'),
  ('RAM',          'Memory / Random Access Memory'),
  ('Storage',      'Media penyimpanan data (SSD/HDD/NVMe)'),
  ('Motherboard',  'Papan induk / mainboard'),
  ('PSU',          'Power Supply Unit - sumber daya komputer'),
  ('VGA',          'Kartu grafis / Graphics Card'),
  ('Cooling',      'Sistem pendingin: cooler, fan, thermal paste'),
  ('Casing',       'Casing / chassis komputer');

-- Brand
INSERT INTO brand (nama_brand, logo_url) VALUES
  ('Intel', 'https://www.google.com/s2/favicons?domain=intel.com&sz=128'),
  ('AMD', 'https://www.google.com/s2/favicons?domain=amd.com&sz=128'),
  ('ASUS', 'https://www.google.com/s2/favicons?domain=asus.com&sz=128'),
  ('MSI', 'https://www.google.com/s2/favicons?domain=msi.com&sz=128'),
  ('Corsair', 'https://www.google.com/s2/favicons?domain=corsair.com&sz=128'),
  ('Samsung', 'https://www.google.com/s2/favicons?domain=samsung.com&sz=128'),
  ('Western Digital', 'https://www.google.com/s2/favicons?domain=westerndigital.com&sz=128'),
  ('Seagate', 'https://www.google.com/s2/favicons?domain=seagate.com&sz=128'),
  ('EVGA', 'https://www.google.com/s2/favicons?domain=evga.com&sz=128'),
  ('Gigabyte', 'https://www.google.com/s2/favicons?domain=gigabyte.com&sz=128'),
  ('Kingston', 'https://www.google.com/s2/favicons?domain=kingston.com&sz=128'),
  ('Noctua', 'https://www.google.com/s2/favicons?domain=noctua.at&sz=128'),
  ('DeepCool', 'https://www.google.com/s2/favicons?domain=deepcool.com&sz=128'),
  ('Fractal Design', 'https://www.google.com/s2/favicons?domain=fractal-design.com&sz=128'),
  ('be quiet!', 'https://www.google.com/s2/favicons?domain=bequiet.com&sz=128');

-- Supplier
INSERT INTO supplier (nama_supplier, alamat, no_telp, email, kontak_person) VALUES
  ('PT. Komputindo Jaya',     'Jl. Mangga Dua No.12, Jakarta',   '021-6230001', 'order@komputindojaya.com',  'Budi Santoso'),
  ('CV. Digit Mania',         'Jl. Ruko Elektronik B5, Surabaya','031-7112233', 'sales@digitmania.id',       'Dewi Lestari'),
  ('Toko IT Central',         'Jl. Pasar Baru No.88, Bandung',   '022-4233100', 'it.central@gmail.com',      'Eko Prasetyo'),
  ('PT. Global Tech Supply',  'Jl. Sudirman Kav.22, Jakarta',    '021-5702200', 'supply@globaltech.co.id',   'Fitri Handayani');

-- Part (data dummy realistis)
INSERT INTO part (kode_part, nama_part, kategori_id, brand_id, supplier_id, spesifikasi, harga_beli, harga_jual, stok, stok_minimum, satuan, gambar_url, status) VALUES
  -- Processor
  ('CPU-AMD-001', 'AMD Ryzen 5 5600X',    1, 2, 1, 'Socket AM4, 6 Core 12 Thread, 3.7GHz-4.6GHz, TDP 65W',              2650000, 3100000, 15, 3, 'pcs', 'https://m.media-amazon.com/images/I/51MFe1hs5AL._AC_SL1500_.jpg', 'aktif'),
  ('CPU-AMD-002', 'AMD Ryzen 7 5800X',    1, 2, 1, 'Socket AM4, 8 Core 16 Thread, 3.8GHz-4.7GHz, TDP 105W',             4100000, 4800000, 8,  3, 'pcs', 'https://m.media-amazon.com/images/I/51oWBjxqHvL._AC_SL1500_.jpg', 'aktif'),
  ('CPU-INT-001', 'Intel Core i5-12400F', 1, 1, 1, 'Socket LGA1700, 6 Core 12 Thread, 2.5GHz-4.4GHz, TDP 65W',          2200000, 2750000, 12, 3, 'pcs', 'https://m.media-amazon.com/images/I/61iyHIe0vnL._AC_SL1500_.jpg', 'aktif'),
  ('CPU-INT-002', 'Intel Core i7-12700K', 1, 1, 1, 'Socket LGA1700, 12 Core 20 Thread, 3.6GHz-5.0GHz, TDP 125W',        4800000, 5500000, 5,  3, 'pcs', 'https://m.media-amazon.com/images/I/617HL0dR0iL._AC_SL1500_.jpg', 'aktif'),

  -- RAM
  ('RAM-COR-001', 'Corsair Vengeance LPX 16GB DDR4', 2, 5, 2, 'DDR4 3200MHz, CL16, 2x8GB Kit, 1.35V',                  650000,  850000,  20, 5, 'pcs', 'https://m.media-amazon.com/images/I/71GEnQXEb3L._AC_SL1500_.jpg', 'aktif'),
  ('RAM-COR-002', 'Corsair Dominator 32GB DDR5',      2, 5, 2, 'DDR5 5200MHz, CL38, 2x16GB Kit, 1.25V',                 1800000, 2200000, 7,  3, 'pcs', 'https://m.media-amazon.com/images/I/71gHAqORv3L._AC_SL1500_.jpg', 'aktif'),
  ('RAM-KIN-001', 'Kingston Fury Beast 16GB DDR4',    2, 11, 2, 'DDR4 3600MHz, CL18, 2x8GB Kit, 1.35V',                 600000,  780000,  18, 5, 'pcs', 'https://m.media-amazon.com/images/I/71SDFMfpWCL._AC_SL1500_.jpg', 'aktif'),

  -- Storage
  ('SSD-SAM-001', 'Samsung 970 EVO Plus 1TB NVMe',   3, 6, 3, 'M.2 PCIe 3.0, R:3500MB/s W:3300MB/s, TLC NAND',         1150000, 1450000, 22, 5, 'pcs', 'https://m.media-amazon.com/images/I/71+J1VmCPNL._AC_SL1500_.jpg', 'aktif'),
  ('SSD-SAM-002', 'Samsung 980 Pro 2TB NVMe',         3, 6, 3, 'M.2 PCIe 4.0, R:7000MB/s W:5100MB/s, MLC NAND',         2300000, 2800000, 10, 3, 'pcs', 'https://m.media-amazon.com/images/I/71RkOhNnAXL._AC_SL1500_.jpg', 'aktif'),
  ('HDD-WD-001',  'WD Blue 2TB 3.5" HDD',             3, 7, 3, 'SATA III, 5400RPM, 256MB Cache, CMR',                   650000,  820000,  14, 5, 'pcs', 'https://m.media-amazon.com/images/I/71hMpE0mF1L._AC_SL1500_.jpg', 'aktif'),
  ('HDD-SEA-001', 'Seagate Barracuda 4TB HDD',         3, 8, 3, 'SATA III, 5400RPM, 256MB Cache, SMR',                   950000,  1200000, 8,  3, 'pcs', 'https://m.media-amazon.com/images/I/81YHDtDKmQL._AC_SL1500_.jpg', 'aktif'),

  -- Motherboard
  ('MB-ASU-001', 'ASUS ROG Strix B550-F',    4, 3, 1, 'Socket AM4, ATX, DDR4, PCIe 4.0, 2.5G LAN, WiFi 6',              2350000, 2900000, 6,  2, 'pcs', 'https://m.media-amazon.com/images/I/91-hBoSmKEL._AC_SL1500_.jpg', 'aktif'),
  ('MB-MSI-001', 'MSI MAG B660M Mortar',     4, 4, 1, 'Socket LGA1700, mATX, DDR4, PCIe 4.0, 2.5G LAN',                 1450000, 1800000, 9,  2, 'pcs', 'https://m.media-amazon.com/images/I/71T+qIBJAkL._AC_SL1500_.jpg', 'aktif'),
  ('MB-GIG-001', 'Gigabyte B550 AORUS Pro',  4, 10, 1, 'Socket AM4, ATX, DDR4, PCIe 4.0, 2.5G LAN, WiFi 6',             2100000, 2600000, 4,  2, 'pcs', 'https://m.media-amazon.com/images/I/91WKRtfmJ0L._AC_SL1500_.jpg', 'aktif'),

  -- PSU
  ('PSU-COR-001', 'Corsair RM750x 750W Gold', 5, 5, 4, '80+ Gold, Fully Modular, 750W, 10yr Warranty',                  1350000, 1700000, 11, 3, 'pcs', 'https://m.media-amazon.com/images/I/71Gp3lPADeL._AC_SL1500_.jpg', 'aktif'),
  ('PSU-EVG-001', 'EVGA SuperNOVA 850W Platinum', 5, 9, 4, '80+ Platinum, Fully Modular, 850W, 10yr Warranty',           1700000, 2100000, 5,  2, 'pcs', 'https://m.media-amazon.com/images/I/81TjKNKPr6L._AC_SL1500_.jpg', 'aktif'),

  -- VGA
  ('VGA-ASU-001', 'ASUS TUF RX 6700 XT 12GB', 6, 3, 4, 'RDNA2, 12GB GDDR6, PCIe 4.0, 3x DP + 1x HDMI, 180W TDP',     5500000, 6500000, 4,  2, 'pcs', 'https://m.media-amazon.com/images/I/71OOHy5RRWL._AC_SL1500_.jpg', 'aktif'),
  ('VGA-MSI-001', 'MSI RTX 3070 Gaming X 8GB', 6, 4, 4, 'Ampere, 8GB GDDR6, PCIe 4.0, 3x DP + 1x HDMI, 220W TDP',    7200000, 8500000, 3,  2, 'pcs', 'https://m.media-amazon.com/images/I/71w2UrLmhOL._AC_SL1500_.jpg', 'aktif'),

  -- Cooling
  ('CLG-NOC-001', 'Noctua NH-D15 CPU Cooler',  7, 12, 2, 'Dual Tower, 2x NF-A15 PWM, TDP 250W+, Socket LGA1700/AM5',   1200000, 1550000, 8,  3, 'pcs', 'https://m.media-amazon.com/images/I/71I6LMB2g3L._AC_SL1500_.jpg', 'aktif'),
  ('CLG-DEP-001', 'DeepCool AK620 CPU Cooler', 7, 13, 2, 'Dual Tower, 2x FK120P, TDP 260W, Socket LGA1700/AM5',        650000,  850000,  12, 3, 'pcs', 'https://m.media-amazon.com/images/I/51rVcjLvKQL._AC_SL1500_.jpg', 'aktif'),

  -- Casing
  ('CAS-FRA-001', 'Fractal Design Meshify C', 8, 14, 2, 'Mid Tower, Mesh Front, 2x Fans included, ATX/mATX/ITX',        850000,  1100000, 6,  2, 'pcs', 'https://m.media-amazon.com/images/I/71yibFOfAcL._AC_SL1500_.jpg', 'aktif'),
  ('CAS-BEQ-001', 'be quiet! Pure Base 500',  8, 15, 2, 'Mid Tower, Tempered Glass, 3x Pure Wings 2 Fans, ATX',         950000,  1200000, 4,  2, 'pcs', 'https://m.media-amazon.com/images/I/71y4B+3kGRL._AC_SL1500_.jpg', 'aktif');

-- Transaksi Masuk (Stok awal)
INSERT INTO transaksi_masuk (part_id, supplier_id, user_id, no_invoice, jumlah, harga_satuan, total_harga, tgl_masuk, keterangan) VALUES
  (1,  1, 1, 'INV-2026-001', 15, 2650000, 39750000,  '2026-06-01', 'Stok awal Ryzen 5 5600X'),
  (2,  1, 1, 'INV-2026-001', 8,  4100000, 32800000,  '2026-06-01', 'Stok awal Ryzen 7 5800X'),
  (3,  1, 1, 'INV-2026-001', 12, 2200000, 26400000,  '2026-06-01', 'Stok awal Core i5-12400F'),
  (4,  1, 1, 'INV-2026-001', 5,  4800000, 24000000,  '2026-06-01', 'Stok awal Core i7-12700K'),
  (5,  2, 1, 'INV-2026-002', 20, 650000,  13000000,  '2026-06-02', 'Stok awal RAM Corsair 16GB'),
  (6,  2, 1, 'INV-2026-002', 7,  1800000, 12600000,  '2026-06-02', 'Stok awal RAM Corsair DDR5'),
  (7,  2, 1, 'INV-2026-002', 18, 600000,  10800000,  '2026-06-02', 'Stok awal Kingston Fury'),
  (8,  3, 1, 'INV-2026-003', 22, 1150000, 25300000,  '2026-06-03', 'Stok awal SSD Samsung 1TB'),
  (9,  3, 1, 'INV-2026-003', 10, 2300000, 23000000,  '2026-06-03', 'Stok awal SSD Samsung 2TB'),
  (10, 3, 1, 'INV-2026-003', 14, 650000,  9100000,   '2026-06-03', 'Stok awal HDD WD 2TB'),
  (11, 3, 1, 'INV-2026-003', 8,  950000,  7600000,   '2026-06-03', 'Stok awal HDD Seagate 4TB'),
  (15, 4, 1, 'INV-2026-004', 11, 1350000, 14850000,  '2026-06-05', 'Stok awal PSU Corsair 750W'),
  (16, 4, 1, 'INV-2026-004', 5,  1700000, 8500000,   '2026-06-05', 'Stok awal PSU EVGA 850W');

-- Transaksi Keluar (Penjualan dummy)
INSERT INTO transaksi_keluar (part_id, user_id, no_transaksi, jumlah, harga_satuan, total_harga, nama_pembeli, tgl_keluar, keterangan) VALUES
  (1,  1, 'TRX-2026-001', 2, 3100000, 6200000,  'Andi Wirawan',    '2026-06-05', 'Pembelian build gaming'),
  (5,  1, 'TRX-2026-001', 2, 850000,  1700000,  'Andi Wirawan',    '2026-06-05', 'Pembelian build gaming'),
  (8,  1, 'TRX-2026-001', 1, 1450000, 1450000,  'Andi Wirawan',    '2026-06-05', 'Pembelian build gaming'),
  (3,  2, 'TRX-2026-002', 3, 2750000, 8250000,  'Budi Hartono',    '2026-06-07', 'Upgrade PC kantor'),
  (7,  2, 'TRX-2026-002', 3, 780000,  2340000,  'Budi Hartono',    '2026-06-07', 'Upgrade PC kantor'),
  (10, 2, 'TRX-2026-003', 2, 820000,  1640000,  'Citra Dewi',      '2026-06-09', 'Tambah storage NAS'),
  (11, 1, 'TRX-2026-004', 1, 1200000, 1200000,  'Dimas Prayoga',   '2026-06-10', 'Upgrade storage backup'),
  (2,  1, 'TRX-2026-005', 1, 4800000, 4800000,  'Eka Nugraha',     '2026-06-11', 'Build workstation'),
  (6,  1, 'TRX-2026-005', 1, 2200000, 2200000,  'Eka Nugraha',     '2026-06-11', 'Build workstation DDR5'),
  (9,  1, 'TRX-2026-005', 1, 2800000, 2800000,  'Eka Nugraha',     '2026-06-11', 'NVMe workstation');

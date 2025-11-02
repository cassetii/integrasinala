# 🎯 KPI NALA - INTEGRATED SYSTEM

## Sistem Terintegrasi KPI Nala → Database Nala

Aplikasi ini menggabungkan **KPI Nala** dengan **Database Nala** untuk sinkronisasi data otomatis secara real-time.

---

## 🚀 FITUR UTAMA

### ✅ **Dual Database Synchronization**
- Data yang diinput di KPI Nala **otomatis masuk** ke Database Nala
- Tersimpan di **2 Firebase Database** secara bersamaan:
  - `kpiteknisi` (KPI Database)
  - `databasebesar` (Main Database Nala)
- Status sinkronisasi tercatat dan dapat dimonitor

### 📊 **Monitor Real-time**
- Dashboard monitoring pekerjaan teknisi
- Filter berdasarkan tanggal
- Status sinkronisasi setiap data

### 📈 **Analytics Dashboard**
- Total Revenue
- Total Jobs
- Average Time per Job
- Top Technician Performance

### 🗄️ **Database View**
- Melihat semua data yang tersimpan di Database Nala
- Refresh manual untuk update terbaru
- Total records counter

---

## 📁 STRUKTUR FILE

```
kpinala-integrated/
├── index.html          # Struktur HTML aplikasi
├── style.css           # Styling & design
├── script.js           # Logic aplikasi & data handling
└── firebase-config.js  # Konfigurasi Firebase & dual sync
```

---

## 🔧 CARA INSTALL

### 1. **Download Semua File**
Download 4 file berikut:
- `index.html`
- `style.css`
- `script.js`
- `firebase-config.js`

### 2. **Letakkan dalam 1 Folder**
```
📁 kpinala-integrated/
   📄 index.html
   📄 style.css
   📄 script.js
   📄 firebase-config.js
```

### 3. **Buka di Browser**
- Double click `index.html`
- Atau drag file ke browser
- Pastikan semua file dalam 1 folder yang sama!

### 4. **Cek Status Koneksi**
Di pojok kanan atas akan muncul 2 badge:
- 🟢 **✅ KPI DB** → Terhubung ke KPI Database
- 🟢 **✅ Main DB** → Terhubung ke Database Nala

---

## 📝 CARA PENGGUNAAN

### **Tab 1: Input Data** 📝
1. Pilih teknisi (bisa lebih dari 1)
2. Isi detail pekerjaan (tanggal, jasa, waktu)
3. Isi data customer (nama, telepon, alamat)
4. Masukkan pemasukan
5. Klik **"💾 SIMPAN KE DATABASE (Dual Sync)"**
6. ✅ Data otomatis tersimpan ke **2 database**!

### **Tab 2: Monitor** 📊
- Lihat semua pekerjaan yang sudah diinput
- Filter berdasarkan tanggal
- Edit atau hapus data
- Status sinkronisasi ke Database Nala

### **Tab 3: Analytics** 📈
- Dashboard statistik otomatis
- Total revenue, jobs, rata-rata waktu
- Top technician performance

### **Tab 4: Database** 🗄️
- Melihat data yang tersimpan di Database Nala
- Verifikasi sinkronisasi berhasil
- Informasi lengkap setiap record

---

## 🔄 PROSES SINKRONISASI

```
Input Data → KPI Nala
    │
    ├─→ ✅ Simpan ke Firebase: kpiteknisi
    │
    └─→ ✅ Simpan ke Firebase: databasebesar (Database Nala)
            │
            └─→ Tambah metadata:
                - source: 'kpi_nala'
                - kpiDbId: (ID dari KPI database)
                - syncedAt: (timestamp)
                - dataType: 'technician_job'
                - month, year, dayOfWeek (untuk analytics)
```

---

## 🔐 KONFIGURASI DATABASE

### **KPI Database** (kpiteknisi)
- Collection: `jobs`
- Fields: teknisi, tanggal, jasa, customer, pemasukan, dll
- Tracking: syncedToMainDb, mainDbId

### **Main Database** (databasebesar)
- Collection: `kpi_teknisi`
- Fields: semua field KPI + metadata tambahan
- Tracking: source, kpiDbId, syncedAt

### **Finance Database** (Optional)
- Siap untuk integrasi bonus/insentif
- Dapat dikembangkan untuk auto-calculate berdasarkan KPI

---

## 🎨 FITUR TAMBAHAN

### ✨ **Smart Features**
- ⏰ Auto-calculate total waktu pengerjaan
- 📱 Responsive design (mobile & desktop)
- 🎯 Real-time status monitoring
- 💾 Auto-save dengan dual database
- 🔄 Refresh manual untuk update data

### 🛡️ **Data Validation**
- Validasi teknisi (minimal 1)
- Validasi nama external technician
- Validasi waktu (selesai > mulai)
- Validasi semua field required

### 🎭 **User Experience**
- Loading indicators
- Success/error messages
- Smooth animations
- Color-coded status badges

---

## 🐛 TROUBLESHOOTING

### ❌ **Status Badge Merah**
- Cek koneksi internet
- Pastikan Firebase credentials benar
- Buka Console Browser (F12) untuk detail error

### ❌ **Data Tidak Tersimpan**
- Cek status kedua database (harus hijau)
- Pastikan semua field terisi
- Cek Console untuk error message

### ❌ **File Tidak Terbaca**
- Pastikan semua file dalam 1 folder
- Cek nama file (case-sensitive)
- Gunakan web server lokal jika perlu

---

## 🔮 PENGEMBANGAN SELANJUTNYA

### **Ideas for Enhancement:**

1. **Finance Integration** 💰
   - Auto-calculate bonus berdasarkan KPI
   - Link ke Finance Nala untuk pencatatan otomatis
   - Dashboard earning per teknisi

2. **Advanced Analytics** 📊
   - Grafik revenue per bulan
   - Comparison antar teknisi
   - Heatmap lokasi customer
   - Service type breakdown

3. **Notification System** 🔔
   - Email/SMS untuk target tercapai
   - Reminder untuk follow-up customer
   - Alert jika ada anomali data

4. **Export Features** 📑
   - Export to Excel
   - Generate PDF reports
   - Backup data otomatis

5. **User Management** 👥
   - Login system
   - Role-based access (admin, teknisi, viewer)
   - Activity logs per user

---

## 📞 SUPPORT

Jika ada pertanyaan atau butuh bantuan:
- Cek Console Browser (F12) untuk error details
- Screenshot issue dan kirimkan
- Sertakan langkah-langkah yang dilakukan

---

## 📄 LICENSE

Aplikasi ini dibuat khusus untuk **Nala Aircon** - Makassar, Indonesia

---

## ✅ CHECKLIST SEBELUM DEPLOY

- [ ] Semua file dalam 1 folder
- [ ] Firebase credentials sudah benar
- [ ] Test input data
- [ ] Cek sinkronisasi ke kedua database
- [ ] Test semua tab (Input, Monitor, Analytics, Database)
- [ ] Test edit & delete
- [ ] Test filter tanggal
- [ ] Test responsive (mobile view)

---

## 🎉 SELAMAT MENGGUNAKAN!

Sistem ini akan memudahkan monitoring KPI teknisi dan otomatis tersinkronisasi dengan Database Nala. Semua data tercatat dengan baik dan dapat dianalisa kapan saja!

**Made with ❤️ for Nala Aircon**

# Absensi Dewan Guru Dhiyaul Ulum

Aplikasi absensi berbasis web untuk guru (login, absen masuk/pulang, cek lokasi) yang datanya **terpusat di Google Sheets**, plus **Dashboard Admin** untuk melihat rekap semua guru di satu tempat.

## Isi paket
- `index.html` — halaman absen untuk guru (dipakai dari HP masing-masing)
- `admin.html` — dashboard admin, rekap semua guru
- `Code.gs` — kode yang ditempel ke Google Apps Script (jembatan ke Google Sheets)
- `manifest.json` — pelengkap agar tidak ada error 404
- `README.md` — panduan ini

Alurnya: **Guru absen di HP → dikirim ke Google Sheets lewat Apps Script → Admin buka `admin.html` untuk lihat rekap semua guru, real-time dari Sheets.**

---

## BAGIAN 1 — Setup Google Sheets + Apps Script (backend)

### 1. Buat Google Sheet
1. Buka [sheet.new](https://sheet.new) (otomatis membuat spreadsheet baru).
2. Ganti nama spreadsheet, misalnya "Data Absensi DU".

### 2. Tempel kode Apps Script
1. Di spreadsheet, klik menu **Extensions → Apps Script**.
2. Hapus semua kode contoh (`function myFunction()...`) yang sudah ada.
3. Buka file `Code.gs` dari paket ini, salin semua isinya, tempel ke editor Apps Script.
4. Klik ikon **Save** (disket).

### 3. Deploy sebagai Web App
1. Klik tombol **Deploy → New deployment**.
2. Klik ikon gerigi ⚙️ di samping "Select type" → pilih **Web app**.
3. Isi:
   - **Execute as**: `Me (email kamu)`
   - **Who has access**: `Anyone`
4. Klik **Deploy**.
5. Google akan minta izin akses (Authorize access) — pilih akun Google kamu, klik **Advanced → Go to (nama project) (unsafe)** kalau muncul peringatan, lalu **Allow**. Ini normal untuk script buatan sendiri.
6. Setelah deploy selesai, akan muncul **Web app URL** seperti:
   `https://script.google.com/macros/s/AKfycb........../exec`
7. **Salin URL ini** — akan dipakai di Bagian 2.

> Kalau nanti kamu edit `Code.gs` lagi, jangan lupa **Deploy → Manage deployments → ikon pensil → New version → Deploy** supaya perubahan aktif.

---

## BAGIAN 2 — Hubungkan aplikasi ke Apps Script

1. Buka file `index.html`, cari baris:
   ```js
   const CONFIG = {
     SCRIPT_URL: 'PASTE_URL_WEB_APP_APPS_SCRIPT_DI_SINI'
   };
   ```
   Ganti `PASTE_URL_WEB_APP_APPS_SCRIPT_DI_SINI` dengan URL yang kamu salin di Bagian 1 langkah 6 (tetap di antara tanda kutip).

2. Buka file `admin.html`, lakukan hal yang sama pada bagian:
   ```js
   const CONFIG = {
     SCRIPT_URL: 'PASTE_URL_WEB_APP_APPS_SCRIPT_DI_SINI',
     ADMIN_PASSWORD: 'admin123'
   };
   ```
   Ganti URL-nya, dan **sebaiknya ganti juga `admin123`** dengan password lain yang hanya diketahui admin.

---

## BAGIAN 3 — Publish ke GitHub Pages

### 1. Buat repository
1. Buka [github.com](https://github.com) → login/daftar.
2. Klik **+** (kanan atas) → **New repository** → nama misalnya `absensi-du` → **Public** → **Create repository**.

### 2. Upload file
1. Klik **Add file → Upload files**.
2. Upload `index.html`, `admin.html`, `manifest.json` (tidak perlu upload `Code.gs`, itu hanya untuk Apps Script).
3. Klik **Commit changes**.

### 3. Aktifkan GitHub Pages
1. Tab **Settings → Pages**.
2. **Build and deployment → Source**: pilih **Deploy from a branch**.
3. **Branch**: `main`, folder `/ (root)` → **Save**.
4. Tunggu 1–2 menit, link situs akan muncul:
   `https://<username-github-kamu>.github.io/absensi-du/`

### 4. Bagikan
- Link untuk guru: `https://<username>.github.io/absensi-du/index.html`
- Link untuk admin: `https://<username>.github.io/absensi-du/admin.html`

---

## Catatan keamanan (penting dibaca)

- Password login guru (`123456`) dan password admin (`admin123` / yang kamu ganti) **ada di dalam kode**, bukan sistem login sungguhan — siapa pun yang tahu URL & buka "View Page Source" bisa melihatnya. Untuk pemakaian sekolah sehari-hari ini biasanya cukup (mencegah orang iseng asal isi), tapi bukan proteksi tingkat tinggi.
- URL Apps Script juga bisa dilihat orang yang membuka kode halaman. Karena `doPost` diset "Anyone" bisa mengirim data, secara teori orang lain yang tahu URL ini bisa mengirim data palsu ke Sheets kamu. Untuk kebutuhan sekolah skala kecil risiko ini biasanya rendah, tapi kalau ingin lebih aman, beri tahu saya — bisa ditambahkan token rahasia sederhana di kode `Code.gs` dan `index.html`.
- Data absensi tersimpan permanen di Google Sheets kamu (bukan cuma di HP guru), jadi aman dari data hilang meski HP guru ganti/hilang, selama absen terkirim (status "Tersinkron" di app).

## Kalau HP guru sedang offline saat absen
Aplikasi tetap mencatat absen secara lokal di HP tersebut (badge "belum sinkron"), lalu otomatis mencoba mengirim ke Sheets saat HP kembali online. Guru juga bisa tekan tombol **🔄 Sinkron Ulang** secara manual.

## Cara update tampilan/kode nanti
Edit file langsung di GitHub (klik file → ikon pensil → edit → **Commit changes**). Situs otomatis ter-update dalam 1–2 menit. Untuk perubahan pada `Code.gs`, edit di Apps Script Editor lalu **Deploy ulang** (lihat Bagian 1, catatan di bawah langkah 7).

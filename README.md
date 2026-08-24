# Absensi Dewan Guru Dhiyaul Ulum

Aplikasi absensi guru berbasis web + Firebase, dapat dibuka melalui HP dan komputer.

## Fitur
- Login guru/admin
- Absen masuk dan pulang
- Waktu otomatis
- Deteksi terlambat
- Riwayat absensi
- Dashboard admin
- Pemantauan guru yang belum absen
- Rekap dan export CSV
- Firebase Authentication + Firestore
- Siap di-host di GitHub Pages

## Instalasi singkat
1. Buat project Firebase.
2. Aktifkan Authentication > Email/Password.
3. Buat Firestore Database.
4. Salin konfigurasi Firebase ke `firebase-config.js`.
5. Terapkan `firestore.rules`.
6. Buat akun melalui Firebase Authentication.
7. Tambahkan dokumen `users/{UID}` di Firestore.

Contoh dokumen admin:
```json
{
  "name": "Administrator",
  "role": "admin"
}
```

Contoh dokumen guru:
```json
{
  "name": "Nama Guru",
  "role": "teacher"
}
```

## Upload GitHub
Upload seluruh isi folder ini ke repository GitHub.
Lalu buka Settings > Pages > Deploy from branch > pilih `main` dan folder `/root`.
Setelah beberapa menit aplikasi dapat dibuka dari alamat GitHub Pages repository tersebut.

> Catatan: jangan memasukkan password Firebase ke dalam file. Config Firebase web memang berada di frontend; keamanan data diatur melalui Firestore Rules.

# To-Do List Life Dashboard

Dashboard sederhana untuk mengatur hari: jam & sapaan, focus timer 25 menit, to-do list, dan quick links.
Dibangun dengan HTML + CSS + Vanilla JavaScript, semua data disimpan di **Local Storage** browser (tidak perlu backend).

## Struktur Folder
```
todo-dashboard/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
└── .kiro/        <-- WAJIB dibuat lewat aplikasi Kiro, lihat catatan di bawah
```

## Fitur
- Greeting: jam real-time, tanggal, sapaan otomatis sesuai waktu
- Focus Timer: 25 menit, tombol Start / Stop / Reset
- To-Do List: tambah, edit, tandai selesai, hapus tugas (tersimpan di Local Storage)
- Quick Links: tambah/hapus link favorit (tersimpan di Local Storage)

## Challenge yang dipilih (3 dari 5)
1. Light / Dark mode
2. Custom name di greeting
3. Prevent duplicate tasks

## Catatan penting soal folder `.kiro`
Folder `.kiro` otomatis dibuat oleh aplikasi **Kiro** (tool AWS yang wajib dipakai sesuai instruksi tugas)
saat kamu membuka & mengerjakan project ini di dalamnya. Folder ini TIDAK bisa dibuat manual dengan hasil
yang valid, karena isinya adalah log spesifikasi & histori kerja kamu di Kiro. Jadi:
1. Install & buka Kiro, lalu import/buka folder `todo-dashboard` ini di dalamnya.
2. Kerjakan sedikit refinement / debugging lewat Kiro (sesuai instruksi "Before You Start").
3. Kiro akan otomatis membuat folder `.kiro` di root project.
4. Commit & push folder tersebut bersama source code ke GitHub.

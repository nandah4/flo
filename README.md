# 🌊 Flo — Student Productivity Web App

---

## 📌 Informasi Umum

| | |
|---|---|
| **Nama Website** | Flo |
| **Nama Tim** | mohon bulan April dispen dulu yh - Wandi |
| **Dengan Backend** | Tidak |

---

## 👥 Anggota Tim

| Nama | Institusi |
|------|-----------|
| **Ananda Priya Yustira** | Politeknik Negeri Malang |
| **Wandi** | Politeknik Negeri Malang |

---

## ✨ Daftar Fitur Utama

### 📝 Notes (`/notes`)
- **Notebook System** — catatan dikelompokkan per notebook (Lectures, Projects, dll.)
- **Pin & Tag** — pin catatan penting ke atas, beri tag warna, filter per notebook/tag
- **Rich Text Editor** — format teks dengan bold, italic, heading, list, dan lainnya
- **Upload Resource** — unggah dokumen PDF atau voice note; AI otomatis generate summary & judul
- **Word Count** — penghitung kata real-time di editor

### ✅ Tasks (`/tasks`)
- **Kanban Board** — 4 kolom: To-Do, In Progress, In Review, Done; drag & drop antar kolom
- **List View** — tampilan daftar dengan filter prioritas
- **Calendar View** — tampilan task berdasarkan tanggal deadline
- **Detail Task** — judul, deskripsi, prioritas (High/Medium/Low), tanggal mulai & deadline, upload gambar

### 🗓️ Planning (`/planning`)
- **Grid Mingguan** — slot waktu 06.00–22.00, navigasi antar minggu
- **Add Event Drawer** — buat event baru: judul, hari, jam mulai & selesai, warna
- **Integrasi Task** — task aktif dari Kanban otomatis muncul di kalender

### ⏱️ Focus Timer (`/timer`)
- **3 Mode** — Focus (25 mnt), Short Break (5 mnt), Long Break (15 mnt)
- **Kustomisasi Durasi** — ubah panjang setiap sesi sesuai kebutuhan
- **Zen Mode** — full-screen, minim distraksi, dilengkapi task list & session notes
- **Session Progress** — indikator sesi dan riwayat sesi selesai

### 🤖 Flo AI Assistant
- **Floating Button** — selalu tersedia di Dashboard, Notes, Tasks, Planning, dan Timer
- **Context-aware** — kirim konteks Notes, Tasks, atau Timer langsung ke chat AI
- **Panel Percakapan** — slide-in chat panel dengan riwayat pesan

---

## 🗺️ Alur Demo

Disarankan menilai aplikasi mengikuti urutan berikut:

```
🏠 Home  →  📊 Dashboard  →  📝 Notes  →  ✅ Tasks  →  🗓️ Planning  →  ⏱️ Timer  →  🤖 AI
   (/)       (/dashboard)    (/notes)     (/tasks)    (/planning)    (/timer)
```

| # | Halaman | Yang Perlu Dilihat |
|---|---------|-------------------|
| 1 | **Home** | Landing page: hero animasi, showcase fitur, testimonial |
| 2 | **Dashboard** | XP & Level, streak, stat cards dinamis, recent tasks & notes |
| 3 | **Notes** | Buat catatan, pin, filter tag & notebook, upload dokumen/voice → AI summary |
| 4 | **Tasks** | Kanban 4 kolom, pindah task antar kolom, coba tampilan List & Calendar |
| 5 | **Planning** | Buat event di grid mingguan, lihat integrasi task dari Kanban |
| 6 | **Timer** | Mulai Pomodoro, aktifkan Zen Mode, kustomisasi durasi sesi |
| 7 | **AI Assistant** | Klik tombol floating AI di sudut kanan bawah halaman mana saja |

---

## 🧩 Sub-Fitur

### 📊 Dashboard (`/dashboard`)
- **Stat Cards** — total Tasks, Notes, dan Events terhubung ke data secara dinamis.
- **Quick Actions & Widgets** — akses cepat ke semua modul, recent tasks, dan recent notes dalam satu halaman.

### 🔔 Notifications
- **Notif Pintar** — notifikasi untuk task overdue, event yang akan datang, dan streak alert dengan tab All/Unread.
- **Mark as Read** — tandai semua notif sekaligus atau satu per satu langsung dari panel.

### 🔍 Search
- **Global Search** — cari Notes, Tasks, atau Timer dari mana saja lewat sidebar menu .

### 🏆 Gamification
- **XP & Level System** — setiap aksi produktif (buat catatan, selesaikan task) kasih poin XP dan level naik otomatis 
- **Streak Tracker** — pelacak konsistensi harian biar kamu tetap on track dan nggak putus streak.

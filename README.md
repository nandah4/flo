# 🌊 Flo — Student Productivity Web App

> **Flo** adalah platform produktivitas *all-in-one* yang dirancang khusus untuk mahasiswa.  
> Kelola catatan, tugas, jadwal, dan sesi fokus belajar — semuanya dalam satu tempat yang terintegrasi, dengan bantuan AI.

---

## 👥 Tim Pengembang

Nama Tim : mohon bulan April dispen dulu yh - Wandi

| Nama | Institusi |
|------|-----------|
| **Ananda Priya Yustira** | Politeknik Negeri Malang |
| **Wandi** | Politeknik Negeri Malang |

---

## 🔗 Informasi Aplikasi

| | |
|---|---|
| **Nama Website** | Flo |
| **Tagline** | *Take Control of Your Academic Life with Flo* |
| **Tech Stack** | React 19, TypeScript, Vite, Tailwind CSS v4, Framer Motion |
| **Target Pengguna** | Mahasiswa |

---

## �️ Alur Demo

Disarankan untuk menilai aplikasi mengikuti alur berikut:

```
🏠 Home Page  →  📊 Dashboard  →  📝 Notes  →  ✅ Tasks  →  🗓️ Planning  →  ⏱️ Timer  →  🤖 AI Assistant
   (/)           (/dashboard)     (/notes)      (/tasks)     (/planning)    (/timer)
```

| # | Halaman | Apa yang Perlu Dilihat |
|---|---------|------------------------|
| 1 | **Home Page** | Landing page interaktif: hero animasi, showcase fitur, testimonial, panduan langkah |
| 2 | **Dashboard** | Ringkasan produktivitas bulanan, sistem XP & Level, recent tasks |
| 3 | **Notes** | Buat catatan baru, coba pin note, upload docs & voice note, gunakan filter & tag |
| 4 | **Tasks** | Pindah task antar kolom Kanban |
| 5 | **Planning** | Lihat kalender mingguan, buat event baru via drawer, amati integrasi task dari Kanban |
| 6 | **Timer** | Mulai sesi Pomodoro, aktifkan Zen Mode, coba kustomisasi durasi timer |
| 7 | **AI Assistant** | Klik tombol floating AI di sudut layar (tersedia di Dashboard, Notes, Tasks, Planning) |

---

## ✨ Fitur Utama

### 1. 📝 Notes / Notespace (`/notes`)
Fitur pencatatan cerdas yang lengkap dan terorganisir.

- **Notebook System** — catatan dikelompokkan ke dalam *notebook* (Lectures, Personal, Projects, Research, dll). Jumlah catatan per notebook ditampilkan di sidebar secara dinamis.
- **Pinned Notes** — catatan penting dapat di-pin ke bagian atas halaman.
- **Tag Warna-warni** — setiap catatan dapat diberi multiple tag berwarna untuk kategorisasi cepat.
- **Rich Text Editor** — editor berbasis blok untuk menulis dan memformat catatan secara bebas.
- **Pencarian & Filter** — cari catatan berdasarkan judul, tag, atau notebook.
- **Word Count** — setiap catatan menampilkan jumlah kata secara real-time.
- **Lampiran Dokumen** — catatan dapat dilampirkan file PDF sebagai referensi.
- **Tambah Catatan Modal** — modal interaktif untuk membuat catatan baru dengan cepat.

---

### 2. ✅ Tasks / Kanban Board (`/tasks`)
Manajemen tugas visual bergaya Kanban dengan tiga tampilan berbeda.

- **Kanban Board** — 4 kolom: *To Do*, *In Progress*, *In Review*, *Done*.
- **List View** — tampilan tabel semua task dengan filter status, prioritas, dan tanggal.
- **Calendar View** — tampilan kalender bulanan dengan indikator task per hari. Klik hari untuk melihat atau menambah task.
- **Add Task Modal** — form lengkap: judul, deskripsi, prioritas, tanggal, label warna, estimasi durasi.
- **Task Detail Modal** — popup detail task lengkap dengan deskripsi dan semua metadata.
- **Priority Badges** — setiap task memiliki badge prioritas berwarna (High / Medium / Low).

---

### 3. 🗓️ Planning / Weekly Calendar (`/planning`)
Kalender mingguan dengan tampilan timeline jam untuk merencanakan agenda harian.

- **Weekly View** — tampilan grid 7 hari (Mon–Sun) dengan slot waktu dari jam 06.00 hingga 22.00.
- **Event Blocks** — setiap event ditampilkan sebagai blok berwarna pada timeline.
- **Integrasi Task** — task aktif dari Kanban Board otomatis muncul di kalender Planning.
- **Navigasi Minggu** — tombol prev/next untuk berpindah antar minggu.
- **Add Event Drawer** — *drawer* slide-in untuk membuat event baru: judul, warna, hari, jam mulai–selesai.

---

### 4. ⏱️ Focus Timer / Pomodoro (`/timer`)
Timer Pomodoro terintegrasi untuk sesi belajar yang terstruktur dan produktif.

- **Countdown Timer** — tampilan visual bundar dengan progress arc animasi.
- **Mode Timer** — tiga mode: *Focus* (25 mnt), *Short Break* (5 mnt), *Long Break* (15 mnt). Semua durasi dapat dikustomisasi.
- **Zen Mode** — tampilan penuh layar, minim distraksi, dengan overlay tenang untuk fokus total.
- **Task List Sesi** — daftar task aktif yang dapat di-*reorder* dan ditandai selesai selama sesi berjalan.
- **Session Notes** — area catatan cepat khusus untuk ide atau poin penting selama sesi belajar.
- **Auto-switch** — timer otomatis berganti mode setelah sesi selesai.

---

### 5. 🤖 Flo AI Assistant
Panel asisten kecerdasan buatan yang terintegrasi di dalam aplikasi — bukan tautan eksternal.

- **Floating Button** — tombol FAB yang selalu tersedia di sudut kanan bawah layar (Dashboard, Notes, Tasks, Planning).
- **Chat Interface** — antarmuka percakapan natural untuk berinteraksi langsung dengan AI.
- **Contextual Help** — AI memahami konteks halaman yang sedang dibuka pengguna.
- **Typing Animation** — animasi ketik saat AI merespons untuk pengalaman pengguna yang natural.

---

## 🧩 Sub Fitur Pendukung

### 📊 Dashboard (`/dashboard`)
Pusat kendali utama, memberikan gambaran menyeluruh atas status produktivitas pengguna hari ini.

- **Metric Cards** — total Tasks, Notes, dan Events yang terhubung dengan data aktual secara dinamis.
- **Quick Actions** — akses satu klik ke modul Notes, Tasks, dan Timer.
- **Upcoming Events** — widget daftar agenda terdekat yang diambil dari data Planning.
- **Recent Notes** — widget catatan terbaru yang dibuat pengguna.

---

### 🏆 Gamification (Sistem Gamifikasi)
Sistem penghargaan yang membuat produktivitas terasa menyenangkan dan *rewarding*.

- **XP (Experience Points)** — setiap aksi produktif (membuat catatan, menyelesaikan task) memberikan poin XP.
- **Level System** — level bertingkat dengan nama peran: *Beginner → Explorer → Learner → ...* dan progress bar animasi.
- **Streak Tracker** — pelacak konsistensi harian pengguna untuk menjaga motivasi.

---

### 🃏 Flashcard *(Coming Soon / In Development)*
Fitur kartu hafalan berbasis metode *spaced repetition* untuk membantu mahasiswa mengingat materi kuliah dengan lebih efektif.

---

## 🎨 Design System

| Token | Nilai | Keterangan |
|-------|-------|------------|
| **Primary Color** | `#FFD400` | Kuning Emas |
| **Secondary Color** | `#FF8C00` | Oranye |
| **Background** | `#F8F8F6` | Off-white |
| **Font** | Google Sans | Tipografi modern & bersih |

---

*Dibuat dengan ❤️ oleh Tim Flo — Politeknik Negeri Malang*

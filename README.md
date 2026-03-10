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

## 🗺️ Alur Demo

Disarankan untuk menilai aplikasi mengikuti alur berikut:

```
🏠 Home  →  📊 Dashboard  →  📝 Notes  →  ✅ Tasks  →  🗓️ Planning  →  ⏱️ Timer  →  🤖 AI
   (/)       (/dashboard)    (/notes)     (/tasks)    (/planning)    (/timer)
```

| # | Halaman | Yang Perlu Dilihat |
|---|---------|-------------------|
| 1 | **Home** | Landing page: hero animasi, showcase fitur, testimonial |
| 2 | **Dashboard** | Ringkasan produktivitas, XP & Level, notes activity diagram, recent tasks & notes |
| 3 | **Notes** | Buat catatan manual, pin note, filter & tag, upload resource (docs & voice)  |
| 4 | **Tasks** | Pindah task di Kanban dengan mengatur status, coba List & Calendar view |
| 5 | **Planning** | Buat event di kalender mingguan, lihat integrasi task |
| 6 | **Timer** | Mulai Pomodoro, aktifkan Zen Mode, kustomisasi durasi |
| 7 | **AI Assistant** | Klik tombol floating AI di sudut kanan bawah layar |

---

## ✨ Fitur Utama

### 📝 Notes — Notespace (`/notes`)
- **Notebook System** — catatan dikelompokkan per notebook (Lectures, Projects, dll), jumlah catatan muncul langsung di sidebar.
- **Pin, Tag & Filter** — pin catatan penting ke atas, beri tag warna, dan filter berdasarkan notebook atau tag.

### ✅ Tasks — Kanban Board (`/tasks`)
- **3 Tampilan** — Kanban Board 4 kolom progress (To-Do, In Progress, In Review, dan Done).
- **Add & Detail Task** — form lengkap: judul, deskripsi, prioritas badge (High/Medium/Low), dan tanggal deadline.

### 🗓️ Planning — Weekly Calendar (`/planning`)
- **Timeline Mingguan** — grid 7 hari dengan slot jam 06.00–22.00; event aktif dari Kanban otomatis muncul di sini.
- **Add Event Drawer** — slide-in drawer untuk buat event baru: judul, hari, jam mulai & selesai.

### ⏱️ Focus Timer — Pomodoro (`/timer`)
- **3 Mode Timer** — Focus (25 mnt), Short Break (5 mnt), Long Break (15 mnt); semua durasi bisa dikustomisasi.
- **Zen Mode** — tampilan full-screen minim distraksi dengan task list & session notes bawaan.

### 🤖 Flo AI Assistant
- **Floating Button** — tombol AI selalu ada di sudut kanan bawah; tersedia di Dashboard, Notes, Tasks, Planning, dan Timer.
- **Context-aware Chat** — panel percakapan dengan AI yang bisa kamu kasih konteks Notes, Tasks, atau Timer secara langsung.

---

## 🧩 Fitur Pendukung

### 📊 Dashboard (`/dashboard`)
- **Stat Cards** — total Tasks, Notes, dan Events terhubung ke data secara dinamis.
- **Quick Actions & Widgets** — akses cepat ke semua modul, recent tasks, dan recent notes dalam satu halaman.

### 🔔 Notifications
- **Notif Pintar** — notifikasi untuk task overdue, event yang akan datang, dan streak alert dengan tab All/Unread.
- **Mark as Read** — tandai semua notif sekaligus atau satu per satu langsung dari panel.

### 🔍 Search
- **Global Search** — cari Notes, Tasks, atau Timer dari mana saja lewat sidebar menu .

### 🏆 Gamification
- **XP & Level System** — setiap aksi produktif (buat catatan, selesaikan task) kasih poin XP; level naik otomatis dengan progress bar animasi.
- **Streak Tracker** — pelacak konsistensi harian biar kamu tetap on track dan nggak putus streak.

---

## 🎨 Design System

| Token | Nilai | Keterangan |
|-------|-------|------------|
| **Primary** | `#FFD400` | Kuning Emas |
| **Secondary** | `#FF8C00` | Oranye |
| **Background** | `#F8F8F6` | Off-white |
| **Font** | Google Sans | Modern & bersih |

---

*Dibuat dengan ❤️ oleh Tim Flo — Politeknik Negeri Malang*

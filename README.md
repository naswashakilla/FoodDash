#  Food Dash Deluxe

Selamat datang di **Food Dash Deluxe**! Sebuah game platformer bergaya retro arkade modern yang dibangun menggunakan **Phaser 3** dengan grafis *high-resolution vector canvas* tanpa membutuhkan aset gambar eksternal. Game ini dirancang secara dinamis dengan efek suara retro yang disintesis langsung menggunakan *Web Audio API*.

Bantu Chef manis kita melompati rintangan, menginjak musuh sushi jahat, menghindari kejaran hotdog terbang, dan mengumpulkan semua makanan penutup lezat untuk mencapai **Kue Ulang Tahun Raksasa 🎂** di akhir setiap level!


##  Deskripsi Game

Dalam **Food Dash Deluxe**, Anda akan menjelajahi 3 dunia bertema makanan yang berbeda dengan tingkat kesulitan yang semakin meningkat dan jenis rintangan yang sangat bervariasi. Skor tertinggi Anda akan disimpan secara otomatis di browser Anda (*Local Storage*) sehingga Anda selalu bisa mencoba memecahkan rekor terbaik Anda!


## Level Permainan & Rintangan Unik

Setiap level memiliki tema warna, latar belakang musik sfx, kecepatan pergerakan, dan **rintangan khusus** yang membedakannya dengan level lain:

###  Level 1: Candy Land (Mudah)
Taman permen yang manis dan penuh warna. Cocok untuk mempelajari dasar pergerakan Chef.
* **Tema Visual**: Merah Muda & Ungu Lembut.
* **Musuh Darat (Sushi)**: Berjalan lambat dan santai.
* **Musuh Terbang (Hotdog)**: Melayang perlahan dengan pola gelombang sempit.
* **Duri Permen**: Duri ungu statis yang mudah dilompati.

###  Level 2: Spicy Kitchen (Sedang)
Dapur panas yang membara dan penuh bahaya api! Memerlukan fokus tinggi untuk menghindari benda jatuh.
* **Tema Visual**: Oranye & Merah Menyala.
* **Duri Membara**: Duri berwarna oranye menyala yang berkedip-kedip layaknya batu bara panas.
* **Sushi Melompat**: Musuh darat (Sushi) bergerak lebih cepat dan akan **melompat secara reaktif** untuk menghalangi Anda jika Anda mendekatinya.
* **Hujan Cabai (Chili Spawner)**: Cabai merah pedas berputar akan jatuh secara acak dari langit-langit dapur.
  * **Sistem Peringatan Laser**: Sebelum cabai jatuh, sebuah **garis bidik laser merah putus-putus** dan teks **` DROP`** akan berkedip di layar selama 1 detik untuk memberi Anda waktu menghindar.
* **Enemy Cleanup**: Jika musuh tergelincir ke jurang, mereka akan otomatis dibersihkan secara aman agar game tetap berjalan lancar.

###  Level 3: Sugar Rush (Sulit)
Dunia gula neon futuristik yang bergerak sangat cepat dan agresif. Ujian ketangkasan refleks sesungguhnya!
* **Tema Visual**: Hijau & Cyan Neon Cyberpunk.
* **Duri Neon Bergeser**: Duri berwarna cyan neon tidak lagi diam, melainkan **bergeser ke kiri dan kanan secara horizontal** untuk menjebak lompatan Anda.
* **Sushi Mengamuk (Rage-Charge)**: Sushi darat bergerak sangat cepat, dan jika mereka mendeteksi Chef dalam jarak dekat, mereka akan **berlari kencang dengan aura merah marah** mengejar Anda.
* **Hotdog Menembak (Shooter)**: Musuh terbang (Hotdog) kini menembakkan **peluru neon gula** langsung ke arah posisi Chef setiap 1,8 detik. Anda harus lincah berzigzag di udara!

---

##  Kontrol Permainan

Anda dapat mengendalikan Chef menggunakan Keyboard dengan kontrol yang sangat responsif:

| Aksi | Tombol Keyboard |
| :--- | :--- |
| **Bergerak Kiri** | ⬅️ Arrow Left / **A** |
| **Bergerak Kanan** | ➡️ Arrow Right / **D** |
| **Melompat** | ⬆️ Arrow Up / **W** / **Z** / **SPACEBAR** |
| **Lompat Ganda** | Tekan tombol Lompat **2 kali** saat di udara 🚀 |
| **Menginjak Musuh** | Mendarat tepat di atas kepala musuh saat jatuh untuk menghancurkannya! 💥 |

---

##  Mekanik Skor & Combo Khusus

* **Makanan & Koin (Collectibles)**: Kumpulkan Burger, Donat, Lolipop, Es Krim, Cupcake, dan Koin untuk menambah poin Anda.
* **Combo Stomp Multiplier**: Setiap kali Anda menginjak musuh berturut-turut tanpa menyentuh tanah, Anda akan memicu pengganda skor combo!
  * Lompatan Pertama: **+50 Poin**
  * Lompatan Kedua (Combo x2): **+100 Poin**
  * Lompatan Ketiga (Combo x3): **+150 Poin**, dan seterusnya disertai efek teks kombo berkedip jingga/merah muda!
* **Pit Fall Protection**: Jika Anda jatuh ke dalam jurang, Anda tidak akan langsung kalah! Anda hanya kehilangan 1 nyawa (❤️) dan akan respawn dengan selamat di awal level.

##  Cara Memainkan Game

Game ini sepenuhnya berbasis web statis, sehingga Anda **tidak perlu menginstal program apa pun**!

1. Unduh atau buka direktori game ini di komputer Anda.
2. Cari file bernama **`index.html`**.
3. Klik dua kali file **`index.html`** untuk membukanya langsung di Browser web favorit Anda (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari, dll.).
4. Klik tombol level di menu utama (**Lv 1, Lv 2, atau Lv 3**) atau tekan tombol keyboard apa saja untuk langsung memulai petualangan di Level 1!


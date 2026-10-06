# KENZ.STUDIO

Landing page statis KENZ.STUDIO untuk layanan website, sistem bisnis, dan produk
digital.

CSS global berada di `styles.css`; gaya tombol dan navigasi dipisah di
`css/components/buttons.css` dan `css/components/menu.css`.

## Menjalankan secara lokal

Pastikan Node.js sudah terpasang, lalu jalankan dari folder proyek:

```sh
npm start
```

Buka [http://localhost:5500](http://localhost:5500). Untuk memilih port lain,
atur variabel lingkungan `PORT` sebelum menjalankan server.

## Build dan preview Cloudflare Workers

Build menyalin file publik ke `dist/`, yang dikonfigurasi sebagai static assets
di `wrangler.jsonc`.

```sh
npm run build
npm run dev:cloudflare
```

Perintah preview memerlukan koneksi internet saat Wrangler pertama kali
diunduh dengan `npx`. Buka alamat lokal yang ditampilkan Wrangler.

## Deploy dari GitHub ke Cloudflare Workers

Hubungkan repository GitHub ke project Cloudflare Worker `kenz-studio` melalui
Workers Builds. Atur build command `npm run build` dan deploy command
`npx wrangler deploy`. Wrangler membaca folder asset `dist/` dari `wrangler.jsonc`;
push ke branch `main` akan memulai build dan deploy otomatis.

Jika menggunakan GitHub Actions untuk deploy selain integrasi Workers Builds,
gunakan Cloudflare API token dan Account ID sebagai repository secrets.

Untuk menghubungkan domain khusus `kenz.studio`, tambahkan domain tersebut pada
project Worker melalui **Settings → Domains & Routes**.
Domain harus sudah ditambahkan dan aktif di akun Cloudflare. Tambahkan juga
`www.kenz.studio` jika varian `www` ingin digunakan. Domain khusus diatur
terpisah dari alamat Worker `kenz-studio.<subdomain>.workers.dev`.

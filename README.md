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

## Deploy otomatis ke Cloudflare Pages

Project Pages **`kenz-studio`** sudah live di
**https://kenz-studio.pages.dev**.

Setiap push ke branch `main` menjalankan workflow
`.github/workflows/deploy-pages.yml`:

1. `npm run build` menghasilkan folder `dist/`.
2. `wrangler pages deploy dist --project-name=kenz-studio` menerbitkan
   hasilnya sebagai deployment production.

Workflow membutuhkan repository secrets
`CLOUDFLARE_API_TOKEN` (izin Pages + Workers) dan
`CLOUDFLARE_ACCOUNT_ID`.

Deploy manual dari komputer lokal:

```sh
npm run deploy:pages
```

## Build dan preview Cloudflare Workers

Build menyalin file publik ke `dist/`. Config Worker disimpan di
`wrangler.worker.jsonc` (dipakai `npm run dev:cloudflare`); deploy Pages
sengaja tanpa config agar validasi Pages tidak menolak field `assets`.

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

Situs memakai domain gratis `https://kenz-studio.pages.dev`, sehingga canonical,
Open Graph, `robots.txt`, dan `sitemap.xml` menunjuk ke alamat tersebut.
Domain khusus berbayar tidak diperlukan. Bila suatu saat ingin memakai domain
khusus, tambahkan pada project Pages melalui **Custom domains**, daftarkan
domain di akun Cloudflare, lalu perbarui URL di `index.html`, `robots.txt`,
dan `sitemap.xml`.

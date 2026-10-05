# YEP.studio

Landing page statis YEP.studio untuk layanan website, sistem bisnis, dan produk
digital.

## Menjalankan secara lokal

Pastikan Node.js sudah terpasang, lalu jalankan dari folder proyek:

```sh
npm start
```

Buka [http://localhost:5500](http://localhost:5500). Untuk memilih port lain,
atur variabel lingkungan `PORT` sebelum menjalankan server.

## Build dan preview Cloudflare Pages

Build hanya menyalin file publik yang diperlukan ke `dist/`; file konfigurasi
dan metadata lokal tidak ikut dipublikasikan.

```sh
npm run build
npm run dev:cloudflare
```

Perintah preview Cloudflare memerlukan koneksi internet saat Wrangler pertama
kali diunduh dengan `npx`. Buka alamat lokal yang ditampilkan Wrangler.

## Deploy dari GitHub ke Cloudflare Pages

Workflow `.github/workflows/deploy-cloudflare.yml` membangun dan men-deploy situs
setiap kali ada push ke branch `main`. Sebelum workflow dijalankan:

1. Buat project Cloudflare Pages bernama `yep-studio-landing`.
2. Buat Cloudflare API token dengan izin deploy Pages.
3. Tambahkan repository secrets `CLOUDFLARE_API_TOKEN` dan
   `CLOUDFLARE_ACCOUNT_ID` di **Settings → Secrets and variables → Actions**.

Deploy juga bisa dijalankan manual dari tab **Actions** di GitHub.

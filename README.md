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

1. Buat project Cloudflare Pages bernama `kenz-studio`. Alamat Pages bawaannya
   akan menjadi `kenz-studio.pages.dev`.
2. Buat Cloudflare API token dengan izin deploy Pages.
3. Tambahkan repository secrets `CLOUDFLARE_API_TOKEN` dan
   `CLOUDFLARE_ACCOUNT_ID` di **Settings → Secrets and variables → Actions**.

Untuk menghubungkan domain khusus `kenz.studio`, tambahkan domain tersebut pada
project Cloudflare Pages melalui **Custom domains → Set up a custom domain**.
Domain harus sudah ditambahkan dan aktif di akun Cloudflare. Tambahkan juga
`www.kenz.studio` jika varian `www` ingin digunakan. Workflow mengirim build ke
project Pages `kenz-studio`; domain khusus diatur terpisah melalui dashboard
Cloudflare.

Deploy juga bisa dijalankan manual dari tab **Actions** di GitHub. Pengaturan
domain khusus dilakukan di dashboard Cloudflare; workflow hanya mengirim file
situs ke project Pages.

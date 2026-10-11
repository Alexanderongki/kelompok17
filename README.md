# WebGIS Ketelitian Horizontal – Desa Sidodadi

## Cara menjalankan di VS Code
1. Ekstrak ZIP, lalu **File → Open Folder** di VS Code.
2. Pasang ekstensi **Live Server**, klik kanan `index.html` → **Open with Live Server**.
   (Atau cukup klik dua kali `index.html` di browser.)
3. Perlu internet (Leaflet dan peta dasar dimuat dari CDN).

## Struktur
- `tim.html` + `tim.css` + `team.js` – halaman perkenalan tim (edit nama/bio di team.js, foto di folder img/)
- `index.html` – kerangka halaman · `style.css` – tampilan · `app.js` – logika peta
- `data/data.js` – data GCP/ICP Sidodadi yang dimuat otomatis (dari Sidodadi_KEMKER23.csv). Pengelompokan: awalan IPSW/ISDD = ICP, selain itu (BM, PSW, SDD) = GCP; ubah di file ini jika perlu.

- `data/tutupan.js` – tutupan lahan Sidodadi (dikonversi dari SHP UTM 48S ke WGS84): Hutan, Perkebunan, Pertanian, Lahan terbuka, Pemakaman, Perairan, Bangunan, Jalan.

## Ortofoto (folder `ortho/`)
Tidak ada upload di WebGIS. Taruh tile XYZ hasil konversi .ecw langsung di folder `ortho/` dengan struktur `ortho/{zoom}/{x}/{y}.jpg`, lalu sesuaikan `ortho/config.js` (format & zoom). Di WebGIS ortofoto hanya bisa diatur tampil/sembunyi dan transparansinya. Lihat `ortho/BACA-SAYA.txt` untuk cara membuat tile di QGIS/gdal2tiles.

## Tampilan awal
Peta langsung terzoom ke Desa Sidodadi, Kec. Teluk Pandan (konstanta `SIDODADI` di `app.js`). Tombol ⌖ mengembalikan ke tampilan ini.

document.addEventListener('DOMContentLoaded', () => {
    const d = new Date();
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

    // Set input tanggal default ke hari ini
    document.getElementById('inputTglSurat').valueAsDate = d;
    document.getElementById('inputTglJanji').valueAsDate = d;

    // Trigger update setiap ada ketikan/perubahan
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('input', updatePreview);
    });

    function formatIndoDate(dateObj) {
        if (!dateObj || isNaN(dateObj)) return "...";
        return `${dateObj.getDate()} ${months[dateObj.getMonth()]} ${dateObj.getFullYear()}`;
    }

    function formatIndoDayDate(dateObj) {
        if (!dateObj || isNaN(dateObj)) return "...";
        return `${days[dateObj.getDay()]}, ${formatIndoDate(dateObj)}`;
    }

    function updatePreview() {
        const pendaftar = document.getElementById('inputPendaftar').value || "[Nama Pendaftar]";
        const gender = document.getElementById('inputGender').value;
        // Logika: Jika kolom anak/klien kosong, otomatis pakai nama pendaftar
        const klien = document.getElementById('inputKlien').value || pendaftar;
        const kontak = document.getElementById('inputKontak').value || "[Nomer Kontak]";
        const layanan = document.getElementById('inputLayanan').value || "[Jenis Layanan]";
        const waktu = document.getElementById('inputWaktu').value || "[Waktu]";
        const psikolog = document.getElementById('inputPsikolog').value || "[Isi Nama Psikolog]";

        const tglSuratObj = document.getElementById('inputTglSurat').valueAsDate;
        const tglJanjiObj = document.getElementById('inputTglJanji').valueAsDate;

        // Logika Panggilan Bapak/Ibu
        const panggilan = gender === "Perempuan" ? "Ibu" : "Bapak";

        // Memasukkan data ke dalam template kanan
        document.getElementById('outTglSurat').innerText = `Tangerang Selatan, ${formatIndoDate(tglSuratObj)}`;
        document.getElementById('outYth').innerText = `Yth. ${panggilan} ${pendaftar}`;
        document.getElementById('outNamaPasien').innerText = klien;
        document.getElementById('outKontak').innerText = kontak;

        // Layanan disebut dua kali (di paragraf & di tabel)
        document.querySelectorAll('.outLayanan').forEach(el => el.innerText = layanan);

        document.getElementById('outJadwal').innerText = formatIndoDayDate(tglJanjiObj);
        document.getElementById('outWaktu').innerText = `${waktu} WIB`;
        document.getElementById('outPsikolog').innerText = psikolog;
    }

    // Fungsi untuk auto-scale kertas agar pas (fit) di layar tanpa scroll
    function fitPaper() {
        const previewArea = document.getElementById('preview-area');
        const paper = document.querySelector('.paper');
        // Target area dikurangi padding atas-bawah (total 40px)
        const availableHeight = previewArea.clientHeight - 40;
        const availableWidth = previewArea.clientWidth - 40;

        // Tinggi A4 = 297mm (sekitar 1122.5px), Lebar A4 = 210mm (sekitar 793.7px)
        const scaleY = availableHeight / 1122.5;
        const scaleX = availableWidth / 793.7;

        // Ambil skala terkecil agar seluruh kertas masuk ke layar
        const scale = Math.min(scaleX, scaleY);
        paper.style.transform = `scale(${scale})`;
    }

    window.addEventListener('resize', fitPaper);
    fitPaper(); // Jalankan saat pertama kali buka

    // Jalankan preview pertama kali saat aplikasi dibuka
    updatePreview();
});

// FUNGSI GENERATE PDF - FINAL FIX (DESKTOP + MOBILE + IPHONE)
// Strategi: Clone kertas ke kontainer position:fixed di koordinat (0,0) viewport.
// Ini menjamin html2canvas SELALU mendapat elemen di posisi (0,0),
// tidak terpengaruh sidebar, flex-center, atau scale apapun.
// Container diletakkan di z-index:-1 (di belakang semua konten) sehingga tidak terlihat.
function generatePDF() {
    var originalPaper = document.querySelector('.paper');
    var btn = document.querySelector('.btn-print');

    // Ambil nama untuk nama file
    var pendaftar = document.getElementById('inputPendaftar').value.trim();
    if (!pendaftar) pendaftar = "Klien";
    var safeName = pendaftar.replace(/[^a-zA-Z0-9 ]/g, "").trim().replace(/\s+/g, '_');
    var filename = "Surat_Konfirmasi_" + safeName + ".pdf";

    btn.innerText = "Memproses...";
    btn.disabled = true;

    // === LANGKAH 1: Buat Print Container tersembunyi di belakang konten ===
    // position:fixed top:0 left:0 menjamin posisi di koordinat viewport (0,0).
    // z-index:-1 menyembunyikannya di belakang semua konten halaman (tidak terlihat user).
    // html2canvas membaca DOM, bukan pixel layar, jadi tetap bisa merender elemen ini.
    var printContainer = document.createElement('div');
    printContainer.style.cssText = 'position:fixed;top:0;left:0;' +
        'width:210mm;height:297mm;z-index:-1;background:white;' +
        'margin:0;padding:0;overflow:hidden;border:none;outline:none;box-shadow:none;';

    // === LANGKAH 2: Clone kertas asli dan reset SEMUA style via inline ===
    var clonedPaper = originalPaper.cloneNode(true);
    clonedPaper.style.cssText = 'transform:none !important;-webkit-transform:none !important;' +
        'width:210mm !important;height:297mm !important;max-height:297mm !important;' +
        'margin:0 !important;padding:0 !important;box-shadow:none !important;' +
        'overflow:hidden !important;position:relative !important;' +
        'flex-shrink:0 !important;box-sizing:border-box !important;' +
        'border:none !important;outline:none !important;';

    // === LANGKAH 3: Perbaiki elemen-elemen dalam clone secara inline ===
    var bar = clonedPaper.querySelector('.header-contact-bar');
    if (bar) bar.style.gap = '40px';

    var svgs = clonedPaper.querySelectorAll('.contact-item svg');
    for (var i = 0; i < svgs.length; i++) {
        svgs[i].style.width = '18px';
        svgs[i].style.height = '18px';
        svgs[i].style.fill = 'white';
        svgs[i].style.display = 'inline-block';
        svgs[i].style.flexShrink = '0';
    }

    // Masukkan clone ke container, container ke body
    printContainer.appendChild(clonedPaper);
    document.body.appendChild(printContainer);

    // === LANGKAH 4: Konfigurasi html2pdf ===
    var opt = {
        margin: 0,
        filename: filename,
        image: { type: 'jpeg', quality: 1 },
        html2canvas: {
            scale: 2,
            useCORS: true,
            scrollX: 0,
            scrollY: 0,
            x: 0,
            y: 0,
            width: 794,
            height: 1123,
            windowWidth: 794
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // === LANGKAH 5: Tunggu browser merender clone, lalu tangkap ===
    setTimeout(function () {
        html2pdf()
            .set(opt)
            .from(clonedPaper)
            .toCanvas()
            .toPdf()
            .get('pdf')
            .then(function (pdf) {
                while (pdf.getNumberOfPages() > 1) {
                    pdf.deletePage(2);
                }
            })
            .save()
            .then(function () {
                if (document.body.contains(printContainer)) document.body.removeChild(printContainer);
                btn.innerText = "Cetak / Simpan PDF";
                btn.disabled = false;
            })
            .catch(function (err) {
                console.error("Error PDF:", err);
                alert("Gagal mencetak. Silakan refresh dan coba lagi.");
                if (document.body.contains(printContainer)) document.body.removeChild(printContainer);
                btn.innerText = "Cetak / Simpan PDF";
                btn.disabled = false;
            });
    }, 200);
}


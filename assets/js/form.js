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

document.addEventListener('DOMContentLoaded', () => {
    /* --- 1. Cache Semua Elemen DOM di Awal --- */
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const closeMobileMenuButton = document.getElementById('close-mobile-menu-button');
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    const navLinks = document.querySelectorAll('.navLink');
    const sections = document.querySelectorAll('main section[id]');
    const modalPicture = document.getElementById('modalPicture');
    const modalPictureCaption = document.getElementById('modalPictureCaption');
    const closeModalPictureButton = document.getElementById('closeModalPicture');
    const modalPictureContent = document.getElementById('modalPictureContent');
    const toTopButton = document.getElementById('to-top-button');
    const body = document.body;

    /* --- 2. Mobile Menu Logic --- */
    function toggleMobileMenu() {
        /* Gunakan satu kelas state untuk mengontrol semua style dari CSS */
        body.classList.toggle('menu-is-open'); 
    }
    mobileMenuButton.addEventListener('click', toggleMobileMenu);
    closeMobileMenuButton.addEventListener('click', toggleMobileMenu);

    /* --- 3. Theme Toggle Logic --- */
    function applyTheme(theme) {
        if (theme === 'dark') {
            html.classList.add('dark');
        } else {
            html.classList.remove('dark');
        }
    }
    themeToggle.addEventListener('click', () => {
        const isDark = !html.classList.contains('dark');
        const newTheme = isDark ? 'dark' : 'light';
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
    });
    /* Terapkan tema saat halaman dimuat */
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);

    /* Active Nav Link on Scroll using Intersection Observer API */

    /* Buat 'peta' dari ID seksi ke DAFTAR tautan navigasi */
    const navLinkMap = new Map();
    navLinks.forEach(link => {
        const sectionId = link.getAttribute('href').substring(1);
        if (!sectionId) return; /* Lewati jika tidak ada href */

        /* Jika ID ini belum ada di peta, buat array kosong untuknya */
        if (!navLinkMap.has(sectionId)) {
            navLinkMap.set(sectionId, []);
        }
        /* Tambahkan tautan saat ini ke dalam array untuk ID tersebut */
        navLinkMap.get(sectionId).push(link);
    });

    /* Simpan referensi ke tautan-tautan yang sedang aktif --- */
    let currentActiveLinks = [];

    /* Opsi untuk Intersection Observer (Tetap Sama) */
    const observerOptions = {
        root: null,
        rootMargin: '-40% 0px -40% 0px',
        threshold: 0
    };

    /* Fungsi callback yang sudah disesuaikan */
    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const targetId = entry.target.id;
                const targetLinks = navLinkMap.get(targetId); /* Ini sekarang array [linkDesktop, linkMobile] */

                if (targetLinks && targetLinks !== currentActiveLinks) {
                    /* Nonaktifkan semua tautan aktif sebelumnya (jika ada) */
                    currentActiveLinks.forEach(link => link.classList.remove('text-orange-500'));
                    /* Aktifkan semua tautan yang baru (desktop & mobile) */
                    targetLinks.forEach(link => link.classList.add('text-orange-500'));
                    /* Perbarui referensi tautan-tautan aktif */
                    currentActiveLinks = targetLinks;
                }
            }
        });
    };

    /* Buat dan jalankan observer (Tetap Sama) */
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach(section => {
        observer.observe(section);
    });

    /* Nav Link Active State */
    /* navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.forEach(item => {
                item.classList.remove('text-orange-500');
                link.classList.add('dark:text-white', 'text-black');
            });
            link.classList.add('text-orange-500');
            link.classList.remove('dark:text-white', 'text-black');
        });
    }); */

    /* --- 5. Modal Picture Logic --- */
    function openModalPicture(image) {
        modalPicture.classList.remove('hidden');
        modalPictureContent.src = image.src;
        modalPictureCaption.innerHTML = image.alt;
    }
    function closeModalPicture() {
        modalPicture.classList.add('hidden');
    }
    closeModalPictureButton.addEventListener('click', closeModalPicture);

    /* --- 6. Penggabungan Event Listener Global (Click & Scroll) --- */
    /* Utility untuk Throttling */
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /* Listener untuk scroll (di-throttle) */
    window.addEventListener('scroll', throttle(() => {
        /* Refresh AOS agar tetap responsif */
        AOS.refresh();
        /* To Top Button Logic */
        if (window.scrollY > 300) {
            toTopButton.classList.remove('opacity-0', 'pointer-events-none');
            toTopButton.classList.add('opacity-100', 'pointer-events-auto');
        } else {
            toTopButton.classList.remove('opacity-100', 'pointer-events-auto');
            toTopButton.classList.add('opacity-0', 'pointer-events-none');
        }
    }, 150)); /*  Jalankan maksimal setiap 150ms */

    /* Listener untuk click (menggunakan event delegation) */
    document.addEventListener('click', (event) => {
        const target = event.target;
        /* Event Delegation untuk membuka modal gambar */
        const imgModal = target.closest('.imgModal');
        if (imgModal) {
            openModalPicture(target);
            return;
        }
        /* Tutup modal jika klik di luar konten */
        if (!modalPicture.classList.contains('hidden') && target === modalPicture) {
            closeModalPicture();
            return;
        }
        /* Tutup mobile menu jika klik di dalam */
        if (body.classList.contains('menu-is-open') && target.closest('#mobile-menu')) {
            toggleMobileMenu();
        }
        /* Tutup mobile menu jika klik di luar */
        if (body.classList.contains('menu-is-open') && !target.closest('#mobile-menu') && !target.closest('#mobile-menu-button')) {
            toggleMobileMenu();
        }
    });
});
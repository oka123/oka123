document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Cache Semua Elemen DOM di Awal ---
    const mobileMenu = document.getElementById('mobile-menu');
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

    // --- 2. Mobile Menu Logic ---
    function toggleMobileMenu() {
        // Gunakan satu kelas state untuk mengontrol semua style dari CSS
        body.classList.toggle('menu-is-open'); 
    }
    mobileMenuButton.addEventListener('click', toggleMobileMenu);
    closeMobileMenuButton.addEventListener('click', toggleMobileMenu);

    // --- 3. Theme Toggle Logic ---
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
    // Terapkan tema saat halaman dimuat
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);

    /* Active Nav Link on Scroll using Intersection Observer API
    Opsi untuk Intersection Observer */
    const observerOptions = {
        root: null, /* Menggunakan viewport sebagai root */
        rootMargin: '-40% 0px -40% 0px', /* Trik: Anggap section 'aktif' saat berada di tengah layar */
        threshold: 0
    };

    /* Fungsi yang akan dijalankan saat seksi terlihat */
    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            /* Jika seksi masuk ke area pengamatan (tengah layar) */
            if (entry.isIntersecting) {
                /* Hapus kelas aktif dari semua link */
                navLinks.forEach(link => {
                    link.classList.remove('text-orange-500');
                    link.classList.add('dark:text-white', 'text-black');
                    
                });

                /* Dapatkan link yang sesuai dengan seksi yang terlihat */
                const targetId = entry.target.id;
                const targetLinks = document.querySelectorAll(`.navLink[href="#${targetId}"]`);
                
                targetLinks.forEach(link => {
                    link.classList.add('text-orange-500');
                    link.classList.remove('dark:text-white', 'text-black');
                });
            }
        });
    };

    /* Buat dan jalankan observer */
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

    // --- 5. Modal Picture Logic ---
    function openModalPicture(image) {
        modalPicture.classList.remove('hidden');
        modalPictureContent.src = image.src;
        modalPictureCaption.innerHTML = image.alt;
    }
    function closeModalPicture() {
        modalPicture.classList.add('hidden');
    }
    closeModalPictureButton.addEventListener('click', closeModalPicture);

    // --- 6. Penggabungan Event Listener Global (Click & Scroll) ---
    // Utility untuk Throttling
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

    // Listener untuk scroll (di-throttle)
    window.addEventListener('scroll', throttle(() => {
        // To Top Button Logic
        if (window.scrollY > 300) {
            toTopButton.classList.remove('opacity-0', 'pointer-events-none');
            toTopButton.classList.add('opacity-100', 'pointer-events-auto');
        } else {
            toTopButton.classList.remove('opacity-100', 'pointer-events-auto');
            toTopButton.classList.add('opacity-0', 'pointer-events-none');
        }
    }, 150)); // Jalankan maksimal setiap 150ms

    // Listener untuk click (menggunakan event delegation)
    document.addEventListener('click', (event) => {
        const target = event.target;
        // Event Delegation untuk membuka modal gambar
        const imgModal = target.closest('.imgModal');
        if (imgModal) {
            openModalPicture(target);
            return;
        }
        // Tutup modal jika klik di luar konten
        if (!modalPicture.classList.contains('hidden') && target === modalPicture) {
            closeModalPicture();
            return;
        }
        // Tutup mobile menu jika klik di luar dan di dalam
        if (body.classList.contains('menu-is-open') && !target.closest('#mobile-menu') || target.closest('#mobile-menu') && !target.closest('#mobile-menu-button')) {
            toggleMobileMenu();
        }
    });
});
 <!--TOMBOL FULLSCREEN --> 
    <script>
        const fullscreenIcon = document.getElementById("fullscreen-icon");

        // Fungsi untuk toggle full screen
        function toggleFullScreen() {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen(); // Masuk full screen
                fullscreenIcon.classList.remove("fa-expand"); // Ubah ikon
                fullscreenIcon.classList.add("fa-compress");
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen(); // Keluar dari full screen
                    fullscreenIcon.classList.remove("fa-compress"); // Kembali ke ikon awal
                    fullscreenIcon.classList.add("fa-expand");
                }
            }
        }

        // Event listener untuk ikon
        fullscreenIcon.addEventListener("click", toggleFullScreen);

        // Event listener untuk deteksi perubahan status full screen
        document.addEventListener("fullscreenchange", () => {
            if (!document.fullscreenElement) {
                fullscreenIcon.classList.remove("fa-compress");
                fullscreenIcon.classList.add("fa-expand");
            }
        });
    </script>

<!--MENU TAB PRODUCT-->
<script>
// Toggle untuk menampilkan dan menyembunyikan tab dengan efek fade in dan fade out
const toggleIcon = document.getElementById('icon');
const tabsContainer = document.getElementById('tabs');

toggleIcon.addEventListener('click', (event) => {
    event.stopPropagation(); // Menghentikan propagasi klik agar tidak menutup tabs
    if (tabsContainer.classList.contains('show')) {
        tabsContainer.classList.remove('show'); // Sembunyikan tab dengan efek fade out
    } else {
        tabsContainer.classList.add('show'); // Tampilkan tab dengan efek fade in
    }
});

// Tutup tabs jika klik terjadi di luar area tabs atau icon
document.addEventListener('click', (event) => {
    if (!tabsContainer.contains(event.target) && !toggleIcon.contains(event.target)) {
        tabsContainer.classList.remove('show'); // Sembunyikan tab dengan efek fade out
    }
});

// Ambil semua tab dan produk
const tabs = document.querySelectorAll('.tab');
const products = document.querySelectorAll('.product-card2');

// Menambahkan event listener untuk setiap tab
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Hapus kelas aktif dari semua tab dan sembunyikan semua produk
        tabs.forEach(t => t.classList.remove('active-tab'));
        products.forEach(product => product.style.display = 'none');

        // Tambahkan kelas aktif pada tab yang dipilih
        tab.classList.add('active-tab');

        // Tampilkan produk berdasarkan kategori yang dipilih
        const category = tab.getAttribute('data-category');
        products.forEach(product => {
            if (product.getAttribute('data-category') === category) {
                product.style.display = 'block'; // Tampilkan produk yang cocok
            }
        });
    });
});

// Menampilkan produk kategori pertama saat halaman dimuat
document.querySelector('.tab[data-category="jersey"]').click();
</script>

<!--LIGHTBOX DETAIL PRODUCT-->
<script>
// JavaScript for opening and closing the lightbox
document.querySelectorAll('.product-card2 .card2-header, .product-card2 .card2-body').forEach(card => {
    card.addEventListener('click', function() {
        const productCard = this.closest('.product-card2');

        // Get product details directly from the elements
        const imgSrc = productCard.querySelector('.card2-header img').src;
        const title = productCard.querySelector('.card2-title').textContent;
        const price = productCard.querySelector('.card2-price').textContent;
        const description = productCard.querySelector('.card2-description').childNodes[0].textContent.trim();

        // Set lightbox content
        document.getElementById('lightbox-imgPL').src = imgSrc;
        document.getElementById('lightbox-titlePL').textContent = title;
        document.getElementById('lightbox-pricePL').textContent = price;
        document.getElementById('lightbox-descriptionPL').textContent = description;

        // Check for note-guide table and insert it into the lightbox if it exists
        const guideTable = productCard.querySelector('.note-guide');
        if (guideTable) {
            document.getElementById('lightbox-guidePL').innerHTML = guideTable.outerHTML;
            document.querySelector('#lightbox-guidePL .note-guide').classList.add('note-guide'); // Apply styles
            document.getElementById('lightbox-guidePL').style.display = 'block';
        } else {
            document.getElementById('lightbox-guidePL').style.display = 'none'; // Hide if no table
        }

        // Show lightbox
        document.getElementById('lightboxPL').style.display = 'flex';
    });
});

// Close button functionality
document.querySelector('.close-btnPL').addEventListener('click', function() {
    document.getElementById('lightboxPL').style.display = 'none';
    document.getElementById('lightbox-guidePL').innerHTML = ''; // Clear table on close
});

// Close lightbox on outside click
window.addEventListener('click', function(event) {
    if (event.target === document.getElementById('lightboxPL')) {
        document.getElementById('lightboxPL').style.display = 'none';
        document.getElementById('lightbox-guidePL').innerHTML = ''; // Clear table on close
    }
});
</script>

	
<!--MENU TAB PRODUCT CART-->
<script>
// Ambil elemen keranjang dan checkout
const cartItemsContainer = document.getElementById('cart-items');
const checkoutBtn = document.getElementById('checkout-btn');
const subtotalElement = document.getElementById('subtotal');
const cartCount = document.getElementById('cart-count');
const cartIcon = document.getElementById('cart-icon');
const cartPopup = document.getElementById('cart-popup');
const paymentPopup = document.getElementById('payment-popup');

let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

// Toggle visibility of cart popup
cartIcon.addEventListener('click', function() {
    cartPopup.classList.toggle('popup-hidden');
});

// Function to add item to cart
function addToCart(productName, productPrice, productImg, event) {
    event.stopPropagation();
    const item = cartItems.find(cartItem => cartItem.name === productName);
    if (item) {
        item.qty += 1;
    } else {
        cartItems.push({
            name: productName,
            price: productPrice,
            img: productImg,
            qty: 1
        });
    }
    updateCart();
}

// Update cart display and save to local storage
function updateCart() {
    cartItemsContainer.innerHTML = '';
    let subtotal = 0;
    let itemCount = 0;
    cartItems.forEach(item => {
        subtotal += item.price * item.qty;
        itemCount += item.qty;
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <div class="item-image">
                <img src="${item.img}" alt="${item.name}">
            </div>
            <div class="item-details">
                <span>${item.name}</span>
                <span>Rp ${(item.price * item.qty).toLocaleString('id-ID')}</span> <!-- Pemisah ribuan -->
            </div>
            <div class="item-controls">
                <button class="decrease-btn" onclick="decreaseQty('${item.name}', event)">-</button>
                ${item.qty}
                <button class="increase-btn" onclick="addToCart('${item.name}', ${item.price}, '${item.img}', event)">+</button>
                <button class="remove-btn" onclick="removeFromCart('${item.name}', event)">X</button>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });
    subtotalElement.innerText = subtotal.toLocaleString('id-ID'); // Pemisah ribuan
    cartCount.innerText = itemCount;
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

// Function to add product from button click
document.querySelectorAll('.add-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        const productCard = btn.closest('.product-card2');
        const productName = productCard.querySelector('.card2-title').innerText;
        const productPrice = parseInt(productCard.querySelector('.card2-price').innerText.replace(/Rp |[.]/g, ''));
        const productImg = productCard.querySelector('.card2-header img').src;
        addToCart(productName, productPrice, productImg, event);
    });
});

// Functions for increasing, decreasing and removing items
function decreaseQty(productName, event) {
    event.stopPropagation();
    const item = cartItems.find(cartItem => cartItem.name === productName);
    if (item && item.qty > 1) {
        item.qty -= 1;
    } else if (item) {
        cartItems = cartItems.filter(cartItem => cartItem.name !== productName);
    }
    updateCart();
}

function removeFromCart(productName, event) {
    event.stopPropagation();
    cartItems = cartItems.filter(cartItem => cartItem.name !== productName);
    updateCart();
}

// Function to handle checkout
function checkout() {
    if (cartItems.length === 0) {
        alert('Keranjang kosong, tambahkan produk terlebih dahulu!');
        return;
    }

    // Tampilkan popup pembayaran
    showPaymentPopup();
}

// Show payment popup
function showPaymentPopup() {
    const subtotal = cartItems.reduce((total, item) => total + item.price * item.qty, 0);
    paymentPopup.classList.remove('popup-hidden'); // Tampilkan popup
    paymentPopup.classList.add('popup-show'); // Tambahkan kelas animasi
    const paymentDetails = paymentPopup.querySelector('.payment-details');
    paymentDetails.innerHTML = `
        <p><strong><h1 style="margin-top:-10px;margin-bottom:30px;">Rp ${subtotal.toLocaleString('id-ID')}</h1></strong></p> <!-- Pemisah ribuan -->
        <p>Pilih metode pembayaran:</p>
        <ul>
            <li><h3>a.n <b>PT. DSAIN KREASI MANDIRI</h3></b></li>
            <li>Bank Mandiri</li>
            <li><b><h1 style="margin-top:-3px;margin-bottom:50px;">1340020180971<h1></b></li>
        </ul>
    `;
}

// Hide payment popup
function hidePaymentPopup() {
    paymentPopup.classList.remove('popup-show'); // Hapus kelas animasi
    paymentPopup.classList.add('popup-hidden');
}

// Send order to WhatsApp
function sendOrderToWhatsApp() {
    let message = "Pesanan Anda:\n--------------------------------------\n";
    cartItems.forEach(item => {
        message += `${item.name} - Qty: ${item.qty} - Rp ${(item.price * item.qty).toLocaleString('id-ID')}\n`; // Pemisah ribuan
    });
    message += `--------------------------------------\nSubtotal: Rp ${cartItems.reduce((total, item) => total + item.price * item.qty, 0).toLocaleString('id-ID')}`; // Pemisah ribuan

    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = '6285172288904';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');

    cartItems = [];
    updateCart();
    hidePaymentPopup();
}

// Event listener untuk tombol checkout
checkoutBtn.addEventListener('click', checkout);

// Event listeners untuk tombol pada popup pembayaran
document.getElementById('cancel-btn').addEventListener('click', hidePaymentPopup);
document.getElementById('next-btn').addEventListener('click', sendOrderToWhatsApp);

// Close cart popup when clicking outside of it
window.addEventListener('click', function(event) {
    if (!cartPopup.classList.contains('popup-hidden') && !cartIcon.contains(event.target) && !cartPopup.contains(event.target)) {
        cartPopup.classList.add('popup-hidden');
    }
});

// Call updateCart to load items from local storage on page load
updateCart();
</script>


<!--MENU BOTTOM TAB--> 
<script>
  // JavaScript untuk menangani aktivasi tab
  function activateTabH3(element, contentId) {
    const tabs = document.querySelectorAll('.tab-itemH3');
    const contents = document.querySelectorAll('.contentH3');
    
    // Hapus kelas aktif dari semua tab dan konten
    tabs.forEach(tab => tab.classList.remove('activeH3'));
    contents.forEach(content => content.classList.remove('activeH3'));
    
    // Tambah kelas aktif ke tab dan konten yang dipilih
    element.classList.add('activeH3');
    document.getElementById(contentId).classList.add('activeH3');
  }
</script>


 <!-- Popup Whatsapp --> 
<script>
    function toggleWhatsAppCard(event) {
        var card = document.getElementById("whatsappCard");
        var floatIcon = document.getElementById("floatIcon");
        var floatContainer = document.getElementById("whatsappFloatContainer");
        var helpText = document.getElementById("helpText");

        if (card.style.display === "none" || card.style.display === "") {
            card.style.display = "block";
            floatContainer.classList.add("hidden"); // Sembunyikan ikon saat kartu terbuka
            helpText.style.display = "none"; // Sembunyikan teks saat kartu terbuka
            setTimeout(function() {
                card.classList.add("active");
                floatIcon.style.transform = "rotate(180deg)"; // Rotasi saat kartu muncul
            }, 10);
        } else {
            card.classList.remove("active");
            floatIcon.style.transform = "rotate(0deg)"; // Kembali ke posisi semula
            setTimeout(function() {
                card.style.display = "none";
                floatContainer.classList.remove("hidden"); // Tampilkan ikon saat kartu tertutup
                helpText.style.display = "block"; // Tampilkan teks saat kartu tertutup
            }, 400); // Sesuaikan dengan durasi transisi
        }

        event.stopPropagation(); // Mencegah event bubbling
    }

    // Menambahkan event listener untuk klik di luar card
    document.addEventListener('click', function(event) {
        var card = document.getElementById("whatsappCard");
        var floatButton = document.getElementById("whatsappFloat");
        var floatContainer = document.getElementById("whatsappFloatContainer");
        var helpText = document.getElementById("helpText");

        // Mengecek apakah klik di luar card dan tombol
        if (!card.contains(event.target) && !floatButton.contains(event.target) && card.style.display === "block") {
            card.classList.remove("active");
            floatIcon.style.transform = "rotate(0deg)"; // Kembali ke posisi semula
            setTimeout(function() {
                card.style.display = "none";
                floatContainer.classList.remove("hidden"); // Tampilkan ikon saat kartu tertutup
                helpText.style.display = "block"; // Tampilkan teks saat kartu tertutup
            }, 400); // Sesuaikan dengan durasi transisi
        }
    });
</script>

 <!-- Katalog --> 
<script>
    const hiddenImages = document.querySelectorAll('.hidden-imageKT');
    let currentIndex = 0;

    function openPopup(index) {
        const imageUrl = hiddenImages[index].src;
        document.getElementById('popupImageKT').src = imageUrl;

        const overlay = document.getElementById('overlayKT');
        overlay.style.display = 'flex';
        setTimeout(() => {
            overlay.style.opacity = 1;
        }, 10);

        const popupContainer = document.querySelector('.popup-containerKT');
        setTimeout(() => {
            popupContainer.style.opacity = 1;
            popupContainer.style.transform = 'scale(1)';
        }, 10);

        currentIndex = index;

        document.querySelector('.prev-buttonKT').style.display = 'block';
        document.querySelector('.next-buttonKT').style.display = 'block';
    }

    function closePopup() {
        const overlay = document.getElementById('overlayKT');
        const popupContainer = document.querySelector('.popup-containerKT');

        overlay.style.opacity = 0;
        popupContainer.style.opacity = 0;
        popupContainer.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 300);
    }

    function prevImage() {
        currentIndex = (currentIndex === 0) ? hiddenImages.length - 1 : currentIndex - 1;
        document.getElementById('popupImageKT').src = hiddenImages[currentIndex].src;
    }

    function nextImage() {
        currentIndex = (currentIndex === hiddenImages.length - 1) ? 0 : currentIndex + 1;
        document.getElementById('popupImageKT').src = hiddenImages[currentIndex].src;
    }
</script>


 <!--MENU TAB PROTOFOLIO --> 
<script>
    // Menampilkan thumbnail dan popup lightbox saat card diklik
    document.querySelectorAll('.article-cardA2').forEach(card => {
        const mediaUrl = card.getAttribute('data-media');
        const mediaType = card.getAttribute('data-type');

        card.addEventListener('click', () => {
            document.getElementById('lightboxA2').style.display = 'flex';
            document.getElementById('popup-titleA2').innerText = card.querySelector('h2').innerText;
            document.getElementById('popup-authorA2').innerText = card.querySelector('.authorA2').innerText;
            document.getElementById('popup-contentA2').innerText = card.querySelector('.contentA2').innerText;

            if (mediaType === 'image') {
                const image = document.getElementById('popup-imageA2');
                image.src = mediaUrl;
                image.style.display = 'block';
                document.getElementById('popup-videoA2').style.display = 'none';
            } else if (mediaType === 'video') {
                const video = document.getElementById('popup-videoA2');
                video.src = mediaUrl;
                video.style.display = 'block';
                document.getElementById('popup-imageA2').style.display = 'none';
            }
        });
    });

    // Menutup lightbox saat tombol close diklik
    document.getElementById('close-btnA2').addEventListener('click', () => {
        closeLightbox();
    });

    // Menutup lightbox saat mengklik di luar konten
    document.getElementById('lightboxA2').addEventListener('click', (event) => {
        if (event.target === event.currentTarget) {
            closeLightbox();
        }
    });

    // Fungsi untuk menutup lightbox
    function closeLightbox() {
        document.getElementById('lightboxA2').style.display = 'none';
        document.getElementById('popup-imageA2').style.display = 'none';
        document.getElementById('popup-videoA2').style.display = 'none';
    }
</script>

<!--Banner Utama-->
<script>
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dots button');
    const progressBar = document.querySelector('.progress-bar');

    function showSlide(index) {
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    
    // Ubah slide
    currentSlide = index;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');

    // Reset progress bar
    progressBar.style.width = '0';
    setTimeout(() => {
        progressBar.style.width = '100%';
    }, 100);

    // Reset dan retrigger animasi teks
    const content = slides[currentSlide].querySelectorAll('.content h2, .content p, .content a');
    content.forEach(element => {
        element.style.opacity = '0';  // Reset opacity ke 0
        element.style.transform = 'translateX(-100px)';  // Reset posisi awal ke kiri
        element.style.animation = 'none';  // Matikan animasi sebelumnya
        setTimeout(() => {
            element.style.animation = '';  // Aktifkan animasi kembali
        }, 10);
    });
}

// Fungsi untuk beralih ke slide berikutnya
function showNextSlide() {
    const nextSlide = (currentSlide + 1) % slides.length;
    showSlide(nextSlide);
}

// Event listener untuk dots (indikator slide)
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        showSlide(index);
    });
});

// Set interval untuk otomatis ganti slide setiap 10 detik
setInterval(showNextSlide, 10000); 

</script>


<!--Client-->
<script>
    // Ganti variabel track dengan nama yang lebih unik
    const clientTrack = document.querySelector('.client-slider-track');
    let clientCurrentSlide = 0;
    const clientTotalSlides = 3; // 3 slides, each containing 5 images

    // Ganti fungsi moveToNextSlide dengan nama yang lebih unik
    function clientMoveToNextSlide() {
        clientCurrentSlide = (clientCurrentSlide + 1) % clientTotalSlides; // Cycle back to the first slide after the last
        clientTrack.style.transform = `translateX(-${clientCurrentSlide * 100 / clientTotalSlides}%)`;
    }

    // Automatically move to the next slide every 3 seconds
    setInterval(clientMoveToNextSlide, 3000);
</script>


<!--Team-->
    <script>
        // JavaScript untuk transisi mobile
        if (window.innerWidth <= 768) {
            let currentIndex = 0;
            const cards = document.querySelectorAll('.team-card');
            const totalCards = cards.length;

            function showNextCard() {
                // Hilangkan class active dari card saat ini
                cards[currentIndex].classList.remove('active');

                // Hitung index card berikutnya
                currentIndex = (currentIndex + 1) % totalCards;

                // Tambahkan class active ke card berikutnya
                cards[currentIndex].classList.add('active');
            }

            // Interval untuk mengubah card setiap 4 detik
            setInterval(showNextCard, 4000);
        }
    </script>
    
 <!--CONTACT FORM --> 
    <script>
        document.querySelector(".contact-formCF").addEventListener("submit", function(event) {
            event.preventDefault();
            alert("Message Sent!");
        });
    </script>

 <!--NOTIF MENGAMBANG --> 
  <script>
    // Menampilkan notifikasi berdasarkan ID
    function showNotif(id) {
      const notifNT = document.getElementById(id);
      
      // Tampilkan notifikasi
      notifNT.style.display = 'block';

      // Setelah 3 detik, sembunyikan notifikasi
      setTimeout(() => {
        notifNT.style.display = 'none';
      }, 3000);
    }
  </script>

 <!--POPUP MAINTENANCE --> 
    <script>
        // Menampilkan popup saat halaman dimuat
        window.addEventListener("load", function() {
            const popup = document.getElementById('maintenance-popupMT');
            popup.classList.add('activeMT');
        });

        // Menutup popup saat tombol close diklik
        document.getElementById('close-popupMT').addEventListener('click', function() {
            const popup = document.getElementById('maintenance-popupMT');
            popup.classList.remove('activeMT');
        });

        // Menutup popup jika diklik di luar area popup
        document.getElementById('maintenance-popupMT').addEventListener('click', function(event) {
            if (event.target === this) {
                this.classList.remove('activeMT');
            }
        });
    </script>
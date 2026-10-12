
const gallery = document.getElementById("gallery");
const items = Array.from(
    document.querySelectorAll(".gallery-item")
);

const filterButtons = document.querySelectorAll(".filter-btn");
const emptyMessage = document.getElementById("emptyMessage");

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxTitle = document.getElementById("lightboxTitle");
const lightboxCounter = document.getElementById("lightboxCounter");

const closeBtn = document.getElementById("closeBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let visibleItems = [...items];
let currentIndex = 0;
let lastFocusedElement = null;

// Filter images by category
filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        const category = button.dataset.category;

        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        visibleItems = items.filter(item => {
            return category === "all" ||
                   item.dataset.category === category;
        });

        items.forEach(item => {
            item.hidden = !visibleItems.includes(item);
        });

        emptyMessage.hidden = visibleItems.length !== 0;

        // Close viewer if the selected image is filtered out
        if (lightbox.classList.contains("open")) {
            closeLightbox();
        }
    });
});

// Open image in lightbox
items.forEach(item => {
    item.addEventListener("click", () => {
        currentIndex = visibleItems.indexOf(item);

        if (currentIndex !== -1) {
            openLightbox();
        }
    });
});

function openLightbox() {
    if (visibleItems.length === 0) return;

    lastFocusedElement = document.activeElement;

    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    showImage(currentIndex);
    closeBtn.focus();
}

// Display selected image
function showImage(index) {
    const item = visibleItems[index];

    if (!item) return;

    const image = item.querySelector("img");

    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    lightboxTitle.textContent = item.dataset.title;

    lightboxCounter.textContent =
        `Image ${index + 1} of ${visibleItems.length}`;

    prevBtn.disabled = visibleItems.length <= 1;
    nextBtn.disabled = visibleItems.length <= 1;
}

// Show next image
function showNext() {
    if (visibleItems.length <= 1) return;

    currentIndex = (currentIndex + 1) % visibleItems.length;
    showImage(currentIndex);
}

// Show previous image
function showPrevious() {
    if (visibleItems.length <= 1) return;

    currentIndex =
        (currentIndex - 1 + visibleItems.length) %
        visibleItems.length;

    showImage(currentIndex);
}

// Close lightbox
function closeLightbox() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    lightboxImage.removeAttribute("src");

    if (lastFocusedElement) {
        lastFocusedElement.focus();
    }
}

// Button events
nextBtn.addEventListener("click", showNext);
prevBtn.addEventListener("click", showPrevious);
closeBtn.addEventListener("click", closeLightbox);

// Close when clicking the dark background
lightbox.addEventListener("click", event => {
    if (event.target === lightbox) {
        closeLightbox();
    }
});

// Keyboard navigation
document.addEventListener("keydown", event => {
    if (!lightbox.classList.contains("open")) return;

    if (event.key === "Escape") {
        closeLightbox();
    } else if (event.key === "ArrowRight") {
        showNext();
    } else if (event.key === "ArrowLeft") {
        showPrevious();
    }
});
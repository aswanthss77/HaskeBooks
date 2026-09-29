document.querySelectorAll('.book-card').forEach((book) => {
  book.addEventListener('click', () => {
    book.classList.add('is-selected');
  });
});

const menuToggle = document.querySelector('.menu-toggle');
const primaryNav = document.querySelector('#primary-nav');

if (menuToggle && primaryNav) {
  const setMenuOpen = (isOpen) => {
    primaryNav.classList.toggle('is-open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    menuToggle.textContent = isOpen ? '×' : '☰';
  };

  menuToggle.addEventListener('click', () => setMenuOpen(!primaryNav.classList.contains('is-open')));
  primaryNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenuOpen(false)));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setMenuOpen(false);
  });
}

const productGallery = document.querySelector('.product-gallery');

if (productGallery) {
  document.querySelectorAll('.gallery-arrow').forEach((arrow) => {
    arrow.addEventListener('click', () => {
      const direction = Number(arrow.dataset.galleryDirection);
      productGallery.scrollBy({ left: direction * productGallery.clientWidth * 0.85, behavior: 'smooth' });
    });
  });
}

const uploadInput = document.querySelector('#book-image');
const uploadZone = document.querySelector('.upload-zone');
const preview = document.querySelector('#cover-preview');
const uploadMessage = document.querySelector('#upload-message');
const bookForm = document.querySelector('#book-form');

function showBookCover(file) {
  if (!file) return;

  const isJpeg = ['image/jpeg', 'image/jpg'].includes(file.type);
  const isTooLarge = file.size > 5 * 1024 * 1024;
  if (!isJpeg || isTooLarge) {
    uploadMessage.textContent = !isJpeg ? 'Please select a JPEG image.' : 'Please select an image smaller than 5 MB.';
    uploadInput.value = '';
    preview.hidden = true;
    return;
  }

  uploadMessage.textContent = `${file.name} is ready to upload.`;
  preview.src = URL.createObjectURL(file);
  preview.hidden = false;
}

if (uploadInput) {
  uploadInput.addEventListener('change', () => showBookCover(uploadInput.files[0]));
  ['dragenter', 'dragover'].forEach((eventName) => uploadZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    uploadZone.classList.add('is-dragging');
  }));
  ['dragleave', 'drop'].forEach((eventName) => uploadZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    uploadZone.classList.remove('is-dragging');
  }));
  uploadZone.addEventListener('drop', (event) => {
    const droppedFile = event.dataTransfer.files[0];
    if (!droppedFile) return;
    const files = new DataTransfer();
    files.items.add(droppedFile);
    uploadInput.files = files.files;
    showBookCover(droppedFile);
  });
}

if (bookForm) {
  bookForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!bookForm.reportValidity()) return;
    document.querySelector('#form-toast').classList.add('is-visible');
  });
}

document.querySelectorAll('.book-card').forEach((book) => {
  book.addEventListener('click', () => {
    const bag = document.querySelector('.bag');
    const currentTotal = Number(bag.textContent) || 0;
    bag.textContent = String(currentTotal + 1).padStart(2, '0');
    book.classList.add('is-selected');
  });
});

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

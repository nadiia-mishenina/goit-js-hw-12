import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const gallery = document.querySelector('.gallery');

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

export function fetchGallery(data) {
  removeLoader();

  if (!data.hits || data.hits.length === 0) {
    gallery.insertAdjacentHTML(
      'beforeend',
      `<p class="no-results">No images found. Try another keyword!</p>`
    );
    return;
  }

  gallery.insertAdjacentHTML('beforeend', markupGallery(data));
  lightbox.refresh();
}

function markupGallery(data) {
  return data.hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
      <li class="gallery-item hvr-grow">
        <a class="gallery-link" href="${largeImageURL}">
          <figure class="gallery-figure">
            <img class="gallery-image" src="${webformatURL}" alt="${tags}" loading="lazy">
            <figcaption class="gallery-figcaption">
              <ul class="img-content-wrapper">
                <li>Likes<span>${likes}</span></li>
                <li>Views<span>${views}</span></li>
                <li>Comments<span>${comments}</span></li>
                <li>Downloads<span>${downloads}</span></li>
              </ul>
            </figcaption>
          </figure>
        </a>
      </li>`
    )
    .join('');
}

export function fetchLoader() {
  gallery.insertAdjacentHTML(
    'beforeend',
    `<div class='loader-wrapper'>
        <div class='loader'></div>
    </div>`
  );
}

export function removeLoader() {
  const loader = document.querySelector('.loader-wrapper');
  if (loader) loader.remove();
}

export function clearGallery() {
  gallery.innerHTML = '';
}

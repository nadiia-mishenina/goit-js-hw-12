import iziToast from 'izitoast';
import {
  EVENT_TYPE,
  MESSAGES,
  MESSAGES_BG_COLORS,
  showInfoMessage,
} from './js/helpers';
import { getGalleryData } from './js/pixabay-api';
import { fetchGallery } from './js/render-functions';

let queryString = '';
let currentPage = 1;
let evtType = '';

const IMAGE_MAX_COUNT = 15;

const form = document.querySelector('.form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more-btn');
const loaderWrapper = document.querySelector('.loader-wrapper');

form.addEventListener('submit', onSubmitForm);
loadMoreBtn.addEventListener('click', onLoadMoreClick);

async function onLoadMoreClick() {
  try {
    evtType = EVENT_TYPE.click;
    await renderGallery(queryString, currentPage);

    if (currentPage > 1) {
      const firstCard = document.querySelector('.gallery li');
      if (firstCard) {
        const { height } = firstCard.getBoundingClientRect();
        window.scrollBy({
          top: height * 2,
          left: 0,
          behavior: 'smooth',
        });
      }
    }
  } catch (error) {
    showInfoMessage(MESSAGES.exception + error, MESSAGES_BG_COLORS.orange);
  }
}

async function onSubmitForm(event) {
  try {
    event.preventDefault();
    const target = event.target;
    const search = target.elements.search.value.trim();

    evtType = EVENT_TYPE.submit;
    loadMoreBtn.classList.remove('visible');
    iziToast.destroy();

    if (queryString !== search) {
      gallery.innerHTML = '';
      queryString = search;
      currentPage = 1;
    }

    if (!search) {
      showInfoMessage(MESSAGES.info, MESSAGES_BG_COLORS.blue);
      gallery.innerHTML = '';
      return;
    }

    await renderGallery(queryString, currentPage);
    target.reset();
  } catch (error) {
    showInfoMessage(MESSAGES.exception + error, MESSAGES_BG_COLORS.orange);
  }
}

function showLoader() {
  if (loaderWrapper) loaderWrapper.style.display = 'flex';
}

function hideLoader() {
  if (loaderWrapper) loaderWrapper.style.display = 'none';
}

async function renderGallery(searchValue, page) {
  showLoader();

  try {
    if (searchValue === queryString && evtType === EVENT_TYPE.click) {
      currentPage += 1;
      page = currentPage;
    }

    const galleryData = await getGalleryData(searchValue, page);

    if (validateGalleryData(galleryData)) {
      const restOfImages = galleryData.totalHits - (page - 1) * IMAGE_MAX_COUNT;
      fetchGallery(galleryData);
      showHideBtn(restOfImages);
    }
  } catch (error) {
    showInfoMessage(MESSAGES.exception + error, MESSAGES_BG_COLORS.orange);
  } finally {
    hideLoader();
  }
}

function validateGalleryData(galleryData) {
  if (!galleryData) {
    gallery.innerHTML = '';
    return false;
  } else if (galleryData.totalHits === 0) {
    showInfoMessage(MESSAGES.warning, MESSAGES_BG_COLORS.red);
    gallery.innerHTML = '';
    return false;
  }
  return true;
}

function showHideBtn(imagesCount) {
  if (imagesCount <= IMAGE_MAX_COUNT) {
    loadMoreBtn.classList.remove('visible');
    showInfoMessage(MESSAGES.endOfSearch, MESSAGES_BG_COLORS.blue);
  } else {
    loadMoreBtn.classList.add('visible');
  }
}

import './sass/index.scss';
import { Notify } from 'notiflix';
import FetchApi from './js/search';
import { createGalleryEl } from './js/addPicturesCard';

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const fetchApi = new FetchApi();

form.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', loadMore);

async function onSearch(e) {
  e.preventDefault();
  resetGalery();
  fetchApi.resetPage();
  loadMoreBtn.classList.add('is-hidden');

  if (document.querySelector('.end-of-pages')) {
    deleteElement();
  }

  fetchApi.query = e.currentTarget.elements.searchQuery.value;

  if (fetchApi.query === '') {
    notFoundImagaes();
    form.reset();
    return;
  }

  const pictures = await fetchApi.fetchPicures();

  if (fetchApi.totalHits === 0) {
    notFoundImagaes();
  } else {
    onFoundImages(fetchApi.totalHits);
    renderMurkUp(pictures);
    loadMoreBtn.classList.remove('is-hidden');

    form.reset();
  }
}

async function loadMore() {
  try {
    fetchApi.incrementPage();

    const images = await fetchApi.fetchPicures();
    renderMurkUp(images);
    endOfPage();
    scroll();
  } catch (error) {
    console.log(error);
  }
}

function renderMurkUp(array) {
  gallery.insertAdjacentHTML('beforeend', createGalleryEl(array));
}

function notFoundImagaes() {
  Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

function onFoundImages(totalHits) {
  Notify.success(`Hooray! We found ${totalHits} images.`);
}

function resetGalery() {
  gallery.innerHTML = '';
}

function endOfPage() {
  const totalPage = Math.ceil(fetchApi.totalHits / fetchApi.per_page);
  if (totalPage === fetchApi.page) {
    loadMoreBtn.classList.add('is-hidden');
    notificationOfAndPages();
  }
}

function notificationOfAndPages() {
  const notif = document.createElement('p');
  notif.classList.add('end-of-pages');
  notif.textContent =
    "We're sorry, but you've reached the end of search results.";
  gallery.after(notif);
}

function deleteElement() {
  const text = document.querySelector('.end-of-pages');
  text.remove();
}

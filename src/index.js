import PictureApiService from './js/picture-api';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import galleryTpl from './templates/gallery-card.hbs';
import throttle from 'lodash.throttle';

Notiflix.Notify.init({
  position: 'left-top',
  // showOnlyTheLastOne: true,
});

// let lightbox = new SimpleLightbox('.gallery-item');
// console.log('galleryBox', lightbox);

const refs = {
  searchForm: document.querySelector('#search-form'),
  input: document.querySelector('input'),
  submitButton: document.querySelector('button'),
  loadMoreButton: document.querySelector('.load-more'),
  gallery: document.querySelector('.gallery'),
  loader: document.querySelector('.loader'),
};

// const cardHeight = '60px';     throttle(onScroll, 300)

refs.searchForm.addEventListener('submit', onSearch);
// refs.loadMoreButton.addEventListener('click', onClick);
window.addEventListener('scroll', throttle(onScroll, 300));

const pictureServise = new PictureApiService();

function onSearch(evt) {
  evt.preventDefault();
  console.log(evt.currentTarget.elements.searchQuery.value);
  pictureServise.query = evt.currentTarget.elements.searchQuery.value;
  pictureServise.resetPageNumber();
  cleanMarcUp();
  refs.loader.classList.remove('hidden');
  pictureServise.fetchPicture().then(data => {
    // console.log(!data.length && pictureServise.pageNumber === 2);
    // if (!data.length && pictureServise.pageNumber === 2) {
    //   console.log(!data.length);
    //   return;
    // }
    renderGallery(data);

    refs.loader.classList.add('hidden');
  });
}

function onClick() {
  pictureServise.fetchPicture().then(renderGallery);
}

function renderGallery(arrayObj) {
  if (!arrayObj) return;
  console.log(arrayObj);
  const marcUp = arrayObj.map(obj => galleryTpl(obj)).join(' ');
  console.log(marcUp);
  refs.gallery.insertAdjacentHTML('beforeend', marcUp);
  // let lightbox =
  new SimpleLightbox('.gallery-item', {
    captionsData: 'alt',
    captionDelay: 250,
  }).refresh();
  // console.log('open', lightbox);
  // lightbox

  // smoothScroll();
}

function cleanMarcUp() {
  refs.gallery.innerHTML = '';
}

function onScroll() {
  const documentRect = document.documentElement.getBoundingClientRect();
  console.log(documentRect.bottom);
  if (documentRect.bottom < document.documentElement.clientHeight + 140) {
    refs.loader.classList.remove('hidden');
    pictureServise
      .fetchPicture()
      .then(data => {
        // if (!data) {
        //   window.removeEventListener('scroll', onScroll);
        //   return;
        // }
        refs.loader.classList.add('hidden');
        renderGallery(data);
      })
      .catch();
  }
}

function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    // top: cardHeight * 2,
    behavior: 'smooth',
  });
}

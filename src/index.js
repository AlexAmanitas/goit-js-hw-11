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
  homeButton: document.querySelector('.home-btn'),
  footer: document.querySelector('.footer'),
};

// const cardHeight = '60px';     throttle(onScroll, 300)

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreButton.addEventListener('click', onClick);
refs.homeButton.addEventListener('click', onSmoothScroll);
refs.input.addEventListener('input', throttle(onInput), 300);
// window.addEventListener('scroll', onScroll);

const pictureServise = new PictureApiService();

function onSearch(evt) {
  evt.preventDefault();
  console.log(evt.currentTarget.elements.searchQuery.value);
  pictureServise.query = evt.currentTarget.elements.searchQuery.value;

  pictureServise.resetPageNumber();
  cleanMarcUp();
  refs.loader.classList.remove('hidden');
  pictureServise.fetchPicture().then(data => {
    renderGallery(data);

    refs.loader.classList.add('hidden');
    if (data) {
      refs.homeButton.classList.remove('hidden');
      refs.loadMoreButton.classList.remove('hidden');
      refs.loadMoreButton.removeAttribute('disabled');
      refs.submitButton.setAttribute('disabled', 'disabled');
    }
  });
}

function onClick() {
  refs.loader.classList.remove('hidden');
  pictureServise.fetchPicture().then(data => {
    renderGallery(data);
    if (data.length < 40) {
      refs.loadMoreButton.classList.add('hidden');
      refs.homeButton.classList.add('center');
      refs.loadMoreButton.setAttribute('disabled', 'disabled');
      refs.footer.classList.add('center');
      Notiflix.Notify.warning(
        "We're sorry, but you've reached the end of search results."
      );
    }
    refs.loader.classList.add('hidden');
  });
}

function renderGallery(arrayObj) {
  if (!arrayObj) return;
  console.log(arrayObj);
  const marcUp = arrayObj.map(obj => galleryTpl(obj)).join(' ');
  console.log(marcUp);
  refs.gallery.insertAdjacentHTML('beforeend', marcUp);

  let lightbox = new SimpleLightbox('.gallery-item', {
    captionsData: 'alt',
    captionDelay: 250,
  });
  lightbox.refresh();
}

function cleanMarcUp() {
  refs.gallery.innerHTML = '';
}

// function onScroll() {
//   setTimeout(() => {
//     const documentRect = document.documentElement.getBoundingClientRect();
//     console.log(documentRect.bottom);
//     if (documentRect.bottom < document.documentElement.clientHeight + 100) {
//       refs.loader.classList.remove('hidden');
//       pictureServise
//         .fetchPicture()
//         .then(data => {
//           // if (!data) {
//           //   window.removeEventListener('scroll', onScroll);
//           //   return;
//           // }
//           refs.loader.classList.add('hidden');
//           renderGallery(data);
//         })
//         .catch();
//     }
//   }, 500);
// }

function onSmoothScroll(evt) {
  evt.preventDefault();
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth',
  });
}

function onInput(evt) {
  refs.submitButton.removeAttribute('disabled');
  refs.footer.classList.remove('center');
  refs.homeButton.classList.remove('center');
}

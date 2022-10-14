import PictureApiService from './js/picture-api';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import galleryTpl from './templates/gallery-card.hbs';
import throttle from 'lodash.throttle';

const refs = {
  searchForm: document.querySelector('#search-form'),
  input: document.querySelector('input'),
  submitButton: document.querySelector('button'),
  gallery: document.querySelector('.gallery'),
  loader: document.querySelector('.loader'),
  homeButton: document.querySelector('.home-btn'),
};

refs.searchForm.addEventListener('submit', onSearch);
refs.homeButton.addEventListener('click', onSmoothScroll);
refs.input.addEventListener('input', throttle(onInput), 300);

let lightbox = null;
const pictureServise = new PictureApiService();

function onSearch(evt) {
  evt.preventDefault();
  pictureServise.query = evt.currentTarget.elements.searchQuery.value;
  fetchingQuery();
  refs.input.value = '';
}

function fetchingQuery() {
  observer.unobserve(refs.loader);
  pictureServise.resetPageNumber();
  cleanMarcUp();
  refs.loader.classList.remove('hidden');
  pictureServise
    .fetchPicture()
    .then(data => {
      if (!data) {
        refs.loader.classList.add('hidden');
        refs.submitButton.setAttribute('disabled', 'disabled');
        refs.homeButton.classList.add('hidden');
        return;
      }
      renderGallery(data);
      refs.loader.classList.add('hidden');
      refs.homeButton.classList.remove('hidden');
      refs.submitButton.setAttribute('disabled', 'disabled');
    })
    .catch(console.log);
}

function renderGallery(arrayObj) {
  if (!arrayObj) return;

  lightbox && lightbox.destroy();

  const marcUp = arrayObj.map(obj => galleryTpl(obj)).join(' ');
  refs.gallery.insertAdjacentHTML('beforeend', marcUp);

  lightbox = new SimpleLightbox('.gallery-item', {
    captionsData: 'alt',
    captionDelay: 250,
  });
  observer.observe(refs.loader);
}

function cleanMarcUp() {
  refs.gallery.innerHTML = '';
}

const options = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1,
};

const observer = new IntersectionObserver(observerCallback, options);

function observerCallback(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      refs.loader.classList.remove('hidden');
      pictureServise.fetchPicture().then(data => {
        if (!data || data.length === 0) {
          observer.unobserve(refs.loader);
          refs.loader.classList.add('hidden');
          return;
        }
        renderGallery(data);
        refs.loader.classList.add('hidden');
      });
    }
  });
}

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

// function onClick() {
//   refs.loader.classList.remove('hidden');
//   pictureServise.fetchPicture().then(data => {
//     renderGallery(data);
//     if (data.length < 40) {
//       // refs.loadMoreButton.classList.add('hidden');
//       refs.homeButton.classList.add('center');
//       // refs.loadMoreButton.setAttribute('disabled', 'disabled');
//       // refs.footer.classList.add('center');
//     }
//     refs.loader.classList.add('hidden');
//   });
// }

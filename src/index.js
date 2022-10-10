import Notiflix from 'notiflix';
import PictureApiService from './js/picture-api';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
// import galleryTpl from './templates/gallery-card.hbs';

const refs = {
  searchForm: document.querySelector('#search-form'),
  input: document.querySelector('input'),
  submitButton: document.querySelector('button'),
  loadMoreButton: document.querySelector('.load-more'),
  gallery: document.querySelector('.gallery'),
};

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreButton.addEventListener('click', onClick);

const pictureServise = new PictureApiService();

function onSearch(evt) {
  evt.preventDefault();
  console.log(evt.currentTarget.elements.searchQuery.value);
  pictureServise.query = evt.currentTarget.elements.searchQuery.value;
  pictureServise.resetPageNumber();
  pictureServise.fetchPicture();
}

function onClick() {
  pictureServise.fetchPicture();
}

pictureServise.fetchPicture().then(data => console.log(data.totalHits));

function renderGallery() {}

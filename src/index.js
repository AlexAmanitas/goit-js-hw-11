import Notiflix from 'notiflix';
import axios from 'axios';
import PictureApiService from './js/picture-api';

const API_KEY = '30451625-24b88a788a5d1862c6d5c9df8';
// const URL =
//   'https://pixabay.com/api/?key=' +
//   API_KEY +
//   '&q=' +
//   encodeURIComponent('red roses');
// $.getJSON(URL, function (data) {
//   if (parseInt(data.totalHits) > 0)
//     $.each(data.hits, function (i, hit) {
//       console.log(hit.pageURL);
//     });
//   else console.log('No hits');
// });

const refs = {
  searchForm: document.querySelector('#search-form'),
  input: document.querySelector('input'),
  submitButton: document.querySelector('button'),
};

refs.searchForm.addEventListener('submit', onSearch);

const pictureServise = new PictureApiService();

// async function request(req, pageNumber) {
//   const url1 = 'https://pixabay.com/api/?key=';
//   const url2 = `&image_type=photo&orientation=horizontal&safesearch=true&page=${pageNumber}&per_page=40`;
//   const data = await axios.get(`${url1}${API_KEY}&q=${req}${url2}`);
//   console.log(data);
// }

pictureServise.fetchPicture();

function onSearch(evt) {
  evt.preventDefault();
  console.log(evt.currentTarget.elements.searchQuery.value);
  pictureServise.query = evt.currentTarget.elements.searchQuery.value;
  pictureServise.fetchPicture(1);
}

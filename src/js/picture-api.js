import axios from 'axios';
import Notiflix from 'notiflix';

const API_KEY = '30451625-24b88a788a5d1862c6d5c9df8';

export default class PictureApiService {
  constructor() {
    this.searchQuery = '';
    this.pageNumber = 1;
  }

  async fetchPicture() {
    const base_url = 'https://pixabay.com/api/?';
    const searchParams = new URLSearchParams({
      key: API_KEY,
      q: this.searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: this.pageNumber,
      per_page: 40,
    });

    try {
      const data = await axios.get(`${base_url}${searchParams}`);
      // console.log(this, data);

      console.log(data.data.hits);
      if (!data.data.hits.length && this.pageNumber === 1) {
        console.log(!data.data.hits.length);
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }
      // if (data.data.hits.length < 40) {
      //
      //   return;
      // }
      if (this.pageNumber === 1) {
        Notiflix.Notify.info(`Hooray! We found ${data.data.totalHits} images.`);
      }
      this.pageNumber += 1;
      return data.data.hits;
    } catch {
      error => console.log(error);
    }
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }

  resetPageNumber() {
    this.pageNumber = 1;
  }
}

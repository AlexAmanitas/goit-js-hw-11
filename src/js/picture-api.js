import axios from 'axios';

const API_KEY = '30451625-24b88a788a5d1862c6d5c9df8';

export default class PictureApiService {
  constructor() {
    this.searchQuery = '';
    this.pageNumber = 1;
  }

  async fetchPicture() {
    const url1 = 'https://pixabay.com/api/?key=';
    const url2 = `&image_type=photo&orientation=horizontal&safesearch=true&page=${this.pageNumber}&per_page=40`;
    try {
      const data = await axios.get(
        `${url1}${API_KEY}&q=${this.searchQuery}${url2}`
      );
      this.pageNumber += 1;
      console.log(data);
    } catch {
      console.log(error);
    }
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}

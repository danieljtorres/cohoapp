import { axiosInstance } from '@/_plugins/axios.plugin'

const http = axiosInstance

export default {
  getAll () {
    return http.get('categories')
      .then(response => {
        if (response.data) return response.data.data
      }, error => {
        return Promise.reject(error);
      })
  },
  save (data) {
    return http.post('categories', data)
      .then(response => {
        if (response.data) return response.data.data
      }, error => {
        return Promise.reject(error);
      })
  },
  edit (data) {
    return http.put('categories', data)
      .then(response => {
        if (response.data) return response.data.data
      }, error => {
        return Promise.reject(error);
      })
  }
}
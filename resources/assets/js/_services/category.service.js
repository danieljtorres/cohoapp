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
  }
}
import { axiosInstance } from '@/_plugins/axios.plugin'

const http = axiosInstance

export default {
  getAll () {
    return http.get('working-activities')
      .then(response => {
        if (response.data) return response.data.data
      }, error => {
        return Promise.reject(error);
      })
  }
}
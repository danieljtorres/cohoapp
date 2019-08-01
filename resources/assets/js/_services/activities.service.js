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
  },
  save (data) {
    return http.post('working-activities', data)
      .then(response => {
        if (response.data) return response.data.data
      }, error => {
        return Promise.reject(error);
      })
  },
  edit (data) {
    return http.put('working-activities', data)
      .then(response => {
        if (response.data) return response.data.data
      }, error => {
        return Promise.reject(error);
      })
  }
}
import { axiosInstance } from '@/_plugins/axios.plugin'

const http = axiosInstance

export default {
  getAll() {
    return http.get('working-activities')
      .then(response => {
        if (response.data) return response.data.data
      }, error => {
        return Promise.reject(error);
      })
  },
  getActive(data) {
    return http.get('working-record/active', { params: data })
      .then(response => {
        if (response.data) return response.data.data
      }, error => {
        return Promise.reject(error);
      })
  },
  start(data) {
    return http.post('working-record', data)
      .then(response => {
        if (response.data) return response.data.data
      }, error => {
        return Promise.reject(error);
      })
  },
  end(data) {
    return http.post('working-record/end', data)
      .then(response => {
        if (response.data) return response.data
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
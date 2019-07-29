import { axiosInstance } from '@/_plugins/axios.plugin'

const http = axiosInstance

export default {
  getAdmins () {
    return http.get('users/admins')
      .then(response => {
        if (response.data) return response.data.data
      }, error => {
        return Promise.reject(error);
      })
  },
  getEmployees () {
    return http.get('users/employees')
      .then(response => {
        if (response.data) return response.data.data
      }, error => {
        return Promise.reject(error);
      })
  },
  getEmployeeReport (params) {
    return http.get('users/employees/report', { params: params })
      .then(response => {
        if (response.data) return response.data.data
      }, error => {
        return Promise.reject(error);
      })
  }
}
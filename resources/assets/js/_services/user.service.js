import { axiosInstance } from '@/_plugins/axios.plugin'

const http = axiosInstance

export default {
  saveAdmin (data) {
    return http.post('users/admins', data)
      .then(response => {
        if (response.data) return response.data.data
      }, error => {
        return Promise.reject(error);
      })
  },
  getAdmins () {
    return http.get('users/admins')
      .then(response => {
        if (response.data) return response.data.data
      }, error => {
        return Promise.reject(error);
      })
  },
  saveEmployee (data) {
    return http.post('users/employees', data)
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
  },
  edit (data) {
    return http.put('users', data)
      .then(response => {
        if (response.data) return response.data.data
      }, error => {
        return Promise.reject(error);
      })
  },
  delete (data) {
    return http.delete('users/admins', data)
      .then(response => {
        if (response.data) return response.data.data
      }, error => {
        return Promise.reject(error);
      })
  },
  getEmployeeReportToExcel (params) {
    window.open('/api/v1/users/employees/report/excel?'+Object.entries(params).map(e => e.join('=')).join('&'))
  }
}
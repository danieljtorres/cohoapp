import { axiosInstance } from '@/_plugins/axios.plugin'
var jwtDecode = require('jwt-decode');
var moment = require('moment');

const http = axiosInstance

export default {
  loginAdmin (data) {
    return http.post('admin/login', data)
      .then(response => {
        if (response.data) {
          localStorage.setItem('coho_token', JSON.stringify(response.data.token))
          localStorage.setItem('coho_user', JSON.stringify(response.data.user))
        }

        const tokenData = this.getDecodedToken()
        const authUser = this.getAuthUser()
        return { tokenData, authUser }
      })
      .catch(error => {
        return Promise.reject(error);
      })
  },
  loginEmployee (data) {
    return http.post('login', data)
      .then(response => {
        if (response.data) {
          localStorage.setItem('coho_token', JSON.stringify(response.data.token))
          localStorage.setItem('coho_user', JSON.stringify(response.data.user))
        }

        const tokenData = this.getDecodedToken()
        const authUser = this.getAuthUser()
        return { tokenData, authUser }
      })
      .catch(error => {
        return Promise.reject(error);
      })
  },
  getDecodedToken() {
    const token = JSON.parse(localStorage.getItem('coho_token'))
    
    if (token) {
      const decoded = jwtDecode(token.token)
      return decoded
    }

    return false
  },
  getAuthUser() {
    const authUser = JSON.parse(localStorage.getItem('coho_user'))
    if (authUser) {
      return authUser
    }

    return false
  },
  getWork() {
    const a = JSON.parse(localStorage.getItem('coho_work'))
    if (a) {
      return a
    }

    return false
  },
  stopWork() {
    localStorage.removeItem('coho_work')
    return true
  },
  isAuthenticaded() {
    const tokenData = this.getDecodedToken()
    const now = moment().unix()

    if (tokenData && tokenData.exp > now) {
      return true
    }

    return false
  },
  logout() {
    localStorage.removeItem('coho_token')
    localStorage.removeItem('coho_user')
    return true
  },
  logoutEmployee(data) {
    return http.post('stop-work', data)
      .then(response => {
        return response.data
      })
  }
}
import { axiosInstance } from '@/_plugins/axios.plugin'
var jwtDecode = require('jwt-decode');
var moment = require('moment');

const http = axiosInstance

export default {
  loginAdmin (loginData) {
    return http.post('admin/login', loginData)
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
  loginEmployee (loginData) {
    return http.post('login', loginData)
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
  logoutEmployee() {
    return http.post('logout', loginData)
      .then(response => {
        response.data.data
      })
  }
}
export default {
  namespaced: true,
  state: {
    authUser: false,
    workingDay: false,
    tokenData: false
  },
  mutations: {
    SET_TOKEN_DATA(state, playload) {
      state.tokenData = playload
    },
    SET_AUTH_USER(state, playload) {
      state.authUser = playload
    },
    SET_WORK(state, playload) {
      state.workingDay = playload
    }
  },
  actions: {
    async loginAdmin({ commit }, data) {
      try {
        const { tokenData, authUser } = await this.$sv.authService.loginAdmin(data)
        commit('SET_TOKEN_DATA', tokenData)
        commit('SET_AUTH_USER', authUser)
        return true
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async loginEmployee({ commit }, data) {
      try {
        const { tokenData, authUser } = await this.$sv.authService.loginEmployee(data)
        commit('SET_TOKEN_DATA', tokenData)
        commit('SET_AUTH_USER', authUser)
        return true
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async logoutAdmin() {
      this.$sv.authService.logout()
    },
    async logout() {
      return this.$sv.authService.logout()
    },
    async logoutEmployee() {
      try {
        const w = this.$sv.authService.getWork()
        await this.$sv.authService.logoutEmployee({ working_day_id: w.id })
        this.$sv.authService.stopWork()
        return true
      } catch (error) {
        return Promise.reject(error)
      }
    }
  }
}
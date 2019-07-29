export default {
  namespaced: true,
  state: {
    employees: [],
    report: [],
    admins: []
  },
  mutations: {
    SET_LIST(state, playload) {
      state[playload.type] = playload.data
    }
  },
  actions: {
    async getEmployees({ commit }, data) {
      try {
        const list = await this.$sv.userService.getEmployees()
        commit('SET_LIST', { type: 'employees', data: list })
        return true
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async getEmployeeReport({ commit }, data) {
      try {
        const report = await this.$sv.userService.getEmployeeReport(data)
        commit('SET_LIST', { type: 'report', data: report })
        return true
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async getAdmins({ commit }, data) {
      try {
        const list = await this.$sv.userService.getAdmins()
        commit('SET_LIST', { type: 'admins', data: list })
        return true
      } catch (error) {
        return Promise.reject(error)
      }
    }
  }
}
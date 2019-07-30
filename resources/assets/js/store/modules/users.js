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
    async saveEmployee({ dispatch }, data) {
      try {
        await this.$sv.userService.saveEmployee(data)
        await dispatch('getEmployees')
        return true
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async edit({ dispatch }, data) {
      try {
        await this.$sv.userService.edit(data)
        await dispatch('getEmployees')
        return true
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async getEmployees({ commit }) {
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
    async saveAdmin({ dispatch }, data) {
      try {
        await this.$sv.userService.saveAdmin(data)
        await dispatch('getAdmins')
        return true
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async getAdmins({ commit }) {
      try {
        const list = await this.$sv.userService.getAdmins()
        commit('SET_LIST', { type: 'admins', data: list })
        return true
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async delete({ dispatch }, data) {
      try {
        await this.$sv.userService.delete(data)
        await dispatch('getAdmins')
        await dispatch('getEmployees')
        return true
      } catch (error) {
        return Promise.reject(error)
      }
    }
  }
}
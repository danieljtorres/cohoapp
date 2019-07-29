export default {
  namespaced: true,
  state: {
    list: [],
    active: null
  },
  mutations: {
    SET_LIST(state, playload) {
      state.list = playload
    },
    SET_ACTIVE(state, playload) {
      state.active = playload
    }
  },
  actions: {
    async getAll({ commit }) {
      try {
        const list = await this.$sv.activityService.getAll()
        commit('SET_LIST', list)
        return true
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async getActive({ commit }) {
      try {
        const tokenData = this.$sv.authService.getDecodedToken()
        const active = await this.$sv.activityService.getActive({ working_day_id: tokenData.data.working_day.id })
        commit('SET_ACTIVE', active)
        return true
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async start({ commit }, data) {
      try {
        const tokenData = this.$sv.authService.getDecodedToken()
        data.working_day_id = tokenData.data.working_day.id
        const record = await this.$sv.activityService.start(data)
        commit('SET_ACTIVE', record)
        return true
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async end({ commit }, data) {
      try {
        const tokenData = this.$sv.authService.getDecodedToken()
        data.working_day_id = tokenData.data.working_day.id
        const record = await this.$sv.activityService.end(data)
        commit('SET_ACTIVE', null)
        return true
      } catch (error) {
        return Promise.reject(error)
      }
    }
  }
}
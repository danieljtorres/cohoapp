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
        const tokenData = this.$sv.authService.getWork()
        const active = await this.$sv.activityService.getActive({ working_day_id: tokenData.id })
        commit('SET_ACTIVE', active)
        return true
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async start({ commit }, data) {
      try {
        const tokenData = this.$sv.authService.getWork()
        data.working_day_id = tokenData.id
        const record = await this.$sv.activityService.start(data)
        commit('SET_ACTIVE', record)
        return true
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async end({ commit }, data) {
      try {
        const tokenData = this.$sv.authService.getWork()
        data.working_day_id = tokenData.id
        const record = await this.$sv.activityService.end(data)
        commit('SET_ACTIVE', null)
        return true
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async save({ dispatch }, data) {
      try {
        console.log(this.$sv.activityService)
        await this.$sv.activityService.save(data)
        await dispatch('getAll')
        return true
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async edit({ dispatch }, data) {
      try {
        await this.$sv.activityService.edit(data)
        await dispatch('getAll')
        return true
      } catch (error) {
        return Promise.reject(error)
      }
    },
  }
}
export default {
  namespaced: true,
  state: {
    list: []
  },
  mutations: {
    SET_LIST(state, playload) {
      state.list = playload
    }
  },
  actions: {
    async getAll({ commit }, data) {
      try {
        const list = await this.$sv.categoryService.getAll()
        commit('SET_LIST', list)
        return true
      } catch (error) {
        return Promise.reject(error)
      }
    }
  }
}
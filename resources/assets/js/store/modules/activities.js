export default {
  namespaced: true,
  state: {
    list: [{
      id: 1,
      name: 'Conducción',
      icon: 'swheel',
      quest: false
    }, {
      id: 2,
      name: 'Producción',
      icon: 'screw',
      quest: true
    }, {
      id: 3,
      name: 'Mantenimiento',
      icon: 'tools',
      quest: true
    }]
  },
  mutations: {
    SET_LIST(state, playload) {
      state.list = playload
    }
  },
  actions: {
    async getAll({ commit }, data) {
      try {
        const list = await this.$sv.activitiesService.getAll()
        commit('SET_LIST', list)
        return true
      } catch (error) {
        return Promise.reject(error)
      }
    }
  }
}
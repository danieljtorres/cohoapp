import Vue from 'vue'
import Vuex from 'vuex'
import modules from './modules'
import services from '@/_services'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export const store = new Vuex.Store({
  state: {
    drawer: true
  },
  mutations: {
    TOGGLE_DRAWER(state, value) {
      state.drawer = value !== undefined ? value : !state.drawer
    }
  },
  getters: {},
  actions: {},
  modules: modules,
  strict: debug
})

store.$sv = services

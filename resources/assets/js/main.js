import Vue from 'vue'
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'
import VueAxios from 'vue-axios'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import es from 'vee-validate/dist/locale/es';
import VeeValidate, { Validator } from 'vee-validate';
import moment from 'moment'
import 'moment/locale/es'
import 'vue2-daterange-picker/dist/vue2-daterange-picker.css'
import { axiosInstance } from '@/_plugins/axios.plugin'
import { Router } from '@/routes'
import { store } from '@/store'
import App from './App'
import DateTimePicker from 'vuetify-datetime-picker'
import 'vuetify-datetime-picker/src/stylus/main.styl'

Vue.config.productionTip = false

const requireComponent = require.context(
  './components',
  false,
  /App[A-Z]\w+\.(vue|js)$/
)

requireComponent.keys().forEach(fileName => {
  const componentConfig = requireComponent(fileName)

  const componentName = upperFirst(
    camelCase(
      fileName
        .split('/')
        .pop()
        .replace(/\.\w+$/, '')
    )
  )

  Vue.component(
    componentName,
    componentConfig.default || componentConfig
  )
})

Vue.use(VueAxios, axiosInstance)
Vue.use(Vuetify)

Vue.use(VeeValidate);
Vue.use(DateTimePicker)

Validator.localize('es', es);

moment.locale('es')
Vue.prototype.$moment = moment

const EventBus = new Vue();
Vue.prototype.$eventBus = EventBus

new Vue({
  el: '#app',
  router: Router,
  store,
  beforeCreate() {
    const tokenData = store.$sv.authService.getDecodedToken()
    const authUser = store.$sv.authService.getAuthUser()
    const wd = store.$sv.authService.getWork()
    store.commit('auth/SET_TOKEN_DATA', tokenData)
    store.commit('auth/SET_AUTH_USER', authUser)
    store.commit('auth/SET_WORK', wd)
  },
  render: h => h(App)
})
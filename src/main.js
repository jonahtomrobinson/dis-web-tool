// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import BootstrapVue from 'bootstrap-vue'
import VModal from 'vue-js-modal'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// Import custom CSS
import './assets/scss/layout.min.scss'
import './assets/scss/nav-bar.scss'

Vue.use(VModal, { dialog: true , dynamic: true})
Vue.use(BootstrapVue)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})


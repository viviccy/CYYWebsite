import Vue from "vue"
import App from "./App.vue"

//this will import index.js from 'router' folder to this main.js, which is the main file of this Vue project
import router from "./router"
import store from "./store"
import Vue2Editor from "vue2-editor"

import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"

Vue.use(Vue2Editor)

Vue.config.productionTip = false

// can also use something like createApp(App).mount('#app')
new Vue({
  //'router' here means this Vue project now will have the routing functions such as $route, <rounter-link>, etc
  router,

  store,
  render: (h) => h(App),
}).$mount("#app")

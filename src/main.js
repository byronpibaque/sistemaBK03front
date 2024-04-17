import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'

Vue.config.productionTip = false

/*--------------------REGISTER BOOTSTRAP---------------------------------*/
import {BootstrapVue, IconsPlugin} from "bootstrap-vue";
// Importar los archivos CSS de Bootstrap y BootstrapVue (el orden es importante)
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
// Haz que BootstrapVue esté disponible en todo tu proyecto
Vue.use(BootstrapVue);
// Opcionalmente, instale el plugin de componentes de iconos BootstrapVue
Vue.use(IconsPlugin);
/*-----------------------------------------------------------------------*/

axios.defaults.baseURL='https://sistemabk03-service.onrender.com/api/'; //RUTA DE ACCESO AL BACK
//axios.defaults.baseURL='http://localhost:20000/api/'; //RUTA DE ACCESO AL BACKEND

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')



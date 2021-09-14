import Vue from 'vue'
import Vuex from 'vuex'
import decode from 'jwt-decode'
import router from './router'


Vue.use(Vuex)

//Gestionar acceso al sistema

export default new Vuex.Store({
  state: {
    token: null,
    usuario: null
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
    },
    setUsuario(state, usuario) {
      state.usuario = usuario;
    }
  },
  actions: {
    //Permite almacenar token en el localStorage.
    guardarToken({ commit }, token) {
      commit("setToken", token)
      commit("setUsuario", decode(token))
      localStorage.setItem("token", token)
    },
    //Acceder sin ingresar credenciales.
    autoLogin({ commit }) {
      let token = localStorage.getItem("token");
      if (token) {
        commit("setToken", token);
        commit("setUsuario", decode(token));
      }
      router.push({ name: 'home' });
    },
    //Eliminar el token del localStorage.
    salir({ commit }) {
      commit("setToken", null)
      commit("setUsuario", null)
      localStorage.removeItem("token");
      router.push({ name: 'login' });
    }
  }
})

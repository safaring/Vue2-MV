import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    poster: ''
  },
  mutations: {
    changePoster(state,obj) {
      state.poster = obj.poster
    }
  }
})
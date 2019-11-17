import Vue from 'vue'
import Vuex from 'vuex'
// import api from '@/assets/js/api'

Vue.use(Vuex)
const defaultUser = {
    name: 'jeft'
}

export default new Vuex.Store({
    state: {
        user: defaultUser
    },
    getters: {
    },
    mutations: {
    },
    actions: {
    },
    modules: {
    }
})

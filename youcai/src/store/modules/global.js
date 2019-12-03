const moduleGL = {
    namespaced: true,
    state: {
        navTit: ''
    },
    getters: {},
    mutations: {
        setNavTit (state, payload) {
            state.navTit = payload ? payload.tit : ''
        }
    },
    actions: {}
}

export default moduleGL
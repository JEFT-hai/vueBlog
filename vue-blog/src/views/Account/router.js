export default {
    path: '/account/:type?',
    name:'account',
    component: () => import('./Account.vue'),
    meta: {
        login: false,
        title: '',
        noAside: true
    }
}
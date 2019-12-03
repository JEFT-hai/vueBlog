export default {
    path: '/',
    component: () => import('./master.vue'),
    children: [{
        path: '',
        name: 'index',
        component: () => import('./index.vue'),
        meta: {
            nav: {
                type: 'search'
            },
            keepAlive: true,
            scrollY: 0
        }
    }]
}
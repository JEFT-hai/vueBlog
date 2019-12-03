export default {
    path: '/shop',
    component: () => import('./master.vue'),
    children: [{
        path: '/',
        name: 'shop',
        component: () => import('./shop.vue'),
        meta: {
            nav: {
                type: 'searchOnly'
            },
            keepAlive: true
        }
    }]
}
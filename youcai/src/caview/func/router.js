export default {
    path: '/func',
    component: () => import('./master.vue'),
    children: [{
        path: 'search/:type?',
        name: 'search',
        component: () => import('./search.vue'),
        meta: {
            keepAlive: true
        }
    }]
}
export default {
    path: '/blog',
    component: () => import('./Master.vue'),
    children: [{
        path: '',
        name: 'blogMain',
        component: () => import('./Main.vue'),
        meta: {
            login: true,
            title: '博客主页'
        }
    }]
}
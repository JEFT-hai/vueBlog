let defaultPath = './'
export default {
  path: '/shop',
  component: () => import(defaultPath + 'Master.vue'),
  children: [
    {
      path: 'shopList',
      name: 'show_list',
      meta: { login: true, title: '附近优惠' },
      component: () => import('./ShopList')
    },
    {
      path: 'createShop',
      name: 'create_shop',
      meta: { login: true, title: '创建商户' },
      component: () => import('./CreateShop')
    },
    {
      path: 'neabryShop',
      name: 'neabry_shop',
      meta: { login: true, title: '附近商家' },
      component: () => import('./NeabryShop')
    },
    {
      path: 'modifyShop/:businessId',
      name: 'modify_shop',
      meta: { login: true, title: '修改商户' },
      component: () => import('./ModifyShop')
    },
    {
      path: 'lookShop',
      name: 'look_shop',
      meta: { login: true, title: '创建商户' },
      component: () => import('./LookShop')
    },
    {
      path: 'releaseDiscount/:businessId',
      name: 'release_discount',
      meta: { login: true, title: '发布优惠' },
      component: () => import('./ReleaseDiscount')
    },
    {
      path: 'businessHome/:businessId',
      name: 'business_home',
      meta: { login: true, title: '' },
      component: () => import('./BusinessHome')
    },
    {
      path: 'discountInfo/:id',
      name: 'discount_info',
      meta: { login: true, title: '' },
      component: () => import('./DiscountActivityInfo')
    },
  ]
}

let defaultPath = './'
export default {
  path: '/vote',
  component: () => import(defaultPath + 'Master.vue'),
  children: [{
      path: 'votePage',
      name: 'vote',
      meta: {
        keepAlive: false
      },
      component: () => import('./VoteList.vue'),
      children: [{ // 投票列表页
          path: 'voteList/:id',
          name: 'voteList',
          meta: {
            scrollY: 0,
            keepAlive: false,
            subAlive: true
          },
          component: () => import('./ItemVoteList.vue')
        },
        { // 投票排行
          path: 'voteState/:id',
          name: 'voteState',
          meta: {
            scrollY: 0,
            keepAlive: false,
            subAlive: true
          },
          component: () => import('./VoteState.vue')
        },
        { // 投票规则
          path: 'voteDetail/:id',
          name: 'voteDetail',
          meta: {
            keepAlive: false,
            subAlive: true
          },
          component: () => import('./voteDetail.vue')
        },
        { // 投票 横屏视频 详情
          path: 'voteHVideo/:postId/:id',
          name: 'voteHVideoDetail',
          meta: {
            keepAlive: false,
            subAlive: false,
            noNav: true
          },
          component: () => import('./videoH.vue')
        },
        { // 投票 竖屏视频 详情
          path: 'videoVote/:id',
          name: 'videoVote',
          meta: {
            login: true,
            title: '投票活动'
          },
          component: () => import('./videoVote.vue')
        }
      ]
    },
    {
      path: 'voteTransfer/:id',
      name: 'voteTransfer',
      meta: {
        keepAlive: true
      },
      component: () => import('./voteTransfer.vue')
    },
    {
      path: 'voteRevise/:id',
      name: 'voteRevise',
      meta: {
        keepAlive: true
      },
      component: () => import('./voteRevise.vue')
    }
  ]
}

<script>
export default {
  data () {
    return {
      memberState: '', // 表示群成员的退群状态 memberState表示是否被踢出群或者退群， 0表示正常，1表示退群，2表示移出群
      joinState: '', // 表示申请状态 2表示申请通过
      groupId: this.$route.params.id,
    }
  },
  computed: {
    /**
     * isGroupLeader 是否是群主
     */
    isGroupLeader () {
      let me = this
      let groupLeader = this.groupMember.filter((item) => {
        return item.memberRole === 2
      })[0]
      return groupLeader && groupLeader.userId === me.$store.state.user.userId
    },
    /**
     * isInGroup是否在群里面
     */
    isInGroup () {
      return this.isGroupLeader || this.joinState === 2 && this.memberState === 0
    },
    /**
     * myIsManager我是否为管理员
     */
    myIsManager () {
      let me = this
      let groupLeader = this.groupMember.filter((item) => {
        return item.memberRole === 1
      })[0]
      return groupLeader && groupLeader.userId === me.$store.state.user.userId
    }
  },
  mounted () {
    this.$share.close()
  },
  methods: {
    reviseGroup () { // 修改群资料
      let me = this
      me.$router.push({
        name: 'groupRevise',
        params: {
          id: this.$route.params.id
        }
      })
    },
    share () { // 分享
      let innerObj = {
        name: this.$route.name,
        objectId: this.groupId
      }
      this.$share.open(this.groupInfo, false, 'groupInfo', this.$router.currentRoute.fullPath, innerObj)
    },
    /**
     * goGroupMember去到群成员列表
     */
    goGroupMember () {
      let me = this
      me.$router.push({
        name: 'groupMemberList',
        params: {
          id: me.groupInfo.userGroupId
        }
      })
    },
    /**
    * goUser去到用户主页
    */
    goUser (item) {
      if (item.userId === this.$store.state.user.userId) { // 去到我的主页
        this.$router.push({ name: 'my' })
      } else { // 去到别人的主页
        this.$router.push({ name: 'discoverUser', params: { id: item.userId } })
      }
    },
  }
}
</script>


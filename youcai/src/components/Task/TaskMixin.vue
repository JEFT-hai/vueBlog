<script>
  import taskSign from '@/components/Task/TaskSign'
  import {mapState} from 'vuex'
  export default {
      data () {
          return {
            progress: null,
            signTabShow: false,
            currentDate: '',
            checkIn: {},
            taskPoint: 0,
            isSign: true,
            loginItem: {
                countOperate: 0,
                pointType: 5,
                progressArr: [
                { num: 1, code: 1 },
                { num: 2, code: 2 },
                { num: 3, code: 3 },
                { num: 4, code: 5 },
                { num: 5, code: 8 },
                { num: 6, code: 13 },
                { num: 7, code: 21 }
                ], // num是天数/次数 code是积分数
                unit: '天',
                isGetBox: false
            },
          }
      },
      components: {
        taskSign
      },
      computed: {
          ...mapState(['user']),
            signIndex() {
                let signNum = this.checkIn
                    ? this.isResetSign
                    ? 0
                    : this.isSign
                    ? this.checkIn.checkInType
                    : this.checkIn.checkInType + 1
                    : 0
                return signNum % 7
            },
            isResetSign() {
                // 是否断开签到
                if (this.checkIn && this.currentDate) {
                    return (
                    this.format.date(this.currentDate, 'yyyyMMdd') !==
                        this.format.date(
                        new Date(
                            this.format.getDate(this.checkIn.checkInDate).getTime() +
                            24 * 60 * 60 * 1000
                        ),
                        'yyyyMMdd'
                        ) && !this.isSign
                    )
                } else {
                    return false
                }
            }
      },
      watch: {
        signIndex(newV) {
            this.$set(this.loginItem, 'countOperate', newV)
            if ((newV === this.loginItem.progressArr.length - 1) && this.isSign) {
                this.$set(this.loginItem, 'isGetBox', true)
            }
        }
      },
      async activated() {
        await this.getTask()
        this.signTabShow = !this.getIsSign() && !this.hasShowToday()
      },
      methods: {
          getTask() {
            let me = this
            return new Promise((resolve, reject) => {
                me.api.get({
                    url: 'Task',
                    success: function(res) {
                        me.code = res.taskPoint
                        me.currentDate = res.currentDate
                        me.checkIn = res.checkIn
                        me.progress = res.progress
                        resolve()
                    },
                    error: function(err) {
                        me.$alert(err)
                        reject()
                    }
                })
            })
            },
            goFlowers() {
                this.$router.push({
                    name: 'flowersDetail'
                })
            },
            setSignTab(data) {
                this.signTabShow = data
            },
            signTask() {
                this.setSignTab(false)
                let me = this
                let data = {
                    CheckInType: me.signIndex
                }
                me.api.process({
                    url: 'Task',
                    data: data,
                    success: function() {
                        me.code += me.loginItem.progressArr[me.signIndex].code
                        let date = new Date()
                        me.checkIn = Object.assign({}, me.checkIn, {
                            checkInType: me.signIndex,
                            checkInDate: date,
                            createTime: date
                        })
                        me.getIsSign()
                        me.$router.push({
                            name: 'taskCenter'
                        })
                    }
                })
            },
            getIsSign() {
                let isSign = true
                if (!this.checkIn) {
                    isSign = false
                } else {
                    isSign =
                    this.format.date(this.checkIn.checkInDate, 'yyyy-MM-dd') ===
                    this.format.date(this.currentDate, 'yyyy-MM-dd')
                }
                this.isSign = isSign
                return this.isSign
            },
            hasShowToday() {
                const userIdVisitTime = `${this.format.id(
                    this.user.userId
                )}visitTaskTime`
                let visitTaskTime = localStorage.getItem(userIdVisitTime) || ''
                let hasShowToday = visitTaskTime
                    ? visitTaskTime === this.format.date(this.currentDate, 'yyyy-MM-dd')
                    : false
                localStorage.setItem(
                    userIdVisitTime,
                    this.format.date(new Date(), 'yyyy-MM-dd')
                )
                return hasShowToday
            }
            // addCode(code) {
            //     this.code += code
            // }
      }
  }
</script>


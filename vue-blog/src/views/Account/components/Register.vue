<template>
    <el-form ref='form' class="form" :model="formObj" :rules="rules" label-position="left">
        <div class="form-head">
            <span class='form-head-tip'>已有账号，去<i>登录</i></span>
            <span class="form-head-tit">注册</span>
        </div>
        <el-form-item prop='userName' ref='userName'>
            <span class="iconItem"><i class="iconfont iconLC_icon_user_fill_2"></i></span>
            <el-input clearable @keydown.native.enter="key($event, 'userName')" v-model="formObj.userName" placeholder='请输入用户名'></el-input>
        </el-form-item>
        <el-form-item prop="passwordR" ref='passwordR'>
            <span class="iconItem"><i class="iconfont iconmima"></i></span>
            <el-input class="password" :type="passwordRSee ? '' : 'password'" clearable @keydown.native.enter="key($event, 'passwordR')" v-model="formObj.passwordR" placeholder='请输入密码'></el-input>
            <i @click='passwordRSee=!passwordRSee' :class="['iconfont', 'toggleSee-icon', {'iconinvisiblebukejian': !passwordRSee}, {'iconvisiblekejian': passwordRSee}]"></i>
        </el-form-item>
        <el-form-item prop="passwordRC" ref='passwordRC'>
            <span class="iconItem"><i class="iconfont iconmima"></i></span>
            <el-input class="password" :type="passwordRCSee ? '' : 'password'" clearable @keydown.native.enter="key($event, 'passwordRC')" v-model="formObj.passwordRC" placeholder='请再次输入密码'></el-input>
            <i @click='passwordRCSee=!passwordRCSee' :class="['iconfont', 'toggleSee-icon', {'iconinvisiblebukejian': !passwordRCSee}, {'iconvisiblekejian' : passwordRCSee}]"></i>
        </el-form-item>
        <el-form-item prop="email" ref='email' :rules='rules.email'>
            <span class="iconItem"><i class="iconfont iconyouxiang"></i></span>
            <el-input clearable @keydown.native.enter="key($event, 'email')" v-model="formObj.email" placeholder='请输入邮箱地址'>
            </el-input>
        </el-form-item>
        <el-form-item prop="nickname" ref='nickname'>
            <span class="iconItem"><i class="iconfont iconxin"></i></span>
            <el-input clearable @keydown.native.enter="key($event, 'nickname')" v-model="formObj.nickname" placeholder='请输入昵称'></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click='register'>确认</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
export default {
    data () {
        var validatePass = (rule, value, callback) => {
            if (value === '') {
            callback(new Error('请输入密码'));
            } else {
            if (this.formObj.passwordRC !== '') {
                this.$refs.form.validateField('passwordRC');
            }
            callback();
            }
        };
        var validatePass2 = (rule, value, callback) => {
            if (value === '') {
            callback(new Error('请再次输入密码'));
            } else if (value !== this.formObj.passwordR) {
            callback(new Error('两次输入密码不一致!'));
            } else {
            callback();
            }
        };
        return {
            passwordRCSee: false,
            passwordRSee: false,
            formObj:{
                userName: '1234',
                passwordR: '1234',
                passwordRC: '1234',
                email: '1234@qq.com',
                nickname: '1234'
            },
            inputArr: ['userName', 'passwordR', 'passwordRC', 'email', 'nickname'],
            rules:{
                userName: [
                    { required: true, message: '请输入登录名称', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                passwordR: [
                    { required: true, message: '请输入登录密码', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' },
                    {validator: validatePass, trigger: 'blur'}
                ],
                passwordRC: [
                    { required: true, message: '请再次输入登录密码', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' },
                    {validator: validatePass2, trigger: 'blur'}
                ],
                email: [
                    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
                ],
                nickname: [
                    { required: true, message: '请输入昵称', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ]
            }
        }
    },
    methods:{
        key (e, name) {
            let index = e.shiftKey ? -1 : 1
            this.getInputIndex(name, index)
        },
        getInputIndex (name, index) {
            let curIndex = this.inputArr.indexOf(name)
            if (curIndex + 1 === this.inputArr.length && index === 1) {
                alert('最后')
                return
            }
            index = (this.inputArr.length + index + curIndex) % this.inputArr.length
            this.$refs[this.inputArr[index]].$el.querySelector('input').focus()
        },
        register () {
            let me = this
            me.$router.push({
                    name: 'blogMain'
                })
            // me.$.http({
            //     method: 'post',
            //     url: 'register',
            //     data: me.formObj
            // }).then((res) => {
            //     // eslint-disable-next-line
            //     console.log(res)
            // }).catch((err) =>{
            //     // eslint-disable-next-line
            //     const errMsg = err.toString()
            //     // eslint-disable-next-line
            //     console.log(err.response)
            //     // alert(JSON.stringify(err))
            //     me.$router.push({
            //         name: 'blogMain'
            //     })
            // })
        }
    }
}
</script>

<style lang='less'>
  .form{
      margin: 0 auto;
      .form-head{
          height: 60px;
          line-height: 60px;
          margin-bottom: 24px;
          overflow: hidden;
          color: #fff;
          .form-head-tit{
              display: block;
              text-align: left;
              margin-right: 180px;
              font-size: 30px;
          }
          .form-head-tip{
              float: right;
              width: 180px;
              text-align: right;
          }
      }
      .el-form-item{
            border: 1px solid hsla(0,0%,100%,.1);
            background: rgba(0,0,0,.1);
            border-radius: 5px;
            color: #454545;
          .el-form-item__content{
            height: 44px;
            box-sizing: border-box;
            position: relative;
            .toggleSee-icon{
                position: absolute;
                width: 40px;
                height: 40px;
                line-height: 40px;
                font-size: 16px;
                top:0;
                right: -40px;
                color: #fff;
            }
            .iconItem{
                float: left;
                width: 44px;
                height: 44px;
                line-height: 44px;
                text-align: center;
                overflow: hidden;
                .iconfont{
                    color: #fff;
                }
            }
            .el-input{
                display: block;
                height: 44px;
                line-height: 44px;
                margin-left: 44px;
                width: auto;
                .el-input__inner{
                    background-color: transparent;
                    outline: none;
                    border: none;
                    color: #fff;
                    caret-color: #fff;
                    padding: 0;
                    font-size: 16px;
                    padding-right: 40px;
                }
            }
            .el-button{
                width: 100%;
                height: 100%;
            }
          }
      }
  }
</style>

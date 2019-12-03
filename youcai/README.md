# 多录

## Project setup

```
npm install
```

### Compiles and hot-reloads for development(正式接口)

```
npm run serve
```

### Compiles and minifies for production(正式接口)

```
npm run build
```

### Compiles and minifies for testServe(测试接口)

```
npm run test
```

### Compiles and minifies for testBuild(测试接口)

```
npm run testB
```

### Lints and fixes files

```
npm run lint
```

## 内部版本

1. 只用手机号就可以登陆
2. 上传 video 的 cover && 展示 && 分享

## 要调整的地方

1. 将封装的 component 进行替换与补充,avatar, swiper, btnLike, postFullItem, waterfall...
2. 整理 discover,account 等页面
3. 整理疏通路由
4. 优化表单提交

### activity Home

## Plugin

### 1. this.$uploading, this.$success, this.\$error

用途：

1. 提交 Post 时的状态提示,
2. 防止多次提交
3. args (isShow, txt, dur) 是否显示 | 提示文字 | 显示的时间
4. 三种状态不能共存 uploading -> 上传中 success -> 上传成功 error -> 上传失败

#### this.\$uploading

用途：
上传时显示 loading

```
  eg: this.$uploading(true, '上传中...') // 没有dur, 让 success|error 来结束loading状态
```

#### this.\$success

用途：
上传成功时显示 success

```
  eg: this.$success(true, '上传成功', 500) // 要有dur, 不然会一直存在
```

#### this.\$error

用途：
上传失败时显示 error

```
  eg: this.$error(true, '上传失败', 500) // 要有dur, 不然会一直存在 // txt也可以不固定，从后端response中获取
```

### 2. this.\$confirm

用途：

1. 用于全局拦截 | 用户返回没有保存拦截
2. 分为两种模式 由 type 控制: alert | confirm
3. 参数为对象：{title('提示'), msg(''), type('alert'), alertBtnText('我知道了'), yesBtnText('确定'), noBtnText('取消'), hasMark(true)} (msg 可以为 DOM)

```
  eg:
  Vue.prototype.$confirm({
    title: '您必须先创建群组',
    msg: '才能发布活动',
    yesBtnText: '创建群组',
    type: 'confirm'
  }).then(() => {
    router.push({
      name: 'groupCreate'
    })
  }).catch(() => {
    // console.log('cancel')
  })
```

4. type: alert -> title、msg、alertBtnText、hasMask 生效, 点击 Btn 之后触发 resolve()也就是.then() => ...
5. type: confirm -> title、msg、yesBtnText、noBtnText、hasMask 生效，点击 yesBtnText 之后触发 resolve(),点击 noBtnText 之后触发 reject(),也就是.catch(() => ...)

### 3. this.$alert, this.$toast

#### this.\$alert

用途：
提示用户
参数：
text 提示的文字

#### this.\$toast

用途：
提示用户
参数：
text 提示的文字
dur: 显示的时间 | 1500

### 4. this.\$share

1. 用途：
   分享 App 中各个页面
2. 参数：
   item = null (Obj), isDelete = false (是否可删除), type = 'discover' (分享的类型), path = '' (页面网址), innerObj = '' (站内 Obj)
3. 方法：
   .open(args) // 调用
   .close() // 隐藏

### 5. this.\$operate

1. 用途：
   弹出一些功能选项
2. 参数 Obj
   type: saveImg | other
   title: '保存图片？': ''
   btnTxt: '',
   data: imgSrc | []
3.

```
  eg： // 保存图片
  this.$operate({data: data})
```

## 同一风格

### 防止重复提交

#### 小按钮

用 isLoading 来，显示是否是上传中
if (this.isLoading) {
return
}
通过 isLoading 来控制 btn 的 class
.fadeBtn.is_loading .iconfont | toggle\_\_button--isLoading

## android Methods

### 获取网络情况

android -> WanAndroid.getNetwork()
web -> this.setNetwork(netType) 0 none | 1 WIFI | 2 移动 | 3 2G 网络

### 上传图片类型

WanAndroid.imgCropType(0, 1)

0: 不传：1:1.33 || 1:1
1：活动横图 20:9
2：头像 1:1
3：长方形 1:1.33
4：空白
5：活动封面 9:16

### 聊天相关字段

#### ws 中的 state

socketStatus: socket 的连接状态(boolean) -> 用来判断是否连接上 socket

#### 会话列表

channelType: 0 个人 | 1 群组 -> 要根据该字段 抉择是否显示发送人名称
channelId: 会话 Id
channelName: 会话名称
channelAvatar: 会话头像
createTime: 最后一次会话的时间 -> 没有就显示 topTime
unCountRead: 未读消息数目
-> 清空聊天也存在以上字段
-> 清空聊天不存在以下字段 && 只有清空聊天情况能触发 以下内容为空
最后一条消息发送人字段：
senderId: 发送人 Id
senderAvatar: 发送人头像
senderName: 发送人名称
content: 消息的内容 string 要转 JSON, type: text 是文字
bg: 聊天背景
noInterrupt: 0 消息免打扰 默认 0
top: 0 是否置顶
topTime: null 置顶时间

#### 聊天内容

read: 是否已读 || 在聊天内都为已读
status: 发送状态 1 成功 | 0 失败 | 2 loading
createTime: 消息的时间
showTime: 0 不显示时间 | 1 显示时间
content: 消息的内容 string 要转 JSON, type: text 是文字
receiverId: 接收方 Id
receiverName: 接收方名称
receiverAvatar: 接收方头像
senderId: 发送方 Id
senderName: 发送方名称
senderAvatar: 发送方头像
-> 以下三个 Id 为标识 Id, 用作与后端交互
channelId: 当前会话频道的 id
imChatId: 单聊的唯一会话 Id
imGroupDetailChatId: 群聊的唯一会话 Id

#### 相关状态

ws 中：
summaryMsg: {
unCountRead integer(\$int32)
未读消息总数量

unCounttLaC integer(\$int32)
点赞与收藏

unCountNotice integer(\$int32)
通知

unCountComment integer(\$int32)
评论
}

#### 相关操作

- 以下函数 {channelId: channelId} payload 为 obj 形式

1. 设置未读已读
   upChannelMsgUnRead // 设为未读
   upChannelMsgRead 设为已读
2. 从会话列表删除某频道
   delChannelItem
3. 清空聊天记录
   delChannelMsg
4. 置顶聊天 {top: 1 置顶 || 0 取消置顶,channelId:channel.channelId }
   setChannelTop
5. 消息免打扰 {noInterrupt: 1 免打扰 || 0 默认打扰,channelId:channel.channelId }
   setChannelNoInterrupt
6. 设置聊天背景 {bg: 颜色 || url, e: input 的 change 事件接收的 e,channelId:channel.channelId,没有 channelId 是设置所有的聊天背景 }
   setChannelBg
7. 获取 channel 的设置信息
   getChannelSet

#### 页面更改

话题 评论图片改成方图 done
首页 Tab +号改成头像 done
默认头像都换成鹿的图片 done
评论表情换成字符表情 done
editor 判断 webp 格式的图片 done
回车发送消息 去掉回车 done
聊天的图片能保存 done
进入小助手页面 小助手自动发送消息 done

#### bug

自己的帖子不能转发 done

消息可能会有两张图片 做了拦截的 未知...
聊天 chatroom 页面滑动不到底部 渲染问题(好像较少触发)

#### 增加页面 / 新接口

话题 增加链接地址字段 done
话题 增加链接地址页面 done
聊天 获取历史 List 列表与单品频道消息 done
聊天 增加多录小助手 小助手自动说话(只说一次) done
个人中心 done
积分页面 done

#### 任务中心 调试

点赞 可以超过 10 个
开宝箱 failed

#### 小调整

自动转发不显示帖子作者 done
退登录要清除聊天消息数目 done
签到页面每天只显示一次 done
聊天室最后一条消息 不显示自己的 done
宝箱 x 换成+ done
转发自己的帖子不显示作者 done
task 页面按钮 显示深色 done
内部分享的群不对 done
内部分享后路由错误 done
task 点赞次数判断 done
开宝箱加声音 done
播放视频 切换 control 也切换返回/分享的显隐 done
增加注销账户功能 done
修复首次进入 groupInfo 卡死 done

## 新增任务

### 会员中心功能

会员等级 暂时不做
积分加速 暂时不做

头像挂件 页面 done
昵称颜色 关于 css 样式的换色基本完成(one span) 不做其余了 done
VIP身份外显 done
投票加倍
反馈优先
谁看过我
2 分钟视频笔记

积分兑换会员
这些页面都有详情介绍页面

### 修改

我的页面也能签到

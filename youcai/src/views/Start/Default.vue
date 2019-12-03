<template>
  <div id="startupimg"
       class="fadeIcon">
    <img :src="BASE_URL + 'assets/images/start.jpg'"
         :srcset="BASE_URL + 'assets/images/start@2x.jpg 2x'" />
  </div>
</template>

<script>
export default {
  created () {
    setTimeout(() => {
      this.$router.push({ name: 'index' })
    }, 1000)
    // let isLogIn = localStorage.getItem('Headers_Authorization')
    // if (isLogIn) {
    // } else {
    //   this.$router.push({ name: 'index' })
    // }
  },
  mounted () {
    // let me = this
    // eslint-disable-next-line
    // mui.plusReady(function () {
    //   // eslint-disable-next-line
    //   plus.geolocation.getCurrentPosition(function(position) {
    //     var currentLon = position.coords.longitude;
    //     var currentLat = position.coords.latitude;
    //   } ,function(e){
    //         mui.toast("异常:" + e.message);
    //   })
    // })
  }
}
</script>

<style>
#startupimg {
  position: absolute;
  z-index: 999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #fff;
  text-align: center;
  display: flex;
  justify-content: center;
  justify-items: center;
  align-content: center;
  align-items: center;
  position: absolute;
}
#startupimg img {
  width: 64vw;
  height: 64vw;
  /* width: 23vw;
  height: 23vw; */
  border-radius: 1vw;
  animation: fadeIcon 1.5s;
  will-change: opacity;
  margin-top: -20vh;
}
@keyframes fadeIcon
{
  0%   { opacity: 0;}
  50% { opacity: 1;}
  75% { opacity: 0;}
  100%   { opacity: 0;}
}
</style>

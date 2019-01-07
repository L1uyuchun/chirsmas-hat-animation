<!--// 点击帽子的灰点之后再touchmove之后才可旋转，点击帽子移动-->
<template>
  <div class="animation">
    <div
      class="headPhoto"
      @touchstart="touchstart"
      @touchmove="touchmove"
      @touchend="touchend"
      ref="headphoto"
    >
      <div class="headImg" :style="hatStyle" ref="headImg" v-if="headImgShow">
        <img
          class="headhat"
          :src="hatImg"
          alt=""
        >
        <span
          class="scaleBtn"
          @touchstart="scaletouchstart"
        ></span>
      </div>
      <input type="file" class="upload" ref="upload" @change="handleUpload($event)">
      <img
        class="imgShow"
        :src="imgUrl"
        alt=""
      >
    </div>
    <p class="warning" v-show="warningShow">请选择jpeg、png、jpg类型的图片</p>
    <button class="uploadBtn" @click="selectPhoto">上传头像</button>
    <button class="merge">生成头像</button>
    <p class="tips">选择帽子</p>
    <ul class="photoBox">

      <img
        class="photo"
        v-for="(item,index) in photos"
        :key="index"
        :src="item"
        @click="selectHat"
        :ref="index"
      />
    </ul>
    <div class="mergeResult">
      <img src="" alt="">
    </div>
  </div>
</template>

<script>
export default {
  name: 'animation',
  data () {
    return {
      photos: [require('@/assets/img/animation/chirsmas-hat1.png'), require('@/assets/img/animation/chirsmas-hat2.png'), require('@/assets/img/animation/chirsmas-hat3.png'), require('@/assets/img/animation/chirsmas-hat4.png'), require('@/assets/img/animation/chirsmas-hat1.png')],
      imgUrl: '',
      warningShow: false,
      hatImg: '',
      borderStyle: {
        border: 0
      },
      touch_lock: false,
      touch_scale_lock: false,
      hatStyle: {
        position: 'absolute',
        top: '3px',
        left: '50%',
        transform: 'rotate(0deg)'
      },
      lengthX: 0,
      lengthY: 0,
      startPoint: [],
      headImgShow: false
    }
  },
  methods: {
    handleUpload (event) {
      let img1 = event.target.files[0]
      let url = null
      if (img1.type.split('/')[1] === 'jpeg' || 'png' || 'jpg') {
        this.warningShow = false
        console.log(345)
        // basic
        if (window.createObjectURL !== undefined) {
          url = window.createObjectURL(img1)
        } else if (window.URL !== undefined) {
          // mozilla(firefox)
          url = window.URL.createObjectURL(img1)
        } else if (window.webkitURL !== undefined) { // webkit or chrome
          url = window.webkitURL.createObjectURL(img1)
        }
        this.imgUrl = url
      } else {
        console.log(456)
        this.imgUrl = ''
        this.warningShow = true
      }
    },
    selectPhoto () {
      console.log(123234)
      this.$refs.upload.click()
    },
    selectHat (e) {
      const dom = e.target
      const arr = []
      this.hatImg = dom.src
      this.headImgShow = true
      for (let key in this.$refs) {
        if (key !== 'upload' && key !== 'headphoto' && key !== 'headImg') {
          arr.push(this.$refs[key])
        }
      }
      arr.forEach((item) => {
        item[0].style.border = 0
      })
      dom.style.border = '1px solid #000'
    },
    // 获取元素距离页面的距离
    getPoint (obj) {
      let y = obj.offsetTop
      let x = obj.offsetLeft
      while (obj.offsetParent) {
        y += obj.offsetParent.offsetTop
        x += obj.offsetParent.offsetLeft
        obj = obj.offsetParent
      }
      return [x, y]
    },
    // 获取到div.headImg的上，左距离
    getEndPoint (e) {
      let startPoint = this.getPoint(this.$refs.headphoto)// 距离页面
      return [(e.touches[0].pageX - startPoint[0]), (e.touches[0].pageY - startPoint[1])]// 距离上边的距离
    },
    touchstart (e) {
      let endPoint = this.getEndPoint(e)
      if (endPoint[0] <= this.$refs.headImg.offsetLeft + 40 && endPoint[0] >= this.$refs.headImg.offsetLeft && endPoint[1] <= this.$refs.headImg.offsetTop + 40 && endPoint[1] >= this.$refs.headImg.offsetTop) {
        this.touch_lock = true
        console.log('move')
      }
    },
    scaletouchstart (e) {
      console.log('scale')
      this.touch_scale_lock = true
      this.startPoint = this.getEndPoint(e)
    },
    touchmove (e) {
      // clearTimeout(this.timer)
      if (this.touch_lock) {
        let touchPoint = this.getEndPoint(e)
        this.hatStyle = {
          left: (touchPoint[0] - 20) + 'px',
          top: (touchPoint[1] - 20) + 'px'
        }
      } else if (this.touch_scale_lock) {
        let iRotate = 0
        let disPoint = this.getPoint(this.$refs.headImg)// 距离页面的点
        console.log(disPoint)
        var a = e.touches[0].pageX - disPoint[0]
        var b = e.touches[0].pageY - disPoint[1]
        var c = Math.sqrt(a * a + b * b)
        if (a > 0 && b > 0) {
          iRotate = Math.asin(b / c) + 270 * Math.PI / 180
        } else if (a > 0) {
          iRotate = Math.asin(a / c) + 180 * Math.PI / 180
        }
        if (a < 0 && b > 0) {
          iRotate = -(Math.asin(b / c) + 270 * Math.PI / 180)
        } else if (a < 0) {
          iRotate = Math.asin(a / c) + 180 * Math.PI / 180
        }
        this.$refs.headImg.style.WebkitTransform = 'rotate(' + iRotate + 'rad)'
      }
    },
    touchend () {
      this.touch_lock = false
    }
  }
}
</script>

<style lang="stylus" scoped>
  .uploadBtn
    margin-left 70px
    margin-top 20px

  .headPhoto
    height 129px
    width 150px
    padding-top 21px
    border 1px solid #eee
    margin 0 auto
    text-align center
    font-size 14px
    position relative
    .upload
      position absolute
      top 0
      left 0
      width 100%
      height 100%
      visibility hidden

    .imgShow
      width 80%
      height 80%
      margin-top 15px
      margin 0 auto
      display block
      border-radius 50%
    .headImg
       height 40px
       width 40px
       position absolute
       margin-left -15px
       z-index 2
       border 1px solid #eee
       .headhat
          width 100%
          height 100%
          line-height 0
       .scaleBtn
          display block
          position relative
          width 10px
          height 10px
          background-color #eee
          bottom 8px
          right -36px
  .photoBox
    width 100%
    height 50px
    padding 0
    display flex
    flex-direction row
    justify-content space-between

    .photo
      display block
      width 30px
      height 30px
      border 1px solid #eee
</style>

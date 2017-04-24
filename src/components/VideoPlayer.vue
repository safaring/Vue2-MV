<template>
  <div class="videoplayer">
    <div id="player" @click="showControls">
      <div class="controls" v-show="controlShow">
        <a href="javascript:;" class="switch play" @click.stop="play" v-show="!isPlay"></a>
        <a href="javascript:;" class="switch pause" @click.stop="play" v-show="isPlay && !loading"></a>
        <div class="v-loading">
          <loading :loading="loading" :theme="'light'" :size="'.45rem'"></loading>
        </div>
        <a href="javascript:;" v-show="isPlayShow" class="full" @click.stop="setFullScreen"></a>
        <div class="progress" ref="progress" v-show="isPlayShow">
          <span class="offset" :style="{width: videoProgress}"></span>
          <a href="javascript:;" ref="drager" :style="{left: videoProgress}" class="drager"></a>
        </div>
        <div class="timer" v-show="isPlayShow">
          <span class="current">{{ currentTime }}</span> /
          <span class="total">{{ duration }}</span>
        </div>
      </div>
      <div class="cover" :style="video.poster | listCover" v-if="coverShow"></div>
      <video id="video" ref="video" v-if="isPlayShow" webkit-playsinline playsinline>
        <source :type="video.type" :src="video.source" />
      </video>
    </div>
  </div>
</template>

<script>
import api from '../api'
import Loading from '../components/Loading'

export default {
  name: 'videoplayer',
  props: ['videoPoster','videoSource','videoType'],
  data () {
    return {
      isPlay: false,
      isPlayShow: false,
      controlShow: true,
      coverShow: true,
      loading: false,
      currentTime: '00:00',
      duration: '00:00',
      videoProgress: 0,
      dragerX: 0,
      $video: undefined,
      $drager: undefined,
      $progress: undefined,
      controlShowTimer: undefined,
      video: {
        type: this.videoType,
        source: this.videoSource,
        poster: this.videoPoster
      }
    }
  },
  components: {
    Loading
  },
  beforeMount(){
    this.$root.$on('change-poster', (val)=>{
      if(this.videoPoster == ''){
        this.video.poster = val;
      }
    })

    this.$root.$on('change-source', (val)=>{
      if(this.videoSource == ''){
        this.video.source = val;
      }
    })
  },
  methods: {
    countMinutes(num) {
      return this.formatConversion(parseInt((num/60)))+':'+this.formatConversion(parseInt(num%60));
    },
    formatConversion(num) {
      if(num < 10){
        return '0'+num.toString();
      }
      return num;
    },
    init() {
      this.$video = this.$refs.video
      this.$video.play()
      this.loading = true

      this.$video.addEventListener('loadedmetadata',()=>{//当视频的元数据(时长、尺寸)已加载时
        this.duration = this.countMinutes(this.$video.duration);
        this.currentTime = this.countMinutes(this.$video.currentTime);
      })

      this.$video.addEventListener('canplay',()=>{//当浏览器能够开始播放视频时
        this.controlShow = false
        this.loading = false
      })

      this.$video.addEventListener('timeupdate',()=>{//当目前的播放位置已更改时
        this.currentTime = this.countMinutes(this.$video.currentTime);
        this.videoProgress = (this.$video.currentTime/this.$video.duration).toFixed(4)*100 + '%';
      })

      this.$video.addEventListener('waiting',()=>{//当视频由于需要缓冲下一帧而停止
        this.controlShow = true
        this.loading = true
      })

      this.$video.addEventListener('pause',()=>{//当视频已暂停时
        this.controlShow = true
        this.isPlay = false
      })

      this.$video.addEventListener('play',()=>{//当视频已开始或不再暂停时
        this.controlShow = false
        this.isPlay = true
      })

      this.$video.addEventListener('ended',()=>{//当目前的播放列表已结束时
        this.controlShow = true
        this.isPlay = false
      })

      this.pressMove()
    },
    play() {
      if(this.isPlay == false){
        this.isPlay = true
        
        if(this.isPlayShow == false){
          this.isPlayShow = true
          this.coverShow = false
          setTimeout(() => {
            this.init();
          },0)
        }else {
          this.$video.play()
          this.controlShow = false
        }

      }else {
        clearTimeout(this.controlShowTimer)
        this.controlShow = true
        this.$refs.video.pause()
        this.isPlay = false
      }
    },
    pressMove() {//拖动更改视频进度
      this.$drager = this.$refs.drager
      this.$progress = this.$refs.progress

      this.$drager.addEventListener('touchstart',(event)=>{
        clearTimeout(this.controlShowTimer)
        this.dragerX = event.targetTouches[0].clientX
      })

      this.$drager.addEventListener('touchmove',(event)=>{
        this.$video.pause()
        if(event.targetTouches[0].clientX < 0){
          this.videoProgress = 0
        }else if(event.targetTouches[0].clientX > this.$progress.offsetWidth){
          this.videoProgress = '100%'
        }else {
          this.videoProgress = (event.targetTouches[0].clientX/this.$progress.offsetWidth).toFixed(4)*100 + '%'
        }
        
      })

      this.$drager.addEventListener('touchend',(event)=>{
        var dragerTime = (event.changedTouches[0].clientX/this.$progress.offsetWidth).toFixed(4)*this.$video.duration
        this.currentTime = this.countMinutes(dragerTime)
        this.$video.currentTime = dragerTime.toFixed(0)
        this.$video.play()
      })

    },
    showControls() {
      clearTimeout(this.controlShowTimer)
      if(this.isPlay == true && !this.loading){
        if(this.controlShow == false){
          this.controlShow = true
          this.controlShowTimer = setTimeout(() => {
            this.controlShow = false
          },3000)
        }else {
          this.controlShow = false
        }
      } 
    },
    setFullScreen() {
      if(this.$video.webkitEnterFullscreen != undefined){
        this.$video.webkitEnterFullscreen()
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "src/style/base/variables";
@import "src/style/base/mixins";

%size {
  width: 100%;
  height: 5.5rem;
}

#player {
  position: fixed;
  background-color: #000;
  z-index: $zindex-player;
  top: 0;
  left: 0;
  @extend %size;
  .full {
    position: absolute;
    bottom: .3rem;
    right: .32rem;
    &:after {
      @include arrow(right,1px,rgba(255,255,255,.75),.2666rem);
    }
    &:before {
      @include arrow(left,1px,rgba(255,255,255,.75),.2666rem);
    }
  }
  .timer {
    position: absolute;
    bottom: .3rem;
    left: .3466rem;
    color: rgba(255,255,255,.75);
    font-size: .3733rem;
    line-height: 1;
  }
  .progress {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 9.64rem;
    height: 1px;
    &:before {
      content:"";
      position: absolute;
      left: 0;
      top: 0;
      width: 10rem;
      height: 1px;
      background-color: rgba(255,255,255,.75);
    }
    .offset {
      position: absolute;
      left: 0;
      top: 0;
      width: 0;
      height: 2px;
      background-color: rgba(193,13,12,.75);
      border-radius: 1px;
    }
    .drager {
      position: absolute;
      width: .36rem;
      height: .36rem;
      border-radius: 50%;
      background-color: rgba(193,13,12,1);
      bottom: -.18rem;
      left: 0;
    }
  }
  .cover {
    position: absolute;
    top: 0;
    left: 0;
    @extend %size;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }
  .controls {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    @extend %size;
    .v-loading {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
    }
    .switch {
      position: absolute;
      left: 50%;
      top: 50%;
      margin: -.8rem 0 0 -.8rem;
      width: 1.6rem;
      height: 1.6rem;
      background-color: rgba(0,0,0,.4);
      border: 1px solid #fff;
      border-radius: 50%;
      &:active {
        box-shadow: 2px 2px 6px rgba(255,255,255,.4), -2px -2px 6px rgba(255,255,255,.4);
      }
      &.play {
        &:before {
          content: '';
          position: absolute;
          left: 50%;
          top: 50%;
          margin: -.26rem 0 0 -.15rem;
          font-size: 0;
          line-height: 0;
          width: 0;
          height: 0;
          border: 0 dashed transparent;
          border-width: .3rem .5rem;
          border-left-style: solid;
          border-left-color: #fff;
        }
      }
      &.pause {
        &:before {
          content: '';
          position: absolute;
          left: 50%;
          top: 50%;
          width: .4rem;
          height: .6rem;
          margin: -.3rem 0 0 -.2rem;
          border: .1rem solid #fff;
          border-width: 0 .1rem 0;
        }
      }
    }
  }
}

#video {
  @extend %size;
}
</style>

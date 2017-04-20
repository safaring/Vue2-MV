<template>
  <div class="loading" v-if="loading">
    <div :class="{'m-loading':1,'m-loading-dark':theme=='dark','m-loading-light':theme=='light'}" :style="{fontSize: size}"> 
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'loading',
  props: ['loading','theme','size']
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.loading {
  text-align: center;
  padding: .3rem 0;
}
.m-loading {
    position: relative;
    display: inline-block;
    width: 2.3125em;
    height: 2.3125em;
    vertical-align: middle;
    font-size: .3rem;
    span {
      position: absolute;
      will-change: background-color;
      left: 1.10938em;
      bottom: 0;
      width: .09375em;
      height: .5em;
      border-radius: .2em;
      background-color: transparent;
      transform-origin: center -.65625em;
      -webkit-backface-visibility: hidden;
      @for $i from 1 to 13 {
        &:nth-child(#{$i}) {
          animation-delay: #{($i - 1)/10}s;
          transform: rotate(#{($i - 1)*30}deg)
        }
      }
  }
}

.m-loading-dark span {
    animation: loading-fade-dark 1.1s infinite linear
}

@keyframes loading-fade-dark {
    0% {
        background-color: rgba(0,0,0,.6)
    }

    100% {
        background-color: rgba(0,0,0,0)
    }
}

.m-loading-light span {
    animation: loading-fade-light 1.1s infinite linear
}

@keyframes loading-fade-light {
    0% {
        background-color: rgba(255,255,255,.6)
    }

    100% {
        background-color: rgba(255,255,255,0)
    }
}
</style>

<template>
  <div id="app">
    <!-- <transition name="router-slide" mode="out-in"> -->
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    <!-- </transition> -->
  </div>
</template>

<style lang="scss">
@import 'src/style/base';

// .router-slide-enter-active, .router-slide-leave-active {
//     transition: all .2s ease;
// }
// .router-slide-enter {
//     transform: translate3d(1rem, 0, 0);
//     opacity: .9;
// }

</style>

<template>
  <div class="list">
    <ul class="mvlist" v-infinite-scroll="fetchData" infinite-scroll-disabled="busy" infinite-scroll-distance="50">
      <li v-for="mv in mvList">
        <router-link :to="{ name: 'mv', params: { id: mv.id, poster: mv.cover, mvName: mv.name }}">
          <div class="cover" :style="mv.cover | listCover"></div>
          <h4>{{ mv.name }}</h4>
          <p>{{ mv.artistName }}</p>
          <span>{{ mv.playCount | numberConversion }}</span>
        </router-link>
      </li>
    </ul>
    <loading :loading="loading" :theme="'dark'"></loading>
  </div>
</template>

<script>
import api from '../api'
import Loading from '../components/Loading'
import infiniteScroll from 'vue-infinite-scroll'

export default {
  name: 'list',
  props: ['searchKeyword'],
  data () {
    return {
      mvList: [],
      offset: 0,
      busy: false,
      loading: false, 
      sKey: this.searchKeyword//组件内部不能直接修改prop的值
    }
  },
  beforeMount(){
    this.$root.$on('change-skey', val => {
      this.sKey = val
      console.log('---'+this.sKey)
      this.mvList = []
      this.offset = 0
      this.fetchData()
    })

    this.$root.$options.router.afterEach(route => {//通过router的变化，设置组件的infinite-scroll-disabled
      if(route.name == 'index'){
        this.busy = false
      }else {
        this.busy = true;
      }
    })
  },
  methods: {
    fetchData() {
      this.busy = true
      this.loading = true
      
      this.$http.get(api.getMvList(this.sKey,this.offset)).then(response => {
        if(response.data.result.mvs != undefined){
          this.mvList = this.mvList.concat(response.data.result.mvs)
          this.offset = this.mvList.length

          this.busy = false
          this.loading = false
        }else {
          this.loading = false
        }
           
      }, response => {
        console.log('error')
        this.busy = false
        this.loading = false
      })
    }
  },
  components: {
    Loading
  },
  directives: {
    infiniteScroll
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "src/style/base/variables";
@import "src/style/base/mixins";


.list {
  padding: .3rem 0 .8rem;
}

.mvlist {
  margin: 0 2%;
  li {
    position: relative;
    display: inline-block;
    width: 49%;
    margin: .2rem 0;
    &:nth-child(2n+1) {
      margin-right: 2%;
    }
    .cover {
      width: 100%;
      height: 2.4rem;
      background-position: center;
      background-repeat: no-repeat;
      background-size: 100%;
    }
    h4 {
      color: $gray-darker;
      font-weight: normal;
      font-size: 14px;
      @include line-clamp(1);
    }
    p {
      font-size: 12px;
      color: #999;
    }
    span {
      position: absolute;
      top: 5px;
      right: 10px;
      color: #fff;
      font-size: 12px;
    }
  }
}
</style>

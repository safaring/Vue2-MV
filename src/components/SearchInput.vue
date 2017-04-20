<template>
  <div class="search">
    <div class="search-wrapper">
      <form @submit.prevent="submit" action="">
        <input type="search" placeholder="搜索" v-model="searchKeyword" @keyup.enter="hideKeyboard($event)">
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'search',
  data () {
    return {
      searchKeyword: ''
    }
  },
  methods: {
    submit: function(){
      this.$root.$emit('change-skey',this.searchKeyword)
    },
    hideKeyboard: function(ev){
      ev.target.blur();
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.search-wrapper {
  padding: .25rem .3rem;
  background-color: #eee;
  input {
    border: 0;
    width: 100%;
    height: .9rem;
    border-radius: 20px;
    padding: 0 15px;
    text-align: center;
    &:focus {
      text-align: left;
    }
  }
}

</style>

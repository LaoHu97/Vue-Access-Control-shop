<template>
  <div>
    <keep-alive>
      <router-view v-if="!$route.meta.noCache"></router-view>
    </keep-alive>
    <router-view v-if="$route.meta.noCache"></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {
      children: null
    };
  },
  beforeRouteEnter: function(to, from, next) {
    next(vm => {
      let children = vm.$route.meta.children;
      if (children) {
        vm.children = children;
      } else {
        vm.children = null;
      }
    });
  },
  watch: {
    '$route': function(to, from) {
      let children = this.$route.meta.children;
      if (children) {
        this.children = children;
      } else {
        this.children = null;
      }
    }
  },
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    }
  }
};
</script>
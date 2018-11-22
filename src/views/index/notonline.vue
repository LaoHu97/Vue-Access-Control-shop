<template>
  <el-container style="height:100%">
    <el-header style="background: #fff;height:auto">
      <EleHeader @login="login" @logout="logout"></EleHeader>
    </el-header>
    <el-main>
      <div class="notonline_main">
        <h1>暂未开放，敬请期待</h1>
      </div>
    </el-main>
  </el-container>
</template>
<script>
  import {
    TagsView,
    EleHeader,
    ErrorPage
  } from '../../components'
  import CryptoJS from "crypto-js";
  import {
    modifyPassword,
    batchRemoveUser
  } from '../../api/shop';
  export default {
    components: {
      TagsView,
      EleHeader,
      ErrorPage
    },
    data() {
      return {

      };
    },
    methods: {
      //退出登录
      logout: function () {
        this.$emit("logout");
      },
      //重新获取路由
      login: function (newPath) {
        this.$emit("login", newPath);
      }
    }
  };

</script>
<style scoped lang="scss">
  .top_logo {
    width: 180px;
    float: left;
  }

  .top_logo img {
    width: 30%;
    margin-top: 19px;
    float: left;
  }

  .top_logo span {
    font-size: 18px;
    font-weight: bolder;
    color: #284890;
    line-height: 60px;
  }

  .notonline_main {
    text-align: center;
  }

  .el_menu_horizontal {
    border: none;
    float: right;
  }

</style>

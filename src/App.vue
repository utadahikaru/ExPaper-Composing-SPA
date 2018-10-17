<template>
  <section id="app">
    <div class="bqteam-header" v-if="currentPagePath !== '/auth/login'">
      <div class="bqteam-header-logo">
        <img src="/static/img/00-1.png" alt="logo">
      </div>
      <div class="bqteam-header-menu">
        <header-menu></header-menu>
      </div>
      <div class="bqteam-header-user">
        <span class="username">{{userName}}</span>
        <subject-selector></subject-selector>
        <button @click="logout">退出系统</button>
      </div>

      <div class="clearfix"></div>
    </div>
    <div class="bqteam-main">
      <div class="bqteam-main-wrap" v-loading.fullscreen.lock="fullscreenLoading">
        <router-view></router-view>
      </div>
    </div>
    <div class="bqteam-footer">
      <span>上海必乾信息科技有限公司</span>
    </div>
  </section>
</template>

<script>
import subjectSelector from "comp/subject-selector";

export default {
  name: "App",
  components: {
    subjectSelector
  },
  computed: {
    prePagePath: function() {
      return this.$store.state.app.prePagePath;
    },

    currentPagePath: function() {
      return this.$store.state.app.currentPagePath;
    },

    fullscreenLoading: function() {
      return this.$store.state.loading.loading;
    },

    userName() {
      let userInfo = this.$store.state.user.userInfo;
      return userInfo.roleName + "：" + userInfo.name;
    }
  },
  methods: {
    logout() {
      this.$store.commit("clearUserInfo");
      localStorage.clear();
      this.$router.push("/auth/login");
    }
  }
};
</script>
<style lang="scss" scoped>
.bqteam-header {
  position: absolute;
  z-index: 1000;
  top: 0;

  width: 100%;
  height: 58px;

  border-bottom: 8px solid rgba(45, 171, 226, 0.4);
  background-color: white;

  font-size: 0;
  .bqteam-header-logo {
    display: inline-block;

    width: 160px;
    height: 50px;
    padding: 0 50px;

    vertical-align: middle;
    @media screen and (max-width: 1366px) {
      width: 100px;
      padding: 0 20px;
    }
    img {
      width: 50px;
      height: 50px;
      margin-top: -4px;
    }
  }
  .bqteam-header-menu {
    display: inline-block;

    height: 58px;

    vertical-align: middle;
  }
  .bqteam-header-user {
    // vertical-align: middle;
    display: flex;
    float: right;
    align-items: center;

    height: 50px;
    button {
      display: inline-block;

      box-sizing: border-box;
      margin-right: 40px;
      padding: 0 30px;

      transition: 0.3s ease-out;
      text-decoration: none;

      color: rgba(45, 171, 226, 0.9);
      border: 2px solid rgba(45, 171, 226, 0.8);
      border-radius: 25px;
      outline: none;

      font-size: 16px;
      font-weight: 200;
      line-height: 30px;
      &:hover {
        color: #fff;
        background-color: rgba(45, 171, 226, 0.8);
      }
    }
  }
}

.bqteam-main {
  position: absolute;
  top: 0;
  bottom: 30px;

  width: 100%;

  background: url("/static/img/bg.jpg") no-repeat;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  .bqteam-main-wrap {
    position: relative;

    width: 100%;
    height: 100%;
    padding-top: 58px;

    background-color: rgba(255, 255, 255, 0.8);
  }
}

.bqteam-footer {
  position: absolute;
  bottom: 0;

  width: 100%;
  height: 30px;

  text-align: center;

  background-color: rgba(45, 171, 226, 0.8);
  span {
    color: rgb(121, 30, 30);

    font-size: 14px;
    line-height: 30px;
  }
}

.username {
  margin-right: 10px;

  color: darkslategrey;

  font-size: 14px;
}
</style>

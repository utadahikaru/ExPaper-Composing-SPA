<template>
  <ul>
    <div class="bqteam-sep"></div>

    <router-link v-for="menu in menus" v-if="menu.roleId.indexOf(currentRoleId) !== -1" :key="menu.id" :to="menu.link">
      <li>
        <img :src="menu.icon" />
        <span>{{menu.name}}</span>
      </li>
      <div class="bqteam-sep"></div>
    </router-link>
  </ul>
</template>
<script>
export default {
  name: "header-menu",
  data () {
    return {
      menus: [
        {
          link: "/home",
          name: "首页",
          icon: "/static/img/icon/home.svg",
          roleId: [1, 2, 3, 4]
        },
        {
          link: "/zjk/paperManagement",
          name: "组卷库",
          icon: "/static/img/icon/sj.svg",
          roleId: [3, 4]
        },
        {
          link: "/xmb/xmbManagement",
          name: "细目表",
          icon: "/static/img/icon/quan.svg",
          roleId: [3, 4]
        },
        {
          link: "/xtk/exerciseManagement",
          name: "习题库",
          icon: "/static/img/icon/xt.svg",
          roleId: [3, 4]
        },
        {
          link: "/zsk",
          name: "知识库",
          icon: "/static/img/icon/idea1.svg",
          roleId: [3]
        },
        {
          link: "/jsgl/teacherManagement",
          name: "教师管理",
          icon: "fa fa-file-pdf",
          roleId: [3]
        },
        {
          link: "/admin/subjectManagement",
          name: "学科管理",
          icon: "fa fa-file-pdf",
          roleId: [1, 2]
        },
        {
          link: "/admin/userManagement",
          name: "用户管理",
          icon: "fa fa-file-pdf",
          roleId: [1, 2]
        },
        {
          link: "/grzx",
          name: "个人中心",
          icon: "/static/img/icon/user1.svg",
          roleId: [1, 2, 3, 4]
        }
      ]
    }
  },

  computed: {
    currentRoleId () {
      let id = this.$store.state.user.userInfo.roleId
      return id !== undefined ? id : 0
    }
  }
}
</script>

<style lang="scss" scoped>
ul {
  list-style: none;
  height: 58px;
  margin: 0;
  padding: 0;
  text-align: center;
  li {
    float: left;
    width: 110px;
    height: 58px;
    font-size: 0;
    span {
      line-height: 50px;
      font-size: 16px;
      font-weight: 200;
      color: rgba(45, 171, 226, 0.9);
      vertical-align: middle;
    }
    img {
      width: 16px;
      height: 16px;
      vertical-align: middle;
    }
    &:hover {
      span {
        font-size: 18px;
      }
      img {
        width: 18px;
        height: 18px;
      }
      border-bottom: rgba(45, 171, 226, 0.8) 8px solid;
    }
    @media screen and (max-width: 1366px) {
      width: 90px;
      img {
        display: none;
      }
    }
  }
}
.bqteam-sep {
  float: left;
  width: 1px;
  height: 50px;
  background: #eeeeee;
}
.router-link-active li {
  span {
    font-size: 18px;
  }
  img {
    width: 18px;
    height: 18px;
  }
  border-bottom: rgba(45, 171, 226, 0.8) 8px solid;
}
</style>


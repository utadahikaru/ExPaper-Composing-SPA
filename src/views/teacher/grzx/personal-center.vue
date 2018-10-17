<template>
  <div class="bqteam-main-wrap-inner">
    <el-tabs v-model="activeTab">
      <el-tab-pane label="个人信息" name="1">
        <personal-information></personal-information>
      </el-tab-pane>
      <el-tab-pane label="密码修改" name="2">
        <password-change></password-change>
      </el-tab-pane>
      <el-tab-pane label="统计分析" name="3">
        <stats-personal v-if="activeTab === '3'"></stats-personal>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>


<script>
import personalInformation from "./components/personal-information"
import passwordChange from "./components/password-change"
import statsPersonal from "./components/stats-personal"
export default {
  components: {
    personalInformation,
    passwordChange,
    statsPersonal
  },
  data () {
    return {
      activeTab: "1"
    };
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
</style>
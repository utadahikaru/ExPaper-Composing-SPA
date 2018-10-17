<template>
  <!-- 组卷管理 -->
  <div class="bqteam-main-wrap-inner">
    <el-tabs v-model="activeTab" @tab-click="switchTab">
      <el-tab-pane label="公开组卷" name="1">
        <paper-set></paper-set>
      </el-tab-pane>
      <el-tab-pane label="我的组卷" name="2">
        <paper-mine></paper-mine>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import paperSet from "./components/paper-set";
import paperMine from "./components/paper-mine";

export default {
  components: {
    paperSet,
    paperMine
  },
  data () {
    return {
      activeTab: '1',
    }
  },
  mounted () {
    this.activeTab = this.$store.state.tab.paperPageTab
  },
  methods: {
    switchTab (tab, event) {
      this.$store.commit('setPaperPageTab', tab.name)
    }
  }
};
</script>

<style lang="scss" scoped>
</style>



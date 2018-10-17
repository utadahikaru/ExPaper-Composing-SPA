<template>
  <div class="bqteam-main-wrap-inner">
    <el-tabs v-model="activeTab" @tab-click="switchTab">
      <el-tab-pane label="公开细目表" name="1">
        <xmb-set ref="xmbMine"></xmb-set>
      </el-tab-pane>
      <el-tab-pane label="我的细目表" name="2">
        <xmb-mine></xmb-mine>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import xmbSet from './components/xmb-set'
import xmbMine from './components/xmb-mine'
export default {
  components: {
    xmbSet,
    xmbMine
  },
  data () {
    return {
      activeTab: '1'
    }
  },
  mounted () {
    this.activeTab = this.$store.state.tab.xmbPageTab
  },
  methods: {
    switchTab (tab, event) {
      this.$store.commit('setXmbPageTab', tab.name)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

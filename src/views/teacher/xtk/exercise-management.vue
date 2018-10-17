<template>
  <!-- 组卷管理 -->
  <div class="bqteam-main-wrap-inner">


      <el-tabs v-model="activeTab">
        <el-tab-pane label="习题查看" name="1">
          <exercise-view ref="paperMine"></exercise-view>
        </el-tab-pane>
        <el-tab-pane label="录入题目" name="2">
          <exercise-create ref="paperCreate"></exercise-create>
        </el-tab-pane>
      </el-tabs>


  </div>
</template>

<script>
import exerciseView from './components/exercise-view'
import exerciseCreate from './components/exercise-create'

export default {
  components: {
    exerciseView,
    exerciseCreate
  },
  data () {
    return {
      activeTab: '1'
    }
  },
  mounted () {
    this.activeTab = this.$store.state.tab.exercisePageTab
  },
  methods: {
    switchTab (tab, event) {
      this.$store.commit('setExercisePageTab', tab.name)

    }
  }
}
</script>

<style lang="scss" scoped>
</style>


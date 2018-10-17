<template>
  <!-- 组卷管理 -->
  <div class="bqteam-main-wrap-inner">
    <el-tabs class="tab" v-model="activeTab" @tab-click="switchTab">
      <el-tab-pane label="试卷类型" name="1">
        <paper-type></paper-type>
      </el-tab-pane>
      <el-tab-pane label="题目类型" name="2">
        <exercise-type></exercise-type>
      </el-tab-pane>
      <el-tab-pane label="知识点" name="3">
        <knowledge ref="knowledge"></knowledge>
      </el-tab-pane>
      <el-tab-pane label="教材章节" name="4">
        <textbook ref="textbook"></textbook>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import knowledge from './components/knowledge'
import textbook from './components/textbook'
import paperType from './components/paper-type'
import exerciseType from './components/exercise-type'
import grade from './components/grade'

export default {
  components: {
    knowledge,
    textbook,
    paperType,
    exerciseType,
    grade
  },
  data () {
    return {
      activeTab: '1'
    }
  },
  methods: {
    switchTab (tab, event) {
      switch (tab.name) {
        case '3':
          this.$refs.knowledge.highLigthCurrentKnowledge()
          break;
        case '4':
          this.$refs.textbook.highLigthCurrentBook()
          break
        default:
          break;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.tab {
  height: 100%;
}
</style>


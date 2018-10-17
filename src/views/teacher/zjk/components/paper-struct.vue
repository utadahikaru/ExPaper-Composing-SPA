<template>
  <div>
    <div class="paper-struct">试卷结构设置</div>
    <div class="paper-struct-top">
      <label class="radio"><input type="radio" value="default" v-model="paperStructAuto" /> 试卷</label>
      <label class="radio"><input type="radio" value="homework" v-model="paperStructAuto" /> 作业</label>
      <label class="radio"><input type="radio" value="quiz" v-model="paperStructAuto" /> 测验</label>
    </div>
    <div class="paper-struct-top">
      <label class="radio"><input type="checkbox" value="secrecyMark" v-model="paperStructCustom" /> 保密标志</label>
      <label class="radio"><input type="checkbox" value="headline" v-model="paperStructCustom" /> 大标题</label>
      <label class="radio"><input type="checkbox" value="subhead" v-model="paperStructCustom" /> 副标题</label>
      <label class="radio"><input type="checkbox" value="paperInfo" v-model="paperStructCustom" /> 考试信息</label>
      <label class="radio"><input type="checkbox" value="studentInfo" v-model="paperStructCustom" /> 学生信息</label>
      <label class="radio"><input type="checkbox" value="scoreTable" v-model="paperStructCustom" /> 分数栏</label>
      <label class="radio"><input type="checkbox" value="announcements" v-model="paperStructCustom" /> 注意事项</label>
      <label class="radio"><input type="checkbox" value="titleTypeScore" v-model="paperStructCustom" /> 大题评分区</label>
      <label class="radio"><input type="checkbox" value="titleType" v-model="paperStructCustom" /> 大题</label>
      <label class="radio"><input type="checkbox" value="score" v-model="paperStructCustom" /> 分数</label>
      <label class="radio"><input type="checkbox" value="space" v-model="paperStructCustom" /> 答题区</label>
    </div>
    <div class="cutline"></div>
    <div class="paper-struct-top">
      答案与解析&nbsp;&nbsp;&nbsp;
      <label class="radio"><input type="radio" value="end" v-model="paperAnswerStyle" /> 尾页</label>
      <label class="radio"><input type="radio" value="inside" v-model="paperAnswerStyle" /> 题后</label>
      <label class="radio"><input type="radio" value="none" v-model="paperAnswerStyle" /> 无</label>
    </div>
  </div>
</template>

<script>
export default {
  name: 'papreStruct',
  data () {
    return {
      paperStructAuto: 'default',
      paperStructCustom: [],
      paperStructDefault: ['secrecyMark', 'headline', 'subhead', 'paperInfo', 'studentInfo', 'scoreTable', 'announcements', 'titleTypeScore', 'titleType', 'score', 'space'],
      paperStructHomework: ['titleType'],
      paperStructQuiz: ['headline', 'studentInfo', 'titleType', 'score', 'space'],
      paperAnswerStyle: 'end'
    }

  },
  mounted: function () {
    this.paperStructCustom = this.paperStructDefault
  },
  watch: {
    'paperStructAuto' () {
      switch (this.paperStructAuto) {
        case 'homework':
          this.paperStructCustom = this.paperStructHomework
          break
        case 'quiz':
          this.paperStructCustom = this.paperStructQuiz
          break
        default:
          this.paperStructCustom = this.paperStructDefault
          break

      }
      this.$store.commit('setPaperStructCustom', this.paperStructCustom)
    },

    'paperStructCustom' () {
      this.$store.commit('setPaperStructCustom', this.paperStructCustom)
    },

    'paperAnswerStyle' () {
      this.$store.commit('setAnswerStyle', this.paperAnswerStyle)
    }
  },
}
</script>

<style lang="scss" scoped>
.paper-struct {
  padding: 10px;

  border-top: $border-solid;
  background: #eee;

  &-top {
    display: flex;
    align-items: center;
    flex-wrap: wrap;

    margin: 5px 10px;

    font-size: 14px;
  }
}

.cutline {
  margin: 0 10px;
  border-top: $border-dashed;
}

.radio {
  margin: 4px 10px 4px 0;
}

el-radio {
  margin-left: 10px;
}
</style>


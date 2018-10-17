<template>
  <div>
    <div class="exercise-refresh">
      <el-button icon="el-icon-refresh" type="text" :disabled="pageNum >= pages" @click="refreshExercise">换一批</el-button>
    </div>

    <!-- 小题列表 -->
    <div class="exercise-box" v-loading="loading">
      <div v-for="(exercise, index) in exerciseList" :key="index">
        <exercise :exercise="exercise" :inPaper="false" :shouldCorrect="false" :shouldCollect="false" v-on:updateExerciseList="replaceExercise(exercise)" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "paper-replace",
  data () {
    return {
      exerciseList: [],
      loading: false,
      pageNum: 1,// 当前第几页
      pages: 1// 总页数
    }
  },
  props: {
    params: {
      type: Object,
      default: function () {
        return {
          exerciseNumber: '',
          exerciseGrade: 7,
          exerciseSubject: this.$store.getters.getSubject(),
          exerciseType: 0,
          knowledgeNumber: '',
          bookNumber: ''
        }
      }
    },

    index: {
      type: Object,
      default: function () {
        return {
          typeIndex: 0,
          index: 0
        }
      }
    },

    open: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    open () {
      if (this.open === true) {
        this.searchExercise()
      }
    }
  },
  mounted () {
    this.searchExercise()
  },
  methods: {
    searchExercise () {
      this.loading = true

      let data = {
        exerciseGrade: this.params.exerciseGrade,
        exerciseSubject: this.params.exerciseSubject,
        exerciseType: this.params.exerciseType,
        knowledgeNumber: this.params.knowledgeNumber,
        bookNumber: this.params.bookNumber,
        pageSize: 10,
        pageNum: this.pageNum
      }

      this.getRequest(this.httpUrl.exercise, data).then(response => {
        this.loading = false
        this.pages = response.data.pages

        this.exerciseList.length = 0
        response.data.list.forEach(exercise => {
          // 排除当前题目
          if (exercise.exerciseNumber !== this.params.exerciseNumber) {
            this.exerciseList.push(exercise)
          }
        })
      }).catch(error => {
        this.loading = false
      })
    },

    refreshExercise () {
      this.pageNum++
      this.searchExercise()
    },

    replaceExercise (exercise) {
      this.$emit('hideReplaceDialog')
      this.$store.commit('replaceExercise', { oldExerciseNumber: this.params.exerciseNumber, newExercise: exercise, index: this.index })
      this.$store.dispatch('updatePaper')
    }
  }
}
</script>

<style lang="scss" scoped>
.exercise-box {
  max-height: 500px;
  overflow: auto;
}

.exercise-refresh {
  display: flex;
  justify-content: flex-end;
}
</style>

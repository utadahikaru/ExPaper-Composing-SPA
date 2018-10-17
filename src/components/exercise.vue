<template>
  <div class="exercise">
    <!-- 题目属性 -->
    <div class="exercise-property" v-if="showProperty">
      <span class="exercise-info">题号：{{exercise.exerciseNumber}}</span>
      <span class="exercise-info">题型：{{getValue(exerciseTypes, exercise.exerciseType)}}</span>
      <span class="exercise-info">难度：{{getValue(global.difficulties, exercise.exerciseDifficulty)}}</span>
      <span class="exercise-info">组卷次数：{{exercise.useTimes}}</span>
    </div>

    <!-- 题目 -->
    <!-- <div class="exercise-title">{{exercise.exerciseQuestion}}</div> -->
    <div class="exercise-title" v-html="exercise.questionTransformed"></div>

    <!-- 题目下方按钮们 -->
    <div class="exercise-footer">
      <el-button type="text" class="exercise-btn" icon="el-icon-document" @click="showAnswer = !showAnswer">{{showAnswer ? '收起解析' : '查看解析'}}</el-button>
      <el-button v-show="collected === 1" type="text" class="exercise-btn" :icon="'el-icon-star-on'" @click="uncollectExercise" v-loading="loading">已收藏</el-button>
      <el-button v-show="collected === 0" type="text" class="exercise-btn" :icon="'el-icon-star-off'" @click="collectExercise" v-loading="loading">收藏</el-button>
      <el-button type="text" class="exercise-btn" icon="el-icon-edit" v-if="shouldCorrect" @click="correctExercise">纠错</el-button>
      <el-button type="text" class="exercise-btn" icon="el-icon-edit" v-if="shouldEdit" @click="updateExercise">修改</el-button>
      <el-button type="text" class="exercise-btn" icon="el-icon-delete" v-if="shouldEdit" @click="deleteExercise">删除</el-button>
      <div style="flex: 1;" />
      <el-button type="text" class="exercise-btn" icon="el-icon-plus" v-show="!inPaper" @click="updateExerciseList">添加到组卷</el-button>
      <el-button type="text" class="exercise-btn" icon="el-icon-minus" v-show="inPaper" @click="updateExerciseList">从组卷移除</el-button>
    </div>

    <!-- 题目解析 -->
    <div v-show="showAnswer">
      <span class="exercise-label">答案：</span>
      <div class="exercise-title" v-html="exercise.answerTransformed"></div>
      <span class="exercise-label">解析：</span>
      <div class="exercise-title" v-html="exercise.analyseTransformed"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "exercise",
  props: {
    //从父组件传来的条件数组
    exercise: {
      type: Object,
      default: function () {
        return {}
      }
    },
    inPaper: {
      type: Boolean,
      default: false
    },
    shouldCorrect: {
      type: Boolean,
      default: false
    },
    shouldEdit: {
      type: Boolean,
      default: false
    },
    shouldCollect: {
      type: Boolean,
      default: true
    },
    showProperty: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      showAnswer: false,
      showCorrection: false,
      loading: false
      // collected: false
    }
  },
  computed: {
    collected () {
      if (this.exercise.isCollect !== undefined) {
        return this.exercise.isCollect
      } else {
        return -1
      }
    },

    exerciseTypes () {
      let exerciseTypes = this.$store.state.exerciseType.exerciseTypes
      if (exerciseTypes === null) {
        this.$store.dispatch('getExerciseTypes')
        return []
      }
      return exerciseTypes
    }
  },
  methods: {
    // 通知父组件将题目添加至试卷篮/从试卷中移出
    updateExerciseList () {
      this.$emit('updateExerciseList', this.exercise)
    },

    // 通知父组件收藏题目
    collectExercise () {
      this.loading = true
      this.postRequest(this.httpUrl.exerciseCollect, { exerciseNumber: this.exercise.exerciseNumber }).then(response => {
        this.loading = false

        this.exercise.isCollect = 1 - this.exercise.isCollect
      }).catch(error => {
        this.loading = false
      })
    },

    // 通知父组件收藏题目
    uncollectExercise () {
      this.loading = true
      this.deleteRequest(this.httpUrl.exerciseCollect, { exerciseNumber: this.exercise.exerciseNumber }).then(response => {
        this.loading = false

        this.exercise.isCollect = 1 - this.exercise.isCollect
      }).catch(error => {
        this.loading = false
      })
    },

    // 通知父组件纠错题目
    correctExercise () {
      this.$emit('correctExercise', this.exercise.exerciseNumber)
    },

    // 通知父组件修改题目
    updateExercise () {
      this.$emit('updateExercise', this.exercise)
    },

    // 通知父组件删除题目
    deleteExercise () {
      this.$emit('deleteExercise', this.exercise.exerciseNumber)
    }
  }
};
</script>

<style lang="scss" scoped>
.exercise {
  margin: 10px 0;

  border: $border-solid;

  &-btn {
    margin: 0 20px;
  }

  &-title {
    margin: 10px 20px;
  }

  &-label {
    margin: 10px 20px;
    color: #666666;
    font-size: 14px;
  }
}

.exercise-property {
  padding: 8px 20px;

  background: #f1f1f1;
}

.exercise-info {
  margin-right: 20px;
  font-size: 14px;
}

.exercise-footer {
  display: flex;
  align-items: center;

  border-top: $border-dashed;
}
</style>


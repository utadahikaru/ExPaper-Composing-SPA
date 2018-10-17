<template>
  <div class="fzsz">
    <h1>2018年4月高一数学测验</h1>
    <h3>总分：({{totalScore}})分</h3>
    <div class="table">
      <table class="table-score">
        <tr>
          <th width="50%">序号</th>
          <!-- <th width="10%">难度</th>
          <th width="65%">知识点</th> -->
          <th width="50%">分数</th>
        </tr>
      </table>
      <table class="table-score" v-for="(exerciseInType, typeIndex) in exerciseListClassified" :key="typeIndex">
        <tr class="dt">
          <!-- 大题题型 -->
          <td width="50%">{{(typeIndex+ 1) + '.' + getValue(exerciseTypes, exerciseInType.type)}}</td>
          <!-- 每题分数 -->
          <td width="50%">
            <input class="input-score" type="number" :min="0" :max="100" v-model.number="exerciseInType.score" @input="setTypeScore(typeIndex, exerciseInType.score)">
            <span>分/题</span>
          </td>
        </tr>
        <tr v-for="(exercise, index) in exerciseInType.exerciseList" :key="exercise.id">
          <!-- 题序 -->
          <td width="50%">{{exercise.index}}</td>
          <!-- 分数 -->
          <td width="50%">
            <input class="input-score" type="number" :min="0" :max="100" v-model.number="exercise.score" @input="setExerciseScore(typeIndex, index, exercise.score)">
            <span>分</span>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import { SET_TYPE_SCORE, SET_EXERCISE_SCORE } from '@/store/mutation-types'

export default {
  name: "paper-score",
  computed: {
    // 计算总分
    totalScore: function () {
      var score = 0
      this.exerciseListClassified.forEach(exerciseInType => {
        exerciseInType.exerciseList.forEach(exercise => {
          score += exercise.score
        });
      });
      return score
    },

    exerciseListClassified () {
      let list = this.$store.state.paper.exerciseListClassified
      return JSON.parse(JSON.stringify(list))
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
    /**
     * @description 设置大题分数，就相当于设置了该分类下每一道题分数
     * @param (index) 大题序号
     */
    setTypeScore (index, score) {
      this.$store.commit(SET_TYPE_SCORE, { index: index, score: score })
      this.$store.dispatch('updatePaper')
    },

    /**
     * @description 设置小题分数，此时将大题分数归0
     * @param (index) 小题序号
     */
    setExerciseScore (typeIndex, index, score) {
      this.$store.commit(SET_EXERCISE_SCORE, { typeIndex: typeIndex, index: index, score: score })
      this.$store.dispatch('updatePaper')
    }
  }
}
</script>

<style lang="scss" scoped>
.fzsz {
  text-align: start;
}

.table {
  overflow: scroll;

  max-height: 360px;

  border-top: $border-solid;
  border-left: $border-solid;
}

h1 {
  margin-top: 0;

  text-align: center;
}

h3 {
  margin: 0;

  text-align: right;
}

.table-score {
  width: 100%;

  border-spacing: 0;

  border-collapse: collapse;
}

.input-score {
  width: 50px;

  outline: none;
}

th {
  margin: 0;
  padding: 6px;

  border-right: $border-solid;
  border-bottom: $border-solid;
  background: #e1e1e1;
}

td {
  margin: 0;
  padding: 6px;

  border-right: $border-solid;
  border-bottom: $border-solid;
}

.dt {
  background: #f1f1f1;
}

.kps {
  display: flex;
  flex-wrap: wrap;
}

.kp {
  width: fit-content;
  margin: 4px;
  padding: 4px;

  border-radius: 5px;
  background: #f1f1f1;
}
</style>

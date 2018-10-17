<template>
  <div class="exercise-basket">
    <div v-for="(exerciseInType, i) in exerciseListClassified" :key="i" v-if="exerciseInType.exerciseList.length > 0">
      <!-- 大题 -->
      <div class="exercise-type-index">{{getValue(exerciseTypes, exerciseInType.type)}}</div>

      <!-- 小题列表 -->
      <div v-for="(exercise, index) in exerciseInType.exerciseList" :key="index">
        <exercise :exercise="exercise" :inPaper="true" :shouldCorrect="false" v-on:updateExerciseList="removeExercise" />
      </div>
    </div>
  </div>
</template>

<script>
import { REMOVE_EXERCISE } from '@/store/mutation-types'

export default {
  name: "paper-preview-list",
  computed: {
    exerciseListClassified: function () {
      return this.$store.state.paper.exerciseListClassified
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
    removeExercise (exercise) {
      let typeIndex = 0
      let index = 0
      for (let i = 0; i < this.exerciseListClassified.length; i++) {
        let exerciseInType = this.exerciseListClassified[i]
        if (exerciseInType.type === exercise.exerciseType) {
          for (let j = 0; j < exerciseInType.exerciseList.length; j++) {
            let ex = exerciseInType.exerciseList[j]
            if (ex.exerciseNumber === exercise.exerciseNumber) {
              typeIndex = i
              index = j
              break
            }
          }
          break
        }
      }
      this.$store.commit(REMOVE_EXERCISE, { typeIndex: typeIndex, index: index })
      this.$store.dispatch('updatePaper')
    }
  }
};
</script>

<style lang="scss" scoped>
.exercise-basket {
  overflow: scroll;

  max-height: 500px;

  text-align: start;
}

.exercise-type-index {
  margin: 24px 0 10px 0;
  padding: 10px 20px;

  background: lightgray;
}
</style>



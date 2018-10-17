<template>
  <div>
    <div class="paper">
      <!-- 试卷头 -->
      <paper-header />

      <!-- 大题，题目类型 -->
      <div :class="mouserInExercise ? 'type-no-hover' : 'type'" v-for="(exerciseInType, typeIndex) in exerciseListClassified" :key="typeIndex" v-show="exerciseInType.exerciseList.length > 0">

        <!-- 上方操作栏 -->
        <div class="type-operate">
          <button class="operate-btn" @click="deleteType(typeIndex)">删除</button>
          <button class="operate-btn" @click="moveType(typeIndex, typeIndex - 1)" v-show="typeIndex > 0">上移</button>
          <button class="operate-btn" @click="moveType(typeIndex, typeIndex + 1)" v-show="typeIndex < (exerciseListClassified.length - 1)">下移</button>
        </div>

        <!-- 大题 -->

        <div :id="'type' + typeIndex" class="type-head exerciseSpan" v-show="(paperStructCustom.indexOf('titleTypeScore') != -1) || (paperStructCustom.indexOf('titleType') != -1) || (paperStructCustom.indexOf('score') != -1)">
          <!-- 大题分数栏 -->
          <table v-show="paperStructCustom.indexOf('titleTypeScore') != -1" class="score-table">
            <tbody>
              <tr>
                <td>评卷人</td>
                <td>得分</td>
              </tr>
              <tr>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
              </tr>
            </tbody>
          </table>
          <!-- 题目类型 -->
          <span class="bold" v-show="paperStructCustom.indexOf('titleType') != -1">{{global.indexInChinese[typeIndex]}}. {{getValue(exerciseTypes, exerciseInType.type)}}</span>
          <span v-show="paperStructCustom.indexOf('score') != -1" v-if="exerciseInType.score > 0">{{"(每题" + exerciseInType.score + "分)"}}</span>
        </div>

        <!-- 同一类型下的题目列表 -->
        <div v-for="(exercise, index) in exerciseInType.exerciseList" :key="index" @mouseenter="mouserInExercise = true" @mouseleave="mouserInExercise = false">
          <div class="exercise" :id="'exercise' + typeIndex + index">

            <!-- 题目上方操作栏 -->
            <div class="exercise-operate">
              <button class="operate-btn" @click="rreplaceExercise(typeIndex, index, exercise)">替换</button>
              <button class="operate-btn" @click="deleteExercise(typeIndex, index)">删除</button>
              <button class="operate-btn" @click="moveExercise(typeIndex, index, index - 1)" v-show="index > 0">上移</button>
              <button class="operate-btn" @click="moveExercise(typeIndex, index, index + 1)" v-show="index < (exerciseInType.exerciseList.length - 1)">下移</button>
            </div>

            <!-- 题目 -->
            <div>
              <span>{{exercise.index}}.</span>
              <span v-show="paperStructCustom.indexOf('score') != -1" v-if="exerciseInType.score == 0">{{"(" + exercise.score + "分)"}}</span>
              <span class="exerciseSpan" v-html="exercise.questionTransformed"></span>
            </div>

            <!-- 题目解析 -->
            <div v-show="paperAnswerStyle === 'inside'">
              <span>答案：</span>
              <span v-html="exercise.answerTransformed"></span>
              <span>解析：</span>
              <span v-html="exercise.analyseTransformed"></span>
            </div>

            <!-- 答题区，仅主观题有 -->
            <div v-if="exercise.exerciseType == 3 || exercise.exerciseType == 4 || exercise.exerciseType == 5" v-show="paperStructCustom.indexOf('space') != -1" style="height: 225px"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="paper" v-show="(paperAnswerStyle === 'end')">
      <div>参考答案与解析</div>
      <div class="content-answer" v-for="(answer, index) in answerList" :key="index">
        <span>{{index + 1}}.&nbsp;&nbsp;</span>
        <div>
          <span>答案：</span>
          <span v-html="answer.answerTransformed"></span>
          <span>解析：</span>
          <span v-html="answer.analyseTransformed"></span>
        </div>
      </div>
    </div>

    <!-- 替换题目面板 -->
    <el-dialog title="替换题目" :visible.sync="showExerciseReplace">
      <paper-replace :open="showExerciseReplace" :params="replaceExerciseParams" :index="replaceExerciseIndex" v-on:hideReplaceDialog="hideReplaceDialog" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="showExerciseReplace = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
import paperHeader from './paper-header'
import paperReplace from './paper-replace'
import {
  MOVE_TYPE,
  MOVE_EXERCISE,
  REMOVE_TYPE,
  REMOVE_EXERCISE
} from '@/store/mutation-types'

export default {
  name: 'paper-content',
  components: {
    paperHeader,
    paperReplace
  },
  data () {
    return {
      //替换题目面板
      showExerciseReplace: false,

      replaceExerciseParams: {},
      replaceExerciseIndex: {},

      mouserInExercise: false
    }
  },
  computed: {

    paperStructCustom () {
      return this.$store.state.paperStruct.paperStructCustom
    },

    paperAnswerStyle () {
      return this.$store.state.paperStruct.paperAnswerStyle
    },

    exerciseList () {
      return this.$store.state.paper.exerciseInfoList
    },

    exerciseListClassified () {
      console.log(this.$store.state.paper.exerciseListClassified);

      return this.$store.state.paper.exerciseListClassified
    },

    answerList () {
      let list = []
      this.exerciseListClassified.forEach(exerciseInType => {
        exerciseInType.exerciseList.forEach(exercise => {
          let answer = { answerTransformed: exercise.answerTransformed, analyseTransformed: exercise.analyseTransformed }
          list.push(answer)
        })
      })
      return list
    },

    exerciseTypes () {
      let exerciseTypes = this.$store.state.exerciseType.exerciseTypes
      if (exerciseTypes === null) {
        this.$store.dispatch('getExerciseTypes')
        return []
      }
      return exerciseTypes
    },
  },
  methods: {
    deleteType (index) {
      this.$store.commit(REMOVE_TYPE, index)
      this.$store.dispatch('updatePaper')
    },

    deleteExercise (typeIndex, index) {
      this.$store.commit(REMOVE_EXERCISE, { typeIndex: typeIndex, index: index })
      this.$store.dispatch('updatePaper')
    },

    moveType (index1, index2) {
      this.$store.commit(MOVE_TYPE, { index1: index1, index2: index2 })
      this.$store.dispatch('updatePaper')
    },

    moveExercise (typeIndex, index1, index2) {
      this.$store.commit(MOVE_EXERCISE, { typeIndex: typeIndex, index1: index1, index2: index2 })
      this.$store.dispatch('updatePaper')
    },

    rreplaceExercise (typeIndex, index, exercise) {
      this.replaceExerciseParams = {
        exerciseNumber: exercise.exerciseNumber,
        exerciseGrade: exercise.exerciseGrade,
        exerciseSubject: exercise.exerciseSubject,
        exerciseType: exercise.exerciseType,
        knowledgeNumber: exercise.knowledgeNumber,
        bookNumber: exercise.bookNumber
      }
      this.replaceExerciseIndex = {
        typeIndex: typeIndex,
        index: index
      }
      this.showExerciseReplace = true
    },

    hideReplaceDialog () {
      this.showExerciseReplace = false
    }
  }
}
</script>

<style lang="scss" scoped>
.sjyl {
  width: fit-content;
  margin: auto;
}

.paper {
  width: 720px;
  border: $border-solid;
  padding: 60px;
  margin-bottom: 10px;
}

.score-table {
  margin-right: 20px;

  border-spacing: 0;

  border-top: 1px solid #777;
  border-left: 1px solid #777;
}

.type-head {
  display: flex;
  align-items: center;

  width: fit-content;
  height: 75px;
}

span {
  color: black;
  font-family: STSong;
}

.bold {
  font-weight: bold;
}

td {
  width: 72px;
  height: 25px;

  text-align: center;

  border-right: 1px solid #777;
  border-bottom: 1px solid #777;
}

.type {
  position: relative;

  &:hover {
    overflow: visible;

    background: #eeeeee;
  }

  &-operate {
    position: absolute;
    right: 0px;
    display: none;

    text-align: end;
  }
}

.type:hover .type-operate {
  display: block;
  position: absolute;
}

.type-no-hover {
  position: relative;

  background: transparent;
}

.exercise {
  position: relative;

  &:hover {
    overflow: visible;

    background: #eeeeee;
  }

  &-operate {
    position: absolute;
    right: 0px;
    display: none;

    text-align: end;
  }
}

.exercise:hover .exercise-operate {
  display: block;
  position: absolute;
}

.operate-btn {
  height: 25px;
  margin: 0px;
  padding: 0 12px;

  color: green;
  border-color: lightgreen;
  border-width: 1px;
  outline: none;
  background: white;

  font-size: 14px;

  cursor: pointer;

  &:hover {
    border-color: green;
  }
}

.content-answer {
  display: flex;
}
</style>

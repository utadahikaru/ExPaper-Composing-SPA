<template>
  <div>
    <div id="paper">
      <!-- 试卷头 -->
      <paper-header-styled />

      <!-- 大题，题目类型 -->
      <div style="color: black;font-size: 12px;font-family: STSong;line-height:20px;" v-for="(exerciseInType, typeIndex) in exerciseListClassified" :key="typeIndex" v-show="exerciseInType.exerciseList.length > 0">

        <table style="12px">
          <tbody>
            <tr>
              <td style="vertical-align: middle;">
                <!-- 大题分数栏 -->
                <table v-show="paperStructCustom.indexOf('titleTypeScore') != -1" style="margin-right: 10px;border-spacing: 0;border-top: 1px solid #777;border-left: 1px solid #777;">
                  <tbody>
                    <tr>
                      <td style="width: 50px;height: 20px;text-align: center;vertical-align: middle;border-right: 1px solid #777;border-bottom: 1px solid #777;">评卷人</td>
                      <td style="width: 50px;height: 20px;text-align: center;vertical-align: middle;border-right: 1px solid #777;border-bottom: 1px solid #777;">得分</td>
                    </tr>
                    <tr>
                      <td style="width: 50px;height: 20px;border-right: 1px solid #777;border-bottom: 1px solid #777;">&nbsp;</td>
                      <td style="width: 50px;height: 20px;border-right: 1px solid #777;border-bottom: 1px solid #777;">&nbsp;</td>
                    </tr>
                  </tbody>
                </table>
              </td>
              <td style="vertical-align: middle;">
                <!-- 题目类型及分数 -->
                <span v-show="paperStructCustom.indexOf('titleType') != -1">{{global.indexInChinese[typeIndex]}}. {{getValue(exerciseTypes, exerciseInType.type)}}</span>
                <span v-show="paperStructCustom.indexOf('score') != -1" v-if="exerciseInType.score > 0">{{"(每题" + exerciseInType.score + "分)"}}</span>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- 同一类型下的题目列表 -->
        <div v-for="(exercise, index) in exerciseInType.exerciseList" :key="index" @mouseenter="mouserInExercise = true" @mouseleave="mouserInExercise = false">
          <div>
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

    <!-- 答案 -->
    <div style="color: black;font-size: 12px;font-family: STSong;line-height:20px;" v-show="(paperAnswerStyle === 'end')">
      <div>参考答案与解析</div>
      <div style="display: flex;" v-for="(answer, index) in answerList" :key="index">
        <span>{{index + 1}}.&nbsp;&nbsp;</span>
        <div>
          <span>答案：</span>
          <span v-html="answer.answerTransformed"></span>
          <span>解析：</span>
          <span v-html="answer.analyseTransformed"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import paperHeaderStyled from './paper-header-styled'
import paperReplace from './paper-replace'
import {
  MOVE_TYPE,
  MOVE_EXERCISE,
  REMOVE_TYPE,
  REMOVE_EXERCISE
} from '@/store/mutation-types'

export default {
  name: 'paper-content-styled',
  components: {
    paperHeaderStyled,
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
    }
  },

  methods: {
    // 此时答案在题目后面或者没有答案，直接下载试卷即可
    downloadPaperDirectly () {


      this.updatePaperStatus()
    },

    // 此时答案单独成页在试题最后
    // combine=true：将答案与试卷下载到同一个pdf文件，试卷打印多少份答案也打印多少份
    // combine=false：将答案与试卷各自下载成两份pdf文件
    downloadPaper (combine) {


      this.updatePaperStatus()
    },

    updatePaperStatus () {
      // 更新组卷状态
      let paper = this.$store.state.paper.paper
      let params = JSON.parse(JSON.stringify(paper))
      params.paperStatus = 1 //已发布
      this.putRequest(this.httpUrl.paper, params).then(response => {
        console.log('更新成功')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

import {
  SET_XT_CONDITION,
  RESET_XT_CONDITION,
  CLEAR_EXERCISE_LIST,
  MOVE_TYPE,
  MOVE_EXERCISE,
  REMOVE_TYPE,
  REMOVE_EXERCISE,
  SET_TYPE_SCORE,
  SET_EXERCISE_SCORE
} from '../mutation-types'

//  4个请求方法以及url
import { putRequest, httpUrl } from 'utils/fetch.js'

const state = {
  // 选题条件
  xtCondition: {
    exerciseDifficulty: 0,
    exerciseType: 0,
    exerciseGrade: 7,
    bookNumber: '',
    knowledgeNumber: '',
    pageSize: 10,
    pageNum: 1,
    sort: '',
    defaultBook: '',
    defaultChapter: [],
    defaultKnowledge: []
  },

  // 组卷
  paper: {},

  // 组卷头部
  paperHead: {
    headlineText: '试卷标题',
    subheadText: '副标题',
    paperInfoText: '考试范围：xxx；考试时间：100分钟；命题人：xxx',
    studentInfoText:
      '学校：__________ 姓名：__________ 班级：__________ 考号：__________',
    announcementsText:
      '注意事项：1、答题前填写好自己的姓名、班级、考号等信息 2、请将答案正确填写在答题卡上'
  },
  // 题目信息列表
  exerciseInfoList: [],
  // 题目按题目分类排列
  exerciseListClassified: []
}

const mutations = {
  [SET_XT_CONDITION]: (state, condition) => {
    state.xtCondition = JSON.parse(JSON.stringify(condition))
  },

  [RESET_XT_CONDITION]: state => {
    state.xtCondition.exerciseType = 0
    state.xtCondition.exerciseDifficulty = 0
    state.xtCondition.sort = ''
    state.xtCondition.pageNum = 1
    state.xtCondition.defaultBook = ''
    state.xtCondition.defaultChapter = []
    state.xtCondition.defaultKnowledge = []
  },

  setPaper: (state, paper) => {
    state.paper = paper
    let obj = JSON.parse(paper.paperJson)
    state.paperHead = obj.paperHead
    state.exerciseInfoList = obj.exerciseInfoList
    state.exerciseListClassified = obj.exerciseListClassified

    state.xtCondition.exerciseGrade = paper.paperGrade
    state.xtCondition.exerciseSubject = paper.paperSubject
  },

  addExercise: (state, exercise) => {
    // 判断该题目是否存在与组卷中
    let index = -1
    for (let i = 0; i < state.exerciseInfoList.length; i++) {
      const exerciseInfo = state.exerciseInfoList[i]
      if (exerciseInfo.exerciseNumber === exercise.exerciseNumber) {
        index = i
        break
      }
    }

    if (index === -1) {
      // 不存在，那么将题目插入组卷

      // 先把题目信息加到题目信息列表中
      let exerciseInfo = {
        exerciseNumber: exercise.exerciseNumber,
        exerciseDifficulty: exercise.exerciseDifficulty,
        knowledgeName: exercise.knowledgeName
      }
      state.exerciseInfoList.push(exerciseInfo)

      // 判断组卷列表中有没有该类型的题目
      let typeIndex = -1
      for (let i = 0; i < state.exerciseListClassified.length; i++) {
        let exerciseInType = state.exerciseListClassified[i]
        if (exerciseInType.type === exercise.exerciseType) {
          // 新加的题目指定其分数为大题分数
          exercise.score = exerciseInType.score
          // 有，直接将题目插入该类型题目列表
          exerciseInType.exerciseList.push(exercise)
          typeIndex = i
          break
        }
      }

      if (typeIndex === -1) {
        // 没有，那么创建该类型题目并将题目插入该类型题目列表
        let exerciseInType = {
          type: exercise.exerciseType,
          score: 10, // 新建时指定每题10分
          exerciseList: []
        }
        exercise.score = 10
        exerciseInType.exerciseList.push(exercise)
        // 将该类型题目插入组卷分类题目表
        state.exerciseListClassified.push(exerciseInType)
      }
    } else {
      // 存在，那么将题目从组卷中移除

      // 先把题目信息从题目信息列表中移除
      state.exerciseInfoList.splice(index, 1)

      // 再把题目从组卷分类题目表中移除
      for (let i = 0; i < state.exerciseListClassified.length; i++) {
        let exerciseInType = state.exerciseListClassified[i]
        // 先找到同类型的题目列表
        if (exerciseInType.type === exercise.exerciseType) {
          for (let j = 0; j < exerciseInType.exerciseList.length; j++) {
            let ex = exerciseInType.exerciseList[j]
            // 再根据题目信息找到题目
            if (ex.exerciseNumber === exercise.exerciseNumber) {
              exerciseInType.exerciseList.splice(j, 1)
              if (exerciseInType.exerciseList.length === 0) {
                // 如果该题目类型下面没有题目了，就置为空
                exerciseInType = undefined
              }
              break
            }
          }
          break
        }
      }
    }

    // 为题目设置序号
    setupExerciseIndex(state.exerciseListClassified)

    // 将题目信息列表和题目列表放到组卷中
    setupPaperJson(state)
  },

  /**
   * 设置试卷头部
   */
  setPaperHead: (state, paperHead) => {
    state.paperHead = paperHead
    state.paper.paperTitle = paperHead.headlineText

    // 将题目信息列表和题目列表放到组卷中
    setupPaperJson(state)
  },

  setPaperDown: state => {
    state.paper.paperStatus = 1
  },

  /**
   * 清空试题篮
   */
  [CLEAR_EXERCISE_LIST](state) {
    state.exerciseInfoList = []
    state.exerciseListClassified = []

    // 将题目信息列表和题目列表放到组卷中
    setupPaperJson(state)
  },

  /**
   * 大题排序
   */
  [MOVE_TYPE](state, index) {
    // 在试卷预览页面，程序需要watch到exerciseListClassified的变化才能刷新页面，而对于引用程序是watch不到的，所以需要深拷贝。
    let emptyArray = JSON.parse(JSON.stringify(state.exerciseListClassified))
    arraySwap(emptyArray, index.index1, index.index2)
    state.exerciseListClassified = emptyArray
    // 为题目设置序号
    setupExerciseIndex(state.exerciseListClassified)

    // 将题目信息列表和题目列表放到组卷中
    setupPaperJson(state)
  },

  /**
   * 小题排序
   */
  [MOVE_EXERCISE](state, index) {
    let emptyArray = JSON.parse(JSON.stringify(state.exerciseListClassified))
    arraySwap(
      emptyArray[index.typeIndex].exerciseList,
      index.index1,
      index.index2
    )
    state.exerciseListClassified = emptyArray
    // 为题目设置序号
    setupExerciseIndex(state.exerciseListClassified)

    // 将题目信息列表和题目列表放到组卷中
    setupPaperJson(state)
  },

  /**
   * 删除大题
   */
  [REMOVE_TYPE](state, index) {
    let emptyArray = JSON.parse(JSON.stringify(state.exerciseListClassified))

    // 要被删除的题目题号
    let exerciseNumberList = []
    emptyArray[index].exerciseList.forEach(element => {
      exerciseNumberList.push(element.exerciseNumber)
    })
    // 从exerciseInfoList中删去题目信息
    exerciseNumberList.forEach(exerciseNumber => {
      for (let i = 0; i < state.exerciseInfoList.length; i++) {
        const element = state.exerciseInfoList[i]
        if (element.exerciseNumber === exerciseNumber) {
          state.exerciseInfoList.splice(i, 1)
        }
      }
    })

    emptyArray.splice(index, 1)
    state.exerciseListClassified = emptyArray

    // 为题目设置序号
    setupExerciseIndex(state.exerciseListClassified)

    // 将题目信息列表和题目列表放到组卷中
    setupPaperJson(state)
  },

  /**
   * 删除小题
   */
  [REMOVE_EXERCISE](state, index) {
    let emptyArray = JSON.parse(JSON.stringify(state.exerciseListClassified))
    // 要被删除的题目题号
    let exerciseNumber =
      emptyArray[index.typeIndex].exerciseList[index.index].exerciseNumber
    // 从exerciseInfoList中删去题目信息
    for (let i = 0; i < state.exerciseInfoList.length; i++) {
      const element = state.exerciseInfoList[i]
      if (element.exerciseNumber === exerciseNumber) {
        state.exerciseInfoList.splice(i, 1)
      }
    }

    // 从
    emptyArray[index.typeIndex].exerciseList.splice(index.index, 1)
    // 如果某个题目分类下没有题目了，就删除该题目分类
    for (let i = 0; i < emptyArray.length; i++) {
      if (emptyArray[i].exerciseList.length === 0) {
        emptyArray.splice(i, 1)
      }
    }
    state.exerciseListClassified = emptyArray

    // 为题目设置序号
    setupExerciseIndex(state.exerciseListClassified)

    // 将题目信息列表和题目列表放到组卷中
    setupPaperJson(state)
  },

  /**
   * 设置大题分数
   */
  [SET_TYPE_SCORE](state, data) {
    state.exerciseListClassified[data.index].score = data.score
    state.exerciseListClassified[data.index].exerciseList.forEach(exercise => {
      exercise.score = data.score
    })

    // 将题目信息列表和题目列表放到组卷中
    setupPaperJson(state)
  },

  /**
   * 设置小题分数
   */
  [SET_EXERCISE_SCORE](state, data) {
    state.exerciseListClassified[data.typeIndex].score = ''
    state.exerciseListClassified[data.typeIndex].exerciseList[data.index].score = data.score

    // 将题目信息列表和题目列表放到组卷中
    setupPaperJson(state)
  },

  replaceExercise: (state, data) => {
    // data = { oldExerciseNumber: this.params.exerciseNumber, newExercise: exercise, index: this.index }

    // 旧题目题号与索引
    let oldExerciseNumber = data.oldExerciseNumber
    let typeIndex = data.index.typeIndex
    let index = data.index.index
    // 新题目
    let exercise = data.newExercise

    // 旧题目索引和分数
    let oldIndex =
      state.exerciseListClassified[typeIndex].exerciseList[index].index
    let oldScore =
      state.exerciseListClassified[typeIndex].exerciseList[index].score
    exercise.index = oldIndex
    exercise.score = oldScore

    // 替换题目
    state.exerciseListClassified[typeIndex].exerciseList[index] = exercise

    // 替换题目信息
    let newInfo = {
      exerciseNumber: exercise.exerciseNumber,
      exerciseDifficulty: exercise.exerciseDifficulty,
      knowledgeName: exercise.knowledgeName
    }
    for (let i = 0; i < state.exerciseInfoList.length; i++) {
      if (state.exerciseInfoList[i].exerciseNumber === oldExerciseNumber) {
        state.exerciseInfoList[i] = newInfo
      }
    }

    // 将题目信息列表和题目列表放到组卷中
    setupPaperJson(state)
  }
}

/**
 *为题目设置序号
 *
 * @param {*} exerciseListClassified
 */
function setupExerciseIndex(exerciseListClassified) {
  let index = 0
  exerciseListClassified.forEach(exerciseInType => {
    exerciseInType.exerciseList.forEach(exercise => {
      index++
      exercise.index = index
    })
  })
}

/**
 * 将题目信息列表和题目列表放到组卷中
 * @param {*} state
 */
function setupPaperJson(state) {
  let obj = {
    paperHead: state.paperHead,
    exerciseInfoList: state.exerciseInfoList,
    exerciseListClassified: state.exerciseListClassified
  }
  state.paper.paperJson = JSON.stringify(obj)
}

/**
 * 交换数组元素
 *
 * @param {*} array
 * @param {*} index1
 * @param {*} index2
 */
function arraySwap(array, index1, index2) {
  var temp = array[index1]
  array[index1] = array[index2]
  array[index2] = temp
}

const actions = {
  updatePaper(context) {
    putRequest(httpUrl.paper, state.paper).then(response => {
      console.log('更新成功')
    })
  }
}

const paper = {
  state,
  mutations,
  actions
}

export default paper

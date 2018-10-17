//  4个请求方法以及url
import { getRequest, putRequest, httpUrl } from 'utils/fetch.js'

// 保存题目类型配置信息
const state = {
  exerciseTypes: null
}

const mutations = {
  setExerciseTypes: (state, list) => {
    state.exerciseTypes = []
    list.forEach(element => {
      let obj = {
        id: element.exerciseType,
        name: element.exerciseTypeName,
        subjectId: element.subjectId,
        exerciseType: element.exerciseType,
        exerciseTypeName: element.exerciseTypeName,
        isUse: element.isUse
      }
      state.exerciseTypes.push(obj)
    })
  },

  clearExerciseType: state => {
    state.exerciseTypes = null
  }
}

const actions = {
  getExerciseTypes: context => {
    let subjectString = localStorage.getItem('userSubject')
    let subject = JSON.parse(subjectString)
    getRequest(httpUrl.exerciseType, { subjectId: subject.id }).then(
      response => {
        context.commit('setExerciseTypes', response.data.list)
      }
    )
  },

  modifyExerciseType(context, exerciseType) {
    putRequest(httpUrl.exerciseType, exerciseType).then(response => {
      context.dispatch('getExerciseTypes')
    })
  }
}

const exerciseType = {
  state,
  mutations,
  actions
}

export default exerciseType

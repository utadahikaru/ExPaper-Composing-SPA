import store from '../../store'

// 保存年级配置信息
const state = {
  grade_name: [
    { id: 1, name: '一年级' },
    { id: 2, name: '二年级' },
    { id: 3, name: '三年级' },
    { id: 4, name: '四年级' },
    { id: 5, name: '五年级' },
    { id: 6, name: '六年级' },
    { id: 7, name: '初一' },
    { id: 8, name: '初二' },
    { id: 9, name: '初三' },
    { id: 10, name: '高一' },
    { id: 11, name: '高二' },
    { id: 12, name: '高三' }
  ],
  grades: null,
  subject: null
}

const mutations = {
  setupGrades: state => {
    let curSubjectString = localStorage.getItem('userSubject')
    if (curSubjectString !== null) {
      let curSubject = JSON.parse(curSubjectString)
      let gradeIds = curSubject.grades.split('@')
      state.grades = []
      gradeIds.forEach(id => {
        let name = ''
        state.grade_name.forEach(element => {
          if (element.id === parseInt(id)) {
            name = element.name
          }
        })
        let obj = { id: parseInt(id), name: name }
        state.grades.push(obj)
      })
    }
  }
}

const getters = {
  getGrades: state => () => {
    if (state.grades === null) {
      store.commit('setupGrades')
    }
    return state.grades
  }
}

const grade = {
  state,
  mutations,
  getters
}

export default grade

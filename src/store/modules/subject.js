import store from '../../store'

// 保存科目配置信息
const state = {
  subjects: [],
  subject: 0,
  subjectName: ''
}

const mutations = {
  setupSubjects() {
    let subjectsString = localStorage.getItem('userSubjects')
    if (subjectsString !== null) {
      state.subjects = JSON.parse(subjectsString)
    }

    let subjectString = localStorage.getItem('userSubject')
    if (subjectString !== null) {
      let subjectObj = JSON.parse(subjectString)
      state.subject = subjectObj.id
      state.subjectName = JSON.parse(subjectString).name
    }
  }
}

const getters = {
  getSubjects: state => () => {
    if (state.subjects.length === 0) {
      store.commit('setupSubjects')
    }
    return state.subjects
  },

  getSubject: state => () => {
    if (state.subjects.length === 0) {
      store.commit('setupSubjects')
    }
    return state.subject
  },

  getSubjectName: state => () => {
    if (state.subjects.length === 0) {
      store.commit('setupSubjects')
    }
    return state.subjectName
  }
}

const subject = {
  state,
  mutations,
  getters
}

export default subject

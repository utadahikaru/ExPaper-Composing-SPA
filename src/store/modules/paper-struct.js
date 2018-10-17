const state = {
  // 模版筛选条件
  paperStructCustom: [],
  paperAnswerStyle: 'end'
}

const mutations = {
  setPaperStructCustom: (state, data) => {
    state.paperStructCustom = data
  },

  setAnswerStyle: (state, data) => {
    state.paperAnswerStyle = data
  }
}

const paperStruct = {
  state,
  mutations
}

export default paperStruct

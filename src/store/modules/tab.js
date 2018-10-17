// 管理各个页面tab索引
const state = {
  //  习题页面tab
  exercisePageTab: '1',
  //  组卷页面tab
  paperPageTab: '1',
  //  细目表页面tab
  xmbPageTab: '1',
  //  知识库页面tab
  zskPageTab: '1'
}

const mutations = {
  setExercisePageTab: (state, tab) => {
    state.exercisePageTab = tab
  },

  setPaperPageTab: (state, tab) => {
    state.paperPageTab = tab
  },

  setXmbPageTab: (state, tab) => {
    state.xmbPageTab = tab
  },

  setZskPageTab: (state, tab) => {
    state.zskPageTab = tab
  },
}

const tab = {
  state,
  mutations
}

export default tab

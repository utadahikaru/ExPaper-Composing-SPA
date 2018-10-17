const state = {
  // 选题条件
  xtCondition: {
    exerciseDifficulty: 0,
    exerciseType: 0,
    exerciseGrade: 0,
    bookNumber: '',
    knowledgeNumber: '',
    pageSize: 10,
    pageNum: 1,
    sort: '',
    defaultBook: '',
    defaultChapter: [],
    defaultKnowledge: []
  }
}

const mutations = {
  setCondition: (state, condition) => {
    if (state.xtCondition.exerciseGrade !== condition.exerciseGrade) {
      // 如果新旧condition年级不一样，就清空章节和知识点选项
      condition.defaultChapter = []
      condition.defaultKnowledge = []
    }
    state.xtCondition = JSON.parse(JSON.stringify(condition))
    if (state.xtCondition.defaultChapter.length === 0) {
      state.xtCondition.bookNumber = ''
    }
    if (state.xtCondition.defaultKnowledge.length === 0) {
      state.xtCondition.knowledgeNumber = ''
    }
  },
  setConditionSort: (state, sort) => {
    state.xtCondition.sort = sort === '' ? undefined : sort
  },
  setConditionPageNum: (state, pageNum) => {
    state.xtCondition.pageNum = pageNum
  },
  resetCondition: state => {
    state.xtCondition = {
      exerciseGrade: 0,
      exerciseType: 0,
      exerciseDifficulty: 0,
      bookNumber: '',
      knowledgeNumber: '',
      defaultBook: '',
      defaultChapter: [],
      defaultKnowledge: [],
      sort: '',
      // 分页
      pageNum: 1,
      pageSize: 10
    }
  }
}

const exerciseView = {
  state,
  mutations
}

export default exerciseView

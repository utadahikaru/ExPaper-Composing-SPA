const state = {
  baseURL: '',
  prePagePath: '',
  currentPagePath: '',
  pageTitle: ''
}

const mutations = {
  SET_BASERUL: (state, url) => {
    state.baseURL = url
  },
  SET_SERVER_ERROR: (state, serverError) => {
    state.serverError = serverError
  },
  SET_PRE_PAGE_PATH: (state, pagePath) => {
    state.prePagePath = pagePath
  },
  SET_CURRENT_PAGE_PATH: (state, pagePath) => {
    state.currentPagePath = pagePath
  },
  SET_PAGE_TITLE: (state, title) => {
    state.pageTitle = title
  }
}
const actions = {
  changeBaseURL ({
    commit
  }, url) {
    commit('SET_BASERUL', url)
  },
  addServerError ({
    commit
  }, error) {
    commit('SET_SERVER_ERROR', error)
  },
  changePrePagePath ({
    commit
  }, pagePath) {
    commit('SET_PRE_PAGE_PATH', pagePath)
  },
  changeCurrentPagePath ({
    commit
  }, pagePath) {
    commit('SET_CURRENT_PAGE_PATH', pagePath)
  },
  changePageTitle ({
    commit
  }, title) {
    commit('SET_PAGE_TITLE', title)
  }
}

const user = {
  state,
  mutations,
  actions
}

export default user

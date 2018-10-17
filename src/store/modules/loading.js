const state = {
  //  全局loading
  loading: false
}

const mutations = {
  loading: (state, loading) => {
    state.loading = loading
  }
}

const actions = {
  loading: (context, loading) => {
    context.commit('loading', loading)

    if (loading) {
      // 5秒之后自动，防止忘记手动取消loading
      setTimeout(() => {
        context.commit('loading', false)
      }, 5000)
    }
  }
}

const loading = {
  state,
  mutations,
  actions
}

export default loading

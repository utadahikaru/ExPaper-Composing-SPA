const state = {
  userInfo: {}
}

const mutations = {
  setUserInfo: state => {
    let userInfoString = localStorage.getItem('userInfo')
    if (userInfoString === null) {
      state.userInfo = {}
    }
    state.userInfo = JSON.parse(userInfoString)
  },

  clearUserInfo: state => {
    state.userInfo = {}
  }
}

const user = {
  state,
  mutations
}

export default user

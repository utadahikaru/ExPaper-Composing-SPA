//  4个请求方法以及url
import {
  getRequest,
  postRequest,
  putRequest,
  deleteRequest,
  httpUrl
} from 'utils/fetch.js'

// 保存试卷类型配置信息
const state = {
  paperTypes: null
}

const mutations = {
  setPaperTypes: (state, list) => {
    state.paperTypes = []
    list.forEach(element => {
      let obj = { id: element.paperType, name: element.paperTypeName }
      state.paperTypes.push(obj)
    })
  }
}

const actions = {
  getPaperTypes: context => {
    getRequest(httpUrl.paperType, {}).then(response => {
      context.commit('setPaperTypes', response.data.list)
    })
  }
}

const paperType = {
  state,
  mutations,
  actions
}

export default paperType

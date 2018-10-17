import { SET_KNOWLEDGE_LIST } from '../mutation-types'
//  4个请求方法以及url
import {
  getRequest,
  postRequest,
  putRequest,
  deleteRequest,
  httpUrl
} from 'utils/fetch.js'

const state = {
  knowledgeList: null
}

const mutations = {
  [SET_KNOWLEDGE_LIST]: (state, knowledgeList) => {
    state.knowledgeList = knowledgeList
  },

  clearKnowledge(state) {
    state.knowledgeList = null
  }
}

const getters = {
  knowledgeTree: state => grade => {
    // 拿出对应年级科目下的知识点
    let list = []
    state.knowledgeList.forEach(knowledge => {
      if (knowledge.knowledgeGrade === grade) {
        list.push(knowledge)
      }
    })

    // 知识点树型结构
    let tree = formKnowledgeTree(list, 'k')
    return tree
  },

  knowledgeName: state => knowledgeNumber => {
    for (let i = 0; i < state.knowledgeList.length; i++) {
      if (state.knowledgeList[i].knowledgeNumber === knowledgeNumber) {
        return state.knowledgeList[i].knowledgeName
      }
    }
    return ''
  },

  // 根据节number拿到节名
  knowledgeNumberExist: state => number => {
    for (let i = 0; i < state.knowledgeList.length; i++) {
      if (state.knowledgeList[i].knowledgeNumber === number) {
        return true
      }
    }
    return false
  },

  knowledgeBrotherCount: state => knowledgePNumber => {
    var count = 0
    for (let i = 0; i < state.knowledgeList.length; i++) {
      if (state.knowledgeList[i].knowledgePNumber === knowledgePNumber) {
        count++
      }
    }
    return count
  }
}

function formKnowledgeTree(knowledgeList, pnumber) {
  // 知识点树型结构
  let tree = []

  knowledgeList.forEach(knowledge => {
    if (knowledge.knowledgePNumber === pnumber) {
      let obj = {
        id: knowledge.knowledgeNumber,
        label: knowledge.knowledgeName,
        value: knowledge.knowledgeNumber,
        pnumber: knowledge.knowledgePNumber,
        grade: knowledge.knowledgeGrade,
        subject: knowledge.knowledgeSubject,
        content: knowledge.knowledgeContent,
        transformed: knowledge.knowledgeTransformed,
        level: knowledge.knowledgeLevel,
        order: knowledge.knowledgeOrder,
        children: formKnowledgeTree(knowledgeList, knowledge.knowledgeNumber)
      }
      if (obj.children.length === 0) {
        obj.children = undefined
      }
      tree.push(obj)
    }
  })
  sortByOrder(tree)
  return tree
}

function sortByOrder(array) {
  var compare = function(obj1, obj2) {
    var order1 = obj1.order
    var order2 = obj2.order
    if (order1 < order2) {
      return -1
    } else if (order1 > order2) {
      return 1
    } else {
      return 0
    }
  }
  array.sort(compare)
}

const actions = {
  getKnowledge(context) {
    if (context.state.knowledgeList === null) {
      let subjectString = localStorage.getItem('userSubject')
      let subject = JSON.parse(subjectString)
      getRequest(httpUrl.knowledge, {
        knowledgeSubject: subject.id,
        pageSize: 1000,
        pageNum: 1
      })
        .then(response => {
          context.commit(SET_KNOWLEDGE_LIST, response.data.list)
        })
        .catch(error => {})
    }
  },

  createKnowledge(context, params) {
    postRequest(httpUrl.knowledge, params)
      .then(response => {
        context.dispatch('editKnowledgeSucceed')
      })
      .catch(error => {})
  },

  updateKnowledge(context, params) {
    putRequest(httpUrl.knowledge, params)
      .then(response => {
        context.dispatch('editKnowledgeSucceed')
      })
      .catch(error => {})
  },

  deleteKnowledge(context, params) {
    deleteRequest(httpUrl.knowledge, params)
      .then(response => {
        context.dispatch('editKnowledgeSucceed')
      })
      .catch(error => {})
  },

  editKnowledgeSucceed(context) {
    let subjectString = localStorage.getItem('userSubject')
    let subject = JSON.parse(subjectString)
    getRequest(httpUrl.knowledge, {
      knowledgeSubject: subject.id,
      pageSize: 1000,
      pageNum: 1
    })
      .then(response => {
        context.commit(SET_KNOWLEDGE_LIST, response.data.list)
      })
      .catch(error => {})
  },

  updateKnowledgeOrder(context, params) {
    putRequest(httpUrl.knowledgeOrder, params)
      .then(response => {
        context.dispatch('editKnowledgeSucceed')
      })
      .catch(error => {})
  }
}

const knowledge = {
  state,
  getters,
  mutations,
  actions
}

export default knowledge

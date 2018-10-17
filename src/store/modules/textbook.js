import { SET_TEXTBOOK_LIST } from '../mutation-types'
//  4个请求方法以及url
import {
  getRequest,
  postRequest,
  putRequest,
  deleteRequest,
  httpUrl
} from 'utils/fetch.js'

const state = {
  // 教材原始数据
  textbookList: null,
  // 对应年级科目的教材列表
  textbooks: []
}

const mutations = {
  // 设置教材章节原始数据
  [SET_TEXTBOOK_LIST]: (state, textbookList) => {
    state.textbookList = textbookList
  },

  clearTextbook(state) {
    state.textbookList = null
  }
}

const getters = {
  // 对应年级科目的教材列表
  textbookList: state => grade => {
    // 拿出对应年级科目下的章节
    let list = []
    state.textbookList.forEach(textbook => {
      if (textbook.bookGrade === grade && textbook.bookLevel === 0) {
        list.push(textbook)
      }
    })
    return list
  },

  // 章节树（用于编辑章节模块中的树形组件）
  chapterTreeForTree: state => (grade, textbookNumber) => {
    // 拿出对应年级科目下的章节
    let list = []
    state.textbookList.forEach(textbook => {
      if (textbook.bookGrade === grade && textbook.bookLevel > 0) {
        list.push(textbook)
      }
    })

    // 知识点树型结构
    let tree = formChapterTreeForSelection(list, textbookNumber)
    return tree
  },

  // 章节树（用于筛选、查询题目模块中的选择组件）
  chapterTreeForSelection: state => grade => {
    // 拿出对应年级科目下的章节
    let list = []
    state.textbookList.forEach(textbook => {
      if (textbook.bookGrade === grade) {
        list.push(textbook)
      }
    })

    // 知识点树型结构
    let tree = formChapterTreeForSelection(list, 'b')
    return tree
  },

  // 根据节number拿到节名
  sectionName: state => sectionNumber => {
    for (let i = 0; i < state.textbookList.length; i++) {
      if (state.textbookList[i].bookNumber === sectionNumber) {
        return state.textbookList[i].bookName
      }
    }
    return ''
  },

  // 新加教材、章节时判断bookNumber存在性，
  bookNumberExist: state => number => {
    for (let i = 0; i < state.textbookList.length; i++) {
      if (state.textbookList[i].bookNumber === number) {
        return true
      }
    }
    return false
  },

  bookBrotherCount: state => bookPNumber => {
    var count = 0
    for (let i = 0; i < state.textbookList.length; i++) {
      if (state.textbookList[i].bookPNumber === bookPNumber) {
        count++
      }
    }
    return count
  }
}

function formChapterTreeForSelection(list, pnumber) {
  // 章节树
  let tree = []

  list.forEach(textbook => {
    if (textbook.bookPNumber === pnumber) {
      let obj = {
        id: textbook.bookNumber,
        value: textbook.bookNumber,
        label: textbook.bookName,
        grade: textbook.bookGrade,
        subject: textbook.bookSubject,
        level: textbook.bookLevel,
        pnumber: textbook.bookPNumber,
        content: textbook.bookContent,
        order: textbook.bookOrder,
        children: formChapterTreeForSelection(list, textbook.bookNumber)
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
  getTextbook(context) {
    if (context.state.textbookList === null) {
      let subjectString = localStorage.getItem('userSubject')
      let subject = JSON.parse(subjectString)
      getRequest(httpUrl.book, {
        bookSubject: subject.id,
        pageSize: 1000,
        pageNum: 1
      })
        .then(response => {
          context.commit(SET_TEXTBOOK_LIST, response.data.list)
        })
        .catch(error => {})
    }
  },

  createTextbook(context, params) {
    postRequest(httpUrl.book, params)
      .then(response => {
        context.dispatch('editTextbookSucceed')
      })
      .catch(error => {})
  },

  updateTextbook(context, params) {
    putRequest(httpUrl.book, params)
      .then(response => {
        context.dispatch('editTextbookSucceed')
      })
      .catch(error => {})
  },

  deleteTextbook(context, params) {
    deleteRequest(httpUrl.book, params)
      .then(response => {
        context.dispatch('editTextbookSucceed')
      })
      .catch(error => {})
  },

  editTextbookSucceed(context) {
    let subjectString = localStorage.getItem('userSubject')
    let subject = JSON.parse(subjectString)
    getRequest(httpUrl.book, {
      bookSubject: subject.id,
      pageSize: 1000,
      pageNum: 1
    })
      .then(response => {
        context.commit(SET_TEXTBOOK_LIST, response.data.list)
      })
      .catch(error => {})
  },

  updateBookOrder(context, params) {
    putRequest(httpUrl.bookOrder, params)
      .then(response => {
        context.dispatch('editTextbookSucceed')
      })
      .catch(error => {})
  }
}

const textbook = {
  state,
  getters,
  mutations,
  actions
}

export default textbook

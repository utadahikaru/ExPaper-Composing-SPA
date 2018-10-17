import Vue from 'vue'
import Vuex from 'vuex'

import user from './modules/user'
import app from './modules/app'
import paperStruct from './modules/paper-struct'
import paper from './modules/paper'
import exerciseView from './modules/exercise-view'
import loading from './modules/loading'
import tab from './modules/tab'

// 知识点
import knowledge from './modules/knowledge'

// 教材/章节
import textbook from './modules/textbook'
// 年级配置项
import grade from './modules/grade'
// 科目配置项
import subject from './modules/subject'
// 组卷类型配置项
import paperType from './modules/paper-type'
// 题目类型配置项
import exerciseType from './modules/exercise-type'

import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    app,
    paperStruct,
    knowledge,
    textbook,
    paper,
    exerciseView,
    loading,
    tab,
    grade,
    subject,
    paperType,
    exerciseType
  },
  strict: process.env.NODE_ENV !== 'production',
  getters
})

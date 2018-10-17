// 存放一些全局变量

// 难度定义
const difficulties = [
  { id: 1, name: '简单' },
  { id: 2, name: '适中' },
  { id: 3, name: '困难' }
]

// 年级定义
const grades = [
  { id: 1, name: '一年级' },
  { id: 2, name: '二年级' },
  { id: 3, name: '三年级' },
  { id: 4, name: '四年级' },
  { id: 5, name: '五年级' },
  { id: 6, name: '六年级' },
  { id: 7, name: '初一' },
  { id: 8, name: '初二' },
  { id: 9, name: '初三' },
  { id: 10, name: '高一' },
  { id: 11, name: '高二' },
  { id: 12, name: '高三' }
]

// 排序方式
const sorts = [
  { id: '', name: '默认' },
  { id: 'create_time desc', name: '最新上传' },
  { id: 'use_times desc', name: '最多组卷' }
]

const indexInChinese = [
  '一',
  '二',
  '三',
  '四',
  '五',
  '六',
  '七',
  '八',
  '九',
  '十'
]

const userRoles = [
  {id: 2, name: '系统管理员'},
  {id: 3, name: '学科管理员'},
  {id: 4, name: '教师'}
]

const userStatus = [
  {id: 0, name: '正常'},
  {id: 1, name: '锁定'}
]

export default {
  difficulties,
  grades,
  sorts,
  indexInChinese,
  userRoles,
  userStatus
}

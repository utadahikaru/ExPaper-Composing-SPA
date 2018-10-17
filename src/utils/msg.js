import {
  Notification,
  Message
} from 'element-ui'

export function pm (msg, type, dura) {
  Message({
    message: msg,
    type: type || 'info',
    duration: dura || 3000
  })
}

export function pn (msg, type, dura) {
  Notification({
    title: '重要提示',
    message: msg,
    type: type || 'info',
    duration: dura || 3000
  })
}

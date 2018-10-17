export default function install(Vue, options) {
  /**
   * @description 交换数组元素
   */
  Vue.prototype.arraySwap = function(array, index1, index2) {
    var temp = array[index1]
    array[index1] = array[index2]
    array[index2] = temp
    return array
  }

  /**
   * @description 深拷贝对象
   */
  Vue.prototype.deepCopy = function(object) {
    if (typeof object !== 'object') {
      return object
    }
    var newobj = {}
    for (var attr in object) {
      newobj[attr] = this.deepCopy(object[attr])
    }
    return newobj
  }

  /**
   * 从golbal.js里面根据code获取value
   * @param {*} objectArray
   * @param {*} key
   */
  Vue.prototype.getValue = function(objectArray, key) {
    for (let index = 0; index < objectArray.length; index++) {
      const element = objectArray[index]
      if (element.id === key) {
        return element.name
      }
    }
    return ''
  }

  /**
   * 将标准时间转换成 yyyy年MM月dd日 hh时mm分ss秒 格式
   * @param {*} standardDate 标准时间
   * @param {*} accuracy 精度（'day','hour','minute','second',''）
   */
  Vue.prototype.readStandardDate = function(standardDate, accuracy) {
    let date = new Date(standardDate.replace(/\-/g, '/')) // 为了让safari能识别，需要把日期中的'-'换成'/'
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    let hour = date.getHours()
    let minute = date.getMinutes()
    let second = date.getSeconds()

    switch (accuracy) {
      case 'day':
        return year + '年' + month + '月' + day + '日'
      case 'hour':
        return year + '年' + month + '月' + day + '日 ' + hour + '时'
      case 'minute':
        return year + '年' + month + '月' + day + '日 ' + hour + '时' + minute + '分'
      case 'second':
        return year + '年' + month + '月' + day + '日 ' + hour + '时' + minute + '分' + second + '秒'
      default:
        return year + '年' + month + '月' + day + '日'
    }
  }

  /**
   * 进行网络请求时，一些属性多余，就要把它们去掉
   * @param {*} obj 
   */
  Vue.prototype.deleteUselessAttribute = function(obj) {
    let obj1 = JSON.parse(JSON.stringify(obj))
    Object.keys(obj1).forEach(key => {
      if (obj1[key] === '' || obj1[key] === 0) {
        delete obj1[key]
      }
    })
    return obj1
  }

  /**
   * 向localStorage存对象
   * @param {*} key 
   * @param {*} value 
   */
  Vue.prototype.setLs = function(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
  }

  /**
   * 从localStorage取对象
   * @param {*} key 
   */
  Vue.prototype.getLs = function(key) {
    let objectString = localStorage.getItem(key)
    return JSON.parse(objectString)
  }
}

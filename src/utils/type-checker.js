const isObject = object => Object.prototype.toString.call(object) === '[object Object]' && typeof object !== 'symbol'

const isFunction = object => Object.prototype.toString.call(object) === '[object Function]'

export {
  isObject,
  isFunction,
}

const isPlainObject = object => Object.prototype.toString.call(object) === '[object Object]'

const isFunction = object => Object.prototype.toString.call(object) === '[object Function]'

export {
  isPlainObject,
  isFunction,
}

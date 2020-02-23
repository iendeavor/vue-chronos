const getPublicKeys = object => {
  return Object.keys(object).filter(key => isPublicKey(key))
}

const isPublicKey = key => {
  return key.startsWith('$') === false
}

export {
  getPublicKeys,
  isPublicKey,
}

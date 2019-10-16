const getPublicKeys = object => {
  return Object.keys(object).filter(key => key.startsWith('$') === false)
}

const isPublicKey = key => {
  return key.startsWith('$') === false
}

export {
  getPublicKeys,
  isPublicKey,
}

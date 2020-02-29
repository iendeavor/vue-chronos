const getPublicKeys = (object: object): string[] => {
  return Object.keys(object).filter(key => isPublicKey(key))
}

const isPublicKey = (key: string): boolean => {
  return key.startsWith('$') === false
}

export {
  getPublicKeys,
  isPublicKey,
}

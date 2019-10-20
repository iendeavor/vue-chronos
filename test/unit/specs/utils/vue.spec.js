import {
  getPublicKeys,
  isPublicKey,
} from '@/utils/vue'

describe('Vue', () => {
  it('should get public keys only', () => {
    const object = {
      $private1: 0,
      $private2: 0,
      public1: 0,
      public2: 0,
    }

    expect(getPublicKeys(object))
      .to.eql(['public1', 'public2'])
  })

  it('should return true whether the key is public', () => {
    const publicKey = 'public'
    const privateKey = '$private'

    expect(isPublicKey(publicKey))
      .to.equal(true)
    expect(isPublicKey(privateKey))
      .to.equal(false)
  })
})

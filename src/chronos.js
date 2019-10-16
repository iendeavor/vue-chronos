import {
  deepCopy,
  dfs,
} from '@/utils/shared'
import {
  getPublicKeys,
  isPublicKey,
} from '@/utils/vue'
import {
  setByPath,
  getByPath,
} from '@/utils/path-manager'
import {
  isObject,
  isFunction,
} from '@/utils/type-checker'

const createVm = (Vue, vm, options) => {
  return new Vue({
    data () {
      return {
        // used for record requests
        object: {},
      }
    },

    computed: {
      userInterface () {
        const object = deepCopy(this.object)

        this.addPublicKeys(object)
        this.addPublicMethods(object)
        this.deletePrivateKeys(object)

        return object
      },

      pairPaths () {
        const pairPaths = vm.$options[options.optionName]
        return isFunction(pairPaths) ? pairPaths.call(vm) : pairPaths
      },

      groupPaths () {
        const visitGroup = group => {
          const currentSender = group[group.length - 1]
          rootSenders.delete(currentSender)
          const receivers = this.pairPaths
            .filter(([sender]) => sender === currentSender)
            .map(([_, receiver]) => receiver)

          if (receivers.length === 0) {
            groups.push(deepCopy(group))
          } else {
            receivers.forEach(receiver => {
              visitGroup([].concat(group, receiver))
            })
          }
        }

        const groups = []
        const rootSenders = new Set(this.pairPaths.map(([sender]) => sender))
        while (rootSenders.size !== 0) visitGroup([[...rootSenders.values()].shift()])

        return groups
      },

      paths () {
        return Array.from(new Set(this.pairPaths.reduce((paths, pair) => paths.concat(pair))))
      },
    },

    watch: {
      pairPaths: {
        immediate: true,
        handler (newValue, oldValue) {
          this.verify(newValue)
          this.object = this.genDefaultObject(newValue)
        },
      },
    },

    methods: {
      async load (theSender, promise) {
        // prevent change pairPaths and load simultaneously.
        await this.$nextTick()

        // prevent reset object while loading.
        const object = this.object
        const pairPaths = this.pairPaths
        const groupPaths = this.groupPaths

        try {
          this.addCount(object, pairPaths, groupPaths, theSender, 1)
          await promise
        } finally {
          this.addCount(object, pairPaths, groupPaths, theSender, -1)
        }
      },

      addCount (object, pairPaths, groupPaths, theSender, count) {
        // receiving
        pairPaths = pairPaths.filter(([sender, receiver]) => sender === theSender)
        const receiverPathList = pairPaths.map(([sender, receiver]) => receiver)
        receiverPathList.forEach(path => {
          path += '.$receivingCount'
          const value = getByPath({object, path}) + count
          setByPath({object, path, value})
        })

        // sending
        const senderPathList = Array.from(new Set(
          groupPaths
            .filter(group => group.some(path => receiverPathList.includes(path)))
            .reduce((list, group) => list.concat(group), [])
            .filter(path => receiverPathList.includes(path) === false)
        ))
        senderPathList.forEach(path => {
          path += '.$sendingCount'
          const value = getByPath({object, path}) + count
          setByPath({object, path, value})
        })
      },

      verify (pairPaths) {
        const throws = lines => {
          lines.unshift('\n========== chronos ==========')
          lines.push('=============================\n')
          throw new Error(lines.join('\n'))
        }

        if (Object.prototype.toString.call(pairPaths) !== '[object Array]') {
          throws([
            `The {${options.optionName}} should be an array, but found:`,
            `{${pairPaths}}`,
          ])
        }

        const stringifiedDependentPairList = pairPaths.map(pair => JSON.stringify(pair))
        stringifiedDependentPairList.forEach(pair => {
          if (stringifiedDependentPairList.indexOf(pair) !== stringifiedDependentPairList.lastIndexOf(pair)) {
            throws([
              `The {${options.optionName}}'s pair should be unique, but found:`,
              `{${pair}}`,
            ])
          }
        })

        pairPaths.forEach(pair => {
          if (Object.prototype.toString.call(pair) !== '[object Array]') {
            throws([
              `The {${options.optionName}}'s pair should be an array, but found:`,
              `{${JSON.stringify(pair)}}`,
            ])
          }
          if (pair.length !== 2) {
            throws([
              `The length of {${options.optionName}}'s pair should equals 2, but found:`,
              `{${JSON.stringify(pair)}}`,
            ])
          }
          if (pair.some(path => Object.prototype.toString.call(path) !== '[object String]')) {
            throws([
              `The {${options.optionName}}'s pair should be a string array, but found:`,
              `{${JSON.stringify(pair)}}`,
            ])
          }
        })

        const fallback = {}
        this.paths.forEach(path => {
          if (getByPath({object: vm.$data, path, fallback}) === fallback) {
            throws([
              `The path of {${options.optionName}}'s pair is not found in this.$data`,
              `{${path}}`,
            ])
          }
        })
      },

      genDefaultObject (pairPaths) {
        const object = {}
        this.paths.forEach(path => setByPath({object, path, value: this.genDefaultLeafValue}))
        return object
      },

      genDefaultLeafValue () {
        return {
          $leaf: true,
          $sending: false,
          $receiving: false,
          $pending: false,
          $sendingCount: 0,
          $receivingCount: 0,
        }
      },

      addPublicKeys (object) {
        const callback = (value, key) => {
          if (isPublicKey(key)) {
            if (value.$leaf) {
              value.$sending = value.$sendingCount !== 0
              value.$receiving = value.$receivingCount !== 0
              value.$pending = value.$receiving || value.$sending
            } else {
              const children = getPublicKeys(value)
              value.$sending = children.some(childKey => value[childKey].$sending)
              value.$receiving = children.some(childKey => value[childKey].$receiving)
              value.$pending = children.some(childKey => value[childKey].$pending)
            }
          }
        }
        dfs(object, callback)
      },

      addPublicMethods (object) {
        object.$load = this.load
      },

      deletePrivateKeys (object) {
        const callback = value => {
          if (isObject(value)) {
            delete value['$leaf']
            delete value['$sendingCount']
            delete value['$receivingCount']
          }
        }
        dfs(object, callback)
      },
    },
  })
}

export {
  createVm,
}

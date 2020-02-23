const isObject = object => Object.prototype.toString.call(object) === '[object Object]' && typeof object !== 'symbol';

const isFunction = object => Object.prototype.toString.call(object) === '[object Function]';

const deepCopy = object => {
  if (isObject(object)) {
    return JSON.parse(JSON.stringify(object))
  } else {
    return object
  }
};
const dfs = (object, callback) => {
  _dfs({'': object}, callback);
};

const _dfs = (object, callback, isRoot = true) => {
  if (isObject(object)) {
    Object.keys(object).forEach(key => {
      if (isObject(object[key])) {
        _dfs(object[key], callback, false);
      }
      callback(object[key], key, object, isRoot);
    });
  }
};

const getPublicKeys = object => {
  return Object.keys(object).filter(key => key.startsWith('$') === false)
};

const isPublicKey = key => {
  return key.startsWith('$') === false
};

let __defaultSeparator = '.';

const getByPath = (object, path, fallback = undefined, separator = __defaultSeparator) => {

  return __getByPath(object, path, fallback, separator)
};
const __getByPath = (object, path, fallback = undefined, separator = __defaultSeparator) => {
  try {
    const pathParts = path.split(separator);
    const deepestPath = pathParts.pop();
    pathParts.forEach(pathPart => { object = object[pathPart]; });
    return deepestPath in object ? object[deepestPath] : fallback
  } catch (error) {
    return fallback
  }
};

const setByPath = (object, path, value, separator = __defaultSeparator) => {

  return __setByPath(object, path, value, separator)
};
const __setByPath = (object, path, value, separator = __defaultSeparator) => {
  const pathParts = path.split(separator);
  const deepestPath = pathParts.pop();
  pathParts.forEach(pathPart => {
    if ((pathPart in object) === false) object[pathPart] = {};
    object = object[pathPart];
  });

  object[deepestPath] = typeof value === 'function' ? value() : value;
};

const createVm = (Vue, vm, options) => {
  return new Vue({
    data () {
      return {
        // used for record requests
        state: {},
      }
    },

    computed: {
      userInterface () {
        const state = deepCopy(this.state);

        this.addPublicKeys(state);
        this.addPublicMethods(state);
        this.deletePrivateKeys(state);

        return state
      },

      dependentPaths () {
        return Array.from(new Set(this.dependentPairPaths.reduce((dependentPaths, pair) => dependentPaths.concat(pair), [])))
      },

      dependentPairPaths () {
        const dependentPairPaths = vm.$options[options.optionName];
        return isFunction(dependentPairPaths) ? dependentPairPaths.call(vm) : dependentPairPaths
      },

      dependentGroupPaths () {
        const visitGroup = group => {
          const currentSender = group[group.length - 1];
          rootSenders.delete(currentSender);
          const receivers = this.dependentPairPaths
            .filter(([sender]) => sender === currentSender)
            .map(([_, receiver]) => receiver);

          if (receivers.length === 0) {
            groups.push(deepCopy(group));
          } else {
            receivers.forEach(receiver => {
              visitGroup([].concat(group, receiver));
            });
          }
        };

        const groups = [];
        const rootSenders = new Set(this.dependentPairPaths.map(([sender]) => sender));
        while (rootSenders.size !== 0) visitGroup([[...rootSenders.values()].shift()]);

        return groups
      },
    },

    watch: {
      dependentPairPaths: {
        immediate: true,
        handler () {
          this.verify();
          this.state = this.genDefaultState();
        },
      },
    },

    methods: {
      async load (theSender, promise) {
        // prevent change dependentPairPaths and load simultaneously.
        await this.$nextTick();

        // prevent reset state while loading.
        const state = this.state;
        const dependentPairPaths = this.dependentPairPaths;
        const dependentGroupPaths = this.dependentGroupPaths;

        try {
          this.addCount(state, dependentPairPaths, dependentGroupPaths, theSender, 1);
          await promise;
        } finally {
          this.addCount(state, dependentPairPaths, dependentGroupPaths, theSender, -1);
        }
      },

      addCount (state, dependentPairPaths, dependentGroupPaths, theSender, count) {
        // receiving
        dependentPairPaths = dependentPairPaths.filter(([sender, receiver]) => sender === theSender);
        const receiverPathList = dependentPairPaths.map(([sender, receiver]) => receiver);
        receiverPathList.forEach(path => {
          path += '.$receivingCount';
          const value = getByPath(state, path) + count;
          setByPath(state, path, value);
        });

        // sending
        const senderPathList = Array.from(new Set(
          dependentGroupPaths
            .filter(group => group.some(path => receiverPathList.includes(path)))
            .reduce((list, group) => list.concat(group), [])
            .filter(path => receiverPathList.includes(path) === false)
        ));
        senderPathList.forEach(path => {
          path += '.$sendingCount';
          const value = getByPath(state, path) + count;
          setByPath(state, path, value);
        });
      },

      verify () {
        const throws = lines => {
          lines.unshift('\n========== chronos ==========');
          lines.push('=============================\n');
          throw new Error(lines.join('\n'))
        };

        const dependentPairPaths = this.dependentPairPaths;

        if (Object.prototype.toString.call(dependentPairPaths) !== '[object Array]') {
          throws([
            `The {${options.optionName}} should be an array, but found:`,
            `{${dependentPairPaths}}`,
          ]);
        }

        const stringifiedDependentPairList = dependentPairPaths.map(pair => JSON.stringify(pair));
        stringifiedDependentPairList.forEach(pair => {
          if (stringifiedDependentPairList.indexOf(pair) !== stringifiedDependentPairList.lastIndexOf(pair)) {
            throws([
              `The {${options.optionName}}'s pair should be unique, but found:`,
              `{${pair}}`,
            ]);
          }
        });

        dependentPairPaths.forEach(pair => {
          if (Object.prototype.toString.call(pair) !== '[object Array]') {
            throws([
              `The {${options.optionName}}'s pair should be an array, but found:`,
              `{${JSON.stringify(pair)}}`,
            ]);
          }
          if (pair.length !== 2) {
            throws([
              `The length of {${options.optionName}}'s pair should equals 2, but found:`,
              `{${JSON.stringify(pair)}}`,
            ]);
          }
          if (pair.some(path => Object.prototype.toString.call(path) !== '[object String]')) {
            throws([
              `The {${options.optionName}}'s pair should be a string array, but found:`,
              `{${JSON.stringify(pair)}}`,
            ]);
          }
        });
      },

      genDefaultState () {
        const state = {};
        this.dependentPaths.forEach(path => setByPath(state, path, this.genDefaultLeafState));
        return state
      },

      genDefaultLeafState () {
        return {
          $leaf: true,
          $sending: false,
          $receiving: false,
          $pending: false,
          $sendingCount: 0,
          $receivingCount: 0,
        }
      },

      addPublicKeys (state) {
        const callback = (value, key) => {
          if (isPublicKey(key)) {
            if (value.$leaf) {
              value.$sending = value.$sendingCount !== 0;
              value.$receiving = value.$receivingCount !== 0;
              value.$pending = value.$receiving || value.$sending;
            } else {
              const children = getPublicKeys(value);
              value.$sending = children.some(childKey => value[childKey].$sending);
              value.$receiving = children.some(childKey => value[childKey].$receiving);
              value.$pending = children.some(childKey => value[childKey].$pending);
            }
          }
        };
        dfs(state, callback);
      },

      addPublicMethods (state) {
        state.$load = this.load;
      },

      deletePrivateKeys (state) {
        const callback = value => {
          if (isObject(value)) {
            delete value['$leaf'];
            delete value['$sendingCount'];
            delete value['$receivingCount'];
          }
        };
        dfs(state, callback);
      },
    },
  })
};

const hasChronos = (vm, options) => [options.optionName] in vm.$options;

const install = function (Vue, options) {
  options = options || {};
  options.getterName = options.getterName || '$chronos';
  options.optionName = options.optionName || 'chronos';

  Vue.mixin({
    data () {
      if (hasChronos(this, options)) {
        this._chronos = Vue.observable({instance: {}});

        this.$options.computed = this.$options.computed || {};
        this.$options.computed[options.getterName] = () => {
          return (
            this._chronos &&
            this._chronos.instance &&
            this._chronos.instance.userInterface
          )
        };
      }
      return {}
    },

    created () {
      if (hasChronos(this, options)) {
        this._chronos.instance = createVm(Vue, this, options);
      }
    },

    destroyed () {
      if (hasChronos(this, options)) {
        this._chronos && this._chronos.instance && this._chronos.instance.$destroy();
        delete this._chronos;
      }
    },
  });
};

var index = { install };

export default index;

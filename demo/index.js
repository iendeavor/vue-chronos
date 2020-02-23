Vue.use(VueChronos, {
  optionName: 'dependentPairPaths',
  getterName: '$c',
})

new Vue({
  el: '#app',

  data () {
    return {
      form: {
        selectA1: '',
        selectB1: '',
        selectA2: '',
        selectB2: '',
      },
      optionsA1: [],
      optionsB1: [],
      optionsA2: [],
      optionsB2: [],

      minDelay: 1000,
      maxDelay: 2000,

      scenario: 'n-n',
      scenarioOptions: [
        {
          label: 'One-to-one',
          value: '1-1',
        }, {
          label: 'One-to-many',
          value: '1-n',
        }, {
          label: 'Many-to-one',
          value: 'n-1',
        }, {
          label: 'Many-to-many',
          value: 'n-n',
        },
      ],
    }
  },

  computed: {
    isVisible () {
      return {
        form: {
          selectA1: ['1-1', '1-n', 'n-1', 'n-n'].includes(this.scenario),
          selectB1: ['n-1', 'n-n'].includes(this.scenario),
          selectA2: ['1-1', '1-n', 'n-1', 'n-n'].includes(this.scenario),
          selectB2: ['1-n', 'n-n'].includes(this.scenario),
        },
      }
    },
    isUnavailable () {
      const form = {
        selectA1: false,
        selectB1: false,
        selectA2: false,
        selectB2: false,
      }
      form.selectA2 = this.form.selectA1 === '' || (this.isVisible.form.selectB1 && this.form.selectB1 === '')
      form.selectB2 = this.form.selectA1 === '' || (this.isVisible.form.selectB1 && this.form.selectB1 === '')
      return { form }
    },
  },

  watch: {
    async 'form.selectA1' (newValue, oldValue) {
      if (this.isUnavailable.form.selectA2 === false && this.isUnavailable.form.selectB2 === false) {
        await this.$c.$load('form.selectA1', new Promise(async resolve => {
          [this.optionsA2, this.optionsB2] = await Promise.all([this.getRandomOptionsAsync(), this.getRandomOptionsAsync()])
          resolve()
        }))
      }
    },
    async 'form.selectB1' (newValue, oldValue) {
      if (this.isUnavailable.form.selectA2 === false && this.isUnavailable.form.selectB2 === false) {
        await this.$c.$load('form.selectB1', new Promise(async resolve => {
          [this.optionsA2, this.optionsB2] = await Promise.all([this.getRandomOptionsAsync(), this.getRandomOptionsAsync()])
          resolve()
        }))
      }
    },
    'scenario': {
      immediate: true,
      handler (newValue) {
        switch (this.scenario) {
          case '1-1':
            this.optionsA1 = this.getRandomOptions()
            this.form.selectA1 = this.optionsA1[0]
            break
          case '1-n':
            this.optionsA1 = this.getRandomOptions()
            this.form.selectA1 = this.optionsA1[0]
            break
          case 'n-1':
            this.optionsA1 = this.getRandomOptions()
            this.optionsB1 = this.getRandomOptions()
            this.form.selectA1 = this.optionsA1[0]
            this.form.selectB1 = this.optionsB1[0]
            break
          case 'n-n':
            this.optionsA1 = this.getRandomOptions()
            this.optionsB1 = this.getRandomOptions()
            this.form.selectA1 = this.optionsA1[0]
            this.form.selectB1 = this.optionsB1[0]
            break
          default:
            break
        }
      },
    },
    '$c' (newValue) {
      console.log('$c:', JSON.stringify(this.$c, null, 2))
    },
  },

  methods: {
    getRandomOptions () {
      const alphabets = Array(26).fill().map((_, index) => String.fromCharCode(index + 'a'.charCodeAt(0)))
      for (const index in alphabets) {
        const randomIndex = Math.floor(Math.random() * alphabets.length)
        ;[alphabets[index], alphabets[randomIndex]] = [alphabets[randomIndex], alphabets[index]]
      }
      while (Math.random() > 0.3 && alphabets.length > 2) alphabets.splice(0, 1)
      return alphabets
    },
    async getRandomOptionsAsync () {
      return new Promise(resolve => {
        const delay = Math.random() * (this.maxDelay - this.minDelay) + this.minDelay
        setTimeout(() => resolve(this.getRandomOptions()), delay)
      })
    },

    handleChangeSelectA1 () {
      this.form.selectA2 = ''
      this.form.selectB2 = ''
      this.handleChangeSelectA2()
      this.handleChangeSelectB2()
    },
    handleChangeSelectB1 () {
      this.form.selectA2 = ''
      this.form.selectB2 = ''
      this.handleChangeSelectA2()
      this.handleChangeSelectB2()
    },
    handleChangeSelectA2 () {},
    handleChangeSelectB2 () {},

    handleChangeMinDelay () {
      if (parseInt(this.minDelay, 10) < 0) this.minDelay = 1000
      if (typeof this.minDelay !== 'number') this.minDelay = parseInt(this.minDelay)
      if (this.minDelay > this.maxDelay) this.minDelay = this.maxDelay
    },
    handleChangeMaxDelay () {
      if (parseInt(this.maxDelay, 10) < 0) this.maxDelay = 1000
      if (typeof this.maxDelay !== 'number') this.maxDelay = parseInt(this.maxDelay)
      if (this.maxDelay < this.minDelay) this.maxDelay = this.minDelay
    },
    handleClickReset () {
      this.form.selectA1 = ''
      this.form.selectB1 = ''
      this.form.selectA2 = ''
      this.form.selectB2 = ''
    },
  },

  dependentPairPaths () {
    switch (this.scenario) {
      case '1-1':
        return [
          ['form.selectA1', 'form.selectA2'],
        ]
      case '1-n':
        return [
          ['form.selectA1', 'form.selectA2'],
          ['form.selectA1', 'form.selectB2'],
        ]
      case 'n-1':
        return [
          ['form.selectA1', 'form.selectA2'],
          ['form.selectB1', 'form.selectA2'],
        ]
      case 'n-n':
        return [
          ['form.selectA1', 'form.selectA2'],
          ['form.selectA1', 'form.selectB2'],
          ['form.selectB1', 'form.selectA2'],
          ['form.selectB1', 'form.selectB2'],
        ]
      default:
        return []
    }
  },
})

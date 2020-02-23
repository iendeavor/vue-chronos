const rollup = require('rollup')
const resolve = require('path').resolve

const build = {
  src: resolve('demo/index.js'),
  format: 'umd',
  env: 'development',
}

function generateInputOptions () {
  const options = {
    input: build.src,
    onwarn: (msg, warn) => {
      warn(msg)
    }
  }
  return options
}

function generateOuputOptions () {
  const options = {
    file: build.dest,
    format: build.format,
    name: 'vue-chronos',
  }
  return options
}

async function exec () {
  const inputOptions = generateInputOptions()
  const outputOptions = generateOuputOptions()
  const watchOptions = {
    ...inputOptions,
    output: [outputOptions],
    watch: {
      clearScreen: true,
    },
  }
  rollup.watch(watchOptions)
}

if (require.main === module) {
  exec()
}
